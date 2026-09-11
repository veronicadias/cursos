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
import ConversationService from "../application/services/ConversationService.js";
import ConversationOrchestrator
    from "../application/services/ConversationOrchestrator.js";
import AIProviderFactory
    from "../infraestructure/ai/AIProviderFactory.js";

import configService
    from "../config/ConfigService.js";
import PromptService from "../application/services/PromptService.js";

class Container {

    constructor() {
        // Primero crear las dependencias compartidas
        this.logger = LoggerFactory.create();
        const userRepository = RepositoryFactory.user();
        const conversationRepository = RepositoryFactory.conversation();
        const messageRepository = RepositoryFactory.message();
        const channelRepository = RepositoryFactory.channel();
        this.aiProvider = AIProviderFactory.create(
            configService.config.ai,
            this.logger
        );
        const promptRepository = RepositoryFactory.prompt();
        
        // Luego inyectarlas
        this.promptService = new PromptService({
            promptRepository,
            logger: this.logger
        });

        this.createUserUseCase = new CreateUserUseCase(userRepository,this.logger);

        this.findUserUseCase = new FindUserUseCase(userRepository,this.logger);
        this.conversationService = new ConversationService({
            conversationRepository,
            messageRepository,
            logger: this.logger,
        });
        // this.conversationOrchestrator = new ConversationOrchestrator({
        //     userRepository,
        //     channelRepository,
        //     conversationService: this.conversationService,
        //     logger: this.logger
        // });
        this.conversationOrchestrator = new ConversationOrchestrator({
            userRepository,
            channelRepository,
            conversationService: this.conversationService,
            promptService: this.promptService,
            aiProvider: this.aiProvider,
            logger: this.logger
        });

    }

}

export default new Container();