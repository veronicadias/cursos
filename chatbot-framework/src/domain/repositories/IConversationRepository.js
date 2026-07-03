// export default class IConversationRepository {

//     async findById(id) {
//         throw new Error("Not implemented");
//     }

//     async findActiveByUser(userId) {
//         throw new Error("Not implemented");
//     }

//     async create(data) {
//         throw new Error("Not implemented");
//     }

//     async update(id, data) {
//         throw new Error("Not implemented");
//     }

//     async updateSummary(id, summary) {
//         throw new Error("Not implemented");
//     }

//     async close(id) {
//         throw new Error("Not implemented");
//     }

// }

import IRepository from "./IRepository.js";

export default class IConversationRepository extends IRepository {

    async findActiveByUser(userId) {
        throw new Error("Method not implemented.");
    }

    async updateSummary(id, summary) {
        throw new Error("Method not implemented.");
    }

    async close(id) {
        throw new Error("Method not implemented.");
    }

}