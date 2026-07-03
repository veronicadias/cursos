import dotenv from "dotenv";
// import database from "./infrastructure/database/PrismaDatabase.js";
import database from "./infraestructure/database/PrismaDatabase.js";
dotenv.config();

import "./app.js";

export default async function bootstrap() {

    await database.connect();

    console.log("✅ PostgreSQL conectado");

}