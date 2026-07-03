/**
 * Ahora necesitamos un contenedor para crear todo automáticamente.

Crea:

src/
└── container/
       container.js
container.js

¿Por qué crear un contenedor?

Porque cuando tengas:

25 repositorios
40 casos de uso
6 proveedores de IA
3 canales (WhatsApp, Telegram, WebSocket)
Redis
Scheduler

No vas a querer instanciar todo manualmente.
 */
// import RepositoryFactory from "../infrastructure/repositories/RepositoryFactory.js";
import RepositoryFactory from "./../infraestructure/repositories/RepositoryFactory.js";

import CreateUserUseCase from "../application/usecases/users/CreateUserUseCase.js";
import FindUserUseCase from "../application/usecases/users/FindUserUseCase.js";
import LoggerFactory from "../infraestructure/logger/LoggerFactory.js";

class Container {

    constructor() {
        // Primero crear las dependencias compartidas
        this.logger = LoggerFactory.create();
        const userRepository = RepositoryFactory.user();

        // Luego inyectarlas
        this.createUserUseCase = new CreateUserUseCase(userRepository,this.logger);

        this.findUserUseCase = new FindUserUseCase(userRepository,this.logger);


    }

}

export default new Container();