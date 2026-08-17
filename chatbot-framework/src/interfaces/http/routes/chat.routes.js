import { Router } from "express";

import container from "../../../container/container.js";
import ChatController from "../controllers/ChatController.js";
import asyncHandler from "../../../shared/middleware/asyncHandler.js";

const router = Router();

const controller = new ChatController(
    // container.conversationService
    container.conversationOrchestrator
);

router.post(
    "/",
    asyncHandler(controller.receive.bind(controller))
);

export default router;