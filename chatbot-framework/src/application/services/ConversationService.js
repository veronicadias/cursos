export default class ConversationService {
    constructor({
        conversationRepository,
        messageRepository,
        logger,
    }) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.logger = logger.child(this.constructor.name);
    }

    async registerIncomingMessage({
        userId,
        channelId,
        text,
        role = "USER",
        tokens = null,
    }) {
        let conversation =
            await this.conversationRepository.findActiveByUser(
                userId,
                channelId
            );

        if (!conversation) {
            conversation = await this.conversationRepository.create({
                userId,
                channelId,
                status: "ACTIVE",
                lastMessageAt: new Date(),
            });

            this.logger.info({
                event: "CONVERSATION_CREATED",
                metadata: {
                    conversationId: conversation.id,
                    userId,
                    channelId,
                },
            });
        }

        const message = await this.messageRepository.create({
            conversationId: conversation.id,
            role,
            content: text,
            tokens,
        });

        await this.conversationRepository.updateLastMessageAt(
            conversation.id
        );

        this.logger.info({
            event: "MESSAGE_RECEIVED",
            metadata: {
                messageId: message.id,
                conversationId: conversation.id,
                userId,
                channelId,
            },
        });

        return {
            conversation,
            message,
        };
    }
}