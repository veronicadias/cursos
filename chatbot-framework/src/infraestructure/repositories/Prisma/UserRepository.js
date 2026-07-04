import IUserRepository from "../../../domain/repositories/IUserRepository.js";
import BaseRepository from "../BaseRepository.js";

class PrismaUserRepository extends BaseRepository {

    constructor(prisma) {

        super(prisma, prisma.user);

    }

    async findByExternalId(externalId, channelId) {

        return this.model.findFirst({

            where: {

                externalId,

                channelId

            }

        });

    }

}

Object.assign(PrismaUserRepository.prototype, IUserRepository.prototype);

export default PrismaUserRepository;