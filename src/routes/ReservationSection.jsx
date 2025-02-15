import EventDetails from './FlujoReservaContent/Event.jsx';
import OurServices from './FlujoReservaContent/OurServices.jsx';
import PlaceSelector from './FlujoReservaContent/PlaceSelector.jsx';
import EdificiosList from './FlujoReservaContent/edificios.jsx';

export const sections = [
    {
        title: "Detalles Generales del Evento",
        description: "Aquí podrás definir los detalles principales del evento.",
        content: <EventDetails />

    },
    {
        title: "Lugar del evento",
        description: "Aquí podrás elegir los edificios que quiere reservar para tu evento.",
        content: <EdificiosList />,
    },
    {
        title: "Nuestros servicios",
        description: "Aquí podrás elegir los productos que pedirás para tu evento.",
        description: "Contenido de Elso",
        content: <OurServices />
    },
    {
        title: "Resumen Final"
    },

];