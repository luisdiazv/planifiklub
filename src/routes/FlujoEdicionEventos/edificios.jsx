import { useState, useEffect } from "react";
import { getAllEdificio, getEdificiosAndMontajesByIdEvento } from "../../Ctrl/EdificiosCtrl";
import { getAllMontajeEdificio } from "../../Ctrl/MontajesEdificioCtrl";
import { getNombreMontajeByIdMontaje } from "../../Ctrl/MontajesCtrl";
import { getFotoEdificio } from "../../API/StorageAPI";
import "./edificiosStyles.css";
import { formatCurrency } from "../../Util/MoneyFormat";

const EdificiosList = ({ id, handleNext }) => {
  const [edificios, setEdificios] = useState([]);
  const [montajes, setMontajes] = useState([]);
  const [montajesNombres, setMontajesNombres] = useState({});
  const [montajeSeleccionado, setMontajeSeleccionado] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [selectedEdificios, setSelectedEdificios] = useState(new Set());
  const [edificioFotos, setEdificioFotos] = useState({});
  const [edificiosEvento, setEdificiosEvento] = useState([]);
  const [isEditable, setIsEditable] = useState(true);

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

            // Obtener y guardar la información de edificios y montajes por defecto
            const edificiosEvento = await getEdificiosAndMontajesByIdEvento(id);
            const edificiosDummy = edificiosEvento.map((edificioEvento) => ({
                ...edificioEvento,
                id_evento: id,
            }));

            setEdificiosEvento(edificiosDummy);

            if (sessionStorage.getItem("edificiosDummy") != null) {
                sessionStorage.removeItem("edificiosDummy");
            }
            sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosDummy));

            // Verifica el estado del evento
            const eventoDummy = JSON.parse(sessionStorage.getItem("eventoDummy"));
            if (eventoDummy && eventoDummy.estado === "Aprobado") {
                setIsEditable(false);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [id]);

useEffect(() => {
    const selectedEdificiosSet = new Set();
    const montajeSeleccionadoObj = {};

    edificiosEvento.forEach((edificioEvento) => {
        selectedEdificiosSet.add(edificioEvento.id_edificio);
        montajeSeleccionadoObj[edificioEvento.id_edificio] = edificioEvento.id_montaje_elegido;
    });

    setSelectedEdificios(selectedEdificiosSet);
    setMontajeSeleccionado(montajeSeleccionadoObj);
}, [edificiosEvento]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectionChange = (id) => {
    if (!isEditable) return;
    setSelectedEdificios((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleMontajeChange = (edificioId, montajeId) => {
    if (!isEditable) return;
    setMontajeSeleccionado((prev) => ({ ...prev, [edificioId]: montajeId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        console.log(`Edificio ID: ${idEdificio}, Subtotal: ${subtotal}`);
        if (!(selectedEdificios.size === 0 || !idMontaje)){
            return {
                id_edificio: idEdificio,
                id_evento: id,
                id_montaje_elegido: idMontaje,
                subtotal_alquiler: subtotal,
            };
        }
    }).filter(edificio => edificio !== undefined); // Filtrar los valores undefined

    if (sessionStorage.getItem("edificiosDummy") != null) {
        sessionStorage.removeItem("edificiosDummy");
    }
    sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosEvento));

    handleNext(); 
};

  if (loading) return <p>Cargando edificios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="edificios-container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
      {!isEditable && <p>Debido al estado de su solicitud, para realizar modificaciones en este evento, comuníquese con la administración.</p>}
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
                  <button type="button" className="toggle-btn" onClick={() => toggleExpand(edificio.idedificios)}>
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
                      disabled={!isEditable}
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
                      disabled={!isEditable}
                    />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        <button type="submit" >Guardar y Pasar a la Siguiente Sección</button>
      </form>
    </div>
  );
};

export default EdificiosList;