export default {

    provider: process.env.AI_PROVIDER || "OLLAMA",

    ollama: {

        baseUrl: process.env.OLLAMA_URL,

        model: process.env.OLLAMA_MODEL

    },

    summaryLimit: Number(process.env.SUMMARY_LIMIT) || 5000

};