import { data } from "autoprefixer";
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
    const { data: usuarios, error: errorUsuarios } = await supabase.from('usuario').select('correo').eq('idusuario', 
      supabase.from('accesos').select('id_usuario').eq('id_rol', 
      supabase.from('roles').select('idroles').eq('nombre_rol', 'Administrativo')
      )
    );

    if (errorUsuarios) {
      console.error('Error al obtener los correos:', errorUsuarios);
    } else {
      console.log('Correos de usuarios administrativos:', usuarios);
    }

    return data;

  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo obtener los administradores");
  }
}