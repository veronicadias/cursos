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

    async getHistory(conversationId, limit = 20) {
        return this.messageRepository.findLastMessages(
            conversationId,
            limit
        );
    }

    async registerAssistantMessage({
        conversationId,
        text,
        tokens = null,
        promptTokens = null,
        completionTokens = null
    }) {
        const message = await this.messageRepository.create({
            conversationId,
            role: "ASSISTANT",
            content: text,
            tokens,
            promptTokens,
            completionTokens
        });

        await this.conversationRepository.updateLastMessageAt(
            conversationId
        );

        return message;
    }
}