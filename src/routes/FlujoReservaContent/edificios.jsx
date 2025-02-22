import { useState, useEffect } from "react";
import { getAllEdificio } from "../../Ctrl/EdificiosCtrl";
import { getAllMontajeEdificio } from "../../Ctrl/MontajesEdificioCtrl";
import { getNombreMontajeByIdMontaje } from "../../Ctrl/MontajesCtrl";
import { getFotoEdificio } from "../../API/StorageAPI";
import "./edificiosStyles.css";
import { formatCurrency } from "../../Util/MoneyFormat";

const EdificiosList = () => {
  const [edificios, setEdificios] = useState([]);
  const [montajes, setMontajes] = useState([]);
  const [montajesNombres, setMontajesNombres] = useState({});
  const [montajeSeleccionado, setMontajeSeleccionado] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [selectedEdificios, setSelectedEdificios] = useState(new Set());
  const [edificioFotos, setEdificioFotos] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let edificiosData = await getAllEdificio();
        edificiosData = edificiosData.sort((a, b) => a.idedificios - b.idedificios);
        setEdificios(edificiosData);

        const montajesData = await getAllMontajeEdificio();
        setMontajes(montajesData);

        const nombresMontajes = {};
        await Promise.all(
          montajesData.map(async (montaje) => {
            nombresMontajes[montaje.id_montajes] = await getNombreMontajeByIdMontaje(montaje.id_montajes);
          })
        );
        setMontajesNombres(nombresMontajes);

        const fotos = {};
        for (const edificio of edificiosData) {
          const fotoUrl = await getFotoEdificio(edificio.idedificios);
          fotos[edificio.idedificios] = fotoUrl;
        }
        setEdificioFotos(fotos);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectionChange = (id) => {
    setSelectedEdificios((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleMontajeChange = (edificioId, montajeId) => {
    setMontajeSeleccionado((prev) => ({ ...prev, [edificioId]: montajeId }));
  };

  const handleSubmit = (e) => {
    //e.preventDefault();

    if (selectedEdificios.size === 0) {
      window.alert("Debes seleccionar al menos un edificio para reservar en tu evento.");
      return;
    }

    const eventoDumm = JSON.parse(sessionStorage.getItem("eventoDummy"));
    const time = Math.round(
      (new Date(`2025-02-17T${eventoDumm.hora_fin}`) - new Date(`2025-02-17T${eventoDumm.hora_inicio}`)) / 3600000
    );

    // Crear lista de edificios seleccionados con montajes y subtotales
    const edificiosEvento = Array.from(selectedEdificios).map((idEdificio) => {
      const edificio = edificios.find((e) => e.idedificios === idEdificio);
      const idMontaje = montajeSeleccionado[idEdificio];

      if (!idMontaje) {
        window.alert(`Debes seleccionar un montaje para el edificio: ${edificio?.nombre || "Desconocido"}`);
        return undefined;
      }

      const subtotal = edificio.costo_hora * time;
      if (!(selectedEdificios.size === 0 || !idMontaje)){
        return {
          id_edificio: idEdificio,
          id_evento: null,
          id_montaje_elegido: idMontaje,
          subtotal_alquiler: subtotal,
        };
      }
    });

    if (sessionStorage.getItem("edificiosDummy") != null) {
      sessionStorage.removeItem("edificiosDummy");
    }
    sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosEvento));
  };


  if (loading) return <p>Cargando edificios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="edificios-container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {edificios.map((edificio) => {
          const montajesFiltrados = montajes.filter((m) => m.id_edificio === edificio.idedificios);
          return (
            <div key={edificio.idedificios} className="edificio-card">
              <div className="edificio-foto">
                {edificioFotos[edificio.idedificios] ? (
                  <img src={edificioFotos[edificio.idedificios]} alt={edificio.nombre} className="edificio-image" />
                ) : (
                  <p>Cargando imagen...</p>
                )}
              </div>
              <div className="edificio-info">
                <div className="titleContainer">
                  <h2>{edificio.nombre}</h2>
                  <button className="toggle-btn" onClick={() => toggleExpand(edificio.idedificios)}>
                    {expanded[edificio.idedificios] ? "Ver menos" : "Ver más"}
                  </button>
                </div>

                {expanded[edificio.idedificios] && (
                  <div className="edificio-details">
                    <p><strong>Descripción:</strong> {edificio.descripcion}</p>
                    <p><strong>Capacidad:</strong> {edificio.capacidad_maxima} personas</p>
                    <p><strong>Disponibilidad:</strong> {edificio.disponibilidad ? "Disponible" : "No disponible"}</p>
                    <p><strong>Costo por Hora:</strong> {formatCurrency(edificio.costo_hora)}</p>
                  </div>
                )}
                <div className="button-container">
                  <div className="montajes-dropdown">
                    <label>Montajes disponibles:</label>
                    <select className="montajes-drop-select"
                      value={montajeSeleccionado[edificio.idedificios] || ""}
                      onChange={(e) => handleMontajeChange(edificio.idedificios, e.target.value)}
                    >
                      {montajesFiltrados.length > 0 ? (
                        <>
                          <option value="" disabled>Seleccione un montaje</option>
                          {montajesFiltrados.map((montaje) => (
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
                  <div className="basic-input-checkbox-container">
                    <input
                      className="basic-input-checkbox"
                      type="checkbox"
                      checked={selectedEdificios.has(edificio.idedificios)}
                      onChange={() => handleSelectionChange(edificio.idedificios)}
                    />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        <button type="submit">Guardar y Pasar a la Siguiente Sección</button>
      </form>
    </div>
  );
};

export default EdificiosList;
