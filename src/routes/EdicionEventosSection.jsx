import EventDetailsEdicion from './FlujoEdicionEventos/Event.jsx';
import OurServicesEdicion from './FlujoEdicionEventos/OurServices.jsx';
import EdificiosListEdicion from './FlujoEdicionEventos/edificios.jsx';
import PurchaseSummaryEdicion from './FlujoEdicionEventos/purchaseSummary.jsx';

export const sections = (id) => [
    {
        title: "Detalles Generales del Evento",
        description: "Aquí podrás definir los detalles principales del evento.",
        content: <EventDetailsEdicion id={id} />
    },
    {
        title: "Lugar del evento",
        description: "Aquí podrás elegir los edificios que quiere reservar para tu evento.",
        content: <EdificiosListEdicion id={id}/>,
    },
    {
        title: "Nuestros servicios",
        description: "Aquí podrás elegir los productos que pedirás para tu evento.",
        content: <OurServicesEdicion id={id}/>
    },
    {
        title: "Resumen del evento actualizado",
        content: <PurchaseSummaryEdicion/>
    }
];