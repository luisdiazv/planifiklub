import { supabase } from "../API/SupabaseAPI";

export const getEventTypes = async () => {
  try {
    const { data, error } = await supabase.from("tipos_eventos").select("*");

    if (error) {
      console.error("Error obteniendo los tipos de eventos:", error.message);
      throw new Error("No se pudo obtener los tipos de eventos: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los tipos de eventos: " + error.message);
  }
};

export const getEventInfo = async (eventId) => {
    try {
      const { data, error } = await supabase.from("evento").select("*").eq("idevento", eventId);
  
      if (error) {
        console.error("Error obteniendo el evento:", error.message);
        throw new Error("No se pudo obtener el evento: " + error.message);
      }
  
      if (!data || data.length === 0) {
        throw new Error("No se encontró el evento con el ID proporcionado.");
      }

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

        if (data.length > 0) { return `${data[0].nombres} ${data[0].apellidos}`;
        } else { return "Usuario desconocido"; }

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

        if (data.length > 0) { return data[0].nombre; 
        } else { return "Tipo de Evento Desconocido"; }

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

const getProductName = async (productoId) => {
  try {
      const { data, error } = await supabase.from("producto").select("nombre").eq("idproducto", productoId);

      if (error) {
          console.error("Error obteniendo el nombre del producto:", error.message);
          throw new Error("No se pudo obtener el nombre del producto: " + error.message);
      }

      if (data.length > 0) { return data[0];
      } else { return "Producto Desconocido"; }

  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener el nombre del producto: " + error.message);
  }
};

export const getEdificios = async (eventId) => {
    try {
        const { data, error } = await supabase
            .from("edificios_evento")
            .select("*")
            .eq("id_evento", eventId);

        if (error) {
            console.error("Error obteniendo los edificios del evento:", error.message);
            throw new Error("No se pudo obtener los edificios del evento: " + error.message);
        }

        if (data.length > 0) {
            const info = await getInfoEdificios(data); // Usar await aquí
            return info;
        } else {
            return "Edificios del Evento Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener los edificios del evento: " + error.message);
    }
};

const getMontajeName = async (montajeId) => {
    try {
        const { data, error } = await supabase
            .from("montajes")
            .select("nombre_montaje")
            .eq("idmontajes", montajeId);

        if (error) {
            console.error("Error obteniendo el nombre del montaje:", error.message);
            throw new Error("No se pudo obtener el nombre del montaje: " + error.message);
        }

        if (data.length > 0) {
            return data[0].nombre_montaje;
        } else {
            return "Nombre del Montaje Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el nombre del montaje: " + error.message);
    }
};

const getEdificioName = async (edificioId) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .select("nombre")
            .eq("idedificios", edificioId);

        if (error) {
            console.error("Error obteniendo el nombre del edificio:", error.message);
            throw new Error("No se pudo obtener el nombre del edificio: " + error.message);
        }

        if (data.length > 0) {
            return data[0].nombre;
        } else {
            return "Nombre del Edificio Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el nombre del Edificio: " + error.message);
    }
};

const getInfoEdificios = async (data) => {
    try {
        const listaConNombres = await Promise.all(
            data.map(async (ed) => {
                try {
                    const edificio = await getEdificioName(ed.id_edificio);
                    const montaje = await getMontajeName(ed.id_montaje_elegido);
                    return {
                        ...ed,
                        nombre_edificio: edificio,
                        nombre_montaje: montaje,
                    };
                } catch (err) {
                    console.error("Error obteniendo nombres:", err.message);
                    return {
                        ...ed,
                        nombre_edificio: "Nombre del Edificio Desconocido",
                        nombre_montaje: "Nombre del Montaje Desconocido",
                    };
                }
            })
        );
        return listaConNombres;
    } catch (error) {
        console.error("Error al obtener la lista de edificios con nombres:", error.message);
        throw new Error("No se pudo obtener la lista de edificios con nombres: " + error.message);
    }
};

  
  
