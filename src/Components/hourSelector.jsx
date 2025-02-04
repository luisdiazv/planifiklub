import "rc-time-picker/assets/index.css";
import React from "react";
import moment from "moment";
import TimePicker from "rc-time-picker";

import './hourSelectorStyles.css';

const isBeforeTime = (time1, time2) =>
    time1.minutes() + time1.hours() * 60 < time2.minutes() + time2.hours();

export default class HourSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value1: props.value ? props.value.clone() : null,
            value2: props.value ? props.value.clone().add(props.minuteStep, "minutes") : null
        };
    }

    handleValueChange1 = (value1) => {
        if (!value1) {
            this.setState({
                value1
            });
            return;
        }

        // Si value2 es menor que value1, ajustamos value2 para que sea mayor
        if (this.state.value2 && isBeforeTime(value1, this.state.value2)) {
            this.setState({
                value1: value1.clone(),
                value2: value1.clone().add(this.props.minuteStep, "minutes") // Ajustamos value2 a un valor mayor
            });
        } else {
            this.setState({
                value1: value1.clone(),
            });
        }

        // Llamamos a onChange solo con value1
        this.props.onChange(value1, this.state.value2);
    };

    handleValueChange2 = (value2) => {
        if (!value2) {
            this.setState({
                value2
            });
            return;
        }

        // Si value1 es mayor que value2, ajustamos value1 para que sea menor
        if (this.state.value1 && isBeforeTime(this.state.value1, value2)) {
            this.setState({
                value2: value2.clone(),
                value1: value2.clone().subtract(this.props.minuteStep, "minutes") // Ajustamos value1 a un valor menor
            });
        } else {
            this.setState({
                value2: value2.clone(),
            });
        }

        // Llamamos a onChange solo con value2
        this.props.onChange(this.state.value1, value2);
    };

    render() {
        const { value1, value2 } = this.state;

        // Si los valores son nulos, renderiza el TimePicker sin valores predeterminados.
        return (
            <div className="hourSelector-container">
                <TimePicker
                    value={value1}
                    disabledHours={() => this.props.disabledHours}
                    minuteStep={30}
                    showSecond={false}
                    onChange={this.handleValueChange1}
                    format="hh:mm A"
                />
                <TimePicker
                    value={value2}
                    disabledHours={() => this.props.disabledHours}
                    minuteStep={30}
                    showSecond={false}
                    onChange={this.handleValueChange2}
                    format="hh:mm A"
                />
            </div>
        );
    }
}

HourSelector.defaultProps = {
    disabledHours: [1, 2, 3, 4],
    value: null,
    minuteStep: 30, // Aseguramos que el paso de minutos sea de 30 en 30
};
