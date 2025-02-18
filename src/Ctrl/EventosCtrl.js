import { supabase } from "../API/SupabaseAPI";
import dayjs from "dayjs"; 
import "dayjs/locale/es";

export const getAllEventIdsByMonth = async (currentMonth) => {
  try {
    dayjs.locale("es");

    // Formatea las fechas de inicio y fin del mes actual
    const startDate = `${currentMonth}-01`; // Primer día del mes
    const endDate = dayjs(currentMonth).endOf("month").format("YYYY-MM-DD"); // Último día del mes

    const { data, error } = await supabase.from("evento").select("*")
      .gte("fecha", startDate) // Fecha mayor o igual al inicio del mes
      .lte("fecha", endDate);  // Fecha menor o igual al final del mes

    if (error) {
      console.error("Error obteniendo los IDs de los eventos:", error.message);
      throw new Error("No se pudo obtener los IDs de los eventos: " + error.message);
    }

    return data; // Devuelve un array con los IDs
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los IDs de los eventos: " + error.message);
  }
};


export const getEventById = async (eventId) => {
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

export const getAllEventIds = async () => {
    try {
      const { data, error } = await supabase
        .from("evento") // Tabla de eventos
        .select("idevento"); // Selecciona solo la columna de IDs
  
      if (error) {
        console.error("Error obteniendo los IDs de los eventos:", error.message);
        throw new Error("No se pudo obtener los IDs de los eventos: " + error.message);
      }
  
      if (data && data.length > 0) {
        return data.map(event => event.idevento); // Devuelve un array con los IDs
      } else {
        return []; // Si no hay datos, devuelve un array vacío
      }
    } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener los IDs de los eventos: " + error.message);
    }
};

export const updateEventStatus = async (eventId, newStatus) => {
    try {
        const { error } = await supabase
            .from("evento")
            .update({ estado: newStatus })
            .eq("idevento", eventId);

        if (error) {
            console.error("Error actualizando el estado del evento:", error.message);
            throw new Error("No se pudo actualizar el estado del evento: " + error.message);
        }

        console.log("Estado del evento actualizado correctamente.");
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al actualizar el estado del evento: " + error.message);
    }
};