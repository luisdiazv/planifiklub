import React, { useState, useEffect } from "react";
import { getAllProducto } from "../../Ctrl/ProductoCtrl";
import { getFotoProducto, uploadFotoProducto } from "../../API/StorageAPI";
import './OurServicesStyles.css';
import { formatCurrency } from "../../Util/MoneyFormat";

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
        return Object.keys(newSelectedProducts);
    }

    const completitudDiccionarios = () => {
        let errores = [];
        const seleccionados = seleccionFinal();

        seleccionados.forEach(llave => {
            if (!productQuantities.hasOwnProperty(llave)) {
                errores.push(llave);
            }
        });
        if (errores.length > 0) {
            throw new Error("Faltan productos por asignar cantidad: " + errores.join(", "));
        }
    };

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
            id_evento: null,//Se genera en la BD (response)
            fecha_pedido: new Date().toISOString().split("T")[0],
            costo_total: parseFloat(totalPrice.toFixed(2)),
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


        console.log("Productos", JSON.parse(sessionStorage.getItem("pedidoDummy")))
        console.log("Cantidad", JSON.parse(sessionStorage.getItem("productoPedidoDummy")))

        console.log("Pedido temporalmente guardado");
    };

    const handleSubmit = async (e) => {
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
            {/* <h3>Productos Disponibles</h3> */}
            <ul className="ourService-cards">
                {products.length > 0 ? (
                    products.map((product) => (
                        <li className="ourService-card" key={product.idproducto}>
                            <div className="ourService-foto">
                                <img
                                    src={product.imagenUrl}
                                    alt={product.nombre}
                                    className="ourService-image"
                                />
                            </div>
                            <div className="ourService-info">
                                <div className="Ourservice-product-name">
                                    <h2>{product.nombre}</h2>
                                    <h3>
                                        {formatCurrency(product.precio)} $
                                    </h3>
                                </div>

                                {selectedProducts[product.idproducto] && (
                                    <input className="OurServices-number-Input"
                                        type="number"
                                        min="1"
                                        value={productQuantities[product.idproducto] || 1}
                                        onChange={(e) => handleQuantityChange(product.idproducto, parseInt(e.target.value) || 1)}
                                    />
                                )}
                                <div className="basic-input-checkbox-container">
                                    <input className="basic-input-checkbox"
                                        type="checkbox"
                                        checked={selectedProducts[product.idproducto] || false}
                                        onChange={(e) => handleCheckboxChange(product.idproducto, e.target.checked)}
                                    />
                                </div>

                            </div>
                        </li>
                    ))
                ) : (
                    <p>Cargando productos...</p>
                )}
            </ul>

            <h4>Servicios Adicionales o Personalizados</h4>
            <ul className="ourService-cards">
                {extraServices.map((service, index) => (
                    <li className="additionalService-card" key={index}>
                        <input
                            type="text"
                            placeholder="Ingrese un servicio adicional"
                            value={service}
                            onChange={(e) => handleExtraServiceChange(index, e.target.value)}
                        />
                        <button
                            onClick={() => removeExtraService(index)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
            <button
                onClick={addExtraService}
            >
                + Agregar Servicio
            </button>
            <h4 hidden>Precio total de productos y servicios: formatCurrency({totalPrice})</h4>

            <button type="submit" onClick={handleSubmit}>
                Siguiente
            </button>
        </div>
    );
};

export default OurProducts;
