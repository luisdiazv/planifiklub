import { supabase } from "../API/SupabaseAPI";

export const getAllMontajeEdificio = async () => {
    try {
        const { data, error } = await supabase.from("montajes_edificios").select("*");

        console.log("montajes en edificios obtenidos:", data);
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