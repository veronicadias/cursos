export default class AIProvider {

    async chat(messages, options = {}) {
        throw new Error("chat() not implemented");
    }

    async summarize(text) {
        throw new Error("summarize() not implemented");
    }

    async embeddings(text) {
        throw new Error("embeddings() not implemented");
    }

}