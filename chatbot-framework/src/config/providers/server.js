export default {
    env: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 3000,

    host: process.env.HOST || "localhost"
};