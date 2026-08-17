import ApiResponse from "../../../shared/response/ApiResponse.js";

export default class ChatController {
    // constructor(conversationService) {
    //     this.conversationService = conversationService;
    // }
    constructor(conversationOrchestrator) {
        this.conversationOrchestrator = conversationOrchestrator;
    }

    async receive(req, res) {
        const result =
            await this.conversationOrchestrator.process(req.body);
            // await this.conversationService.registerIncomingMessage({
            //     userId: req.body.userId,
            //     channelId: req.body.channelId,
            //     text: req.body.text,
            // });

        res.status(201).json(
            ApiResponse.success(
                result,
                "Mensaje registrado correctamente"
            )
        );
    }
}