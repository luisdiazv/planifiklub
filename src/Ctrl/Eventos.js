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
  
export default { getEventTypes, getEventInfo, getUserName, getEventType };