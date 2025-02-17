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

export const uploadFotoProducto = async (id, file) => {
    const path = `Producto/${id}.jpg`;
    const { data, error } = await supabase.storage.from("Img").upload(path, file);
    if (error) {
        console.error("Error subiendo imagen:", error);
        throw new Error("No se pudo subir la imagen");
    }
    return data;
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

export const getFotoEdificio = async (id) => {
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

export const uploadFotoEdificio = async (id, file) => {
    const path = `Producto/${id}.jpg`;
    const { data, error } = await supabase.storage.from("Img").upload(path, file);
    if (error) {
        console.error("Error subiendo imagen:", error);
        throw new Error("No se pudo subir la imagen");
    }
    return data;
}
