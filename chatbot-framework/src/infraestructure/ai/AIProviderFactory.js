import config from "../../config/index.js";

import OllamaProvider from "./providers/OllamaProvider.js";
import OpenAIProvider from "./providers/OpenAIProvider.js";
import GrokProvider from "./providers/GrokProvider.js";

class AIProviderFactory {

    create(config, logger) {

        // console.log(config.config)
        switch (config.provider) {

            case "OLLAMA":
                // console.log('-----------------',config)
                return new OllamaProvider(
                    // config.ai
                    {
                    ...config,
                    logger
                }
                );

            case "OPENAI":
                return new OpenAIProvider(config);

            case "GROK":
                return new GrokProvider(config);

            default:
                throw new Error("Proveedor IA no soportado.");

        }

    }

}

export default new AIProviderFactory();