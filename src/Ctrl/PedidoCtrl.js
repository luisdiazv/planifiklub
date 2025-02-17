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
      console.log(eventId);
      console.log(data[0]);
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

const getInfoPedidos = async (pedidoId) => {
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
