import React, { useState, useEffect } from "react";
import { getAllProducto } from "../../Ctrl/ProductoCtrl";
import { getFotoProducto, uploadFotoProducto } from "../../API/StorageAPI";
import './OurServicesStyles.css';

const OurProducts = () => {
    const [products, setProducts] = useState([]);
    const [productQuantities, setProductQuantities] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [extraServices, setExtraServices] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
          try {
            await getProductos(); // Llamada solo una vez al montar el componente
          } catch (error) {
            console.error('Error fetching productos:', error);
          }
        };

        fetchProductos(); // Llamamos a fetchProductos una vez al montar el componente
    }, []); // Dependencia vacía para que solo se ejecute una vez al montar

    const getProductos = async () => {
        const Productos = await getAllProducto();
        
        // Obtener la URL pública para cada imagen del producto
        const processedProducts = await Promise.all(Productos.map(async (product) => {
            const imagenUrl = await getFotoProducto(product.idproducto); // Obtener URL de la imagen desde Supabase
            return {
                ...product,
                imagenUrl
            };
        }));

        setProducts(processedProducts); // Actualizar el estado con los productos procesados
    };

    const handleQuantityChange = (productId, quantity) => {
        if (selectedProducts[productId]) {
            setProductQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities, [productId]: quantity };
                calculateTotalPrice(newQuantities);
                return newQuantities;
            });
        }
    };

    const handleCheckboxChange = (productId, isSelected) => {
        setSelectedProducts((prevSelected) => {
            const newSelected = { ...prevSelected, [productId]: isSelected };
            if (!isSelected) {
                setProductQuantities((prevQuantities) => {
                    const newQuantities = { ...prevQuantities, [productId]: 0 };
                    calculateTotalPrice(newQuantities);
                    return newQuantities;
                });
            } else {
                calculateTotalPrice(productQuantities);
            }
            return newSelected;
        });
    };

    const calculateTotalPrice = (quantities) => {
        let total = 0;
        products.forEach(product => {
            if (selectedProducts[product.idproducto]) {
                total += (quantities[product.idproducto] || 0) * product.precio;
            }
        });
        setTotalPrice(total);
    };

    const handleBuy = () => {
        setShowSummary(true);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (file && file.type.startsWith("image/")) {
            try {
                await uploadFotoProducto(1, file); // Subir la foto para el producto con id 1
                alert("Foto subida con éxito");
            } catch (error) {
                console.error("Error al subir la foto:", error);
                alert("Hubo un error al subir la foto");
            }
        } else {
            alert("Por favor, selecciona una imagen válida");
        }
    };

    return (
        <div className="card-product-container">
            <div className="card-product">
                <h3>Productos Disponibles</h3>
                {products.map((product) => (
                    <div key={product.idproducto} className="card" style={{ border: "3px solid black", padding: "10px", margin: "10px 0" }}>
                        <img src={product.imagenUrl} alt={product.nombre} className="product-image" />
                        <div className="product-details">
                            <h4>{product.nombre}</h4>
                            <p>{product.descripcion}</p>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts[product.idproducto] || false}
                                    onChange={(e) => handleCheckboxChange(product.idproducto, e.target.checked)}
                                />
                                Seleccionar - {product.precio} $
                            </label>
                            {selectedProducts[product.idproducto] && (
                                <input
                                    type="number"
                                    min="0"
                                    value={productQuantities[product.idproducto] || 0}
                                    onChange={(e) => handleQuantityChange(product.idproducto, parseInt(e.target.value) || 0)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurProducts;
