export default class ConversationOrchestrator {

    constructor({

        userRepository,
        channelRepository,

        conversationRepository,

        messageRepository,
        conversationService,

        // promptService,

        // aiService
        promptRepository,

        aiProvider,

        logger

    }) {
        // console.log("conversationService recibido:", conversationService);

        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.conversationService = conversationService;

        this.conversationRepository = conversationRepository;

        this.messageRepository = messageRepository;

        // this.promptService = promptService;

        // this.aiService = aiService;
        this.promptRepository = promptRepository;

        this.aiProvider = aiProvider;

        this.logger = logger.child(this.constructor.name);

    }

    async process({
        externalUserId,
        channel,
        name,
        text
    }) {
        const channelEntity =
            await this.channelRepository.findByName(channel);

        if (!channelEntity) {
            throw new Error(`Canal ${channel} no encontrado`);
        }

        let user =
            await this.userRepository.findByExternalId(
                externalUserId,
                channelEntity.id
            );
        // console.log('user*-----------------------',user)

        if (!user) {
            user = await this.userRepository.create({
                externalId: externalUserId,
                name,
                channel: {
                    connect: {
                        id: channelEntity.id
                    }
                }
            });

            this.logger.info({
                event: "USER_CREATED",
                metadata: {
                    userId: user.id,
                    channel: channelEntity.name
                }
            });
        }
        // console.log(
        //     "this.conversationService antes de usarlo:",
        //     this.conversationService
        // );

        return this.conversationService.registerIncomingMessage({
            userId: user.id,
            channelId: channelEntity.id,
            text
        });
    }
    // async process(request){

    //     this.logger.info({

    //         event: EventNames.MESSAGE_RECEIVED,

    //         metadata:{

    //             channel:request.channel,

    //             externalId:request.externalId

    //         }

    //     });

    // }
}