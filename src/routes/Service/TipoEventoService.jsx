import React, { useState, useEffect } from 'react'; 
import Resizer from 'react-image-file-resizer';
import { getEdificiosByNombre, updateEdificio, createEdificio, deleteEdificio } from '../../Ctrl/EdificiosCtrl';
import { getTipoEventoByNombre, updateTipoEvento, createTipoEvento, deleteTipoEvento } from '../../Ctrl/TiposEventosCtrl';
import { getFotoEdificio, uploadFotoEdificio } from '../../API/StorageAPI';

const ConfiguradorTipoEventos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [edificioInfo, setEdificioInfo] = useState(null);
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);
  // Estado para la URL de vista previa de la imagen
  const [previewFoto, setPreviewFoto] = useState(null);

  // Estados para los montajes
  const [availableMontajes, setAvailableMontajes] = useState([]);
  const [selectedMontajes, setSelectedMontajes] = useState([]);

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
    try {
      const filteredEdificios = await getEdificiosByNombre(searchTerm);
      if (filteredEdificios && filteredEdificios.length > 0) {
        setEdificios(filteredEdificios);
      } else {
        setEdificios([]);
        setError('No se encontraron edificios con ese nombre.');
      }
    } catch (error) {
      console.error('Error al buscar edificios por nombre:', error.message);
      setError('Ocurrió un error al buscar edificios.');
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
        setSuccessMsg('Edificio actualizado exitosamente.');
      } else {
        // Crear nuevo edificio
        const createdEdificio = await createEdificio(updatedInfo);
        idEdificioGuardado = createdEdificio.idedificios;
        if (newFoto) {
          await uploadFotoEdificio(createdEdificio.idedificios, newFoto);
          const newUrl = await getFotoEdificio(createdEdificio.idedificios);
          setPreviewFoto(newUrl);
        }
        setSuccessMsg('Edificio creado exitosamente.');
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
      setError('Ocurrió un error al guardar el edificio.');
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
        setSuccessMsg('Edificio eliminado exitosamente.');
        setEdificioInfo(null);
        setNewFoto(null);
        setPreviewFoto(null);
      } catch (error) {
        console.error('Error al eliminar el edificio:', error.message);
        setError('Ocurrió un error al eliminar el edificio.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Edificios</header>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ingrese el nombre del edificio"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchByNombre} style={styles.button}>
          Buscar
        </button>
        <button onClick={handleCreateNew} style={{ ...styles.button, marginTop: '10px' }}>
          Crear Nuevo Edificio
        </button>
      </div>

      {error && <span style={styles.error}>{error}</span>}
      {successMsg && <span style={styles.success}>{successMsg}</span>}

      {edificioInfo ? (
        <div style={styles.productoInfo}>
          <h3 style={styles.title}>
            {edificioInfo.idedificios ? 'Editando Edificio' : 'Creando Nuevo Edificio'}
          </h3>

          <p style={styles.label}>Nombre:</p>
          <input
            type="text"
            name="nombre"
            value={edificioInfo.nombre}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Capacidad Máxima:</p>
          <input
            type="number"
            name="capacidad_maxima"
            value={edificioInfo.capacidad_maxima}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Disponibilidad:</p>
          <input
            type="checkbox"
            name="disponibilidad"
            checked={edificioInfo.disponibilidad}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Costo por Hora:</p>
          <input
            type="number"
            name="costo_hora"
            value={edificioInfo.costo_hora}
            onChange={handleChange}
            style={styles.input}
            step="0.01"
          />

          <p style={styles.label}>Descripción:</p>
          <textarea
            name="descripcion"
            value={edificioInfo.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />

          <p style={styles.label}>Foto:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {previewFoto && (
            <img
              src={previewFoto}
              alt="Preview"
              style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '4px' }}
            />
          )}

          <p style={styles.label}>Montajes:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {availableMontajes.map((montaje) => (
              <div key={montaje.idmontajes} style={{ width: '50%' }}>
                <span>
                  <input
                    type="checkbox"
                    value={montaje.idmontajes}
                    checked={selectedMontajes.includes(montaje.idmontajes)}
                    onChange={(e) => handleMontajeChange(e, montaje.idmontajes)}
                  />
                  {montaje.nombre_montaje}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.buttonContainer}>
            <button onClick={handleSave} style={styles.saveButton}>
              Guardar
            </button>
            <button onClick={handleExitWithoutSaving} style={styles.exitButton}>
              Salir sin guardar
            </button>
            {edificioInfo.idedificios && (
              <button onClick={handleDelete} style={styles.deleteButton}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      ) : (
        edificios.length > 0 && (
          <div>
            {edificios.map((edificio) => (
              <div
                key={edificio.idedificios}
                style={styles.productoItem}
                onClick={() => handleSelectEdificio(edificio)}
              >
                <div>
                  <strong>{edificio.nombre}</strong>
                  <div>
                    <span>Capacidad: {edificio.capacidad_maxima} personas</span>
                  </div>
                  <div>
                    <span>Precio: ${edificio.costo_hora} por hora</span>
                  </div>
                  <button style={styles.button}>Seleccionar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '10px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: '5px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    resize: 'none',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#800000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  exitButton: {
    padding: '8px 16px',
    backgroundColor: '#808080',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '10px',
  },
  productoInfo: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productoItem: {
    padding: '5px',
    borderBottom: '1px solid #ccc',
    marginBottom: '5px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
};

export default ConfiguradorTipoEventos;