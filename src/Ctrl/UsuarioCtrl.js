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

export const registrarUsuario = async (usuario) => {
  try {
    const { data, error } = await supabase.from("usuario").insert(usuario);

    if (error) {
      console.error("Error registrando usuario:", error.message);
      throw new Error("No se pudo registrar el usuario: " + error.message);
    }

    console.log("Usuario registrado con éxito:", data);
    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al registrar el usuario: " + error.message);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase.from("usuario").select("*").eq("correo", email).single();
    console.log(data);
    if (error) {
      console.error("Error obteniendo usuario por correo:", error.message);
      throw new Error("No se pudo obtener el usuario: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener el usuario: " + error.message);
  }
};

export const updateUsuario = async (email, updates) => {
  try {
    const { data, error } = await supabase.from("usuario").update(updates).eq("correo", email);
    const usuario = await getUserByEmail(email);
    console.log("Usuario encontrado:", usuario);
    console.log("Datos actualizados:", data);
    if (error) {
      console.error(`Error al modificar usuario con ID ${email}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error(`Error inesperado al modificar usuario con ID ${email}:`, err);
    return { data: null, error: err };
  }
};


export default { verificarUsuario, registrarUsuario, getUserByEmail, updateUsuario };