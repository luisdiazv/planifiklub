import React, { useState, useEffect } from 'react';
import Resizer from 'react-image-file-resizer';
import { handleAcceso } from '../../Util/AccessControl'
import { getEdificiosByNombre, updateEdificio, createEdificio, deleteEdificio } from '../../Ctrl/EdificiosCtrl';
import { getFotoEdificio, uploadFotoEdificio } from '../../API/StorageAPI';
import { getMontajesByEdificio, saveMontajesEdificio } from '../../Ctrl/MontajesEdificioCtrl';
import { getAllMontajes } from '../../Ctrl/MontajesCtrl';
import "./EdificiosServiceStyles.css";

const ConfiguradorEdificios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [edificioInfo, setEdificioInfo] = useState(null);
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);
  // Estado para la URL de vista previa de la imagen
  const [previewFoto, setPreviewFoto] = useState(null);
  // Estado para el indicador de carga
  const [loading, setLoading] = useState(false);

  // Estados para los montajes
  const [availableMontajes, setAvailableMontajes] = useState([]);
  const [selectedMontajes, setSelectedMontajes] = useState([]);

  useEffect(() => {
    const verificarAcceso = async () => {
        const acceso = await handleAcceso(6);
        // Si no hay acceso, se asume que handleAcceso redirige a /404
        if (!acceso) {
            return;
        }
    };
    verificarAcceso();
}, []);

  // Cargar los montajes disponibles desde la base de datos (tabla "montajes")
  useEffect(() => {
    const fetchMontajesDisponibles = async () => {
      try {
        const montajes = await getAllMontajes();
        setAvailableMontajes(montajes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMontajesDisponibles();
  }, []);

  // Cuando se selecciona un edificio para editar, se obtienen los montajes asignados
  const handleSelectEdificio = async (edificio) => {
    setEdificioInfo(edificio);
    setEdificios([]); // Oculta la lista de edificios
    try {
      const url = await getFotoEdificio(edificio.idedificios);
      setPreviewFoto(url);
    } catch (error) {
      console.error('Error al obtener la foto del edificio:', error.message);
      setPreviewFoto(null);
    }
    // Obtener los montajes asignados al edificio
    try {
      const montajesAsignados = await getMontajesByEdificio(edificio.idedificios);
      setSelectedMontajes(montajesAsignados);
    } catch (error) {
      console.error('Error al obtener montajes asignados:', error.message);
      setSelectedMontajes([]);
    }
  };

  const handleSearchByNombre = async () => {
    setError('');
    setSuccessMsg('');
    setEdificioInfo(null);
    setLoading(true);
    try {
      const filteredEdificios = await getEdificiosByNombre(searchTerm);
      if (filteredEdificios && filteredEdificios.length > 0) {
        setEdificios(filteredEdificios);
      } else {
        setEdificios([]);
        window.alert('No se encontraron edificios con ese nombre.');
      }
    } catch (error) {
      console.error('Error al buscar edificios por nombre:', error.message);
      window.alert('Ocurrió un error al buscar edificios.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Abrir el formulario con valores iniciales y sin montajes asignados
    setEdificioInfo({
      nombre: '',
      capacidad_maxima: 0,
      disponibilidad: true,
      costo_hora: 0,
      descripcion: ''
    });
    setError('');
    setSuccessMsg('');
    setPreviewFoto(null);
    setSelectedMontajes([]);
  };

  const handleChange = (e) => {
    const { name, value, _, checked } = e.target; // eslint-disable-line no-unused-vars
    if (name === 'disponibilidad') {
      setEdificioInfo(prev => ({ ...prev, [name]: checked }));
      return;
    }
    if (name === 'costo_hora') {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (!regex.test(value) && value !== '') return;
      const parsedValue = parseFloat(value) || 0;
      if (parsedValue < 0) return;
      setEdificioInfo(prev => ({ ...prev, [name]: parsedValue }));
      return;
    }
    setEdificioInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Redimensionar la imagen para que el lado mayor tenga 300px
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (resizedBlob) => {
        const previewUrl = URL.createObjectURL(resizedBlob);
        setPreviewFoto(previewUrl);
        setNewFoto(resizedBlob);
      },
      'blob'
    );
  };

  // Maneja la selección o deselección de montajes
  const handleMontajeChange = (e, id) => {
    if (e.target.checked) {
      setSelectedMontajes([...selectedMontajes, id]);
    } else {
      setSelectedMontajes(selectedMontajes.filter(item => item !== id));
    }
  };

  const handleSave = async () => {
    if (!edificioInfo) return;
    try {
      let updatedInfo = { ...edificioInfo };
      let idEdificioGuardado = null;
      if (edificioInfo.idedificios) {
        // Actualizar edificio existente
        await updateEdificio(edificioInfo.idedificios, updatedInfo);
        idEdificioGuardado = edificioInfo.idedificios;
        if (newFoto) {
          await uploadFotoEdificio(edificioInfo.idedificios, newFoto);
          const newUrl = await getFotoEdificio(edificioInfo.idedificios);
          setPreviewFoto(newUrl);
        }
        window.alert('Edificio actualizado exitosamente.');
      } else {
        // Crear nuevo edificio
        const createdEdificio = await createEdificio(updatedInfo);
        idEdificioGuardado = createdEdificio.idedificios;
        console.log(idEdificioGuardado)
        if (newFoto) {
          await uploadFotoEdificio(createdEdificio.idedificios, newFoto);
          const newUrl = await getFotoEdificio(createdEdificio.idedificios);
          setPreviewFoto(newUrl);
        }
        window.alert('Edificio creado exitosamente.');
      }

      // Guardar la relación de montajes para el edificio
      if (idEdificioGuardado !== null) {
        await saveMontajesEdificio(
          idEdificioGuardado,
          selectedMontajes.map(id => ({ id_montajes: id }))
        );
      }

      // Reiniciar estados
      setNewFoto(null);
      setEdificioInfo(null);
      setSelectedMontajes([]);
    } catch (error) {
      console.error('Error al guardar el edificio:', error.message);
      window.alert('Ocurrió un error al guardar el edificio.');
    }
  };

  const handleExitWithoutSaving = () => {
    setEdificioInfo(null);
    setSuccessMsg('');
    setError('');
    setNewFoto(null);
    setPreviewFoto(null);
  };

  const handleDelete = async () => {
    if (!edificioInfo) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este edificio?');
    if (confirmDelete) {
      try {
        await deleteEdificio(edificioInfo.idedificios);
        window.alert('Edificio eliminado exitosamente.');
        setEdificioInfo(null);
        setNewFoto(null);
        setPreviewFoto(null);
      } catch (error) {
        console.error('Error al eliminar el edificio:', error.message);
        window.alert('Ocurrió un error al eliminar el edificio.');
      }
    }
  };

  return (
    <div className="fullEdificios-config-container">
      <div className="edificios-config-container">
        <h2 className="edificios-config-header">Configurador de Edificios</h2>

        <div className="edificios-config-input-container">
          <input
            type="text"
            placeholder="Ingrese el nombre del edificio"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="edificios-config-input"
          />
          <button onClick={handleSearchByNombre} className="edificios-config-button">
            Buscar
          </button>
          <button onClick={handleCreateNew} className="edificios-config-button edificios-config-button-margin">
            Crear Nuevo Edificio
          </button>
        </div>

        {/* Indicador de carga */}
        {loading && <div className="edificios-config-loading">Buscando edificios...</div>}

        {error && <span className="edificios-config-error">{error}</span>}
        {successMsg && <span className="edificios-config-success">{successMsg}</span>}

        {edificioInfo ? (
          <div className="edificios-config-producto-info">
            <h3 className="edificios-config-title">
              {edificioInfo.idedificios ? 'Editando Edificio' : 'Creando Nuevo Edificio'}
            </h3>

            <label className="edificios-config-label">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={edificioInfo.nombre}
              onChange={handleChange}
              className="edificios-config-input"
            />

            <label className="edificios-config-label">Capacidad Máxima:</label>
            <input
              type="number"
              name="capacidad_maxima"
              value={edificioInfo.capacidad_maxima}
              onChange={handleChange}
              className="edificios-config-input"
            />
            <div className='edificios-config-label-container'>
              <label className="edificios-config-label">Disponibilidad:</label>
              <div className='basic-input-checkbox-container'>
                <input
                  type="checkbox"
                  name="disponibilidad"
                  checked={edificioInfo.disponibilidad}
                  onChange={handleChange}
                  className="basic-input-checkbox"
                />
              </div></div>


            <label className="edificios-config-label">Costo por Hora:</label>
            <input
              type="number"
              name="costo_hora"
              value={edificioInfo.costo_hora}
              onChange={handleChange}
              className="edificios-config-input"
              step="0.01"
            />

            <label className="edificios-config-label">Descripción:</label>
            <textarea
              name="descripcion"
              value={edificioInfo.descripcion}
              onChange={handleChange}
              className="edificios-config-textarea"
            />

            <label className="edificios-config-label">Foto:</label>
            {previewFoto && (
              <img
                src={previewFoto}
                alt="Preview"
                className="edificios-config-preview-foto"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="edificios-config-input-image"
            />

            <label className="edificios-config-label">Montajes:</label>
            <div className="edificios-config-montajes-container">
              {availableMontajes.map((montaje) => (
                <div key={montaje.idmontajes} className="edificios-config-montaje-item">
                  <div className="basic-input-checkbox-container">
                    <input
                      className='basic-input-checkbox'
                      type="checkbox"
                      value={montaje.idmontajes}
                      checked={selectedMontajes.includes(montaje.idmontajes)}
                      onChange={(e) => handleMontajeChange(e, montaje.idmontajes)}
                    />
                  </div>
                  <p>
                    {montaje.nombre_montaje}
                  </p>
                </div>
              ))}
            </div>

            <div className="edificios-config-button-container">
              <button onClick={handleSave} className="edificios-config-save-button">
                Guardar
              </button>
              <button onClick={handleExitWithoutSaving} className="edificios-config-exit-button">
                Salir sin guardar
              </button>
              {edificioInfo.idedificios && (
                <button onClick={handleDelete} className="edificios-config-delete-button">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ) : (
          edificios.length > 0 && (
            <div className='edificios-config-producto-container'>
              {edificios.map((edificio) => (
                <div
                  key={edificio.idedificios}
                  className="edificios-config-producto-item"
                >
                  <div>
                    <strong>{edificio.nombre}</strong>
                    <div>
                      <label>Capacidad: {edificio.capacidad_maxima} personas</label>
                    </div>
                    <div>
                      <label>Precio: ${edificio.costo_hora} por hora</label>
                    </div>
                    <button className="edificios-config-button" onClick={() => handleSelectEdificio(edificio)}>Seleccionar</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConfiguradorEdificios;
