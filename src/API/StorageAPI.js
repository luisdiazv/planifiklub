import { supabase } from "./SupabaseAPI";

export const getFotoProducto = async (id) => {
    const path = `Producto/${id}.jpg`;
    
    try {
        const { data, error } = await supabase.storage.from('Img').createSignedUrl(path, 60)

        if (error) {
            console.error(error.message);
        }

        if (data) {
            // console.log('URL:', data.signedUrl);
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
