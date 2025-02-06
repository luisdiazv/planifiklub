import { useState, useEffect } from "react";
import { getAllEdificio } from "../../Ctrl/EdificiosCtrl";
import { getAllMontajeEdificio } from "../../Ctrl/MontajesEdificioCtrl";
import { getNombreMontajeByIdMontaje } from "../../Ctrl/MontajesCtrl";
import "./edificiosStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";

const EdificiosList = () => {
  const [edificios, setEdificios] = useState([]);
  const [montajes, setMontajes] = useState([]);
  const [montajesNombres, setMontajesNombres] = useState({});
  const [MontajeSeleccionado, setMontajesSeleccionado] = useState({});
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

        // Cargar los nombres de los montajes
        const nombresMontajes = {};
        for (const montaje of montajesData) {
          nombresMontajes[montaje.id_montajes] = await getNombreMontajeByIdMontaje(montaje.id_montajes);
        }
        setMontajesNombres(nombresMontajes);
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

  const handleMontajeChange = (edificioId, montajeId) => {
    setMontajesSeleccionado((prev) => ({
      ...prev,
      [edificioId]: montajeId,
    }));
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
                <select
                  value={MontajeSeleccionado[edificio.idedificios] || ""}
                  onChange={(e) => handleMontajeChange(edificio.idedificios, e.target.value)}
                >
                  {montajesFiltrados.length > 0 ? (
                    <>
                      <option value="" disabled>Seleccione un montaje</option>
                      {montajesFiltrados.map(montaje => (
                        <option key={montaje.idmontajes_edificios} value={montaje.id_montajes}>
                          {montajesNombres[montaje.id_montajes] || "Cargando..."}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No hay montajes</option>
                  )}

                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EdificiosList;
