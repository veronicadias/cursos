import AIProviderFactory from "./AIProviderFactory.js";

class AIService {

    constructor() {

        this.provider = AIProviderFactory.create();

    }

    async chat(messages) {

        return this.provider.chat(messages);

    }

    async summarize(text) {

        return this.provider.summarize(text);

    }

}

export default new AIService();