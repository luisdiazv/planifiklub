import EventDetails from './BalanzaDePagosContent/Event.jsx';
import OurServices from './BalanzaDePagosContent/OurServices.jsx';
//import PlaceSelector from './BalanzaDePagosContent/PlaceSelector.jsx';
import EdificiosList from "./BalanzaDePagosContent/edificios.jsx";
import PurchaseSummary from "./BalanzaDePagosContent/purchaseSummary.jsx";

export const sections = [
    {
        title: "Tipo de Evento ",
        description: "Selecciona que tipo de evento(s) quieres hacer en nuestro club.",
        content: <EventDetails />

    },
    {
        title: "Lugar del evento",
        description: "Elige la fecha y el lugar para tu evento. ¡Puedes reservar mas de un lugar! \n Recuerda que la fecha que escojas no es definitiva y esta sujeta a cambios.",
        content: <EdificiosList />,
    },
    {
        title: "Nuestros servicios",
        description: "Contenido de Elso",
        content: <OurServices />
    },
    {
        title: "Resumen Final",
        content: <PurchaseSummary />

    },

];