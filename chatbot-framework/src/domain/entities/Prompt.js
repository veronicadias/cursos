export default class Prompt {

    constructor({
        id,
        name,
        description,
        content,
        active = true
    }) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.content = content;
        this.active = active;

    }

}