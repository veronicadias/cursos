import { z } from "zod";

export const ChannelEnum = z.enum([
    "WEB",
    "WHATSAPP",
    "TELEGRAM"
]);

export const MessageRoleEnum = z.enum([
    "USER",
    "ASSISTANT",
    "SYSTEM"
]);

export const ConversationStatusEnum = z.enum([
    "ACTIVE",
    "CLOSED",
    "ARCHIVED"
]);