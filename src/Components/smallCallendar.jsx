import { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import "./smallCallendarStyles.css";

const SmallCallendar = ({ onDateChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='MUI-calendar-container'>
                <h3>¡Escoge el día para tu evento!</h3>
                <DemoContainer components={['DateCalendar']}>
                    <DateCalendar
                        className="custom-calendar large-font"
                        referenceDate={dayjs()}
                        views={['year', 'month', 'day']}
                        minDate={dayjs()}
                        maxDate={dayjs().add(365, 'day')}
                        onChange={(newDate) => onDateChange(newDate)}
                    />
                </DemoContainer>
            </div>
        </LocalizationProvider>
    );
}

export default SmallCallendar;
