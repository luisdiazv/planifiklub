import React, { useState, useEffect } from 'react';
import { getUsuarioByID, updateUsuario } from '../../Ctrl/UsuarioCtrl';  // Asegúrate de que la ruta sea correcta

const ConfiguradorSocio = () => {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSocio, setIsSocio] = useState(false); // Para almacenar si el usuario es socio o no
  const [error, setError] = useState('');

  // Función para buscar un usuario
  const handleSearchUser = async () => {
    setError('');
    setUserInfo(null);
    try {
      const user = await getUsuarioByID(userId);
      if (user) {
        setUserInfo(user);
        setIsSocio(user.socio); // Establecemos el valor de "socio" del usuario
      } else {
        setError('Usuario no encontrado.');
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error.message);
      setError('Ocurrió un error al buscar el usuario.');
    }
  };

  // Función para manejar el cambio del estado de socio
  const handleSocioChange = () => {
    setIsSocio(!isSocio); // Solo cambiar el estado local de "socio"
  };

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    try {
      const updates = { socio: isSocio }; // El valor de socio se obtiene del estado local
      console.log('Actualizando usuario :', userInfo);
      const { data, error } = await updateUsuario(userInfo.correo, updates); // Utilizamos updateUsuario
      if (error) {
        setError('Ocurrió un error al actualizar el estado de socio.');
        return;
      }
      setUserInfo(data); // Actualizamos la información del usuario
      setError('Estado de socio actualizado exitosamente.');
    } catch (error) {
      setError('Ocurrió un error al guardar los cambios.');
    }
  };

  const handleExitWithoutSaving = () => {
    setUserInfo(null);
    setError('');
    setIsSocio(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Socio</header>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ingrese el ID del usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchUser} style={styles.button}>
          Buscar Usuario
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
      {/* Mostrar el checkbox para el estado de socio */}
      {userInfo && (
        <div style={styles.rolesContainer}>
          <h3>¿Es socio?</h3>
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="isSocio"
              checked={isSocio} // Si el usuario es socio, el checkbox estará marcado
              onChange={handleSocioChange}
              style={styles.checkbox}
            />
            <label htmlFor="isSocio" style={styles.label}>
              Marcar como socio
            </label>
          </div>
          {/* Botones de guardar y salir */}
          <div style={styles.buttonContainer}>
            <button onClick={handleSaveChanges} style={styles.saveButton}>
              Guardar cambios
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

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#800000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  userInfo: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
  },
  rolesContainer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  checkbox: {
    marginRight: '10px',
  },
  label: {
    fontSize: '14px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  exitButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ConfiguradorSocio;
