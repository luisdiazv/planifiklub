import React, { useState, useEffect } from 'react';
import { getUsuariosByBusqueda, updateUsuario } from '../../Ctrl/UsuarioCtrl';
import { getAllRoles } from '../../Ctrl/RolCtrl';
import { getRolByUser, updateAccesos } from '../../Ctrl/AccesosCtrl';
import "./UsuarioServiceStyles.css";
import { handleAcceso } from '../../Util/AccessControl';

const ConfiguradorUsuario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // Usuarios encontrados por búsqueda
  const [userInfo, setUserInfo] = useState(null); // Usuario seleccionado
  const [roles, setRoles] = useState([]); // Roles disponibles
  const [selectedRoles, setSelectedRoles] = useState([]); // Roles asignados al usuario
  const [isSocio, setIsSocio] = useState(false); // Estado de socio del usuario
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const verificarAcceso = async () => {
        const acceso = await handleAcceso(5);
        // Si no hay acceso, se asume que handleAcceso redirige a /404
        if (!acceso) {
            return;
        }
    };
    verificarAcceso();
}, []);

  // Cargar todos los roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const allRoles = await getAllRoles();
        if (allRoles && allRoles.length > 0) {
          setRoles(allRoles);
        }
      } catch (err) {
        console.error("Error al obtener los roles:", err.message);
        window.alert("Ocurrió un error al obtener los roles.");
      }
    };
    fetchRoles();
  }, []);

  // Buscar usuarios por nombre, apellidos, correo o documento
  const handleSearchUser = async () => {
    setError('');
    setSuccessMsg('');
    setUserInfo(null);
    try {
      const results = await getUsuariosByBusqueda(searchTerm);
      if (results && results.length > 0) {
        setUsers(results);
      } else {
        setUsers([]);
        window.alert("No se encontraron usuarios con ese criterio.");
      }
    } catch (err) {
      console.error("Error al buscar usuario:", err.message);
      window.alert("Ocurrió un error al buscar el usuario.");
    }
  };

  // Al seleccionar un usuario se cargan sus datos y roles asignados
  const handleSelectUser = async (user) => {
    setUserInfo(user);
    setUsers([]); // Oculta la lista de usuarios
    setSearchTerm(''); // Limpia el campo de búsqueda
    setIsSocio(user.socio);
    try {
      const userRoles = await getRolByUser(user.idusuario);
      const userRoleIds = userRoles.map(role => role.id_rol || role.idroles);
      setSelectedRoles(userRoleIds);
    } catch (err) {
      console.error("Error al obtener roles del usuario:", err.message);
      setSelectedRoles([]);
    }
  };

  // Manejo de selección/deselección de roles
  const handleRoleChange = (roleId) => {
    setSelectedRoles(prevSelected =>
      prevSelected.includes(roleId)
        ? prevSelected.filter(id => id !== roleId)
        : [...prevSelected, roleId]
    );
  };

  // Maneja el cambio del estado de socio
  const handleSocioChange = () => {
    setIsSocio(!isSocio);
  };

  // Guarda los cambios (roles y estado de socio)
  const handleSave = async () => {
    if (!userInfo) return;
    try {
      await updateAccesos(userInfo.idusuario, selectedRoles);
      await updateUsuario(userInfo.correo, { socio: isSocio });
      window.alert("Usuario actualizado exitosamente.");
      // Reinicia estados
      setUserInfo(null);
      setSelectedRoles([]);
      setIsSocio(false);
    } catch (err) {
      console.error("Error al guardar los cambios:", err.message);
      window.alert("Ocurrió un error al guardar los cambios.");
    }
  };

  // Reinicia el formulario sin guardar cambios
  const handleExitWithoutSaving = () => {
    setUserInfo(null);
    setUsers([]);
    setSearchTerm('');
    setSelectedRoles([]);
    setIsSocio(false);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="fullConfig-container">
      <div className="configurador-roles-container">
        <h2 className="configurador-roles-header">Configurador de Usuario</h2>

        <div className="configurador-roles-input-container">
          <input
            type="text"
            placeholder="Ingrese nombre, apellidos, correo o documento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="configurador-roles-input"
          />
          <button onClick={handleSearchUser} className="configurador-roles-button">
            Buscar Usuario
          </button>
        </div>

        {error && <p className="configurador-roles-error">{error}</p>}

        {userInfo ? (
          <div className="configurador-roles-user-info">
            <div className="config-roles-roles-text">
                <h3>Información del usuario</h3>
            </div>
            <label><strong>Nombre:</strong> {userInfo.nombres}</label>
            <label>
              <strong>
                {userInfo.tipo_documento === 'NIT' ? 'Encargado:' : 'Apellido:'}
              </strong> {userInfo.apellidos}
              </label>
            <label><strong>Correo:</strong> {userInfo.correo}</label>
            <label><strong>Tipo de documento:</strong> {userInfo.tipo_documento}</label>
            <label><strong>Documento:</strong> {userInfo.documento}</label>

            {/* Sección para asignar roles */}
            <div className="configurador-roles-roles-container">
              <div className="config-roles-roles-text">
                <h3>Asignar Roles al Usuario</h3>
              </div>
              <div className="configurador-roles-checkbox-container">
                {roles.map(role => (
                  <div key={role.idroles || role.id} className="configurador-roles-checkbox-content">
                    <div className="basic-input-checkbox-container">
                      <input
                        type="checkbox"
                        id={`role-${role.idroles || role.id}`}
                        checked={selectedRoles.includes(role.idroles || role.id)}
                        onChange={() => handleRoleChange(role.idroles || role.id)}
                        className="basic-input-checkbox"
                      />
                    </div>
                    <label htmlFor={`role-${role.idroles || role.id}`}>
                      {role.nombre_rol}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección para configurar el estado de socio */}
            <div className="configurador-roles-roles-container">
              <div className="config-roles-roles-text">
                <h3>Configuración de Socio</h3>
              </div>
              <div className="configurador-roles-checkbox-container">
                <div className="configurador-roles-checkbox-content">
                  <div className="basic-input-checkbox-container">
                    <input
                      type="checkbox"
                      id="isSocio"
                      checked={isSocio}
                      onChange={handleSocioChange}
                      className="basic-input-checkbox"
                    />
                  </div>
                  <label htmlFor="isSocio">Marcar como socio</label>
                </div>
              </div>
            </div>

            <div className="configurador-roles-button-container">
              <button onClick={handleSave} className="configurador-roles-save-button">
                Guardar Cambios
              </button>
              <button onClick={handleExitWithoutSaving} className="configurador-roles-exit-button">
                Salir sin guardar
              </button>
            </div>
          </div>
        ) : (
          users.length > 0 && (
            <div className="configurador-roles-user-info">
              {users.map(user => (
                <div key={user.idusuario} className="configurador-roles-user-item">
                  <div className="configurador-roles-user-item-content">
                    <label>{user.nombres} {user.apellidos}</label>
                    <></>
                    <label>Correo: {user.correo}</label>
                    <></>
                    <label>Documento: {user.documento}</label>
                    <button
                      className="configurador-roles-button"
                      onClick={() => handleSelectUser(user)}
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConfiguradorUsuario;
