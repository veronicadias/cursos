import ValidationError from "../errors/ValidationError.js";

// export default function validateRequest(schema) {
//     return (req, res, next) => {
//         const result = schema.safeParse(req.body);
//         if (!result.success) {
//             return next(
//                 new ValidationError(
//                     result.error.issues
//                         .map(issue => issue.message)
//                         .join(", ")
//                 )
//             );
//         }
//         req.body = result.data;
//         next();
//     };
// }

export default function validateRequest(schema, property = "body") {

    return (req, res, next) => {

        const result = schema.safeParse(req[property]);

        if (!result.success) {

            return next(

                new ValidationError(result.error)

            );

        }

        req[property] = result.data;

        next();

    };

}