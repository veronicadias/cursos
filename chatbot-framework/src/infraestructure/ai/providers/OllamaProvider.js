import { ChatOllama } from "@langchain/ollama";
import AIProvider from "../AIProvider.js";

export default class OllamaProvider extends AIProvider {

    constructor(config) {

        super();

        this.model = new ChatOllama({

            baseUrl: config.ollama.baseUrl,

            model: config.ollama.model,

            temperature: config.ollama.temperature

        });

    }

    async chat(messages) {

        const response = await this.model.invoke(messages);

        return response.content;

    }

}