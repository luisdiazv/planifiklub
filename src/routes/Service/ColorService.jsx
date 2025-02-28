import React, { useState, useEffect } from 'react';
import {
  getBackupInfoClub,
  getActualNombreClubInfo,
  getActualDescripcionClubInfo,
  getActualColorList,
  updateActualInfoClub
} from '../../Ctrl/InformacionClubCtrl';
import {
  getActualLogoClub,
  uploadActualLogoClub,
  restoreBackupLogoClub,
  getBackupLogoClub
} from '../../API/StorageAPI';
import { handleAcceso } from '../../Util/AccessControl'
import './ColorServiceStyles.css';

const ConfiguradorPaginaClub = () => {
  const labelInfo = {
    colorName1: 'Color 1',
    colorDesc1: 'Descripción del color 1',
    colorName2: 'Color 2',
    colorDesc2: 'Descripción del color 2',
    colorName3: 'Color 3',
    colorDesc3: 'Descripción del color 3',
    colorName4: 'Color 4',
    colorDesc4: 'Descripción del color 4',
    colorName5: 'Color 5',
    colorDesc5: 'Descripción del color 5',
    colorName6: 'Color 6',
    colorDesc6: 'Descripción del color 6',
    colorName7: 'Color 7',
    colorDesc7: 'Descripción del color 7',
    colorName8: 'Color 8',
    colorDesc8: 'Descripción del color 8',
    colorName9: 'Color 9',
    colorDesc9: 'Descripción del color 9'
  };

  const initialClubInfo = {
    nombre: '',
    descripcion: '',
    color1: '#ffffff',
    color2: '#ffffff',
    color3: '#ffffff',
    color4: '#ffffff',
    color5: '#ffffff',
    color6: '#ffffff',
    color7: '#ffffff',
    color8: '#ffffff',
    color9: '#ffffff'
  };

  const [clubInfo, setClubInfo] = useState(initialClubInfo);
  const [newLogo, setNewLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cargar el logo actual al montar el componente
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = await getActualLogoClub();
        setCurrentLogo(url);
      } catch (err) {
        console.error("Error al obtener el logo actual:", err.message);
      }
    };
    fetchLogo();
  }, []);

  // Cargar la información actual del club (nombre, descripción y colores) al montar el componente
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const nombre = await getActualNombreClubInfo();
        const descripcion = await getActualDescripcionClubInfo();
        const coloresArray = await getActualColorList();

        setClubInfo({
          nombre: nombre || '',
          descripcion: descripcion || '',
          color1: coloresArray[0] || '#ffffff',
          color2: coloresArray[1] || '#ffffff',
          color3: coloresArray[2] || '#ffffff',
          color4: coloresArray[3] || '#ffffff',
          color5: coloresArray[4] || '#ffffff',
          color6: coloresArray[5] || '#ffffff',
          color7: coloresArray[6] || '#ffffff',
          color8: coloresArray[7] || '#ffffff',
          color9: coloresArray[8] || '#ffffff'
        });
      } catch (error) {
        console.error("Error al cargar la información del club:", error);
        window.alert("Error al cargar la información del club");
      }
    };

    fetchClubInfo();
  }, []);

  useEffect(() => {
    const verificarAcceso = async () => {
        const acceso = await handleAcceso(9);
        // Si no hay acceso, se asume que handleAcceso redirige a /404
        if (!acceso) {
            return;
        }
    };
    verificarAcceso();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validar que el archivo sea .svg
    if (file.type !== 'image/svg+xml') {
      window.alert('Solo se permiten imágenes SVG.');
      return;
    }
    setError('');
    const previewUrl = URL.createObjectURL(file);
    setPreviewLogo(previewUrl);
    setNewLogo(file);
  };

  const handleSave = async () => {
    const colors = [
      clubInfo.color1,
      clubInfo.color2,
      clubInfo.color3,
      clubInfo.color4,
      clubInfo.color5,
      clubInfo.color6,
      clubInfo.color7,
      clubInfo.color8,
      clubInfo.color9,
    ];

    try {
      console.log("Colores: ", colors);
      // Se actualiza la información del club (nombre, descripción y colores)
      const updateResponse = await updateActualInfoClub(
        clubInfo.nombre,
        clubInfo.descripcion,
        colors
      );
      console.log('Información del club actualizada:', updateResponse);

      // Si se seleccionó un nuevo logo, se sube
      if (newLogo) {
        const uploadResult = await uploadActualLogoClub(newLogo);
        console.log("Logo actualizado:", uploadResult);
      }

      console.log('Guardando configuración del club:', clubInfo, newLogo);
      window.alert('Configuración guardada exitosamente.');
    } catch (err) {
      window.alert(err.message);
    }

    console.log('INFO:', clubInfo);
    window.location.reload();
  };

  const handleReset = async () => {
    try {
      const backupData = await getBackupInfoClub();
      const coloresArray = backupData.colores.split("%%");
      setClubInfo({
        nombre: backupData.nombre_club || '',
        descripcion: backupData.descripcion_club || '',
        color1: coloresArray[0] || '#ffffff',
        color2: coloresArray[1] || '#ffffff',
        color3: coloresArray[2] || '#ffffff',
        color4: coloresArray[3] || '#ffffff',
        color5: coloresArray[4] || '#ffffff',
        color6: coloresArray[5] || '#ffffff',
        color7: coloresArray[6] || '#ffffff',
        color8: coloresArray[7] || '#ffffff',
        color9: coloresArray[8] || '#ffffff'
      });

      // Restaurar el logo de respaldo y actualizar el logo actual en el almacenamiento
      await restoreBackupLogoClub();
      const newLogoUrl = await getActualLogoClub();
      setCurrentLogo(newLogoUrl);

      setNewLogo(null);
      setPreviewLogo(null);
      window.alert('Información de respaldo cargada y guardada correctamente.');
    } catch (error) {
      console.error("Error al restaurar información de respaldo:", error);
      window.alert("Error al restaurar la información de respaldo");
    }
  };

  const handleCancel = () => {
    console.log('Operación cancelada.');
    window.location.href = "/app";
  };

  return (
    <div className="full-color-container">
      <div className="container">
        <h2 className="header">Configurador de Página del Club</h2>

        {error && <span className="error">{error}</span>}
        {successMsg && <span className="success">{successMsg}</span>}

        <div className="productoInfo">
          <div className="productoInfo-section">
            <label className="label">Nombre del Club:</label>
            <input
              type="text"
              name="nombre"
              value={clubInfo.nombre}
              onChange={handleChange}
              className="input"
            />

            <label className="label">Descripción del Club (opcional):</label>
            <textarea
              name="descripcion"
              value={clubInfo.descripcion}
              onChange={handleChange}
              className="textarea"
            />
          </div>
          <div className="productoInfo-section">
            <label className="label">Configuración de Colores:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array.from({ length: 9 }, (_, i) => {
                const index = i + 1;
                return (
                  <div key={`color${index}`} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <div>
                      <label className="subTitle">{labelInfo[`colorName${index}`]}</label>
                    </div>
                    <div>
                      <label className="subDescription">{labelInfo[`colorDesc${index}`]}</label>
                      <input
                        type="color"
                        name={`color${index}`}
                        value={clubInfo[`color${index}`]}
                        onChange={handleChange}
                        className="input"
                        style={{ padding: '0', height: '40px' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="productoInfo-section">
            <label className="label">Logo del Club (.svg):</label>
            {previewLogo ? (
              <img className='preview-color-img'
                src={previewLogo}
                alt="Preview Logo"
              />
            ) : currentLogo ? (
              <img className='preview-color-img'
                src={currentLogo}
                alt="Logo Actual"
              />
            ) : null}
            <input
              type="file"
              accept=".svg"
              onChange={handleLogoChange}
              className="input"
            />

          </div>
          <div className="buttonContainer">
            <button onClick={handleSave} className="saveButton">
              Guardar
            </button>
            <button onClick={handleCancel} className="cancelButton">
              Salir sin guardar
            </button>
            <div>
              <button onClick={handleReset} className="exitButton">
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguradorPaginaClub;
