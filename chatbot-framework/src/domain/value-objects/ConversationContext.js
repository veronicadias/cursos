export default class ConversationContext {

    constructor({
        channel,
        externalUserId,
        text,
        attachments = [],
        metadata = {},
        timestamp = new Date()
    }) {

        this.channel = channel;
        this.externalUserId = externalUserId;
        this.text = text;
        this.attachments = attachments;
        this.metadata = metadata;
        this.timestamp = timestamp;

    }

}