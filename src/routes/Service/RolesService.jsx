import React, { useState, useEffect } from 'react';
import { getUsuarioByID } from '../../Ctrl/UsuarioCtrl';
import { getAllRoles } from '../../Ctrl/RolCtrl'; // Asegúrate de que esta ruta sea correcta
import { getRolByUser, updateAccesos } from '../../Ctrl/AccesosCtrl';
import "./RolesServiceStyles.css";
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
    <div className="fullConfig-container">
      <div className="configurador-roles-container">
        <h2 className="configurador-roles-header">Buscador de Usuario</h2>
        <div className="configurador-roles-input-container">
          <input
            type="text"
            placeholder="Ingrese el ID del usuario"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="configurador-roles-input"
          />
          <button onClick={handleSearchUser} className="configurador-roles-button">
            Buscar Usuario
          </button>
        </div>
        {error && <p className="configurador-roles-error">{error}</p>}
        {userInfo && (
          <div className="configurador-roles-user-info">
            <p><strong>ID Usuario:</strong> {userInfo.idusuario}</p>
            <p><strong>Nombre:</strong> {userInfo.nombres}</p>
            <p><strong>{userInfo.tipo_documento === 'NIT' ? 'Encargado:' : 'Apellido:'}</strong> {userInfo.apellidos}</p>
            <p><strong>Correo:</strong> {userInfo.correo}</p>
          </div>
        )}
        {roles.length > 0 && userInfo && (
          <div className="configurador-roles-roles-container">
            <div className="config-roles-roles-text">
              <h3>Asignar Roles al Usuario</h3>
              <div className="configurador-roles-checkbox-container">
                {roles.map(role => (
                  <div key={role.id} className="configurador-roles-checkbox-content">
                    <div className="basic-input-checkbox-container"><input
                      type="checkbox"
                      id={`role-${role.idroles}`}
                      checked={selectedRoles.includes(role.idroles)}
                      onChange={() => handleRoleChange(role.idroles)}
                      className="basic-input-checkbox"
                    /></div>
                    <label htmlFor={`role-${role.idroles}`} className="configurador-roles-label">{role.nombre_rol}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="configurador-roles-button-container">
              <button onClick={handleSave} className="configurador-roles-save-button">
                Guardar
              </button>
              <button onClick={handleExitWithoutSaving} className="configurador-roles-exit-button">
                Salir sin guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguradorRoles;
