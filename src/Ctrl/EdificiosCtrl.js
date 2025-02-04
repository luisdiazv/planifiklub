import { supabase } from "../API/SupabaseAPI";

export const getAllEdificio = async () => {
    try {
        const { data, error } = await supabase.from("edificios").select("*");

        console.log("Edificios obtenidos:", data);
        if (error) {
            console.error("Error obteniendo todos los edificios:", error);
            throw new Error("No se pudo obtener los edificios");
        }
        return data;
    } catch (error) {
        console.error("Error interno:", error);
        throw new Error("FATAL ERROR: No se pudo verificar los edificios");
    }
};