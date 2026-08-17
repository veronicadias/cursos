import IRepository from "./IRepository.js";

export default class IChannelRepository extends IRepository {
    async findByName(name) {
        throw new Error("Method not implemented.");
    }
}