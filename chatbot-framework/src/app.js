import express from "express";
// import dotenv from "dotenv";
import errorHandler from "./shared/middleware/errorHandler.js";
import config from "./config/index.js";
import userRoutes from "./interfaces/http/routes/user.routes.js";
import loggerMiddleware from "./shared/logger/loggerMiddleware.js";
import requestLogger from "./shared/middleware/requestLogger.js";
import container from "./container/container.js";

// dotenv.config();

const app = express();

app.use(requestLogger(container.logger));

app.use(express.json());
const server = config.get("server");
const ai = config.get("ai");
app.use(loggerMiddleware);
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
app.use("/users", userRoutes);
// app.listen(PORT, () => {
//     console.log(`Servidor iniciado en puerto ${PORT}`);
// });



// AL FINAL
app.use(errorHandler);