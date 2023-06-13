import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", requireAuth, require("./getUser").default);
router.get("/list", requireAuth, require("./listUsers").default);
router.get("/:handle", requireAuth, require("./getUser").default);
router.delete("/:handle", requireAuth, require("./deleteUser").default);
router.patch("/:handle", requireAuth, require("./updateUser").default);

export default router;
