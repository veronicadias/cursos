export default {

    url: process.env.DATABASE_URL,

    provider: process.env.DB_PROVIDER || "postgres"

};