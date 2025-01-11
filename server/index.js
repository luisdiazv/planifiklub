import express from "express"
import cors from "cors"

//SDK Mercado Pago
import { MercadoPagoConfig, Preference} from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({
     accessToken: "APP_USR-6829272797524487-010918-654557d1cd1241de2a86a7636cc70136-2202170519",
});

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server funciona");
});

app.post("/create_preference", async (req, res) => {
    try {
        const body = {
            items : [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "COP"
                },
            ],            
            back_urls :{
                success: "https://unal.edu.co/",
                failure: "https://unal.edu.co/",
                pending: "https://unal.edu.co/"
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({body});
        res.json({
            id: result.id,
        });
    }catch (error){
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia"
        });
    }
});

app.listen(port, () => {
    console.log('El servidor esta corriendo ');
});
