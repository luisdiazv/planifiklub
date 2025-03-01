import { supabase } from "./SupabaseAPI";

// Función auxiliar para redimensionar la imagen
const resizeImage = (file, maxSide = 300) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      let { width, height } = image;

      // Calcular la escala en función del lado más largo
      if (width > height) {
        if (width > maxSide) {
          height = Math.round(height * (maxSide / width));
          width = maxSide;
        }
      } else {
        if (height > maxSide) {
          width = Math.round(width * (maxSide / height));
          height = maxSide;
        }
      }

      // Crear un canvas para redimensionar la imagen
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      // Convertir el canvas a Blob con el mismo tipo MIME que el archivo original
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Error al redimensionar la imagen: canvas vacío."));
        }
      }, file.type);
    };

    image.onerror = (error) => reject(error);
    image.src = URL.createObjectURL(file);
  });
};

export const getFotoProducto = async (id) => {
  const path = `Producto/${id}.jpg`;

  try {
    const { data, error } = await supabase.storage.from("Img").createSignedUrl(path, 60);
    if (error) {
      console.error(error.message);
    }
    if (data) {
      return data.signedUrl;
    } else {
      console.error("No file found.");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting URL:", error.message);
  }
};

export const deleteFotoProducto = async (id) => {
  const path = `Producto/${id}.jpg`;
  try {
    const { data, error } = await supabase.storage.from("Img").remove([path]);
    if (error) {
      console.error("Error al eliminar la imagen:", error.message);
      throw new Error("No se pudo eliminar la imagen");
    }
    
    return data;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error.message);
    throw error;
  }
};

export const deleteFotoEdificio = async (id) => {
  const path = `Edificio/${id}.jpg`;
  try {
    const { data, error } = await supabase.storage.from("Img").remove([path]);
    if (error) {
      console.error("Error al eliminar la imagen:", error.message);
      throw new Error("No se pudo eliminar la imagen");
    }
    
    return data;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error.message);
    throw error;
  }
};

export const uploadFotoProducto = async (id, file) => {
  const path = `Producto/${id}.jpg`;
  
  const resizedFile = await resizeImage(file, 300);
  
  const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
  if (checkError) {
    console.error("Error al verificar si existe la imagen:", checkError.message);
    throw new Error("No se pudo verificar si existe la imagen");
  }
  if (existingFile) {
    const { error: deleteError } = await supabase.storage.from("Img").remove([path]);
    if (deleteError) {
      console.error("Error al eliminar la imagen existente:", deleteError.message);
      throw new Error("No se pudo eliminar la imagen existente");
    }
  }

  const { data, error } = await supabase.storage.from("Img").upload(path, resizedFile);
  if (error) {
    console.error("Error subiendo imagen:", error);
    throw new Error("No se pudo subir la imagen");
  }
  return data;
};

export const uploadFotoEdificio = async (id, file) => {
  const path = `Edificio/${id}.jpg`;

  const resizedFile = await resizeImage(file, 300);

  const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
  if (checkError) {
    console.error("Error al verificar si existe la imagen:", checkError.message);
    throw new Error("No se pudo verificar si existe la imagen");
  }
  if (existingFile) {
    const { error: deleteError } = await supabase.storage.from("Img").remove([path]);
    if (deleteError) {
      console.error("Error al eliminar la imagen existente:", deleteError.message);
      throw new Error("No se pudo eliminar la imagen existente");
    }
  }

  const { data, error } = await supabase.storage.from("Img").upload(path, resizedFile);
  if (error) {
    console.error("Error subiendo imagen:", error);
    throw new Error("No se pudo subir la imagen");
  }
  return data;
};

