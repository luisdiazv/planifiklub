import React, { useState } from "react";
import "./testing.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";

const Balanzadepagos = () => {
    const [preferenceId, setPreferenceId] = useState(null)
    initMercadoPago('APP_USR-559230ce-2f09-4179-959c-855f9d01f382', {
        locale: "es-CO"
    });

    const createPreference = async() =>{
        try{
            const response = await axios.post("http://localhost:4000/create_preference",{
                title: "Reserva de evento",
                quantity: 1,
                price: 1000,
            });

            const {id} = response.data;
            return id;
        }catch (error){
            console.log(error);
        }
    }

    const handleBuy = async () =>{
        const id = await createPreference();
        if(id){
            setPreferenceId(id);
        }
    }
   
    return (
        <div className="card-product-container">
            <div className="card-product">
                <div className="card">
                    <h3>Valor a pagar</h3>
                    <p className="price">100000 $</p>
                    <button onClick={handleBuy}>Pagar</button>
                    {preferenceId && <Wallet initialization={{ preferenceId: preferenceId, redirectMode: "modal"}} customization={{ texts:{ valueProp: 'smart_option'}}} />}
                </div>
            </div>
        </div>

    )
};

export default Balanzadepagos;