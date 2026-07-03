import IUserRepository from "../../../domain/repositories/IUserRepository.js";
import database from "../../database/PrismaDatabase.js";

class PrismaUserRepository extends IUserRepository {

    constructor() {
        super();
        this.prisma = database.getClient();
    }

    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findByExternalId(externalId, channelId) {

        return this.prisma.user.findFirst({

            where: {

                externalId,

                channelId

            }

        });

    }

    async create(data) {
        return this.prisma.user.create({
            data: {
                externalId: data.externalId,
                name: data.name,
                channel: {
                    connect: {
                        name: data.channel
                    }
                }
            }
        });
    }

    async update(id, data) {

        return this.prisma.user.update({

            where: { id },

            data

        });

    }

}

export default PrismaUserRepository;