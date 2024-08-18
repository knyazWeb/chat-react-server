import express from "express";
import { getChatHistory } from "./chatController";

const router = express.Router();

router.get("/history", getChatHistory);

export default router;
