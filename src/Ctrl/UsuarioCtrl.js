import { supabase } from "../API/SupabaseAPI";

export const getUsuariosByBusqueda = async (searchTerm) => {
  try {
    // Preparamos el valor de búsqueda con comodines para el patrón
    const searchValue = `%${searchTerm}%`;
    // Se utiliza el método 'or' para filtrar por cualquiera de las columnas deseadas
    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .or(`nombres.ilike.${searchValue},apellidos.ilike.${searchValue},correo.ilike.${searchValue},documento.ilike.${searchValue}`);

    if (error) {
      console.error("Error buscando usuario por búsqueda:", error.message);
      throw new Error("No se pudo buscar el usuario: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error interno al buscar usuario:", error.message);
    throw new Error("Ocurrió un error al buscar el usuario: " + error.message);
  }
};

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
    console.log(usuario);
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

export const getUsuarioByEmail = async (email) => {
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

export const updateUsuario = async (email, updates) => {
  try {
    console.warn(updates);
    const { data, error } = await supabase.from("usuario").update(updates).eq("correo", email);
    const usuario = await getUsuarioByEmail(email);
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


export const getUsuarioByID = async (id) => {
  try {
    const { data, error } = await supabase.from("usuario").select("*").eq("idusuario", id).single();
    if (error) {
      console.error("Error obteniendo usuario por id:", error.message);
      throw new Error("No se pudo obtener el usuario: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener el usuario: " + error.message);
  }
};

export const getNombresApellidosById = async (userId) => {
  try {
    const { data, error } = await supabase.from("usuario").select("*").eq("idusuario", userId);

    if (error) {
      console.error("Error obteniendo el usuario:", error.message);
      throw new Error("No se pudo obtener el usuario: " + error.message);
    }

    if (data.length > 0) {
      if (data[0].tipo_documento === 'NIT'){
        return `${data[0].apellidos} Encargado de ${data[0].nombres}`
      } else {
        return `${data[0].nombres} ${data[0].apellidos}`;
      }
    } else { return "Usuario desconocido"; }

  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener la información del usuario: " + error.message);
  }
};

export const getNombresApellidosByEmail = async (email) => {
  try {
    const { data, error } = await supabase.from("usuario").select("nombres, apellidos").eq("correo", email);

    if (error) {
      console.error("Error obteniendo el usuario:", error.message);
      throw new Error("No se pudo obtener el usuario: " + error.message);
    }

    if (data.length > 0) {
      return `${data[0].nombres} ${data[0].apellidos}`;
    } else { return "Usuario desconocido"; }

  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener la información del usuario: " + error.message);
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

    console.log("Contraseña actualizada con éxito");
    return true; // Contraseña actualizada exitosamente
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al actualizar la contraseña: " + error.message);
  }
};

export default { verificarUsuario, registrarUsuario, getUsuarioByEmail, updateUsuario, getUsuarioByID, actualizarPassword, getNombresApellidosById };
