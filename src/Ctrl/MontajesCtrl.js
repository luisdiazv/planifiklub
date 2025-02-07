import { supabase } from "../API/SupabaseAPI";

export const getNombreMontajeByIdMontaje = async (montajeId) => {
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

  
