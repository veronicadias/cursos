import { PrismaClient } from "@prisma/client";
import Database from "./Database.js";

class PrismaDatabase extends Database {

    constructor() {
        super();

        this.client = new PrismaClient();
    }

    async connect() {
        await this.client.$connect();
    }

    async disconnect() {
        await this.client.$disconnect();
    }

    getClient() {
        return this.client;
    }

}

export default new PrismaDatabase();