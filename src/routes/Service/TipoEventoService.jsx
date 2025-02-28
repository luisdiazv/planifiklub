import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import './TipoEventoServiceStyles.css';
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

const ConfiguradorTipoEventos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoEventoInfo, setTipoEventoInfo] = useState(null);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [newFoto, setNewFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  // Estado para el indicador de carga
  const [loading, setLoading] = useState(false);

  const handleSearchByNombre = async () => {
    setError('');
    setSuccessMsg('');
    setTiposEvento([]); // Inicializa con un array vacío en lugar de null
    setLoading(true);
  
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
    } finally {
      setLoading(false);
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
    <div className="fullTipo-evento-serv-container">
      <div className="tipo-evento-serv-container">
        <h2 header className="tipo-evento-serv-header">Configurador de Tipos de Evento</h2>

        <div className="tipo-evento-serv-input-container">
          <input
            type="text"
            placeholder="Ingrese el nombre del tipo de evento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tipo-evento-serv-input"
          />
          <button onClick={handleSearchByNombre} className="tipo-evento-serv-button">Buscar</button>
          <button onClick={handleCreateNew} className="tipo-evento-serv-button tipo-evento-serv-button-margin">Crear Nuevo Tipo de Evento</button>
        </div>

        {error && <span className="tipo-evento-serv-error">{error}</span>}
        {successMsg && <span className="tipo-evento-serv-success">{successMsg}</span>}

        {tipoEventoInfo ? (
          <div className="tipo-evento-serv-info">
            <h3 className="tipo-evento-serv-title">
              {tipoEventoInfo.idtipos_eventos ? 'Editando Tipo de Evento' : 'Creando Nuevo Tipo de Evento'}
            </h3>

            <label className="tipo-evento-serv-label">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={tipoEventoInfo.nombre}
              onChange={handleChange}
              className="tipo-evento-serv-input"
            />

            <label className="tipo-evento-serv-label">Descripción:</label>
            <textarea
              name="descripcion"
              value={tipoEventoInfo.descripcion}
              onChange={handleChange}
              className="tipo-evento-serv-textarea"
            />

            <label className="tipo-evento-serv-label">Foto:</label>
            {previewFoto && <img src={previewFoto} alt="Preview" className="tipo-evento-serv-preview" />}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="tipo-evento-serv-input-image"
            />
            <div className="tipo-evento-serv-button-container">
              <button onClick={handleSave} className="tipo-evento-serv-save-button">Guardar</button>
              <button onClick={handleExitWithoutSaving} className="tipo-evento-serv-exit-button">Salir sin guardar</button>
              {tipoEventoInfo.idtipos_eventos && <button onClick={handleDelete} className="tipo-evento-serv-delete-button">Eliminar</button>}
            </div>
          </div>
        ) : (
          tiposEvento.length > 0 && (
            <div className='tipo-eventos-serv-container'>
              {tiposEvento.map((tipoEvento) => (
                <div
                  key={tipoEvento.idtipos_eventos}
                  className="tipo-evento-serv-item"
                >
                  <div>
                    <label><strong>{tipoEvento.nombre}</strong></label>
                  </div>
                  <button className="tipo-evento-serv-button"
                    onClick={() => handleSelectTipoEvento(tipoEvento)}>Seleccionar</button>

                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConfiguradorTipoEventos;

