import { useState, useEffect } from "react";
import { getAllEdificio } from "../../Ctrl/EdificiosCtrl";
import { getAllMontajeEdificio } from "../../Ctrl/MontajesEdificioCtrl";
import "./edificiosStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";

const EdificiosList = () => {
    const [edificios, setEdificios] = useState([]);
    const [montajes, setMontajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [selectedEdificios, setSelectedEdificios] = useState(new Set());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState({ start: null, end: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                let edificiosData = await getAllEdificio();
                edificiosData = edificiosData.sort((a, b) => a.idedificios - b.idedificios);
                setEdificios(edificiosData);

                const montajesData = await getAllMontajeEdificio();
                setMontajes(montajesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
        setSelectedDate(newDate);
    };

    const handleHourChange = (start, end) => {
        setSelectedHours({ start, end });
    };

    if (loading) return <p>Cargando edificios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="edificios-container">
            <div className="calendar-container">
                <SmallCallendar onDateChange={handleDateChange} />
                <HourSelector onChange={handleHourChange} />
            </div>
            {edificios.map((edificio) => {
                const montajesFiltrados = montajes.filter(m => m.id_edifcio === edificio.idedificios);
                return (
                    <div key={edificio.idedificios} className="edificio-card">
                        <div className="edificio-foto">
                            <img src={edificio.foto} alt={edificio.nombre} className="edificio-image" />
                        </div>

                        <div className="edificio-info">
                            <h2>{edificio.nombre}</h2>

                            {expanded[edificio.idedificios] && (
                                <div className="edificio-details">
                                    <p><strong>Descripción:</strong> {edificio.descripcion}</p>
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

                            <div className="montajes-dropdown">
                                <label>Montajes disponibles:</label>
                                <select>
                                    {montajesFiltrados.length > 0 ? (
                                        montajesFiltrados.map(montaje => (
                                            <option key={montaje.idmontajes_edificios} value={montaje.id_montajes}>
                                                {montaje.id_montajes}
                                            </option>
                                        ))
                                    ) : (
                                        <option>No hay montajes</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            })}
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
                    <p>{selectedDate.format("DD/MM/YYYY")}</p>
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
}

export default EdificiosList;
