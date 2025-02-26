import React, { useState } from 'react';
import { getUsuarioByID, updateUsuario } from '../../Ctrl/UsuarioCtrl';
import "./MemberServiceStyles.css";

const ConfiguradorSocio = () => {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSocio, setIsSocio] = useState(false);
  const [error, setError] = useState('');

  const handleSearchUser = async () => {
    setError('');
    setUserInfo(null);
    try {
      const user = await getUsuarioByID(userId);
      if (user) {
        setUserInfo(user);
        setIsSocio(user.socio);
      } else {
        window.alert('Usuario no encontrado.');
      }
    } catch (error) {
      window.alert('Ocurrió un error al buscar el usuario.');
    }
  };

  const handleSocioChange = () => {
    setIsSocio(!isSocio);
  };

  const handleSaveChanges = async () => {
    try {
      const updates = { socio: isSocio };
      const { data, error } = await updateUsuario(userInfo.correo, updates);
      if (error) {
        window.alert('Ocurrió un error al actualizar el estado de socio.');
        return;
      }
      setUserInfo(data);
      window.alert('Estado de socio actualizado exitosamente.');
    } catch (error) {
      window.alert('Ocurrió un error al guardar los cambios.');
    }
  };

  const handleExitWithoutSaving = () => {
    setUserInfo(null);
    setError('');
    setIsSocio(false);
  };

  return (
    <div className="fullSocio-container">
      <div className="configurador-socio">
        <h2 className="configurador-header">Configurador de Socio</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Ingrese el ID del usuario"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSearchUser} className="button">
            Buscar Usuario
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {userInfo && (
          <div className="user-info">
            <p><strong>ID Usuario:</strong> {userInfo.idusuario}</p>
            <p><strong>Nombre:</strong> {userInfo.nombres}</p>
            <p><strong>{userInfo.tipo_documento === 'NIT' ? 'Encargado:' : 'Apellido:'}</strong> {userInfo.apellidos}</p>
            <p><strong>Correo:</strong> {userInfo.correo}</p>
          </div>
        )}
        {userInfo && (
          <div className="roles-container">
            <div className="roles-content">
              <h3>¿Es socio?</h3>
              <div className="checkbox-container">
                <div className="basic-input-checkbox-container">
                  <input
                    type="checkbox"
                    id="isSocio"
                    checked={isSocio}
                    onChange={handleSocioChange}
                    className="basic-input-checkbox"
                  />
                </div>

                <label htmlFor="isSocio" className="label">
                  Marcar como socio
                </label>
              </div></div>

            <div className="button-container">
              <button onClick={handleSaveChanges} className="save-button">
                Guardar cambios
              </button>
              <button onClick={handleExitWithoutSaving} className="exit-button">
                Salir sin guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default ConfiguradorSocio;