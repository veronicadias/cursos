export default class ConversationOrchestrator {

    constructor({

        userRepository,

        conversationRepository,

        messageRepository,

        promptService,

        aiService

    }) {

        this.userRepository = userRepository;

        this.conversationRepository = conversationRepository;

        this.messageRepository = messageRepository;

        this.promptService = promptService;

        this.aiService = aiService;

    }

}