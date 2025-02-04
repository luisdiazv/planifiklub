import { useState, useEffect } from "react";
import { getAllEdificio } from "../../Ctrl/EdificiosCtrl";
import "./edificiosStyles.css"; // Importamos el CSS
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";

const EdificiosList = () => {
    const [edificios, setEdificios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [selectedEdificios, setSelectedEdificios] = useState(new Set());
    const [selectedDate, setSelectedDate] = useState(null); // Nueva variable para la fecha seleccionada
    const [selectedHours, setSelectedHours] = useState({ start: null, end: null }); // Estado para el rango de horas

    useEffect(() => {
        const fetchEdificios = async () => {
            try {
                let data = await getAllEdificio();
                data = data.sort((a, b) => a.idedificios - b.idedificios);
                setEdificios(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEdificios();
    }, []);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSelectionChange = (id) => {
        setSelectedEdificios((prev) => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate); // Actualiza la fecha seleccionada
    };

    // Función para manejar el cambio en el rango de horas
    const handleHourChange = (start, end) => {
        setSelectedHours({ start, end }); // Actualiza las horas seleccionadas
    };

    if (loading) return <p>Cargando edificios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="edificios-container">
            <div className="calendar-container">
                <SmallCallendar onDateChange={handleDateChange} />
                <HourSelector onChange={handleHourChange} /> {/* Pasa la función de cambio de hora */}
            </div>
            {edificios.map((edificio) => (
                <div key={edificio.idedificios} className="edificio-card">
                    <div className="edificio-foto">
                        <img src={edificio.foto} alt={edificio.nombre} className="edificio-image" />
                    </div>

                    <div className="edificio-info">
                        <h2>{edificio.nombre}</h2>

                        {expanded[edificio.idedificios] && (
                            <div className="edificio-details">
                                <p><strong>Descripción:</strong> {edificio.Description}</p>
                                <p><strong>Capacidad:</strong> {edificio.capacidad_maxima} personas</p>
                                <p><strong>Disponibilidad:</strong> {edificio.disponibilidad ? "Disponible" : "No disponible"}</p>
                                <p><strong>Costo por Hora:</strong> ${edificio.costo_hora}</p>
                            </div>
                        )}
                        <div className="button-container">
                            <button className="toggle-btn" onClick={() => toggleExpand(edificio.idedificios)}>
                                {expanded[edificio.idedificios] ? "Ver menos" : "Ver más"}
                            </button>

                            <label className="edificio-checker-container">
                                <input className="edificio-checker"
                                    type="checkbox"
                                    checked={selectedEdificios.has(edificio.idedificios)}
                                    onChange={() => handleSelectionChange(edificio.idedificios)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            <div className="selected-edificios">
                <h3>Edificios seleccionados:</h3>
                <ul style={{ display: "flex" }}>
                    {Array.from(selectedEdificios).map((id) => {
                        const edificio = edificios.find((edificio) => edificio.idedificios === id);
                        return (
                            edificio ? (
                                <li key={id}>
                                    <img src={edificio.foto} alt={edificio.nombre} style={{ width: "50%" }} />
                                    <p key={id}>{edificio?.nombre}</p>
                                </li>
                            ) : null
                        );
                    })}
                </ul>
            </div>

            {selectedDate && (
                <div className="selected-date">
                    <h3>Fecha seleccionada:</h3>
                    <p>{selectedDate.format("DD/MM/YYYY")}</p> {/* Muestra la fecha seleccionada */}
                </div>
            )}

            {selectedHours.start && selectedHours.end && (
                <div className="selected-hours">
                    <h3>Rango de horas seleccionadas:</h3>
                    <p>{`${selectedHours.start.format("HH:mm")} - ${selectedHours.end.format("HH:mm")}`}</p>
                </div>
            )}
        </div>
    );
};

export default EdificiosList;
