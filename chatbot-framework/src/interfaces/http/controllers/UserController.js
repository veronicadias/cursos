import ApiResponse from "../../../shared/response/ApiResponse.js";

export default class UserController {

    constructor(createUserUseCase, findUserUseCase){

        this.createUserUseCase = createUserUseCase;

        this.findUserUseCase = findUserUseCase;

    }

    // async create(req,res){
    //     const user = await this.createUserUseCase.execute(req.body);
    //     res.status(201).json(user);
    // }

    // async create(req, res, next) {
    //     try {
    //         const user = await this.createUserUseCase.execute(req.body);
    //         res.status(201).json(
    //             ApiResponse.success(user, "Usuario creado correctamente")
    //         );
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    async create(req, res) {
        const user = await this.createUserUseCase.execute(req.body);

        res.status(201).json(
            ApiResponse.success(user, "Usuario creado correctamente")
        );
    }

    // async find(req,res){
    //     const user = await this.findUserUseCase.execute(req.params.id);
    //     res.json(user);
    // }

    // async find(req,res,next){
    //     try {
    //         const user = await this.findUserUseCase.execute(req.params.id);
    //         res.json(
    //             ApiResponse.success(user, "Usuario encontrado correctamente")
    //         );
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    async find(req, res) {
        const user = await this.findUserUseCase.execute(req.params.id);

        res.json(ApiResponse.success(user));
    }
}