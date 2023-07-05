import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
const router = express.Router();

import getSettings from "./getSettings";
import setSettings from "./setSettings";
import getRepos from "./getRepos";

router.get("/", requireAuth, getSettings.express);
router.post("/", requireAuth, setSettings.express);
router.get("/repos", requireAuth, getRepos.express);

export default router;
