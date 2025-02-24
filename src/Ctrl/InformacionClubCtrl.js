import { supabase } from "../API/SupabaseAPI";
import { restoreBackupLogoClub } from "../API/StorageAPI";

export const getActualNombreClubInfo = async () => {
  try {
    const { data, error } = await supabase
      .from("informacion_club")
      .select("nombre_club")
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al obtener el nombre del club:", error);
      throw new Error("No se pudo obtener el nombre del club");
    }

    return data[0].nombre_club;
  } catch (error) {
    console.error("Error interno en getActualNombreClubInfo:", error);
    throw new Error("No se pudo obtener el nombre del club");
  }
};

export const getActualDescripcionClubInfo = async () => {
  try {
    const { data, error } = await supabase
      .from("informacion_club")
      .select("descripcion_club")
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al obtener la descripción del club:", error);
      throw new Error("No se pudo obtener la descripción del club");
    }

    return data[0].descripcion_club;
  } catch (error) {
    console.error("Error interno en getActualDescripcionClubInfo:", error);
    throw new Error("No se pudo obtener la descripción del club");
  }
};

export const getActualColorList = async () => {
  try {
    const { data, error } = await supabase
      .from("informacion_club")
      .select("colores")
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al obtener la lista de colores:", error);
      throw new Error("No se pudo obtener la lista de colores");
    }

    const colores = data[0].colores;
    const coloresArray = colores.split("%%");
    return coloresArray;
  } catch (error) {
    console.error("Error interno en getActualColorList:", error);
    throw new Error("No se pudo obtener la lista de colores");
  }
};

export const getBackupInfoClub = async () => {
  try {
    const { data, error } = await supabase
      .from("informacion_club")
      .select("nombre_club, descripcion_club, colores")
      .eq("id_info_club", 1)
      .single();

    if (error) {
      console.error("Error al obtener los datos de respaldo:", error);
      throw new Error("No se pudo obtener la información de respaldo del club");
    }

    return data;
  } catch (error) {
    console.error("Error interno en getBackupInfoClub:", error);
    throw new Error("No se pudo obtener la información de respaldo del club");
  }
};

export const restoreBackup = async () => {
  try {
    const { data: backupData, error: backupError } = await supabase
      .from("informacion_club")
      .select("nombre_club, descripcion_club, colores")
      .eq("id_info_club", 1)
      .single();

    if (backupError) {
      console.error("Error al obtener los datos de respaldo:", backupError);
      throw new Error("No se pudo obtener la información de respaldo del club");
    }

    // Actualizamos el registro actual (ID 2) con los datos de respaldo
    const { data: updateData, error: updateError } = await supabase
      .from("informacion_club")
      .update(backupData)
      .eq("id_info_club", 2);

    if (updateError) {
      console.error("Error al restaurar la información del club desde respaldo:", updateError);
      throw new Error("No se pudo restaurar la información del club desde respaldo");
    }

    await restoreBackupLogoClub();
    return updateData;
  } catch (error) {
    console.error("Error interno en restoreBackup:", error);
    throw new Error("No se pudo restaurar la información del club desde respaldo");
  }
};

export const updateActualInfoClub = async (nombre, descripcion, newColorsArray) => {
  try {
    const newColors = newColorsArray.join("%%");

    if (descripcion.trim() === "") {
      descripcion = null;
    }

    const { data, error } = await supabase
      .from("informacion_club")
      .update({
        nombre_club: nombre,
        descripcion_club: descripcion,
        colores: newColors
      })
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al actualizar la información del club:", error);
      throw new Error("No se pudo actualizar la información del club");
    }
    return data;
  } catch (error) {
    console.error("Error interno en updateActualInfoClub:", error);
    throw new Error("No se pudo actualizar la información del club");
  }
};

export const updateActualColors = async (newColorsArray) => {
  try {
    const newColors = newColorsArray.join("%%");

    const { data, error } = await supabase
      .from("informacion_club")
      .update({ colores: newColors })
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al actualizar los colores actuales:", error);
      throw new Error("No se pudo actualizar los colores actuales");
    }
    return data;
  } catch (error) {
    console.error("Error interno en updateActualColors:", error);
    throw new Error("No se pudo actualizar los colores actuales");
  }
};

export const getActualInfoClub = async () => {
  try {
    const { data, error } = await supabase
      .from("informacion_club")
      .select("nombre_club, descripcion_club, colores")
      .eq("id_info_club", 2);

    if (error) {
      console.error("Error al obtener la información del club:", error);
      throw new Error("No se pudo obtener la información del club");
    }

    return data[0];
  } catch (error) {
    console.error("Error interno en getActualInfoClub:", error);
    throw new Error("No se pudo obtener la información del club");
  }
}
