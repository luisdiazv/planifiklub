import { supabase } from "../API/SupabaseAPI";

export const getAllMontajeEdificio = async () => {
    try {
        const { data, error } = await supabase.from("montajes_edificios").select("*");

        if (error) {
            console.error("Error obteniendo todos los montajes en edificios:", error);
            throw new Error("No se pudo obtener los montajes en edificios");
        }
        return data;
    } catch (error) {
        console.error("Error interno:", error);
        throw new Error("FATAL ERROR: No se pudo verificar los montajes en edificios");
    }
};

export const getMontajesByEdificio = async (idEdificio) => {
    try {
        const { data, error } = await supabase
            .from('montajes_edificios')
            .select('id_montajes')
            .eq('id_edificio', idEdificio);

        if (error) {
            console.error("Error obteniendo montajes del edificio:", error);
            throw new Error("No se pudo obtener los montajes del edificio");
        }

        // Devuelve un array de IDs de montajes
        return data.map(item => item.id_montajes);
    } catch (error) {
        console.error("Error interno:", error);
        throw new Error("FATAL ERROR: No se pudo verificar los montajes del edificio");
    }
};

export const saveMontajesEdificio = async (idEdificio, montajesSeleccionados) => {
  try {
    // Eliminar montajes existentes para el edificio
    const { error: deleteError } = await supabase
      .from("montajes_edificios")
      .delete()
      .eq("id_edificio", idEdificio);

    if (deleteError) {
      console.error("Error eliminando montajes existentes:", deleteError);
      throw new Error("No se pudieron eliminar los montajes existentes");
    }

    // Verificar si hay montajes a insertar
    if (Array.isArray(montajesSeleccionados) && montajesSeleccionados.length > 0) {
      // Preparar datos para insertar, utilizando el idEdificio recibido
      const montajesInsert = montajesSeleccionados.map((montaje) => ({
        id_edificio: idEdificio,
        id_montajes: montaje.id_montajes,
      }));

      const { error: insertError } = await supabase
        .from("montajes_edificios")
        .insert(montajesInsert);

      if (insertError) {
        console.error("Error insertando nuevos montajes:", insertError);
        throw new Error("No se pudieron guardar los montajes seleccionados");
      }
    }

    console.log("Montajes guardados exitosamente para el edificio:", idEdificio);
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo guardar los montajes del edificio");
  }
};
