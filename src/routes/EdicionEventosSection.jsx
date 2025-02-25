import EventDetailsEdicion from './FlujoEdicionEventos/Event.jsx';
import OurServicesEdicion from './FlujoEdicionEventos/OurServices.jsx';
import EdificiosListEdicion from './FlujoEdicionEventos/edificios.jsx';
import PurchaseSummaryEdicion from './FlujoEdicionEventos/purchaseSummary.jsx'

export const sections = [
    {
        title: "Detalles Generales del Evento",
        description: "Aquí podrás definir los detalles principales del evento.",
        content: <EventDetailsEdicion />

    },
    {
        title: "Lugar del evento",
        description: "Aquí podrás elegir los edificios que quiere reservar para tu evento.",
        content: <EdificiosListEdicion />,
    },
    {
        title: "Nuestros servicios",
        description: "Aquí podrás elegir los productos que pedirás para tu evento.",
        content: <OurServicesEdicion />
    },
    {
        title: "Resumen del evento actualizado",
        content: <PurchaseSummaryEdicion/>
    }

];