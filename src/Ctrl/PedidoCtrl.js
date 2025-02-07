import { supabase } from "../API/SupabaseAPI";

export const getPedidosByIdEvento = async (eventId) => {
  try {
      const { data, error } = await supabase.from("pedido").select("idpedido").eq("id_evento", eventId);

      if (error) {
          console.error("Error obteniendo el id del pedido:", error.message);
          throw new Error("No se pudo obtener el id del pedido: " + error.message);
      }

      if (data.length > 0) {return getListaPedidos(data[0].idpedido);
      } else { return "ID de Pedido Desconocido"; }

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

      const listaConNombres = await Promise.all(
          data.map(async (pedido) => {
              const productName = await getPedidosByIdEvento(pedido.id_producto);
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

const getInfoPedidos = async (pedidoId) => {
  try {
      const { data, error } = await supabase.from("producto_pedido").select("*").eq("id_pedido", pedidoId);

      if (error) {
          console.error("Error obteniendo la lista de pedidos:", error.message);
          throw new Error("No se pudo obtener la lista de pedidos: " + error.message);
      }

      if (data.length > 0) { return data;
      } else { return "Lista de Pedidos Desconocido"; }

  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener la lista de pedidos: " + error.message);
  }
};
