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
                await getProductos();
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const getProductos = async () => {
        const Productos = await getAllProducto();

        const processedProducts = await Promise.all(Productos.map(async (product) => {
            const imagenUrl = await getFotoProducto(product.idproducto);
            return {
                ...product,
                imagenUrl
            };
        }));

        setProducts(processedProducts);
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
            if (isSelected) {
                setProductQuantities((prevQuantities) => {
                    const newQuantities = { ...prevQuantities, [productId]: 1 };
                    calculateTotalPrice(newQuantities);
                    return newQuantities;
                });
            } else {
                setProductQuantities((prevQuantities) => {
                    const { [productId]: _, ...newQuantities } = prevQuantities;
                    calculateTotalPrice(newQuantities);
                    return newQuantities;
                });
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

    const seleccionFinal = () => {
        const newSelectedProducts = selectedProducts
        Object.keys(newSelectedProducts).forEach(key => {
            if (newSelectedProducts[key] === false) {
              delete newSelectedProducts[key];
            }
        });
        return newSelectedProducts;
    }

    const completitudDiccionarios = () => {
        let errores = [];
        for (let llave in seleccionFinal()) {
          if (!productQuantities.hasOwnProperty(llave)) {
            errores.push(llave);
          }
        }
        if (errores.length > 0) {
            throw new Error("Faltan productos por asignar cantidad: " + errores);
            }
      }

    const calcularSubtotales = () => {
        const subtotals = {};
        
        Object.keys(selectedProducts).forEach((productIdKey) => {
          if (selectedProducts[productIdKey]) { 
            const productId = parseInt(productIdKey, 10);
            const product = products.find((p) => p.idproducto === productId); 
            
            if (product) {
              const quantity = productQuantities[productIdKey] || 0; 
              const subtotal = quantity * product.precio; 
              subtotals[productId] = subtotal;
            }
          }
        });
        
        return subtotals;
    };

    const getStringPedidosAdicionales = () => {
        return extraServices.filter(item => item.trim() !== "").join("%%");
    }

    const handleDummy = (e) => {
        completitudDiccionarios();

        const pedido = {
            idpedido: null, //Se genera en la BD
            id_evento: null,//Se genera en la BD (response)
            fecha_pedido: new Date().toLocaleDateString("es-CO"),
            costo_total: totalPrice,
            pedidos_adicionales: getStringPedidosAdicionales()
        };

        const productoPedido = {
            idproducto_pedido: null, //Se genera en la BD
            id_pedido: null, //Se genera en la BD (response)
            id_producto: seleccionFinal(),
            cantidad: productQuantities,
            subtotal: calcularSubtotales(),
        };

        if (sessionStorage.getItem("pedidoDummy") != null) {
            sessionStorage.removeItem("pedidoDummy");
        }
        if (sessionStorage.getItem("productoPedidoDummy") != null) {
            sessionStorage.removeItem("productoPedidoDummy");
        }

        sessionStorage.setItem("pedidoDummy", JSON.stringify(pedido));
        sessionStorage.setItem("productoPedidoDummy", JSON.stringify(productoPedido));
        

        console.log("Productos",JSON.parse(sessionStorage.getItem("pedidoDummy")))
        console.log("Cantidad",JSON.parse(sessionStorage.getItem("productoPedidoDummy")))

        console.log("Pedido temporalmente guardado");
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        handleDummy();
    };

    const addExtraService = () => {
        setExtraServices([...extraServices, ""]);
        console.warn("Extra services:", extraServices);
    };

    const handleExtraServiceChange = (index, value) => {
        const updatedServices = [...extraServices];
        updatedServices[index] = value;
        setExtraServices(updatedServices);
    };

    const removeExtraService = (index) => {
        const updatedServices = extraServices.filter((_, i) => i !== index);
        setExtraServices(updatedServices);
    };


    return (
        <div className="card-product-container">
            <div className="card-product">
                <div className="card">
                    <h3>Productos Disponibles</h3>
                    <ul>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <li key={product.idproducto} style={{ display: "flex", alignItems: "center", marginBottom: "10px", backgroundColor: "#800000" }}>
                                    <img
                                        src={product.imagenUrl}
                                        alt={product.nombre}
                                        className="product-image"
                                        style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                                    />
                                    <label style={{ flex: 1 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts[product.idproducto] || false}
                                            onChange={(e) => handleCheckboxChange(product.idproducto, e.target.checked)}
                                        />
                                        {product.nombre} - {product.precio} $
                                    </label>
                                    {selectedProducts[product.idproducto] && (
                                        <input
                                            type="number"
                                            min="1"
                                            value={productQuantities[product.idproducto] || 1}
                                            onChange={(e) => handleQuantityChange(product.idproducto, parseInt(e.target.value) || 1)}
                                            style={{ width: "50px", marginLeft: "10px" }}
                                        />
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>Cargando productos...</p>
                        )}
                    </ul>
    
                    <h4>Servicios Adicionales o Personalizados</h4>
                    <ul>
                        {extraServices.map((service, index) => (
                            <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Ingrese un servicio adicional"
                                    value={service}
                                    onChange={(e) => handleExtraServiceChange(index, e.target.value)}
                                    style={{ flex: 1, padding: "5px", marginRight: "10px" }}
                                />
                                <button
                                    onClick={() => removeExtraService(index)}
                                    style={{ backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={addExtraService}
                        style={{ padding: "5px 10px", cursor: "pointer", marginTop: "10px" }}
                    >
                        + Agregar Servicio
                    </button>
                    <h4 hidden>Precio total de productos y servicios: {totalPrice} $</h4>
                </div>
                
                <button type="submit" onClick={handleSubmit} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", padding: "10px 20px", cursor: "pointer", fontSize: "16px" }} >
                    Siguiente
                </button>
            </div>
        </div>
    );
};    

export default OurProducts;
