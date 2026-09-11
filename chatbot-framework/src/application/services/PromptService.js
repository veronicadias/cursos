export default class PromptService{

    constructor({
        promptRepository,
        logger
    }) {
        this.promptRepository = promptRepository;
        this.logger = logger.child(this.constructor.name);
    }

    async getSystemPrompt(){
        // const prompt = await this.promptRepository.findActiveByType("SYSTEM");
        // return prompt?.content ?? "";
        const prompt =
            await this.promptRepository.findActiveByName("SYSTEM");

        if (!prompt) {
            throw new Error("No existe un prompt SYSTEM activo");
        }

        return prompt.content;
    }

    async getSummaryPrompt(){
        const prompt = await this.promptRepository.findActiveByType("SUMMARY");
        return prompt?.content ?? "";
    }

}