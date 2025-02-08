import EventDetails from './FlujoReservaContent/Event.jsx';
import OurServices from './FlujoReservaContent/OurServices.jsx';
import PlaceSelector from './FlujoReservaContent/PlaceSelector.jsx';
import EdificiosList from './FlujoReservaContent/edificios.jsx';

export const sections = [
    {
        title: "Tipo de Evento ",
        description: "Selecciona que tipo de evento(s) quieres hacer en nuestro club.",
        content: <EventDetails />

    },
    {
        title: "Lugar del evento",
        content: <EdificiosList />,
    },
    {
        title: "Nuestros servicios",
        description: "Contenido de Elso",
        content: <OurServices />
    },
    {
        title: "Resumen Final"
    },

];