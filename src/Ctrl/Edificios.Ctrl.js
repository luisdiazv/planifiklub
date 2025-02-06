import { supabase } from "../API/SupabaseAPI";
import { getNombreMontajeByIdMontaje } from "./MontajesCtrl";
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
            const info = await getInfoEdificios(data); // Usar await aquí
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

