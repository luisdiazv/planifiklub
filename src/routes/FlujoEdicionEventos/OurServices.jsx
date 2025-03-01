import React, { useState, useEffect, useRef } from "react";
import { getAllProducto } from "../../Ctrl/ProductoCtrl";
import { getFotoProducto, uploadFotoProducto } from "../../API/StorageAPI";
import './OurServicesStyles.css';
import { formatCurrency } from "../../Util/MoneyFormat";
import { getPedidos, getInfoPedidos } from "../../Ctrl/PedidoCtrl";

const OurProducts = ({ id, handleNext }) => {
    const [products, setProducts] = useState([]);
    const [productQuantities, setProductQuantities] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [extraServices, setExtraServices] = useState([]);
    const [file, setFile] = useState(null);
    const submitButtonRef = useRef(null);
    const [initialCostoTotal, setInitialCostoTotal] = useState(null);

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

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const pedidos = await getPedidos(id);
                if (pedidos.length > 0) {
                    const pedidoDummy = pedidos[0]; // Asumiendo que quieres almacenar el primer pedido
    
                    sessionStorage.setItem("pedidoDummy", JSON.stringify(pedidoDummy));
    
                    // Obtener la información de los productos asociados al pedido
                    const productosPedido = await getInfoPedidos(pedidoDummy.idpedido);
                    
                    
                    sessionStorage.setItem("productoPedidoDummy", JSON.stringify(productosPedido));
                    console.log(sessionStorage.getItem("productoPedidoDummy"));
    
                    // Actualizar el estado con los datos de productoPedidoDummy
                    const selected = {};
                    const quantities = {};
                    productosPedido.forEach((producto) => {
                        selected[producto.id_producto] = true;
                        quantities[producto.id_producto] = producto.cantidad;
                    });
                    setSelectedProducts(selected);
                    setProductQuantities(quantities);
                    calculateTotalPrice(quantities); // Asegúrate de calcular el totalPrice aquí
    
                    // Crear el objeto productoPedidoDummy
                    const productoPedidoDummy = {
                        idproducto_pedido: productosPedido[0].idproducto_pedido,
                        id_pedido: pedidos[0].idpedido,
                        id_producto: Object.keys(selected),
                        cantidad: quantities,
                        subtotal: productosPedido[0].subtotal
                    };
                    console.log("Datos del producto:", productoPedidoDummy);
                    console.log("Cantidad:", productoPedidoDummy.cantidad, "Precio:", productoPedidoDummy.precio);

    
                    // Guardar productoPedidoDummy en sessionStorage
                    sessionStorage.setItem("productoPedidoDummy", JSON.stringify(productoPedidoDummy));
    
                    // Actualizar el estado con los datos de pedidos_adicionales
                    const extraServicesArray = pedidoDummy.pedidos_adicionales ? pedidoDummy.pedidos_adicionales.split("%%") : [];
                    setExtraServices(extraServicesArray);
    
                    // Guardar el valor inicial de costo_total
                    setInitialCostoTotal(pedidoDummy.costo_total);
    
                    // Simula el clic en el botón "Siguiente"
                   /* if (submitButtonRef.current) {
                        console.log("Simulando clic en el botón 'Siguiente'");
                        console.log("Subtotal:", productoPedidoDummy.subtotal);
                        console.log("Total Price:", totalPrice);
                        submitButtonRef.current.click();
                    }*/
                } else {
                    console.warn("No se encontraron pedidos para el evento.");
                }
            } catch (error) {
                console.error("Error obteniendo los pedidos por id_evento:", error);
            }
        };
    
        fetchPedidos();
    }, [id]);

    useEffect(() => {
        calculateTotalPrice(productQuantities);
    }, [selectedProducts, productQuantities, products]); // Asegura que se actualice cuando los productos cambien
    

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
                return newQuantities;
            });
    
            // Llamar a calculateTotalPrice con los valores actualizados
            setTimeout(() => {
                calculateTotalPrice({ ...productQuantities, [productId]: quantity });
            }, 0);
        }
    };
    

    const calculateTotalPrice = (quantities) => {
        if (products.length === 0) return; // Evita calcular si no hay productos cargados
    
        let total = 0;
        products.forEach(product => {
            if (selectedProducts[product.idproducto]) {
                total += (quantities[product.idproducto] || 0) * product.precio;
            }
        });
    
        console.log("Calculated Total Price:", total); // Ahora debería mostrar el total correcto
        setTotalPrice(total);
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

    
    const calcularSubtotales = (selectedProducts, productQuantities) => {
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
    
        console.log("Calculated Subtotals:", subtotals);
        return subtotals;
    };
    const getStringPedidosAdicionales = () => {
        return extraServices.filter(item => item.trim() !== "").join("%%");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const existingPedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy")) || {};
        const existingProductoPedidoDummy = JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || {};
    
        const pedido = {
            id_evento: existingPedidoDummy.id_evento, // Mantener el id_evento existente
            fecha_pedido: new Date().toISOString().split("T")[0],
            costo_total: parseFloat(totalPrice.toFixed(2)),
            pedidos_adicionales: getStringPedidosAdicionales()
        };
    
        const productoPedido = {
            idproducto_pedido: existingProductoPedidoDummy.idproducto_pedido || null, // Mantener el idproducto_pedido existente
            id_pedido: existingProductoPedidoDummy.id_pedido || null, // Mantener el id_pedido existente
            id_producto: seleccionFinal(),
            cantidad: productQuantities,
            subtotal: calcularSubtotales(selectedProducts, productQuantities),
        };
    
        if (sessionStorage.getItem("pedidoDummy") != null) {
            sessionStorage.removeItem("pedidoDummy");
        }
        if (sessionStorage.getItem("productoPedidoDummy") != null) {
            sessionStorage.removeItem("productoPedidoDummy");
        }
    
        sessionStorage.setItem("pedidoDummy", JSON.stringify(pedido));
        sessionStorage.setItem("productoPedidoDummy", JSON.stringify(productoPedido));

        // Reemplazar el valor de costo_total después del clic
        const updatedPedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy"));
        updatedPedidoDummy.costo_total = parseFloat(totalPrice.toFixed(2));
        sessionStorage.setItem("pedidoDummy", JSON.stringify(updatedPedidoDummy));

        console.log("Pedido actualizado:", updatedPedidoDummy);

    
        console.log("Productos", JSON.parse(sessionStorage.getItem("pedidoDummy")));
        console.log("Cantidad", JSON.parse(sessionStorage.getItem("productoPedidoDummy")));
    
        console.log("Pedido temporalmente guardado");
    /*
        // Simula el clic en el botón con id "nextScreenSlider"
        const nextButton = document.getElementById("nextScreenSlider");
        if (nextButton) {
            nextButton.click();
        }*/handleNext(); 
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

            <button type="submit" ref={submitButtonRef} onClick={handleSubmit}>
                Siguiente
            </button>
        </div>
    );
};

export default OurProducts;