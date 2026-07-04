import { Router } from "express";
import container from "../../../container/container.js";
import UserController from "../controllers/UserController.js";
import asyncHandler from "../../../shared/middleware/asyncHandler.js";
import validateRequest from "../../../shared/middleware/validateRequest.js";
import { createUserSchema } from "../validators/user.validator.js";

const router = Router();

// const userController = new UserController(
//     container.resolve("CreateUserUseCase"),
//     container.resolve("FindUserUseCase")
// );

const controller = new UserController(
    container.createUserUseCase,
    container.findUserUseCase
);
// router.post("/", asyncHandler(controller.create.bind(controller)));
router.post(
    "/",
    validateRequest(createUserSchema),
    asyncHandler(controller.create.bind(controller))
);
router.get("/:id", asyncHandler(controller.find.bind(controller)));

// router.post("/", controller.create.bind(controller));
// router.get("/:id", controller.find.bind(controller));

export default router;