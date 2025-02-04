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
            <DemoContainer components={['DateCalendar']}>
                <DateCalendar
                    className="custom-calendar"
                    referenceDate={dayjs()}
                    views={['year', 'month', 'day']}
                    minDate={dayjs()}
                    maxDate={dayjs().add(365, 'day')}
                    onChange={(newDate) => onDateChange(newDate)}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}

export default SmallCallendar;
