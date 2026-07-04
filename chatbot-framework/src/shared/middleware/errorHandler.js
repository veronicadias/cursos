import ApiResponse from "../response/ApiResponse.js";
import AppError from "../errors/AppError.js";

export default function errorHandler(err, req, res, next) {

    if (err instanceof AppError) {

        return res
            .status(err.statusCode)
            .json(
                ApiResponse.error({

                    code: err.code,

                    message: err.message

                })
            );

    }

    console.error(err);

    return res
        .status(500)
        .json(
            ApiResponse.error({

                code: "INTERNAL_ERROR",

                message: "Ha ocurrido un error inesperado."

            })
        );

}