import { supabase } from "../API/SupabaseAPI";

export const getNombreMontajeByIdMontaje = async (montajeId) => {
    try {
        const { data, error } = await supabase
            .from("montajes")
            .select("nombre_montaje")
            .eq("idmontajes", montajeId);

        if (error) {
            console.error("Error obteniendo el nombre del montaje:", error.message);
            throw new Error("No se pudo obtener el nombre del montaje: " + error.message);
        }

        if (data.length > 0) {
            return data[0].nombre_montaje;
        } else {
            return "Nombre del Montaje Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el nombre del montaje: " + error.message);
    }
};

export const getMontajeById = async (montajeId) => {
    try {
        const { data, error } = await supabase
            .from("montajes")
            .select("*")
            .eq("idmontajes", montajeId);

        if (error) {
            console.error("Error obteniendo el montaje:", error.message);
            throw new Error("No se pudo obtener el montaje: " + error.message);
        }
        
        return data;
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el nombre del montaje: " + error.message);
    }
};

export const getMontajes = async () => {
    try {
        const { data, error } = await supabase.from("montajes").select("*");
        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Error obteniendo los montajes:", error.message);
        throw new Error("No se pudieron obtener los montajes: " + error.message);
    }
};

export const createMontaje = async (montaje) => {
    try {
        const { data, error } = await supabase.from("montajes").insert(montaje);
        if (error){
            throw new Error(error.message)
        }
        return data;
        
    } catch (error) {
        console.error("Error creando el montaje:", error.message);
        throw new Error("No se pudo crear el montaje: " + error.message);
    }
};

export const updateMontaje = async (montajeId, updatedMontaje) => {
    try {
        const { data, error } = await supabase
            .from("montajes")
            .update(updatedMontaje)
            .eq("idmontajes", montajeId);
        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Error actualizando el montaje:", error.message);
        throw new Error("No se pudo actualizar el montaje: " + error.message);
    }
};

export const deleteMontaje = async (montajeId) => {
    try {
        const { data, error } = await supabase.from("montajes").delete().eq("idmontajes", montajeId);
        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Error eliminando el montaje:", error.message);
        throw new Error("No se pudo eliminar el montaje: " + error.message);
    }
};

export const getMontajesByNombre = async (nombre) => {
    try {
        const { data, error } = await supabase
            .from("montajes")
            .select("*")
            .ilike("nombre_montaje", `%${nombre}%`); // Búsqueda flexible (insensible a mayúsculas/minúsculas)

        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Error obteniendo montajes por nombre:", error.message);
        throw new Error("No se pudieron obtener los montajes: " + error.message);
    }
};