import React, { useState, useEffect } from 'react';
import { getEventById } from "../../Ctrl/EventosCtrl";

const ConfiguradorEventos = () => {
  const [eventId, setEventId] = useState('');
  const [eventInfo, setEventInfo] = useState(null);
  const [eventStates, setEventStates] = useState();
  const [error, setError] = useState('');

  const handleSearchEvent = async () => {
      setError('');
      setEventInfo(null);
      try {
        const evento = await getEventById(eventId);
        if (user) {
          setEventInfo(evento);
        } else {
          setError('Evento no encontrado.');
        }
      } catch (error) {
        console.error("Error al obtener el evento:", error.message);
        setError('Ocurrió un error al buscar el evento.');
      }
    };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Buscador de Evento</header>
      <div style={styles.inputContainer}>
        <input
          type="number"
          placeholder="Ingrese el ID del evento"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchEvent} style={styles.button}>
          Buscar Evento
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {userInfo && (
        <div style={styles.userInfo}>
          <p><strong>ID Usuario:</strong> {userInfo.idusuario}</p>
          <p><strong>Nombre:</strong> {userInfo.nombres}</p>
          <p><strong>{userInfo.tipo_documento === 'NIT' ? 'Encargado:' : 'Apellido:'}</strong> {userInfo.apellidos}</p>
          <p><strong>Correo:</strong> {userInfo.correo}</p>
        </div>
      )}
      {/* Mostrar los checkboxes para los roles */}
      {roles.length > 0 && userInfo && (
        <div style={styles.rolesContainer}>
          <h3>Asignar Roles al Usuario</h3>
          {roles.map(role => (
            <div key={role.id} style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`role-${role.idroles}`}
                checked={selectedRoles.includes(role.idroles)} // Si el id del rol está en selectedRoles, lo selecciona
                onChange={() => handleRoleChange(role.idroles)}
                style={styles.checkbox}
              />
              <label htmlFor={`role-${role.idroles}`} style={styles.label}>{role.nombre_rol}</label>
            </div>
        ))}
            {/* Botones de guardar y salir */}
            <div style={styles.buttonContainer}>
                <button onClick={handleSave} style={styles.saveButton}>
                Guardar
                </button>
                <button onClick={handleExitWithoutSaving} style={styles.exitButton}>
                Salir sin guardar
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ConfiguradorEventos;