import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import "./VerCotizacionesStyles.css";

dayjs.locale("es");

const VerCotizaciones = () =>{
    const localizer = dayjsLocalizer(dayjs);

    return(
        <div className="calendar-container">
            <h2 style={{ marginBottom: "10px" }}>Cotizaciones en espera</h2>
            <Calendar
            localizer={localizer}
            views={[ "day", "agenda", "month"]}
            defaultView={"agenda"}
            //toolbar={false}
            />
        </div>
    )
}

export default VerCotizaciones;