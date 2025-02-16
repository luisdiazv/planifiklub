import { supabase } from "../API/SupabaseAPI";

export const getPagosbyEventID = async (eventId) => {
    try {
          const { data, error } = await supabase.from("pagos").select("*").eq("id_evento", eventId);
    
          if (error) {
              console.error("Error obteniendo los pagos del evento:", error.message);
              throw new Error("No se pudo obtener los pagos del evento: " + error.message);
          }
    
          if (data.length > 0) {return data;
          } else { return "ID de Evento Desconocido"; }
    
      } catch (error) {
          console.error("Error interno:", error.message);
          throw new Error("Ocurrió un error al obtener el id del pedido: " + error.message);
      }
};    