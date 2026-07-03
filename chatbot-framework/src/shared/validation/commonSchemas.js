import { z } from "zod";

export const UUIDSchema = z.uuid({
    error: "UUID inválido"
});

export const ExternalIdSchema = z.string()
    .min(1)
    .max(100);

export const NameSchema = z.string()
    .min(2)
    .max(100);