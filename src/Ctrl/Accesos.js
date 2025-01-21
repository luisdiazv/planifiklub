import { supabase } from "../API/SupabaseAPI";

export const getRolByUser = async (id) => {
  try {
    const { data, error } = await supabase.from("accesos").select("id_rol").eq("id_usuario", id);
    if (error) {
      console.error("Error verificando acceso:", error);
      throw new Error("No se pudo verificar el acceso");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("No se pudo verificar el acceso");
  }
};