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

export const updateTipoEvento = async (id, updatedInfo) => {
  try {
      const { data, error } = await supabase.from("tipos_eventos").update(updatedInfo).eq("idtipos_eventos", id);

      if (error) {
          console.error("Error actualizando el tipo de evento:", error.message);
          throw new Error("No se pudo actualizar el tipo de evento: " + error.message);
      }

      return data;
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al actualizar el tipo de evento: " + error.message);
  }
};

export const getTipoEventoByNombre = async (nombre) => {
  try {
      const { data, error } = await supabase.from("tipos_eventos").select("*").ilike("nombre", `%${nombre}%`); // Uso de ilike para búsqueda insensible a mayúsculas/minúsculas

      if (error) {
          console.error("Error obteniendo tipo de evento por nombre:", error.message);
          throw new Error("No se pudo obtener los tipo de evento por nombre: " + error.message);
      }

      return data;
  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener tipo de evento por nombre: " + error.message);
  }
};

export const createTipoEvento = async (newTEvento) => {
    try {
        const { data, error } = await supabase.from("tipos_eventos").insert(newTEvento).select();

        if (error) {
            console.error("Error creando el tipo de evento:", error.message);
            throw new Error("No se pudo crear el tipo de evento: " + error.message);
        }

        return data[0]
        
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al crear el tipo de evento: " + error.message);
    }
};

export const deleteTipoEvento = async (id) => {
    try {
        const { data, error } = await supabase.from("tipos_eventos").delete().eq("idtipos_eventos", id);

        if (error) {
            console.error("Error eliminando el tipo de evento:", error.message);
            throw new Error("No se pudo eliminar el tipo de evento: " + error.message);
        }

        return data;
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al eliminar el tipo de evento: " + error.message);
    }
};
