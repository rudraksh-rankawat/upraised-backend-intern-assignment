import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import exp from "constants";

const router = Router()

router.post("/login", loginUser);

export default router