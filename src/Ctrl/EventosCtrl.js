import { supabase } from "../API/SupabaseAPI";
import dayjs from "dayjs"; 
import "dayjs/locale/es";

export const getAllEventIdsByMonth = async (currentMonth) => {
  try {
    dayjs.locale("es");

    // Formatea las fechas de inicio y fin del mes actual
    const startDate = `${currentMonth}-01`; // Primer día del mes
    const endDate = dayjs(currentMonth).endOf("month").format("YYYY-MM-DD"); // Último día del mes

    const { data, error } = await supabase.from("evento").select("*")
      .gte("fecha", startDate) // Fecha mayor o igual al inicio del mes
      .lte("fecha", endDate);  // Fecha menor o igual al final del mes

    if (error) {
      console.error("Error obteniendo los IDs de los eventos:", error.message);
      throw new Error("No se pudo obtener los IDs de los eventos: " + error.message);
    }

    return data; // Devuelve un array con los IDs
  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener los IDs de los eventos: " + error.message);
  }
};


export const getEventById = async (eventId) => {
    try {
      const { data, error } = await supabase.from("evento").select("*").eq("idevento", eventId);
  
      if (error) {
        console.error("Error obteniendo el evento:", error.message);
        throw new Error("No se pudo obtener el evento: " + error.message);
      }
      
  
      if (!data || data.length === 0) {
        throw new Error("No se encontró el evento con el ID proporcionado.");
      }

      return data[0];       

    } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error(
        "Ocurrió un error al obtener la información del evento: " +
          error.message
      );
    }
};

export const getAllEventIds = async () => {
    try {
      const { data, error } = await supabase
        .from("evento") // Tabla de eventos
        .select("idevento"); // Selecciona solo la columna de IDs
  
      if (error) {
        console.error("Error obteniendo los IDs de los eventos:", error.message);
        throw new Error("No se pudo obtener los IDs de los eventos: " + error.message);
      }
  
      if (data && data.length > 0) {
        return data.map(event => event.idevento); // Devuelve un array con los IDs
      } else {
        return []; // Si no hay datos, devuelve un array vacío
      }
    } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al obtener los IDs de los eventos: " + error.message);
    }
};

export const updateEventStatus = async (eventId, newStatus) => {
    try {
        const { error } = await supabase
            .from("evento")
            .update({ estado: newStatus })
            .eq("idevento", eventId);

        if (error) {
            console.error("Error actualizando el estado del evento:", error.message);
            throw new Error("No se pudo actualizar el estado del evento: " + error.message);
        }

        console.log("Estado del evento actualizado correctamente.");
    } catch (error) {
        console.error("Error interno:", error.message);
        throw new Error("Ocurrió un error al actualizar el estado del evento: " + error.message);
    }
};

export const createEvent = async (eventoDummy) => {
  try {
      const { fecha, hora_inicio, hora_fin, detalles, id_usuario, estado, id_tipo_evento, costo_total, personas } = eventoDummy;

      const { data, error } = await supabase
          .from("evento")
          .insert([
              {
                  fecha,
                  hora_inicio,
                  hora_fin,
                  detalles,
                  id_usuario,
                  estado,
                  id_tipo_evento,
                  costo_total,
                  saldo_pendiente:costo_total,
                  personas
              }
          ])
          .select("idevento"); // Selecciona solo el ID del evento creado

      if (error) {
          console.error("Error creando el evento:", error.message);
          throw new Error("No se pudo crear el evento: " + error.message);
      }

      const idEventoCreado = data?.[0]?.idevento; // Obtiene la ID del evento insertado

      console.log("Evento creado correctamente. ID:", idEventoCreado);
      return idEventoCreado; // Retorna solo la ID

  } catch (error) {
      console.error("Error interno:", error.message);
      throw new Error("Ocurrió un error al crear el evento: " + error.message);
  }
};

export const getEventIDsByUser = async (userID) => {
  try {
    const { data, error } = await supabase.from("evento").select("*").eq("id_usuario", userID);

    if (error) {
      console.error("Error obteniendo la lista de eventos del usuario:", error.message);
      throw new Error("No se pudo obtener la lista de eventos del usuario: " + error.message);
    }
    
    if (!data || data.length === 0) {
      throw new Error("No se encontraron eventos asociados al ID.");
    }

    return data;       

  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error(
      "Ocurrió un error al obtener la información del evento: " +
        error.message
    );
  }
}

export const updateEventByID = async (eventID, newInfo) => {
  /*
  template para 
    const newInfo = {
      id_tipo_evento: 'tipo_de_evento',
      fecha: new Date('fecha').toISOString().split('T')[0], // YYYY-MM-DD
      hora_inicio: new Date('hora_de_inicio').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) + ':00', // Formato HH:MM:00
      hora_fin: new Date('hora_de_fin').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) + ':00' , // Formato HH:MM:00
      detalles: 'nueva_descripcion',
      personas: parseInt('invitados', 10)
    };
    Lo de fecha y horas es para modificaciones, para asegurar el formato que pide supabase
  */

  const { data, error } = await supabase.from('evento').update(newInfo).eq('idevento', eventID);

  if (error) {
    console.error('Error actualizando evento:', error);
  } else {
    console.log('Evento actualizado:', data);
  }
}

export const getEventType = async (idtipos_eventos) => {
  try {
    const { data, error } = await supabase
      .from("tipos_eventos")
      .select("nombre")
      .eq("idtipos_eventos", idtipos_eventos)
      .single();

    if (error) {
      console.error("Error obteniendo el tipo de evento:", error.message);
      throw new Error("No se pudo obtener el tipo de evento: " + error.message);
    }

    if (!data) {
      throw new Error("No se encontró el tipo de evento con el ID proporcionado.");
    }

    return data.nombre; // Retorna el valor de la columna 'nombre'

  } catch (error) {
    console.error("Error interno:", error.message);
    throw new Error("Ocurrió un error al obtener el tipo de evento: " + error.message);
  }
};
export const updateEventCostAndBalance = async (eventID, nuevoCosto, nuevoSaldo) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .update({ costo_total: nuevoCosto, saldo_pendiente: nuevoSaldo })
      .eq('idevento', eventID);

    if (error) {
      console.error('Error actualizando costo y saldo del evento:', error.message);
      throw new Error('No se pudo actualizar el costo y saldo del evento: ' + error.message);
    }

    console.log('Costo y saldo del evento actualizados:', data);
    return data;
  } catch (error) {
    console.error('Error interno:', error.message);
    throw new Error('Ocurrió un error al actualizar el costo y saldo del evento: ' + error.message);
  }
};
