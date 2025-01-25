import React, { useState, useEffect } from 'react';
import { getUsuarioByID } from '../../Ctrl/UsuarioCtrl';
import { getAllRoles } from '../../Ctrl/RolCtrl'; // Asegúrate de que esta ruta sea correcta
import { getRolByUser, updateAccesos } from '../../Ctrl/AccesosCtrl';

const ConfiguradorRoles = () => {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState([]); // Para almacenar todos los roles
  const [selectedRoles, setSelectedRoles] = useState([]); // Para almacenar los roles seleccionados
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const allRoles = await getAllRoles();
        if (allRoles && allRoles.length > 0) {
          setRoles(allRoles);
          console.log("Roles obtenidos:", allRoles);
        }
      } catch (error) {
        console.error("Error al obtener los roles:", error.message);
        setError('Ocurrió un error al obtener los roles.');
      }
    };

    fetchRoles();
  }, []);

  // Función para buscar un usuario
  const handleSearchUser = async () => {
    setError('');
    setUserInfo(null);
    try {
      const user = await getUsuarioByID(userId);
      if (user) {
        setUserInfo(user);
        const userRoles = await getRolByUser(userId);
        const userRoleIds = userRoles.map(role => role.id_rol);
        setSelectedRoles(userRoleIds); // Establecemos los roles seleccionados para el usuario
      } else {
        setError('Usuario no encontrado.');
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error.message);
      setError('Ocurrió un error al buscar el usuario.');
    }
  };

  // Función para manejar la selección/deselección de roles
  const handleRoleChange = (roleId) => {
    setSelectedRoles(prevSelectedRoles =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter(id => id !== roleId) // Elimina el rol si ya está seleccionado
        : [...prevSelectedRoles, roleId] // Agrega el rol si no está seleccionado
    );
  };

  // Función para guardar los cambios
  const handleSave = () => {
    console.log("Guardando roles:", selectedRoles);
    updateAccesos(userId, selectedRoles);
    setError('Roles guardados exitosamente.');
  };

  const handleExitWithoutSaving = () => {
    setSelectedRoles([]);
    setUserInfo(null);
    setError('');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Buscador de Usuario</header>
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

export default ConfiguradorRoles;
