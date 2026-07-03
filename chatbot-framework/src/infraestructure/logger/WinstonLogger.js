import winston from "winston";
import ILogger from "../../domain/logger/ILogger.js";

export default class WinstonLogger extends ILogger {

    // constructor() {

    //     super();

    //     this.logger = winston.createLogger({

    //         level: "info",

    //         format: winston.format.combine(

    //             winston.format.timestamp(),

    //             winston.format.errors({
    //                 stack: true
    //             }),

    //             winston.format.json()

    //         ),

    //         transports: [

    //             new winston.transports.Console(),

    //             new winston.transports.File({

    //                 filename: "logs/app.log"

    //             }),

    //             new winston.transports.File({

    //                 filename: "logs/error.log",

    //                 level: "error"

    //             })

    //         ]

    //     });

    // }
    // constructor(logger, context = null) {

    //     super();

    //     this.logger = logger;

    //     this.context = context;

    // }
    constructor(logger = null, context = null) {
        super();

        this.context = context;

        if (logger) {
            // Logger hijo: reutiliza la instancia existente
            this.logger = logger;
        } else {
            // Logger principal
            this.logger = winston.createLogger({
                level: "info",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.errors({ stack: true }),
                    winston.format.json()
                ),
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: "logs/app.log" }),
                    new winston.transports.File({
                        filename: "logs/error.log",
                        level: "error"
                    })
                ]
            });
        }
    }

    child(context) {

        return new WinstonLogger(

            this.logger,

            context

        );

    }

    // info(event, metadata = {}) {
    //     this.logger.info({
    //         event,
    //         ...metadata
    //     });
    // }
    info(log) {
        this.logger.info({
            context: this.context,
            ...log
        });
    }

    // warn(event, metadata = {}) {
    //     this.logger.warn({
    //         event,
    //         ...metadata
    //     });
    // }

    warn(log) {
        this.logger.warn({
            context: this.context,
            ...log
        });
    }
    // error(event, metadata = {}) {
    //     this.logger.error({
    //         event,
    //         ...metadata
    //     });
    // }
    error(log) {
        this.logger.error({
            context: this.context,
            ...log
        });
    }

    // debug(event, metadata = {}) {
    //     this.logger.debug({
    //         event,
    //         ...metadata
    //     });
    // }
    debug(log) {
        this.logger.debug({
            context: this.context,
            ...log
        });
    }

}