import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import {
  getMontajesByNombre,
  updateMontaje,
  createMontaje,
  deleteMontaje
} from '../../Ctrl/MontajesCtrl';
//import { getFotoMontaje, uploadFotoMontaje } from '../../API/StorageAPI'; // Ajusta la ruta según tu proyecto

const ConfiguradorMontajes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [montajeInfo, setMontajeInfo] = useState(null);
  const [montajes, setMontajes] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para almacenar la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);
  // Estado para almacenar la URL de _preview_ de la imagen
  const [previewFoto, setPreviewFoto] = useState(null);

  const handleSearchByNombre = async () => {
    setError('');
    setSuccessMsg('');
    setMontajeInfo(null);
    try {
      const filteredMontajes = await getMontajesByNombre(searchTerm);
      if (filteredMontajes && filteredMontajes.length > 0) {
        setMontajes(filteredMontajes);
      } else {
        setMontajes([]);
        setError('No se encontraron montajes con ese nombre.');
      }
    } catch (error) {
      console.error('Error al buscar montajes por nombre:', error.message);
      setError('Ocurrió un error al buscar montajes.');
    }
  };

  const handleSelectMontaje = async (montaje) => {
    setMontajeInfo(montaje);
    setMontajes([]); // Oculta la lista de montajes
    /*
    try {
      const url = await getFotoMontaje(montaje.idmontajes);
      setPreviewFoto(url);
    } catch (error) {
      console.error('Error al obtener la foto del montaje:', error.message);
      setPreviewFoto(null);
    }
    */
  };

  const handleCreateNew = () => {
    // Abre el formulario con valores iniciales vacíos (sin foto)
    setMontajeInfo({
      nombre_montaje: '',
      descripcion: ''
    });
    setError('');
    setSuccessMsg('');
    setPreviewFoto(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMontajeInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Redimensiona la imagen para que su lado más largo sea de 300px
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
    if (!montajeInfo) return;
    try {
      let updatedInfo = { ...montajeInfo };

      if (montajeInfo.idmontajes) {
        // Montaje existente: actualizar
        await updateMontaje(montajeInfo.idmontajes, updatedInfo);
        /*
        if (newFoto) {
          await uploadFotoMontaje(montajeInfo.idmontajes, newFoto);
          const newUrl = await getFotoMontaje(montajeInfo.idmontajes);
          setPreviewFoto(newUrl);
        }
        */
        setSuccessMsg('Montaje actualizado exitosamente.');
      } else {
        // Nuevo montaje: crear
        const createdMontaje = await createMontaje(updatedInfo);
        /*
        if (newFoto) {
          await uploadFotoMontaje(createdMontaje.idmontajes, newFoto);
          const newUrl = await getFotoMontaje(createdMontaje.idmontajes);
          setPreviewFoto(newUrl);
        }
        */
        setSuccessMsg('Montaje creado exitosamente.');
      }
      setNewFoto(null);
      setMontajeInfo(null);
    } catch (error) {
      console.error('Error al guardar el montaje:', error.message);
      setError('Ocurrió un error al guardar el montaje.');
    }
  };

  const handleExitWithoutSaving = () => {
    setMontajeInfo(null);
    setSuccessMsg('');
    setError('');
    setNewFoto(null);
    setPreviewFoto(null);
  };

  const handleDelete = async () => {
    if (!montajeInfo) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este montaje?');
    if (confirmDelete) {
      try {
        await deleteMontaje(montajeInfo.idmontajes);
        setSuccessMsg('Montaje eliminado exitosamente.');
        setMontajeInfo(null);
        setNewFoto(null);
        setPreviewFoto(null);
      } catch (error) {
        console.error('Error al eliminar el montaje:', error.message);
        setError('Ocurrió un error al eliminar el montaje.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Montajes</header>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ingrese el nombre del montaje"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchByNombre} style={styles.button}>
          Buscar
        </button>
        <button onClick={handleCreateNew} style={{ ...styles.button, marginTop: '10px' }}>
          Crear Nuevo Montaje
        </button>
      </div>

      {error && <span style={styles.error}>{error}</span>}
      {successMsg && <span style={styles.success}>{successMsg}</span>}

      {montajeInfo ? (
        <div style={styles.productoInfo}>
          <h3 style={styles.title}>
            {montajeInfo.idmontajes ? 'Editando Montaje' : 'Creando Nuevo Montaje'}
          </h3>

          <p style={styles.label}>Nombre del Montaje:</p>
          <input
            type="text"
            name="nombre_montaje"
            value={montajeInfo.nombre_montaje}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Descripción:</p>
          <textarea
            name="descripcion"
            value={montajeInfo.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />

          {/*
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
            
          */
          }

          <div style={styles.buttonContainer}>
            <button onClick={handleSave} style={styles.saveButton}>
              Guardar
            </button>
            <button onClick={handleExitWithoutSaving} style={styles.exitButton}>
              Salir sin guardar
            </button>
            {montajeInfo.idmontajes && (
              <button onClick={handleDelete} style={styles.deleteButton}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      ) : (
        montajes.length > 0 && (
          <div>
            {montajes.map((montaje) => (
              <div
                key={montaje.idmontajes}
                style={styles.productoItem}
                onClick={() => handleSelectMontaje(montaje)}
              >
                <span>
                  <div>
                    <strong>{montaje.nombre_montaje}</strong>
                  </div>
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
  title: {
    textAlign: 'center',
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

export default ConfiguradorMontajes;
