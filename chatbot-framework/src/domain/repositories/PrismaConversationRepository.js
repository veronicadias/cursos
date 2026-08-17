import BaseRepository from "../BaseRepository.js";

export default class PrismaConversationRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "conversation");
    }

    async findActiveByUser(userId, channelId) {
        return this.model.findFirst({
            where: {
                userId,
                channelId,
                status: "ACTIVE",
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    async updateSummary(id, summary) {
        return this.model.update({
            where: { id },
            data: {
                summary,
            },
        });
    }

    async updateLastMessageAt(id, date = new Date()) {
        return this.model.update({
            where: { id },
            data: {
                lastMessageAt: date,
            },
        });
    }

    async close(id) {
        return this.model.update({
            where: { id },
            data: {
                status: "CLOSED",
            },
        });
    }
}