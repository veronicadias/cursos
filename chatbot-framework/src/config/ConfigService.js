class ConfigService {
  constructor() {
    this.config = {
      server: {
        env: process.env.NODE_ENV || "development",
        port: Number(process.env.PORT) || 3000,
        host: process.env.HOST || "localhost",
      },

      database: {
        provider: process.env.DB_PROVIDER || "postgres",
        url: process.env.DATABASE_URL,
      },

      ai: {
        provider: process.env.AI_PROVIDER || "OLLAMA",

        ollama: {
          baseUrl: process.env.OLLAMA_URL || "http://localhost:11434",
          model: process.env.OLLAMA_MODEL || "qwen3:4b",
        },

        summaryLimit: Number(process.env.SUMMARY_LIMIT) || 5000,
      },

      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: "1d",
      },

      logger: {
        level: process.env.LOG_LEVEL || "info",
      },
    };
  }

  get(section) {
    return this.config[section];
  }

  getValue(section, key) {
    return this.config[section]?.[key];
  }
}

export default new ConfigService();