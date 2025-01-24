import EventDetails from './BalanzaDePagosContent/Event.jsx';
import OurServices from './BalanzaDePagosContent/OurServices.jsx';
import PlaceSelector from './BalanzaDePagosContent/PlaceSelector.jsx';
import PurchaseSummary from './BalanzaDePagosContent/purchaseSummary.jsx';

import { Wallet } from '@mercadopago/sdk-react';

export const sections = [
    {
        title: "Tipo de Evento ",
        description: "Selecciona que tipo de evento(s) quieres hacer en nuestro club.",
        content: <EventDetails />

    },
    {
        title: "Lugar del evento",
        content: <PlaceSelector />,
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