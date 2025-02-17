import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { 
  getProductosByNombre, 
  updateProducto, 
  createProducto, 
  deleteProducto
} from '../../Ctrl/ProductoCtrl';
import { getFotoProducto, uploadFotoProducto } from '../../API/StorageAPI'; // Ajusta la ruta según tu proyecto

const ConfiguradorProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productoInfo, setProductoInfo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para almacenar la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);

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
      console.error('Error al buscar productos por nombre:', error.message);
      setError('Ocurrió un error al buscar productos.');
    }
  };

  const handleSelectProducto = (producto) => {
    setProductoInfo(producto);
    setProductos([]); // Oculta la lista de productos
  };

  const handleCreateNew = () => {
    // Se abre el formulario con valores iniciales vacíos
    setProductoInfo({
      nombre: '',
      descripcion: '',
      precio: 0,
      foto: ''
    });
    setError('');
    setSuccessMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validación para precio (2 decimales, no negativo)
    if (name === 'precio') {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (!regex.test(value) && value !== '') return;
      const parsedValue = parseFloat(value) || 0;
      if (parsedValue < 0) return;
      setProductoInfo(prev => ({ ...prev, [name]: parsedValue }));
      return;
    }
    setProductoInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Se redimensiona la imagen para que su lado más largo sea de 300px
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (resizedBlob) => {
        // Se crea una URL de vista previa a partir del blob redimensionado
        const previewUrl = URL.createObjectURL(resizedBlob);
        setProductoInfo(prev => ({ ...prev, foto: previewUrl }));
        // Se guarda el blob para su posterior subida a Supabase
        setNewFoto(resizedBlob);
      },
      'blob'
    );
  };

  const handleSave = async () => {
    if (!productoInfo) return;
    try {
      let updatedInfo = { ...productoInfo };

      if (productoInfo.idproducto) {
        // Producto existente: actualizar
        if (newFoto) {
          await uploadFotoProducto(productoInfo.idproducto, newFoto);
          const newUrl = await getFotoProducto(productoInfo.idproducto);
          updatedInfo.foto = newUrl;
        }
        await updateProducto(productoInfo.idproducto, updatedInfo);
        setSuccessMsg('Producto actualizado exitosamente.');
      } else {
        // Nuevo producto: crear
        const createdProduct = await createProducto(updatedInfo);
        if (newFoto) {
          await uploadFotoProducto(createdProduct.idproducto, newFoto);
          const newUrl = await getFotoProducto(createdProduct.idproducto);
          updatedInfo.foto = newUrl;
        }
        // Se actualiza el producto recién creado con la URL de la foto (si se subió)
        await updateProducto(createdProduct.idproducto, updatedInfo);
        setSuccessMsg('Producto creado exitosamente.');
      }
      setNewFoto(null);
      setProductoInfo(null);
    } catch (error) {
      console.error('Error al guardar el producto:', error.message);
      setError('Ocurrió un error al guardar el producto.');
    }
  };

  const handleExitWithoutSaving = () => {
    setProductoInfo(null);
    setSuccessMsg('');
    setError('');
    setNewFoto(null);
  };

  const handleDelete = async () => {
    if (!productoInfo) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      try {
        await deleteProducto(productoInfo.idproducto);
        setSuccessMsg('Producto eliminado exitosamente.');
        setProductoInfo(null);
        setNewFoto(null);
      } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        setError('Ocurrió un error al eliminar el producto.');
      }
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
        <button onClick={handleCreateNew} style={{ ...styles.button, marginTop: '10px' }}>
          Crear Nuevo Producto
        </button>
      </div>

      {error && <span style={styles.error}>{error}</span>}
      {successMsg && <span style={styles.success}>{successMsg}</span>}

      {productoInfo ? (
        <div style={styles.productoInfo}>
          <h3 style={styles.title}>
            {productoInfo.idproducto ? 'Editando Producto' : 'Creando Nuevo Producto'}
          </h3>

          <p style={styles.label}>Nombre:</p>
          <input
            type="text"
            name="nombre"
            value={productoInfo.nombre}
            onChange={handleChange}
            style={styles.input}
          />

          <p style={styles.label}>Descripción:</p>
          <div
            name="descripcion"
            contentEditable="true"
            onInput={(e) => handleChange({ target: { name: 'descripcion', value: e.currentTarget.textContent } })}
            style={styles.inputEditable}
          >
            {productoInfo.descripcion}
          </div>

          <p style={styles.label}>Precio:</p>
          <input
            type="number"
            name="precio"
            value={productoInfo.precio}
            onChange={handleChange}
            style={styles.input}
            step="0.01"
          />

          <p style={styles.label}>Foto:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {productoInfo.foto && (
            <img
              src={productoInfo.foto}
              alt="Preview"
              style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '4px' }}
            />
          )}

          <div style={styles.buttonContainer}>
            <button onClick={handleSave} style={styles.saveButton}>
              Guardar
            </button>
            <button onClick={handleExitWithoutSaving} style={styles.exitButton}>
              Salir sin guardar
            </button>
            {productoInfo.idproducto && (
              <button onClick={handleDelete} style={styles.deleteButton}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      ) : (
        productos.length > 0 && (
          <div>
            {productos.map((producto) => (
              <div
                key={producto.idproducto}
                style={styles.productoItem}
                onClick={() => handleSelectProducto(producto)}
              >
                <span>
                  <strong>{producto.nombre}</strong> - {producto.descripcion} - ${producto.precio}
                  <button style={styles.button}>Seleccionar</button>
                </span>
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
    padding: '10px',
    maxWidth: '500px',
    margin: '0 auto',
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
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    overflowWrap: 'break-word',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    height: '120px', // Aunque es inusual tener un input tan alto, se usará según tus requerimientos.
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#800000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  deleteButton: {
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
  productoItem: {
    padding: '5px',
    borderBottom: '1px solid #ccc',
    marginBottom: '5px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  inputEditable: {
    width: '100%',
    minHeight: '120px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    overflowWrap: 'break-word',
    fontSize: '16px',
    textAlign: 'left',
  },
  
};

export default ConfiguradorProductos;
