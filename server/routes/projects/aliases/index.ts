import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
import { requireRole } from "@/middlewares/projectMiddleware";

const router = express.Router();

router.get("/", requireAuth, requireRole, require("./listAliases").default);
router.post("/", requireAuth, requireRole, require("./addAlias").default);
router.delete("/:alias_id", requireAuth, requireRole, require("./removeAlias").default);

export default router;
