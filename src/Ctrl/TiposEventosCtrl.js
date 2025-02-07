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