import EventNames from "../constants/EventNames.js";
export default function requestLogger(logger) {

    return (req, res, next) => {

        const start = Date.now();

        res.on("finish", () => {

            logger.info(

                EventNames.HTTP_REQUEST,

                {

                    method:req.method,

                    url:req.originalUrl,

                    status:res.statusCode,

                    duration:Date.now()-start

                }

            );

        });

        next();

    };

}