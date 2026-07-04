import database from "../database/PrismaDatabase.js";

import PrismaUserRepository from "./prisma/PrismaUserRepository.js";
// import PrismaConversationRepository from "./prisma/PrismaConversationRepository.js";
// import PrismaMessageRepository from "./prisma/PrismaMessageRepository.js";

class RepositoryFactory {

    constructor() {

        this.prisma = database.getClient();

    }

    user() {

        return new PrismaUserRepository(this.prisma);

    }

    // conversation() {
    //     return new PrismaConversationRepository(this.prisma);
    // }

    // message() {
    //     return new PrismaMessageRepository(this.prisma);
    // }

}

export default new RepositoryFactory();