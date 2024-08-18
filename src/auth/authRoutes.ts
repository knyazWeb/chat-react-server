import express from "express";
import { register, update } from "./authController";

const router = express.Router();

router.post("/register", register);
router.put("/update", update);

export default router;
