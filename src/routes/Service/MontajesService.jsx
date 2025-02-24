import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import "./MontajesServiceStyles.css";

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
    <div className="fullMontaje-config-container">
      <div className="montaje-config-container">
        <h2 className="montaje-config-header">Configurador de Montajes</h2>

        <div className="montaje-config-input-container">
          <input
            type="text"
            placeholder="Ingrese el nombre del montaje"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="montaje-config-input"
          />
          <button onClick={handleSearchByNombre} className="montaje-config-button">
            Buscar
          </button>
          <button onClick={handleCreateNew} className="montaje-config-button montajes-config-button-margin-top">
            Crear Nuevo Montaje
          </button>
        </div>

        {error && <span className="montaje-config-error">{error}</span>}
        {successMsg && <span className="montaje-config-success">{successMsg}</span>}

        {montajeInfo ? (
          <div className="montaje-config-producto-info">
            <h3 className="montaje-config-title">
              {montajeInfo.idmontajes ? 'Editando Montaje' : 'Creando Nuevo Montaje'}
            </h3>

            <label className="montaje-config-label">Nombre del Montaje:</label>
            <input
              type="text"
              name="nombre_montaje"
              value={montajeInfo.nombre_montaje}
              onChange={handleChange}
              className="montaje-config-input"
            />

            <label className="montaje-config-label">Descripción:</label>
            <textarea
              name="descripcion"
              value={montajeInfo.descripcion}
              onChange={handleChange}
              className="montaje-config-textarea"
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

            <div className="montaje-config-button-container">
              <button onClick={handleSave} className="montaje-config-button montaje-config-button-save">
                Guardar
              </button>
              <button onClick={handleExitWithoutSaving} className="montaje-config-button-exit">
                Salir sin guardar
              </button>
              {montajeInfo.idmontajes && (
                <button onClick={handleDelete} className="montaje-config-button-delete">
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
                  className="montaje-config-producto-item"
                >
                  <div>
                    <label>
                      <strong>{montaje.nombre_montaje}</strong>
                    </label>
                  </div>
                  <button className="montaje-config-button" onClick={() => handleSelectMontaje(montaje)}>Seleccionar</button>

                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConfiguradorMontajes;
