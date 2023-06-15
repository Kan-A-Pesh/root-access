import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
import { requireRole } from "@/middlewares/projectMiddleware";

const router = express.Router();

router.get("/", requireAuth, requireRole, require("./listMembers").default);
router.post("/", requireAuth, requireRole, require("./addMember").default);
router.delete("/:handle", requireAuth, requireRole, require("./removeMember").default);
router.patch("/:handle", requireAuth, requireRole, require("./updateMember").default);

export default router;
