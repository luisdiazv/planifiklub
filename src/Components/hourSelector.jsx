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

        if (this.state.value2 && isBeforeTime(value1, this.state.value2)) {
            this.setState({
                value1: value1.clone(),
                value2: value1.clone().add(this.props.minuteStep, "minutes")
            });
        } else {
            this.setState({
                value1: value1.clone(),
            });
        }

        this.props.onChange(value1, this.state.value2);
    };

    handleValueChange2 = (value2) => {
        if (!value2) {
            this.setState({
                value2
            });
            return;
        }


        if (this.state.value1 && isBeforeTime(this.state.value1, value2)) {
            this.setState({
                value2: value2.clone(),
                value1: value2.clone().subtract(this.props.minuteStep, "minutes")
            });
        } else {
            this.setState({
                value2: value2.clone(),
            });
        }

        this.props.onChange(this.state.value1, value2);
    };

    render() {
        const { value1, value2 } = this.state;

        return (
            <div className="hourSelector-container">
                <p>hora de inicio del evento:</p>
                <TimePicker
                    value={value1}
                    disabledHours={() => this.props.disabledHours}
                    minuteStep={30}
                    showSecond={false}
                    onChange={this.handleValueChange1}
                    format="hh:mm A"
                />
                <p>hora final del evento:</p>
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
