import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { 
  getEdificiosByNombre,
  updateEdificio, 
  createEdificio, 
  deleteEdificio 
} from '../../Ctrl/EdificiosCtrl';
import { getFotoEdificio, uploadFotoEdificio } from '../../API/StorageAPI'; // Ajusta la ruta según tu proyecto

const ConfiguradorEdificios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [edificioInfo, setEdificioInfo] = useState(null);
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para almacenar la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);
  // Estado para almacenar la URL de _preview_ de la imagen (no se guarda en la BD)
  const [previewFoto, setPreviewFoto] = useState(null);

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

  const handleSelectEdificio = async (edificio) => {
    setEdificioInfo(edificio);
    setEdificios([]); // Oculta la lista de edificios
    // Opcional: obtener la foto existente desde storage para mostrarla en el preview
    try {
      const url = await getFotoEdificio(edificio.idedificios);
      setPreviewFoto(url);
    } catch (error) {
      console.error('Error al obtener la foto del edificio:', error.message);
      setPreviewFoto(null);
    }
  };

  const handleCreateNew = () => {
    // Se abre el formulario con valores iniciales vacíos (sin campo foto)
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
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

    // Se redimensiona la imagen para que su lado más largo sea de 300px
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (resizedBlob) => {
        // Se crea una URL de vista previa a partir del blob redimensionado
        const previewUrl = URL.createObjectURL(resizedBlob);
        setPreviewFoto(previewUrl);
        // Se guarda el blob para su posterior subida a Supabase
        setNewFoto(resizedBlob);
      },
      'blob'
    );
  };

  const handleSave = async () => {
    if (!edificioInfo) return;
    try {
      let updatedInfo = { ...edificioInfo };

      if (edificioInfo.idedificios) {
        // Edificio existente: actualizar
        await updateEdificio(edificioInfo.idedificios, updatedInfo);
        // Si se seleccionó una nueva foto, se sube de forma separada
        if (newFoto) {
          await uploadFotoEdificio(edificioInfo.idedificios, newFoto);
          // Opcional: se puede obtener la nueva URL para mostrarla en el preview
          const newUrl = await getFotoEdificio(edificioInfo.idedificios);
          setPreviewFoto(newUrl);
        }
        setSuccessMsg('Edificio actualizado exitosamente.');
      } else {
        // Nuevo edificio: crear
        const createdEdificio = await createEdificio(updatedInfo);
        // Si se seleccionó una foto, se sube
        if (newFoto) {
          await uploadFotoEdificio(updatedInfo.idedificios, newFoto);
          // Opcional: obtener la URL para mostrarla en el preview
          const newUrl = await getFotoEdificio(updatedInfo.idedificios);
          setPreviewFoto(newUrl);
        }
        setSuccessMsg('Edificio creado exitosamente.');
      }
      setNewFoto(null);
      setEdificioInfo(null);
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
                <span>
                  <strong>{edificio.nombre}</strong> - {edificio.capacidad_maxima} personas - ${edificio.costo_hora} por hora
                  <button style={styles.button}>Seleccionar</button>
                </span>
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
  
export default ConfiguradorEdificios;
