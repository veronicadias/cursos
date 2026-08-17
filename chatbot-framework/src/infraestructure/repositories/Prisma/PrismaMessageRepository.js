import BaseRepository from "../../BaseRepository.js";

export default class PrismaMessageRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "message");
    }

    async findByConversation(conversationId) {
        return this.model.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }

    async findLastMessages(conversationId, limit = 20) {
        const messages = await this.model.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return messages.reverse();
    }

    async sumTokens(conversationId) {
        const result = await this.model.aggregate({
            where: {
                conversationId,
            },
            _sum: {
                tokens: true,
            },
        });

        return result._sum.tokens ?? 0;
    }
}