export const getFotoEdificio = async (id) => {
  const path = `Edificio/${id}.jpg`;
  try {
    const { data, error } = await supabase.storage.from("Img").createSignedUrl(path, 60);
    if (error) {
      console.error(error.message);
    }
    if (data) {
      return data.signedUrl;
    } else {
      console.error("No file found.");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting URL:", error.message);
  }
};

export const getFotoTipoEvento = async (id) => {
  const path = `TipoEvento/${id}.jpg`;

  try {
    const { data, error } = await supabase.storage.from("Img").createSignedUrl(path, 60);
    if (error) {
      console.error(error.message);
    }
    if (data) {
      return data.signedUrl;
    } else {
      console.error("No file found.");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting URL:", error.message);
  }
};

export const deleteFotoTipoEvento = async (id) => {
  const path = `TipoEvento/${id}.jpg`;
  try {
    const { data, error } = await supabase.storage.from("Img").remove([path]);
    if (error) {
      console.error("Error al eliminar la imagen:", error.message);
      throw new Error("No se pudo eliminar la imagen");
    }
    
    return data;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error.message);
    throw error;
  }
};

export const uploadFotoTipoEvento = async (id, file) => {
  const path = `TipoEvento/${id}.jpg`;
  
  const resizedFile = await resizeImage(file, 300);
  
  const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
  if (checkError) {
    console.error("Error al verificar si existe la imagen:", checkError.message);
    throw new Error("No se pudo verificar si existe la imagen");
  }
  if (existingFile) {
    const { error: deleteError } = await supabase.storage.from("Img").remove([path]);
    if (deleteError) {
      console.error("Error al eliminar la imagen existente:", deleteError.message);
      throw new Error("No se pudo eliminar la imagen existente");
    }
  }

  const { data, error } = await supabase.storage.from("Img").upload(path, resizedFile);
  if (error) {
    console.error("Error subiendo imagen:", error);
    throw new Error("No se pudo subir la imagen");
  }
  return data;
};

export const getActualLogoClub = async () => {
  const path = `Club/2.svg`;
  try {
    const { data, error } = await supabase.storage.from("Img").createSignedUrl(path, 60);
    if (error) {
      console.error("Error al obtener el logo actual:", error.message);
      return undefined;
    }
    if (data) {
      return data.signedUrl;
    } else {
      console.error("No se encontró el logo actual.");
      return undefined;
    }
  } catch (error) {
    console.error("Error obteniendo el logo actual:", error.message);
    return undefined;
  }
};

export const restoreBackupLogoClub = async () => {
  const backupPath = `Club/1.svg`;
  const currentPath = `Club/2.svg`;

  try {
    const { data: backupData, error: downloadError } = await supabase.storage
      .from("Img")
      .download(backupPath);
    if (downloadError) {
      console.error("Error al descargar el logo de respaldo:", downloadError.message);
      throw new Error("No se pudo descargar el logo de respaldo");
    }
    if (!backupData) {
      console.error("No se encontró el logo de respaldo.");
      throw new Error("No se encontró el logo de respaldo");
    }

    // Verificar y eliminar el logo actual si existe
    const { data: existingFile, error: checkError } = await supabase.storage
      .from("Img")
      .getPublicUrl(currentPath);
    if (checkError) {
      console.error("Error al verificar la existencia del logo actual:", checkError.message);
      throw new Error("No se pudo verificar la existencia del logo actual");
    }
    if (existingFile) {
      const { error: deleteError } = await supabase.storage.from("Img").remove([currentPath]);
      if (deleteError) {
        console.error("Error al eliminar el logo actual:", deleteError.message);
        throw new Error("No se pudo eliminar el logo actual");
      }
    }

    // Subir el archivo de respaldo como el logo actual
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Img")
      .upload(currentPath, backupData);
    if (uploadError) {
      console.error("Error subiendo el logo restaurado:", uploadError.message);
      throw new Error("No se pudo restaurar el logo");
    }
    return uploadData;
  } catch (error) {
    console.error("Error en restoreBackupLogoClub:", error.message);
    throw error;
  }
};

export const getBackupLogoClub = async () => { 
  const path = `Club/1.svg`;
  try {
    const { data, error } = await supabase.storage.from("Img").createSignedUrl(path, 60);
    if (error) {
      console.error("Error al obtener el logo de respaldo:", error.message);
      return undefined;
    }
    if (data) {
      return data.signedUrl;
    } else {
      console.error("No se encontró el logo de respaldo.");
      return undefined;
    }
  } catch (error) {
    console.error("Error obteniendo el logo de respaldo:", error.message);
    return undefined;
  }
};

export const uploadActualLogoClub = async (file) => {
  const path = `Club/2.svg`;

  // Verificar si existe un logo actual y eliminarlo si es necesario
  const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
  if (checkError) {
    console.error("Error al verificar si existe el logo:", checkError.message);
    throw new Error("No se pudo verificar si existe el logo");
  }
  if (existingFile) {
    const { error: deleteError } = await supabase.storage.from("Img").remove([path]);
    if (deleteError) {
      console.error("Error al eliminar el logo existente:", deleteError.message);
      throw new Error("No se pudo eliminar el logo existente");
    }
  }

  const { data, error } = await supabase.storage.from("Img").upload(path, file);
  if (error) {
    console.error("Error subiendo el logo:", error.message);
    throw new Error("No se pudo subir el logo");
  }
  return data;
};
