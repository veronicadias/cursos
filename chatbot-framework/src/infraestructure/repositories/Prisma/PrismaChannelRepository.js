// import BaseRepository from "../BaseRepository.js";
import BaseRepository from "../../BaseRepository.js";

export default class PrismaChannelRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "channel");
    }

    async findByName(name) {
        return this.model.findUnique({
            where: {
                name
            }
        });
    }
}