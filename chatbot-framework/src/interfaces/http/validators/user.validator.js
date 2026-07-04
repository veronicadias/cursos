import { z } from "zod";
import {
    ExternalIdSchema,
    NameSchema
} from "../../../shared/validation/commonSchemas.js";

const ChannelEnum = z.enum([
    "WEB",
    "WHATSAPP",
    "TELEGRAM"
]);

channel: ChannelEnum
// export const createUserSchema = z.object({

//     externalId: z.string({
//         error: "El externalId es obligatorio"
//     }).min(1),

//     name: z.string({
//         error: "El nombre es obligatorio"
//     })
//     .min(2, {
//         error: "El nombre debe tener al menos 2 caracteres"
//     })
//     .max(100),

//     // channel: z.string({
//     //     error: "El canal es obligatorio"
//     // })
//     channel: ChannelEnum

// });


export const createUserSchema = z.object({
    // id: z.uuid(),

    externalId: ExternalIdSchema,

    name: NameSchema,

    channel: ChannelEnum

});