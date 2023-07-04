import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", requireAuth, require("./getSettings").default);
router.post("/", requireAuth, require("./setSettings").default);

export default router;
