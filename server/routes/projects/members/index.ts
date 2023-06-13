import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", requireAuth, require("./listMembers").default);
router.post("/", requireAuth, require("./addMember").default);
router.delete("/:handle", requireAuth, require("./removeMember").default);
router.patch("/:handle", requireAuth, require("./updateMember").default);

export default router;
