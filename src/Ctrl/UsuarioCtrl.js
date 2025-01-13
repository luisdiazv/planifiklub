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

export const actualizarPassword = async (email, newPassword) => {
  try {
    const { data, error, count } = await supabase
      .from("usuario")
      .update({ password: newPassword })
      .eq("correo", email)
      .select("*", { count: "exact" }); // Habilitamos el conteo exacto

    if (error) {
      console.error("Error actualizando contraseña:", error.message);
      throw new Error("No se pudo actualizar la contraseña: " + error.message);
    }

    if (count === 0) {
      console.warn("No se encontró un usuario con el correo proporcionado.");
      return false; // No se actualizó ningún registro
    }

    console.log("Contraseña actualizada con éxito:", data);
    return true; // Contraseña actualizada exitosamente
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al actualizar la contraseña: " + error.message);
  }
};


export default { verificarUsuario, registrarUsuario, getUserByEmail, actualizarPassword };
