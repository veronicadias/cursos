export default class BaseRepository {
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }

    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return this.model.findMany();
    }

    async create(data) {
        return this.model.create({
            data
        });
    }

    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
}