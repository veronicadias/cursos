// export default class IUserRepository {

//     findById() {
//         throw new Error("Not implemented");
//     }

//     findByExternalId() {
//         throw new Error("Not implemented");
//     }

//     create() {
//         throw new Error("Not implemented");
//     }

//     update() {
//         throw new Error("Not implemented");
//     }

// }

import IRepository from "./IRepository.js";

export default class IUserRepository extends IRepository {

    async findByExternalId(externalId, channelId) {
        throw new Error("Method not implemented.");
    }

}