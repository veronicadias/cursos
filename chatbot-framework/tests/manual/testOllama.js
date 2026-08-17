import container from "../../src/container/container.js";

const response = await container.aiProvider.generate([
    {
        role: "system",
        content: "Responde siempre en español."
    },
    {
        role: "user",
        content: "Hola, ¿quién eres?"
    }
]);
console.log("RESPUESTA COMPLETA:");
console.dir(response, { depth: null });

console.log("CONTENT:");
console.log(response?.content);
// console.log('respuesta ',response.content);