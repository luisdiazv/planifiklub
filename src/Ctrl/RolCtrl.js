import { supabase } from "../API/SupabaseAPI";

export const getAllRoles = async () => {
  try {
    const { data, error } = await supabase.from("roles").select("*");

    console.log("Roles obtenidos:", data);
    if (error) {
      console.error("Error obteniendo todos los roles:", error);
      throw new Error("No se pudo obtener los roles");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo verificar los roles");
  }
};