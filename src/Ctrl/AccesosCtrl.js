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

export const updateAccesos = async (userId, roles) => {
  try {
    // Obtener los roles previos del usuario
    const prevData = await getRolByUser(userId);
    const prevRoles = prevData.map(role => role.id_rol);

    // 1. Filtrar los roles nuevos (aquellos que no están en prevRoles)
    const rolesToUpsert = roles.filter(role => !prevRoles.includes(role));

    // 2. Filtrar los roles para eliminar (aquellos que están en prevRoles pero no en roles)
    const rolesToDelete = prevRoles.filter(role => !roles.includes(role));

    // Realizar el upsert de roles nuevos (añadir o actualizar roles)
    if (rolesToUpsert.length > 0) {
      const { data: upsertData, error: upsertError } = await supabase.from("accesos").upsert(
        rolesToUpsert.map(role => ({ id_usuario: userId, id_rol: role }))
      );

      if (upsertError) {
        console.error("Error al realizar el upsert:", upsertError);
        return;
      } else {
        console.log("Upsert exitoso:", upsertData);
      }
    }

    // Eliminar los roles que están en la base de datos pero no en el parámetro
    if (rolesToDelete.length > 0) {
      const { data: deleteData, error: deleteError } = await supabase
        .from("accesos")
        .delete()
        .in("id_rol", rolesToDelete)
        .eq("id_usuario", userId);

      if (deleteError) {
        console.error("Error al eliminar roles:", deleteError);
        return;
      } else {
        console.log("Roles eliminados:", deleteData);
      }
    }

    // Si no hubo cambios
    if (rolesToUpsert.length === 0 && rolesToDelete.length === 0) {
      console.log("No hay cambios para realizar.");
    }

  } catch (error) {
    console.error("Error en la función updateUserRoles:", error);
  }
};
