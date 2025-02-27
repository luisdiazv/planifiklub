import React, { useState, useEffect } from 'react';
import Resizer from 'react-image-file-resizer';
import { 
  getTipoEventoByNombre, 
  updateTipoEvento, 
  createTipoEvento, 
  deleteTipoEvento 
} from '../../Ctrl/TiposEventosCtrl';
import { 
  getFotoTipoEvento, 
  uploadFotoTipoEvento 
} from '../../API/StorageAPI';
import { handleAcceso } from '../../Util/AccessControl';

const ConfiguradorTipoEventos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoEventoInfo, setTipoEventoInfo] = useState(null);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [newFoto, setNewFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  useEffect(() => {
    const verificarAcceso = async () => {
        const acceso = await handleAcceso(8);
        // Si no hay acceso, se asume que handleAcceso redirige a /404
        if (!acceso) {
            return;
        }
    };
    verificarAcceso();
  }, []);

  const handleSearchByNombre = async () => {
    setError('');
    setSuccessMsg('');
    setTiposEvento([]); // Inicializa con un array vacío en lugar de null
  
    try {
      const filteredTipos = await getTipoEventoByNombre(searchTerm);
      if (filteredTipos && filteredTipos.length > 0) {
        setTiposEvento(filteredTipos);
      } else {
        setTiposEvento([]); // Asegúrate de que siempre sea un array
        window.alert('No se encontraron tipos de evento con ese nombre.');
      }
    } catch (error) {
      console.error('Error al buscar tipos de evento por nombre:', error.message);
      window.alert('Ocurrió un error al buscar tipos de evento.');
    }
  };
  
  const handleSelectTipoEvento = async (tipoEvento) => {
    setTipoEventoInfo(tipoEvento);
    setTiposEvento([]);

    try {
      const url = await getFotoTipoEvento(tipoEvento.idtipos_eventos);
      setPreviewFoto(url);
    } catch (error) {
      console.error('Error al obtener la foto del tipo de evento:', error.message);
      setPreviewFoto(null);
    }
  };

  const handleExitWithoutSaving = () => {
    setTipoEventoInfo(null);
    setSuccessMsg('');
    setError('');
    setNewFoto(null);
    setPreviewFoto(null);
  };

  const handleCreateNew = () => {
    setTipoEventoInfo({
      nombre: '',
      descripcion: ''
    });
    setError('');
    setSuccessMsg('');
    setPreviewFoto(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoEventoInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const handleSave = async () => {
    if (!tipoEventoInfo) return;
  
    try {
      let updatedInfo = { ...tipoEventoInfo };
  
      if (tipoEventoInfo.idtipos_eventos) {
        // Actualizar tipo de evento existente
        await updateTipoEvento(tipoEventoInfo.idtipos_eventos, updatedInfo);
        
        if (newFoto) {
          await uploadFotoTipoEvento(tipoEventoInfo.idtipos_eventos, newFoto);
          const newUrl = await getFotoTipoEvento(tipoEventoInfo.idtipos_eventos);
          setPreviewFoto(newUrl);
        }
        setSuccessMsg('Tipo de evento actualizado exitosamente.');
        alert('¡Tipo de evento actualizado exitosamente!');
      } else {
        // Crear nuevo tipo de evento
        const createdTipoEvento = await createTipoEvento(updatedInfo);
        
        if (newFoto) {
          await uploadFotoTipoEvento(createdTipoEvento.idtipos_eventos, newFoto);
          const newUrl = await getFotoTipoEvento(createdTipoEvento.idtipos_eventos);
          setPreviewFoto(newUrl);
        }
        setSuccessMsg('Tipo de evento creado exitosamente.');
        alert('¡Tipo de evento creado exitosamente!');
      }
  
      setNewFoto(null);
      setTipoEventoInfo(null);
      setTiposEvento([]);
  
    } catch (error) {
      console.error('Error al guardar el tipo de evento:', error.message);
      window.alert('Ocurrió un error al guardar el tipo de evento.');
      alert('Error al guardar el tipo de evento: ' + error.message);
    }
  };
  
  const handleDelete = async () => {
    if (!tipoEventoInfo) return;
  
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este tipo de evento?');
    
    if (confirmDelete) {
      try {
        await deleteTipoEvento(tipoEventoInfo.idtipos_eventos);
        setSuccessMsg('Tipo de evento eliminado exitosamente.');
        setTipoEventoInfo(null);
        setNewFoto(null);
        setPreviewFoto(null);
        setTiposEvento([]);
  
        // Forzar recarga de la página después de eliminar
        alert('¡Tipo de evento eliminado exitosamente!');
  
      } catch (error) {
        console.error('Error al eliminar el tipo de evento:', error.message);
        window.alert('Ocurrió un error al eliminar el tipo de evento.');
        alert('Error al eliminar el tipo de evento: ' + error.message);
      }
    }
  };  

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Tipos de Evento</header>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ingrese el nombre del tipo de evento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchByNombre} style={styles.button}>
          Buscar
        </button>
        <button onClick={handleCreateNew} style={{ ...styles.button, marginTop: '10px' }}>
          Crear Nuevo Tipo de Evento
        </button>
      </div>

      {error && <span style={styles.error}>{error}</span>}
      {successMsg && <span style={styles.success}>{successMsg}</span>}

      {tipoEventoInfo ? (
        <div style={styles.productoInfo}>
          <h3 style={styles.title}>
            {tipoEventoInfo.idtipos_eventos ? 'Editando Tipo de Evento' : 'Creando Nuevo Tipo de Evento'}
          </h3>
          
          <p style={styles.label}>Nombre:</p>
          <input
            type="text"
            name="nombre"
            value={tipoEventoInfo.nombre}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Descripción:</p>
          <textarea
            name="descripcion"
            value={tipoEventoInfo.descripcion}
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
            {tipoEventoInfo.idtipos_eventos && (
              <button onClick={handleDelete} style={styles.deleteButton}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      ) : (
        tiposEvento.length > 0 && (
          <div>
            {tiposEvento.map((tipoEvento) => (
              <div
                key={tipoEvento.idtipos_eventos}
                style={styles.productoItem}
                onClick={() => handleSelectTipoEvento(tipoEvento)}
              >
                <div>
                  <strong>{tipoEvento.nombre}</strong>
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