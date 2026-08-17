import { ChatOllama } from "@langchain/ollama";
import IAIProvider from "../../domain/ai/IAIProvider.js";

export default class OllamaProvider extends IAIProvider {

    constructor({
        model,
        baseUrl,
        temperature = 0.7,
        logger
    }) {
        super();

        this.logger = logger.child(this.constructor.name);

        this.model = new ChatOllama({
            model,
            baseUrl,
            temperature
        });
    }

    async generate(messages) {

        this.logger.info({
            event: "AI_REQUEST",
            metadata: {
                messages: messages.length
            }
        });

        try {

            const response = await this.model.invoke(messages);

            this.logger.info({
                event: "AI_RESPONSE"
            });

            return {
                content: response.content,
                metadata: response.response_metadata
            };

        } catch (error) {

            this.logger.error({
                event: "AI_ERROR",
                metadata: {
                    message: error.message
                }
            });

            throw error;
        }
    }
}