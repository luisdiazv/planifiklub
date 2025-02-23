import "rc-time-picker/assets/index.css";
import React, { useState } from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "./hourSelectorStyles.css";

const isBeforeTime = (time1, time2) =>
    time1 && time2 && time1.minutes() + time1.hours() * 60 < time2.minutes() + time2.hours() * 60;

export default function HourSelector({ value, onChange, disabledHours, minuteStep = 30 }) {
    const [value1, setValue1] = useState(value ? value.clone() : null);
    const [value2, setValue2] = useState(value ? value.clone().add(minuteStep, "minutes") : null);

    const handleValueChange1 = (newValue1) => {
        if (!newValue1) {
            setValue1(null);
            setValue2(null);
            onChange(null, null);
            return;
        }

        const adjustedValue2 = newValue1.clone().add(minuteStep, "minutes");

        setValue1(newValue1.clone());
        setValue2(adjustedValue2);
        onChange(newValue1, adjustedValue2);
    };

    const handleValueChange2 = (newValue2) => {
        if (!value1 || !newValue2 || !isBeforeTime(value1, newValue2)) {
            return; // Bloquea la selección si `value1` no está definido o si `value2` no es mayor.
        }

        setValue2(newValue2.clone());
        onChange(value1, newValue2);
    };

    // 🔹 Deshabilitar todas las horas menores o iguales a `value1`
    const getDisabledHoursForValue2 = () => {
        if (!value1) return disabledHours;
        const selectedHour = value1.hour();
        return [...new Set([...disabledHours, ...Array.from({ length: selectedHour + 1 }, (_, i) => i)])];
    };

    return (
        <div className="hourSelector-container">
            <h3>¿Cuanto dura tu evento?</h3>
            <div className="hourSelector-field">
                <label className="hourSelector-label">Hora de inicio del evento:</label>
                <TimePicker
                    value={value1}
                    disabledHours={() => disabledHours}
                    minuteStep={minuteStep}
                    showSecond={false}
                    onChange={handleValueChange1}
                    format="hh:mm A"
                    className="hourSelector-input"
                />
            </div>
            <div className="hourSelector-field">
                <label className="hourSelector-label">Hora final del evento:</label>
                <TimePicker
                    value={value2}
                    disabledHours={getDisabledHoursForValue2} // 🔹 Aplica la restricción a value2
                    minuteStep={minuteStep}
                    showSecond={false}
                    onChange={handleValueChange2}
                    format="hh:mm A"
                    className="hourSelector-input"
                    disabled={!value1} // 🔹 Bloquea hasta que value1 tenga un valor
                />
            </div>
        </div>
    );
}

HourSelector.defaultProps = {
    disabledHours: [0, 1, 2, 3, 4], // 🔹 Horas deshabilitadas iniciales
    value: null,
    minuteStep: 30,
};
