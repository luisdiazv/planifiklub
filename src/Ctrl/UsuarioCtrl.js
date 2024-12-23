import { supabase } from "../API/SupabaseAPI";

export const verificarUsuario = async (username, password) => {

  try {
    const { data, error } = await supabase.from("usuario").select("idusuario").eq("correo", username).eq("password", password);

    if (error) {
      console.error("Error verificando usuario:", error);
      throw new Error("No se pudo verificar el usuario");
    }
    return data.length > 0;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("No se pudo verificar el usuario");
  }
};

export default verificarUsuario;