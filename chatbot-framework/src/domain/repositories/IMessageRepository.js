// export default class IMessageRepository {

//     async findByConversation(conversationId) {
//         throw new Error("Not implemented");
//     }

//     async create(data) {
//         throw new Error("Not implemented");
//     }

//     async findLastMessages(conversationId, limit = 20) {
//         throw new Error("Not implemented");
//     }

//     async deleteByConversation(conversationId) {
//         throw new Error("Not implemented");
//     }

// }

import IRepository from "./IRepository.js";

export default class IMessageRepository extends IRepository {

    async findByConversation(conversationId) {
        throw new Error("Method not implemented.");
    }

    async findLastMessages(conversationId, limit = 20) {
        throw new Error("Method not implemented.");
    }

}