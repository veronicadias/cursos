import config from "../../config/index.js";

import OllamaProvider from "./providers/OllamaProvider.js";
import OpenAIProvider from "./providers/OpenAIProvider.js";
import GrokProvider from "./providers/GrokProvider.js";

class AIProviderFactory {

    create() {

        switch (config.ai.provider) {

            case "OLLAMA":
                return new OllamaProvider(config.ai);

            case "OPENAI":
                return new OpenAIProvider(config.ai);

            case "GROK":
                return new GrokProvider(config.ai);

            default:
                throw new Error("Proveedor IA no soportado.");

        }

    }

}

export default new AIProviderFactory();