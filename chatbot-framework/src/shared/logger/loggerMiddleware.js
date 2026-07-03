import logger from "./logger.js";

export default function loggerMiddleware(req, res, next) {

    const start = Date.now();

    res.on("finish", () => {

        const ms = Date.now() - start;

        logger.info(

            `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`

        );

    });

    next();

}