import NotFoundError from "../../../shared/errors/NotFoundError.js";
import EventNames from "../../../shared/constants/EventNames.js";

export default class CreateUserUseCase {

    constructor(userRepository, logger) {

        this.userRepository = userRepository;
        this.logger = logger.child(this.constructor.name);//logger;
    }

    // async execute(data) {
    //     this.logger.info(
    //         EventNames.USER_CREATED,
    //         {
    //             externalId:data.externalId,
    //             channel:data.channel
    //         }
    //     );
    //     return this.userRepository.create(data);
    // }
    async execute(data) {
        // this.logger.info({
        //     event: EventNames.USER_CREATED,
        //     metadata: {
        //         externalId:data.externalId,
        //         channel:data.channel
        //     }
        // });
        return this.userRepository.create(data);

    }

}