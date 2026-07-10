export default class Message {

    constructor({
        id,
        conversationId,
        role,
        content,
        tokens = 0,
        promptTokens = 0,
        completionTokens = 0,
        createdAt = new Date()
    }) {

        this.id = id;
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.tokens = tokens;
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.createdAt = createdAt;

    }

}
