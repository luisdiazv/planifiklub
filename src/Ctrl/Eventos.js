import { supabase } from "../API/SupabaseAPI";

export const getEventTypes = async () => {
  try {
    const { data, error } = await supabase.from("tipos_eventos").select("*");

    if (error) {
      console.error("Error obteniendo los tipos de eventos:", error.message);
      throw new Error("No se pudo obtener los tipos de eventos: " + error.message);
    }

    //console.log("Tipos de eventos obtenidos con éxito:", data);
    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los tipos de eventos: " + error.message);
  }
};

export const getEventInfo = async (eventId) => {
    if (!eventId) {
      throw new Error("El ID del evento es requerido.");
    }
  
    try {
      const { data, error } = await supabase.from("evento").select("*").eq("idevento", eventId);
  
      if (error) {
        console.error("Error obteniendo el evento:", error.message);
        throw new Error("No se pudo obtener el evento: " + error.message);
      }
  
      if (!data || data.length === 0) {
        throw new Error("No se encontró el evento con el ID proporcionado.");
      }
  
      //console.log("Información del Evento:", data[0]);
      return data[0];       

    } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error(
        "Ocurrió un error al obtener la información del evento: " +
          error.message
      );
    }
  };

export const getUserName = async (userId) => {
    try {
        const { data, error } = await supabase.from("usuario").select("nombres, apellidos").eq("idusuario", userId);

        if (error) {
            console.error("Error obteniendo el usuario:", error.message);
            throw new Error("No se pudo obtener el usuario: " + error.message);
        }

        if (data.length > 0) {
            return `${data[0].nombres} ${data[0].apellidos}`;
        } else {
            return "Usuario desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener la información del usuario: " + error.message);
    }
};

export const getEventType = async (eventId) => {
    try {
        const { data, error } = await supabase.from("tipos_eventos").select("nombre").eq("idtipos_eventos", eventId);

        if (error) {
            console.error("Error obteniendo el tipo de evento:", error.message);
            throw new Error("No se pudo obtener el tipo de evento: " + error.message);
        }

        if (data.length > 0) {
            return data[0].nombre;
        } else {
            return "Tipo de Evento Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el tipo de evento: " + error.message);
    }
};

export const getPedidos = async (eventId) => {
  try {
      const { data, error } = await supabase.from("pedido").select("idpedido").eq("id_evento", eventId);

      if (error) {
          console.error("Error obteniendo el id del pedido:", error.message);
          throw new Error("No se pudo obtener el id del pedido: " + error.message);
      }

      if (data.length > 0) {
          return getListaPedidosConNombre(data[0].idpedido);
      } else {
          return "ID de Pedido Desconocido";
      }
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener el id del pedido: " + error.message);
  }
};

const getListaPedidosConNombre = async (pedidoId) => {
  try {
      const data = await getListaPedidos(pedidoId);

      if (data === "Lista de Pedidos Desconocido") {
          return [];
      }

      const listaConNombres = await Promise.all(
          data.map(async (pedido) => {
              const productName = await getProductName(pedido.id_producto);
              return {
                  ...pedido,
                  nombre_producto: productName.nombre,
              };
          })
      );

      return listaConNombres;
  } catch (error) {
      console.error("Error al obtener la lista de pedidos con nombres:", error.message);
      throw new Error("No se pudo obtener la lista de pedidos con nombres: " + error.message);
  }
};

const getListaPedidos = async (pedidoId) => {
  try {
      const { data, error } = await supabase.from("producto_pedido").select("*").eq("id_pedido", pedidoId);

      if (error) {
          console.error("Error obteniendo la lista de pedidos:", error.message);
          throw new Error("No se pudo obtener la lista de pedidos: " + error.message);
      }

      if (data.length > 0) {
          //console.log(data);
          return data;
      } else {
          return "Lista de Pedidos Desconocido";
      }
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener la lista de pedidos: " + error.message);
  }
};

const getProductName = async (productoId) => {
  try {
      const { data, error } = await supabase.from("producto").select("nombre").eq("idproducto", productoId);

      if (error) {
          console.error("Error obteniendo el nombre del producto:", error.message);
          throw new Error("No se pudo obtener el nombre del producto: " + error.message);
      }

      if (data.length > 0) {
          return data[0];
      } else {
          return "Producto Desconocido";
      }
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener el nombre del producto: " + error.message);
  }
};
  
export default { getEventTypes, getEventInfo, getUserName, getEventType, getPedidos };