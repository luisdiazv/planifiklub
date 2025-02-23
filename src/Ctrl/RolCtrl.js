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

export const getAllAdmins = async () => {
  try {
    // Obtener el ID del rol "Administrativo"
    const { data: roles, error: errorRoles } = await supabase
      .from('roles')
      .select('idroles')
      .eq('nombre_rol', 'Administrativo')
      .single();

    if (errorRoles) {
      console.error('Error al obtener el rol Administrativo:', errorRoles);
      return [];
    }

    const idRolAdministrativo = roles.idroles;

    // Obtener los IDs de los usuarios con el rol "Administrativo"
    const { data: accesos, error: errorAccesos } = await supabase
      .from('accesos')
      .select('id_usuario')
      .eq('id_rol', idRolAdministrativo);

    if (errorAccesos) {
      console.error('Error al obtener los accesos de los usuarios administrativos:', errorAccesos);
      return [];
    }

    const idsUsuarios = accesos.map(acceso => acceso.id_usuario);

    // Obtener los correos electrónicos de los usuarios administrativos
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuario')
      .select('correo')
      .in('idusuario', idsUsuarios);

    if (errorUsuarios) {
      console.error('Error al obtener los correos de los usuarios administrativos:', errorUsuarios);
      return [];
    }

    console.log('Correos de usuarios administrativos:', usuarios);
    return usuarios;

  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo obtener los administradores");
  }
};