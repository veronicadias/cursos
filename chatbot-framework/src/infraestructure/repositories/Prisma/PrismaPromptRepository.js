import BaseRepository from "../BaseRepository.js";

export default class PrismaPromptRepository extends BaseRepository{

    constructor(prisma){

        super(prisma,"prompt");

    }

    async findActiveByType(type){

        return this.model.findFirst({

            where:{

                type,

                active:true

            }

        });

    }

}