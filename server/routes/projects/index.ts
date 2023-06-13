import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", requireAuth, require("./listProjects").default);
router.get("/:id", requireAuth, require("./readProject").default);
router.post("/", requireAuth, require("./createProject").default);
router.delete("/:id", requireAuth, require("./deleteProject").default);
router.patch("/:id", requireAuth, require("./updateProject").default);

router.use("/:id/members", require("./members").default);

export default router;
