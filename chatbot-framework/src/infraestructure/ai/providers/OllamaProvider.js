import { ChatOllama } from "@langchain/ollama";
import AIProvider from "../AIProvider.js";

export default class OllamaProvider extends AIProvider {

    constructor(config) {

        super();
        // console.log('config ollama provider-----------',config)
        // console.log({
        //     model,
        //     baseUrl,
        //     temperature
        // });

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

    async generate(messages) {
        const response = await this.model.invoke(messages);
        console.log("LANGCHAIN RESPONSE:");
        console.dir(response, { depth: null });
        return {
            content: response.content,
            metadata: response.response_metadata
        };
    }

}