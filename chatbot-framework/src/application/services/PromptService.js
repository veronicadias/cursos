export default class PromptService{

    constructor(promptRepository){

        this.promptRepository = promptRepository;

    }

    async getSystemPrompt(){

        const prompt = await this.promptRepository.findActiveByType("SYSTEM");

        return prompt?.content ?? "";

    }

    async getSummaryPrompt(){

        const prompt = await this.promptRepository.findActiveByType("SUMMARY");

        return prompt?.content ?? "";

    }

}