import NotFoundError from "../../../shared/errors/NotFoundError.js";
export default class FindUserUseCase {

    constructor(userRepository, logger) {

        this.userRepository = userRepository;
        this.logger = logger.child("FindUserUseCase");//logger;

    }

    // async execute(id) {
    //     return this.userRepository.findById(id);
    // }

    async execute(id) {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        return user;

    }
}