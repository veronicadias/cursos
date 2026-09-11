export default class ConversationOrchestrator {

    constructor({

        userRepository,
        channelRepository,

        conversationRepository,
        promptService,

        messageRepository,
        conversationService,


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

        this.promptService = promptService;

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
        // 1. Guardamos el mensaje USER
        const { conversation } =
            await this.conversationService.registerIncomingMessage({
                userId: user.id,
                channelId: channelEntity.id,
                text
            });

        // 2. Recuperamos el historial
        const history =
            await this.conversationService.getHistory(
                conversation.id
            );

        // 3. Lo convertimos al formato esperado por la IA
        const systemPrompt = await this.promptService.getSystemPrompt();
        const messages = [
            {
                role: "system",
                content: systemPrompt,//"Eres un asistente útil. Responde siempre en español."
            },
            ...history.map(message => ({
                role: message.role.toLowerCase(),
                content: message.content
            }))
        ];

        // 4. Llamamos a Ollama
        const aiResponse =
            await this.aiProvider.generate(messages);

        // 5. Guardamos la respuesta
        const assistantMessage =
            await this.conversationService.registerAssistantMessage({
                conversationId: conversation.id,
                text: aiResponse.content
            });

        // 6. Respondemos
        return {
            conversationId: conversation.id,
            message: assistantMessage
        };

        // return this.conversationService.registerIncomingMessage({
        //     userId: user.id,
        //     channelId: channelEntity.id,
        //     text
        // });

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