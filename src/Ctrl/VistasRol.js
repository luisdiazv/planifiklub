import { supabase } from "../API/SupabaseAPI";

export const getVistaRolByRol = async (rolesIds) => {
  try {
    const { data, error } = await supabase.from("vistasXrol").select("id_vista").in("id_rol", rolesIds);
    if (error) {
      console.error("Error verificando vistaRol:", error);
      throw new Error("No se pudo verificar la vistaRol");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("No se pudo verificar la vistaRol");
  }
};