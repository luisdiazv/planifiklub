import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';

import {
  getProductosByNombre,
  updateProducto,
  createProducto,
  deleteProducto
} from '../../Ctrl/ProductoCtrl';
import { getFotoProducto, uploadFotoProducto } from '../../API/StorageAPI'; // Ajusta la ruta según tu proyecto
import "./ProductosServiceStyles.css";


const ConfiguradorProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productoInfo, setProductoInfo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para almacenar la imagen redimensionada (blob) que se subirá
  const [newFoto, setNewFoto] = useState(null);
  // Estado para almacenar la URL de _preview_ de la imagen (no se guarda en la BD)
  const [previewFoto, setPreviewFoto] = useState(null);

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
        window.alert('No se encontraron productos con ese nombre.');
      }
    } catch (error) {
      console.error('Error al buscar productos por nombre:', error.message);
      window.alert('Ocurrió un error al buscar productos.');
    }
  };

  const handleSelectProducto = async (producto) => {
    setProductoInfo(producto);
    setProductos([]); // Oculta la lista de productos
    // Opcional: obtener la foto existente desde storage para mostrarla en el preview
    try {
      const url = await getFotoProducto(producto.idproducto);
      setPreviewFoto(url);
    } catch (error) {
      console.error('Error al obtener la foto del producto:', error.message);
      setPreviewFoto(null);
    }
  };

  const handleCreateNew = () => {
    // Se abre el formulario con valores iniciales vacíos (sin campo foto)
    setProductoInfo({
      nombre: '',
      descripcion: '',
      precio: 0
    });
    setError('');
    setSuccessMsg('');
    setPreviewFoto(null);
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
        setPreviewFoto(previewUrl);
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
        await updateProducto(productoInfo.idproducto, updatedInfo);
        // Si se seleccionó una nueva foto, se sube de forma separada
        if (newFoto) {
          await uploadFotoProducto(productoInfo.idproducto, newFoto);
          // Opcional: se puede obtener la nueva URL para mostrarla en el preview
          const newUrl = await getFotoProducto(productoInfo.idproducto);
          setPreviewFoto(newUrl);
        }
        window.alert('Producto actualizado exitosamente.');
      } else {
        // Nuevo producto: crear
        const createdProduct = await createProducto(updatedInfo);
        // Si se seleccionó una foto, se sube
        if (newFoto) {
          await uploadFotoProducto(createdProduct.idproducto, newFoto);
          // Opcional: obtener la URL para mostrarla
          const newUrl = await getFotoProducto(createdProduct.idproducto);
          setPreviewFoto(newUrl);
        }
        window.alert('Producto creado exitosamente.');
      }
      // Reiniciamos los estados de foto y formulario
      setNewFoto(null);
      setProductoInfo(null);
      setProductos([]);
    } catch (error) {
      console.error('Error al guardar el producto:', error.message);
      window.alert('Ocurrió un error al guardar el producto.');
    }
  };

  const handleExitWithoutSaving = () => {
    setProductoInfo(null);
    setSuccessMsg('');
    setError('');
    setNewFoto(null);
    setPreviewFoto(null);
  };

  const handleDelete = async () => {
    if (!productoInfo) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      try {
        await deleteProducto(productoInfo.idproducto);
        window.alert('Producto eliminado exitosamente.');
        setProductoInfo(null);
        setNewFoto(null);
        setPreviewFoto(null);
      } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        window.alert('Ocurrió un error al eliminar el producto.');
      }
    }
  };

  return (
    <div className="fullProductServ-container">
      <div className="configurador-productos-container">
        <h2 className="configurador-productos-header">Configurador de Productos</h2>
        <div className="configurador-productos-input-container">
          <input type="text" placeholder="Ingrese el nombre del producto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="configurador-productos-input" />
          <button onClick={handleSearchByNombre} className="configurador-productos-button">Buscar</button>
          <button onClick={handleCreateNew} className="configurador-productos-button">Crear Nuevo Producto</button>
        </div>
        {error && <span className="configurador-productos-error">{error}</span>}
        {successMsg && <span className="configurador-productos-success">{successMsg}</span>}
        {productoInfo ? (
          <div className="configurador-productos-info">
            <h3>{productoInfo.idproducto ? 'Editando Producto' : 'Creando Nuevo Producto'}</h3>
            <div className="configurador-productos-info-section">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={productoInfo.nombre} onChange={handleChange} className="configurador-productos-input" />
            </div>
            <div className="configurador-productos-info-section">
              <label>Descripción:</label>
              <textarea name="descripcion" value={productoInfo.descripcion} onChange={handleChange} className="configurador-productos-textarea" />
            </div>
            <div className="configurador-productos-info-section">
              <label>Precio:</label>
              <input type="number" name="precio" value={productoInfo.precio} onChange={handleChange} className="configurador-productos-input" step="0.01" />
            </div>
            <div className="configurador-productos-info-section">
              <label>Foto:</label>
              <div className='configurador-productos-preview-img-container'>
                {previewFoto && <img src={previewFoto} alt="Preview" className="configurador-productos-preview-img" />}
              </div>

              <input type="file" accept="image/*" onChange={handleImageChange} className="configurador-productos-input-image" />
            </div>
            <div className="configurador-productos-button-container">
              <button onClick={handleSave} className="configurador-productos-save-button">Guardar</button>
              <button onClick={() => setProductoInfo(null)} className="configurador-productos-exit-button">Salir sin guardar</button>
              {productoInfo.idproducto && <button onClick={() => deleteProducto(productoInfo.idproducto)} className="configurador-productos-delete-button">Eliminar</button>}
            </div>
          </div>
        ) : (
          productos.length > 0 && productos.map((producto) => (
            <div key={producto.idproducto} className="configurador-productos-item" >
              <strong>{producto.nombre}</strong> * {producto.descripcion} - ${producto.precio}
              <button className="configurador-productos-button" onClick={() => handleSelectProducto(producto)}>Seleccionar </button>
            </div>
          ))
        )}
      </div>
    </div>

  );
};

export default ConfiguradorProductos;
