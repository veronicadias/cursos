class PrismaConversationRepository extends BaseRepository {

    constructor(prisma) {
        super(prisma, "conversation");
    }

}

export default new PrismaConversationRepository();