import WinstonLogger from "./WinstonLogger.js";

class LoggerFactory {

    create() {

        return new WinstonLogger();

    }

}

export default new LoggerFactory();