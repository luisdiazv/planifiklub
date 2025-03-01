import { supabase } from "../API/SupabaseAPI";

export const getPedidosByIdEvento = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("pedido")
      .select("idpedido")
      .eq("id_evento", eventId);

    if (error) {
      console.error("Error obteniendo el id del pedido:", error.message);
      throw new Error("No se pudo obtener el id del pedido: " + error.message);
    }
    if (data.length > 0) {
      
      
      return await getListaPedidos(data[0].idpedido);
    } else {
      return "ID de Pedido Desconocido";
    }
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener el id del pedido: " + error.message);
  }
};

const getListaPedidos = async (pedidoId) => {
  try {
    const data = await getInfoPedidos(pedidoId);

    if (data === "Lista de Pedidos Desconocido") {
      return [];
    }

    // Obtener todos los id_producto únicos para optimizar la consulta
    const productIds = [...new Set(data.map((pedido) => pedido.id_producto))];

    // Obtener los nombres de los productos en una sola consulta
    const productos = await getNombresProductos(productIds);

    // Mapear los pedidos con los nombres de los productos
    const listaConNombres = data.map((pedido) => ({
      ...pedido,
      nombre_producto: productos[pedido.id_producto] || "Nombre Desconocido",
    }));

    return listaConNombres;
  } catch (error) {
    console.error("Error al obtener la lista de pedidos con nombres:", error.message);
    throw new Error("No se pudo obtener la lista de pedidos con nombres: " + error.message);
  }
};

export const getInfoPedidos = async (pedidoId) => {
  try {
    const { data, error } = await supabase
      .from("producto_pedido")
      .select("*")
      .eq("id_pedido", pedidoId);

    if (error) {
      console.error("Error obteniendo la lista de pedidos:", error.message);
      throw new Error("No se pudo obtener la lista de pedidos: " + error.message);
    }

    return data.length > 0 ? data : "Lista de Pedidos Desconocido";
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener la lista de pedidos: " + error.message);
  }
};

