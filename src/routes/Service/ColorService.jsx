import React, { useState } from 'react';
import { getColors, setColors } from '../../Util/Colors';
import { restoreBackup } from '../../Ctrl/InformacionClubCtrl';

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
  }
  
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
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validar que el archivo sea .svg
    if (file.type !== 'image/svg+xml') {
      setError('Solo se permiten imágenes SVG.');
      return;
    }
    setError('');
    const previewUrl = URL.createObjectURL(file);
    setPreviewLogo(previewUrl);
    setNewLogo(file);
  };

  const handleSave = () => {
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
      setColors(colors);
      console.log("aaa",getColors());
      console.log('Guardando configuración del club:', clubInfo, newLogo);
      setSuccessMsg('Configuración guardada exitosamente.');
    } catch (err) {
      setError(err.message);
    }
    
    console.log('INFO:', clubInfo);
  };

  const handleReset = async () => {
    await restoreBackup();
    setNewLogo(null);
    window.location.reload();
  };

  const handleCancel = () => {
    console.log('Operación cancelada.');
    window.location.href = "/app";
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Página del Club</header>

      {error && <span style={styles.error}>{error}</span>}
      {successMsg && <span style={styles.success}>{successMsg}</span>}

      <div style={styles.productoInfo}>
        <p style={styles.label}>Nombre del Club:</p>
        <input
          type="text"
          name="nombre"
          value={clubInfo.nombre}
          onChange={handleChange}
          style={styles.input}
        />

        <p style={styles.label}>Descripción del Club (opcional):</p>
        <textarea
          name="descripcion"
          value={clubInfo.descripcion}
          onChange={handleChange}
          style={styles.textarea}
        />

        <p style={styles.label}>Configuración de Colores:</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: 9 }, (_, i) => {
            const index = i + 1;
            return (
              <div key={`color${index}`} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div>
                  <label style={styles.subTitle}>{labelInfo[`colorName${index}`]}</label>
                </div>
                <div>
                  <label style={styles.subDescription}>{labelInfo[`colorDesc${index}`]}</label>
                  <input
                    type="color"
                    name={`color${index}`}
                    value={clubInfo[`color${index}`]}
                    onChange={handleChange}
                    style={{ ...styles.input, padding: '0', height: '40px' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p style={styles.label}>Logo del Club (.svg):</p>
        <input
          type="file"
          accept=".svg"
          onChange={handleLogoChange}
          style={styles.input}
        />
        {previewLogo && (
          <img
            src={previewLogo}
            alt="Preview Logo"
            style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '4px' }}
          />
        )}

        <div style={styles.buttonContainer}>
          <button onClick={handleSave} style={styles.saveButton}>
            Guardar
          </button>
          <button onClick={handleCancel} style={styles.cancelButton}>
            Salir sin guardaar
          </button>
          <div>
            <button onClick={handleReset} style={styles.exitButton}>
                Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    margin: '0 auto',
    width: '100%',
    maxWidth: '600px',
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
  label: {
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: '10px',
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
    marginBottom: '10px',
    resize: 'none',
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
  cancelButton: {
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  subTitle: {
    margin: '0 0 2px 0',
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#555'
  },
  subDescription: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#555'
  },
};

export default ConfiguradorPaginaClub;
