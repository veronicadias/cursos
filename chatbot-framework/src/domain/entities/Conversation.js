// export default class Conversation {
//     constructor(data) {
//         Object.assign(this, data);
//     }
// }
export default class Conversation {
    constructor({
        id,
        userId,
        status,
        summary = "",
        aiProvider,
        model,
        messages = []
    }) {
        this.id = id;
        this.userId = userId;
        this.status = status;
        this.summary = summary;
        this.aiProvider = aiProvider;
        this.model = model;
        this.messages = messages;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    totalTokens() {
        return this.messages.reduce(
            (total, message) => total + (message.tokens || 0),
            0
        );
    }

    needsSummary(limit) {
        return this.totalTokens() >= limit;
    }
}