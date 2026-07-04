import express from "express";
// import dotenv from "dotenv";

import config from "./config/index.js";

// dotenv.config();

const app = express();

app.use(express.json());
const server = config.get("server");
const ai = config.get("ai");

app.get("/", (req, res) => {
    res.json({
        // status: "OK",
        // message: "Chatbot Framework iniciado"
        message: "Framework iniciado",
        env: server.env,
        ai: ai.provider,
        model: ai.ollama.model
    });
});

const PORT = process.env.PORT || 3000;

app.listen(server.port, () => {

    console.log(`Servidor iniciado en puerto ${server.port}`);

});

// app.listen(PORT, () => {
//     console.log(`Servidor iniciado en puerto ${PORT}`);
// });