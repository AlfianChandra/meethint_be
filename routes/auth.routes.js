import express from "express";
import { useAuthController } from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/login", useAuthController().login);
router.post("/register", useAuthController().register);

export default router;
