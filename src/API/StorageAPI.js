import { supabase } from "./SupabaseAPI";

export const getFotoProducto = async (id) => {
    const path = `Producto/${id}.jpg`;
    
    try {
        const { data, error } = await supabase.storage.from('Img').createSignedUrl(path, 60)

        if (error) {
            console.error(error.message);
        }

        if (data) {
            return data.signedUrl;
        } else {
            console.error('No file found.');
            return undefined;
        }
    } catch (error) {
        console.error('Error getting URL:', error.message);
    }
}

export const deleteFotoProducto = async (id) => {
    const path = `Producto/${id}.jpg`;
    try {
        const { data, error } = await supabase.storage.from('Img').remove([path]);

        if (error) {
            console.error('Error al eliminar la imagen:', error.message);
            throw new Error('No se pudo eliminar la imagen');
        }

        console.log('Imagen eliminada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al eliminar la imagen:', error.message);
        throw error;
    }
}

export const deleteFotoEdificio = async (id) => {
    const path = `Edificio/${id}.jpg`;
    try {
        const { data, error } = await supabase.storage.from('Img').remove([path]);

        if (error) {
            console.error('Error al eliminar la imagen:', error.message);
            throw new Error('No se pudo eliminar la imagen');
        }

        console.log('Imagen eliminada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al eliminar la imagen:', error.message);
        throw error;
    }
}

export const uploadFotoProducto = async (id, file) => {
    const path = `Producto/${id}.jpg`;

    // Verificar si el archivo ya existe y eliminarlo
    const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
    if (checkError) {
        console.error("Error al verificar si existe la imagen:", checkError.message);
        throw new Error("No se pudo verificar si existe la imagen");
    }

    if (existingFile) {
        // Si el archivo ya existe, eliminarlo antes de subir el nuevo
        const { error: deleteError } = await supabase.storage.from('Img').remove([path]);
        if (deleteError) {
            console.error("Error al eliminar la imagen existente:", deleteError.message);
            throw new Error("No se pudo eliminar la imagen existente");
        }
    }

    // Subir el nuevo archivo
    const { data, error } = await supabase.storage.from("Img").upload(path, file);
    if (error) {
        console.error("Error subiendo imagen:", error);
        throw new Error("No se pudo subir la imagen");
    }
    return data;
}

export const uploadFotoEdificio = async (id, file) => {
    const path = `Edificio/${id}.jpg`;

    // Verificar si el archivo ya existe y eliminarlo
    const { data: existingFile, error: checkError } = await supabase.storage.from("Img").getPublicUrl(path);
    if (checkError) {
        console.error("Error al verificar si existe la imagen:", checkError.message);
        throw new Error("No se pudo verificar si existe la imagen");
    }

    if (existingFile) {
        // Si el archivo ya existe, eliminarlo antes de subir el nuevo
        const { error: deleteError } = await supabase.storage.from('Img').remove([path]);
        if (deleteError) {
            console.error("Error al eliminar la imagen existente:", deleteError.message);
            throw new Error("No se pudo eliminar la imagen existente");
        }
    }

    // Subir el nuevo archivo
    const { data, error } = await supabase.storage.from("Img").upload(path, file);
    if (error) {
        console.error("Error subiendo imagen:", error);
        throw new Error("No se pudo subir la imagen");
    }
    return data;
}

export const getFotoEdificio = async (id) => {
    const path = `Edificio/${id}.jpg`;
    
    try {
        const { data, error } = await supabase.storage.from('Img').createSignedUrl(path, 60)

        if (error) {
            console.error(error.message);
        }

        if (data) {
            return data.signedUrl;
        } else {
            console.error('No file found.');
            return undefined;
        }
    } catch (error) {
        console.error('Error getting URL:', error.message);
    }
}

