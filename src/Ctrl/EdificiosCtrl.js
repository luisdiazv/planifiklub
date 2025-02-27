import { supabase } from "../API/SupabaseAPI";
import { getNombreMontajeByIdMontaje } from "./MontajesCtrl";

export const getAllEdificio = async () => {
    try {
        const { data, error } = await supabase.from("edificios").select("*");

        console.log("Edificios obtenidos:", data);
        if (error) {
            console.error("Error obteniendo todos los edificios:", error);
            throw new Error("No se pudo obtener los edificios");
        }
        return data;
    } catch (error) {
        console.error("Error interno:", error);
        throw new Error("FATAL ERROR: No se pudo verificar los edificios");
    }
};

export const getEdificiosByIdEvento = async (eventId) => {
    try {
        const { data, error } = await supabase
            .from("edificios_evento")
            .select("*")
            .eq("id_evento", eventId);

        if (error) {
            console.error("Error obteniendo los edificios del evento:", error.message);
            throw new Error("No se pudo obtener los edificios del evento: " + error.message);
        }

        if (data.length > 0) {
            const info = await getInfoEdificios(data);
            return info;
        } else {
            return "Edificios del Evento Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener los edificios del evento: " + error.message);
    }
};

const getEdificioName = async (edificioId) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .select("nombre")
            .eq("idedificios", edificioId);

        if (error) {
            console.error("Error obteniendo el nombre del edificio:", error.message);
            throw new Error("No se pudo obtener el nombre del edificio: " + error.message);
        }

        if (data.length > 0) {
            return data[0].nombre;
        } else {
            return "Nombre del Edificio Desconocido";
        }
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener el nombre del Edificio: " + error.message);
    }
};

const getInfoEdificios = async (data) => {
    try {
        const listaConNombres = await Promise.all(
            data.map(async (ed) => {
                try {
                    const edificio = await getEdificioName(ed.id_edificio);
                    const montaje = await getNombreMontajeByIdMontaje(ed.id_montaje_elegido);
                    return {
                        ...ed,
                        nombre_edificio: edificio,
                        nombre_montaje: montaje,
                    };
                } catch (err) {
                    console.error("Error obteniendo nombres:", err.message);
                    return {
                        ...ed,
                        nombre_edificio: "Nombre del Edificio Desconocido",
                        nombre_montaje: "Nombre del Montaje Desconocido",
                    };
                }
            })
        );
        return listaConNombres;
    } catch (error) {
        console.error("Error al obtener la lista de edificios con nombres:", error.message);
        throw new Error("No se pudo obtener la lista de edificios con nombres: " + error.message);
    }
};

export const getEdificiosByNombre = async (nombre) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .select("*")
            .ilike("nombre", `%${nombre}%`); // Uso de ilike para búsqueda insensible a mayúsculas/minúsculas

        if (error) {
            console.error("Error obteniendo edificios por nombre:", error.message);
            throw new Error("No se pudo obtener los edificios por nombre: " + error.message);
        }

        return data;
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener edificios por nombre: " + error.message);
    }
};

export const getEdificiosByID = async (id) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .select("*")
            .ilike("idedificios", id);

        if (error) {
            console.error("Error obteniendo edificios por id:", error.message);
            throw new Error("No se pudo obtener los edificios por id: " + error.message);
        }

        return data;
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener edificios por id: " + error.message);
    }
};

export const updateEdificio = async (id, updatedInfo) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .update(updatedInfo)
            .eq("idedificios", id);

        if (error) {
            console.error("Error actualizando el edificio:", error.message);
            throw new Error("No se pudo actualizar el edificio: " + error.message);
        }

        return data; // Regresamos los datos del edificio actualizado
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al actualizar el edificio: " + error.message);
    }
};

export const createEdificio = async (newEdificio) => {
    try {
        const { data, error } = await supabase.from("edificios").insert(newEdificio).select();

        if (error) {
            console.error("Error creando el edificio:", error.message);
            throw new Error("No se pudo crear el edificio: " + error.message);
        }
        
        return data[0];

    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al crear el edificio: " + error.message);
    }
};

export const deleteEdificio = async (id) => {
    try {
        const { data, error } = await supabase
            .from("edificios")
            .delete()
            .eq("idedificios", id);

        if (error) {
            console.error("Error eliminando el edificio:", error.message);
            throw new Error("No se pudo eliminar el edificio: " + error.message);
        }

        return data; // Regresamos los datos del edificio eliminado
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al eliminar el edificio: " + error.message);
    }
};

export const createEdificioEvento = async (dummyEdificio) => {
    try {
        const nuevoEdificioEvento = {
            id_evento: dummyEdificio.id_evento, 
            id_edificio: dummyEdificio.id_edificio,
            id_montaje_elegido: dummyEdificio.id_montaje_elegido, 
            subtotal_alquiler: dummyEdificio.subtotal_alquiler,
        };

        const { data, error } = await supabase
            .from("edificios_evento")
            .insert(nuevoEdificioEvento)
            .select();

        if (error) {
            console.error("Error creando la entrada en edificios_evento:", error.message);
            throw new Error("No se pudo crear la entrada en edificios_evento: " + error.message);
        }

        return data; // Devuelve la nueva entrada creada
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al crear la entrada en edificios_evento: " + error.message);
    }
};

export const getEdificiosAndMontajesByIdEvento = async (eventId) => {
    try {
        const { data, error } = await supabase
            .from("edificios_evento")
            .select("id_edificio, id_montaje_elegido, subtotal_alquiler")
            .eq("id_evento", eventId);

        if (error) {
            console.error("Error obteniendo los edificios y montajes del evento:", error.message);
            throw new Error("No se pudo obtener los edificios y montajes del evento: " + error.message);
        }

        return data;
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al obtener los edificios y montajes del evento: " + error.message);
    }
};