// Obtener los nombres de productos en una sola consulta
const getNombresProductos = async (productIds) => {
  if (productIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from("producto")
      .select("idproducto, nombre")
      .in("idproducto", productIds);

    if (error) {
      console.error("Error obteniendo los nombres de productos:", error.message);
      throw new Error("No se pudo obtener los nombres de los productos: " + error.message);
    }

    // Convertir la lista en un objeto para fácil acceso
    return data.reduce((acc, producto) => {
      acc[producto.idproducto] = producto.nombre;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los nombres de los productos: " + error.message);
  }
};

export const createPedido = async (pedidoDummy) => {
  try {
      const { id_evento, costo_total, fecha_pedido,pedidos_adicionales } = pedidoDummy;

      const { data, error } = await supabase
          .from("pedido")
          .insert([
              {
                  id_evento,
                  costo_total,
                  fecha_pedido,
                  pedidos_adicionales
              }
          ])
          .select("idpedido"); 

      if (error) {
          console.error("Error creando el pedido:", error.message);
          throw new Error("No se pudo crear el pedido: " + error.message);
      }

      const idPedidoCreado = data?.[0]?.idpedido; // Obtiene la ID del evento insertado

      
      return idPedidoCreado; // Retorna solo la ID

  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al crear el pedido: " + error.message);
  }
};

export const createProductoPedido = async (dummyProducto) => {
  try {
      const nuevoProductoPedido = {
          id_pedido: dummyProducto.id_pedido, 
          id_producto: dummyProducto.id_producto,
          cantidad: dummyProducto.cantidad, 
          subtotal: dummyProducto.subtotal,
      };

      const { data, error } = await supabase
          .from("producto_pedido")
          .insert(nuevoProductoPedido)
          .select("idproducto_pedido");

      if (error) {
          console.error("Error creando la entrada en producto_pedido:", error.message);
          throw new Error("No se pudo crear la entrada en producto_pedido: " + error.message);
      }

      return data; // Devuelve la nueva entrada creada
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al crear la entrada en producto_pedido: " + error.message);
  }
};

export const getPedidosAdicionalesByIdPedido = async (idPedido) => {
  try {
    const { data, error } = await supabase
      .from("pedido")
      .select("pedidos_adicionales")
      .eq("idpedido", idPedido)
      .single();

    if (error) {
      console.error("Error obteniendo pedidos adicionales:", error.message);
      throw new Error("No se pudo obtener los pedidos adicionales: " + error.message);
    }

    return data.pedidos_adicionales;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los pedidos adicionales: " + error.message);
  }
};

export const getPedidos = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("pedido")
      .select("*")
      .eq("id_evento", eventId);

    if (error) {
      console.error("Error obteniendo los pedidos por id_evento:", error.message);
      throw new Error("No se pudo obtener los pedidos por id_evento: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los pedidos por id_evento: " + error.message);
  }
};

export const upsertEdificiosEvento = async (id_evento, edificiosDummy) => {
  try {
    // Obtener edificios ya registrados para el evento
    const { data: edificiosExistentes, error: errorSelect } = await supabase
      .from("edificios_evento")
      .select("id_edificio")
      .eq("id_evento", id_evento);

    if (errorSelect) {
      console.error("Error obteniendo edificios del evento:", errorSelect.message);
      throw new Error("No se pudo obtener los edificios del evento");
    }

    // Convertir los existentes a un Set para fácil comparación
    const edificiosRegistrados = new Set(edificiosExistentes.map(e => e.id_edificio));

    for (const edificio of edificiosDummy) {
      const { id_edificio, id_montaje_elegido, subtotal_alquiler } = edificio;

      if (edificiosRegistrados.has(id_edificio)) {
        // Si el edificio ya está en la BD, actualizar la información
        const { error: errorUpdate } = await supabase
          .from("edificios_evento")
          .update({ id_montaje_elegido, subtotal_alquiler })
          .match({ id_evento, id_edificio });

        if (errorUpdate) {
          console.error(`Error actualizando edificio ${id_edificio}:`, errorUpdate.message);
          throw new Error("No se pudo actualizar el edificio del evento");
        }
      } else {
        // Si el edificio no está en la BD, insertarlo
        const { error: errorInsert } = await supabase
          .from("edificios_evento")
          .insert([{ id_evento, id_edificio, id_montaje_elegido, subtotal_alquiler }]);

        if (errorInsert) {
          console.error("Error insertando nuevo edificio:", errorInsert.message);
          throw new Error("No se pudo insertar el nuevo edificio del evento");
        }
      }
    }

    
    return true;
  } catch (error) {
    console.error("Error interno en upsertEdificiosEvento:", error.message);
    throw new Error("Ocurrió un error al actualizar los edificios del evento");
  }
};

export const updatePedidoById = async (idpedido, pedido) => {
  try {
    const { id_evento, fecha_pedido, costo_total, pedidos_adicionales } = pedido;

    const { data, error } = await supabase
      .from("pedido")
      .update({
        id_evento,
        fecha_pedido,
        costo_total,
        pedidos_adicionales
      })
      .eq("idpedido", idpedido);

    if (error) {
      console.error("Error actualizando el pedido:", error.message);
      throw new Error("No se pudo actualizar el pedido: " + error.message);
    }

    
    return data;

  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al actualizar el pedido: " + error.message);
  }
};

export const upsertProductoPedido = async (idpedido, productoPedido) => {
  try {
    // Obtener los productos ya registrados para el pedido
    const { data: productosExistentes, error: errorSelect } = await supabase
      .from("producto_pedido")
      .select("id_producto")
      .eq("id_pedido", idpedido);

    if (errorSelect) {
      console.error("Error obteniendo productos del pedido:", errorSelect.message);
      throw new Error("No se pudo obtener los productos del pedido");
    }

    // Convertir los existentes a un Set para fácil comparación
    const productosRegistrados = new Set(productosExistentes.map(p => p.id_producto));

    for (const producto of productoPedido.productos) {
      
      const { id_producto, cantidad, subtotal } = producto;
      const idProductoNumerico = Number(id_producto); // Convertir id_producto a número


      if (productosRegistrados.has(idProductoNumerico)) {
        // Si el producto ya está en la BD, actualizar la información
        const { error: errorUpdate } = await supabase
          .from("producto_pedido")
          .update({ cantidad, subtotal })
          .match({ id_pedido: idpedido, id_producto: idProductoNumerico });

        if (errorUpdate) {
          console.error(`Error actualizando producto ${id_producto}:`, errorUpdate.message);
          throw new Error("No se pudo actualizar el producto del pedido");
        }
      } else {
        // Si el producto no está en la BD, insertarlo
        const { error: errorInsert } = await supabase
          .from("producto_pedido")
          .insert([{ id_pedido: idpedido, id_producto: idProductoNumerico, cantidad, subtotal }]);

        if (errorInsert) {
          console.error("Error insertando nuevo producto:", errorInsert.message);
          throw new Error("No se pudo insertar el nuevo producto del pedido");
        }
      }
    }

    
    return true;
  } catch (error) {
    console.error("Error interno en upsertProductoPedido:", error.message);
    throw new Error("Ocurrió un error al actualizar los productos del pedido");
  }
};