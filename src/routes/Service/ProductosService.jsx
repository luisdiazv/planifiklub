import React, { useState } from 'react';
import { getProductosByNombre, updateProducto } from '../../Ctrl/ProductoCtrl';

const ConfiguradorProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productoInfo, setProductoInfo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearchByNombre = async () => {
    setError('');
    setSuccessMsg('');
    setProductoInfo(null);
    try {
      const filteredProductos = await getProductosByNombre(searchTerm);
      if (filteredProductos && filteredProductos.length > 0) {
        setProductos(filteredProductos);
      } else {
        setProductos([]);
        setError('No se encontraron productos con ese nombre.');
      }
    } catch (error) {
      console.error("Error al buscar productos por nombre:", error.message);
      setError('Ocurrió un error al buscar productos.');
    }
  };

  const handleSelectProducto = (producto) => {
    setProductoInfo(producto);
    setProductos([]); // Oculta la lista de productos
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!productoInfo) return;
    try {
      await updateProducto(productoInfo.idproducto, productoInfo);
      setSuccessMsg('Producto actualizado exitosamente.');
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      setError('Ocurrió un error al actualizar el producto.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Configurador de Productos</header>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ingrese el nombre del producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchByNombre} style={styles.button}>
          Buscar
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}
      
      {productoInfo ? (
        <div style={styles.productoInfo}>
          <h3>Editando Producto</h3>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={productoInfo.nombre}
            onChange={handleChange}
            style={styles.input}
          />
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={productoInfo.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={productoInfo.precio}
            onChange={handleChange}
            style={styles.input}
          />
          <label>Foto (URL):</label>
          <input
            type="text"
            name="foto"
            value={productoInfo.foto}
            onChange={handleChange}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleSave} style={styles.saveButton}>
              Guardar
            </button>
          </div>
        </div>
      ) : (
        productos.length > 0 && (
          <div>
            {productos.map(producto => (
              <div 
                key={producto.idproducto} 
                style={styles.productoItem}
                onClick={() => handleSelectProducto(producto)}
              >
                <p>
                  <strong>{producto.nombre}</strong> - {producto.descripcion} - ${producto.precio}
                  <button style={styles.button}>
                    Seleccionar
                  </button>
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#800000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px'
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '20px'
  },
  productoInfo: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  productoItem: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    cursor: 'pointer'
  }
};

export default ConfiguradorProductos;
