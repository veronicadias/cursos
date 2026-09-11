import IRepository from "./IRepository.js";

export default class IPromptRepository extends IRepository {

    async findActiveByType(type){

        throw new Error("Not implemented");

    }

    async findActiveByName(name) {
        throw new Error("Method not implemented.");
    }

}