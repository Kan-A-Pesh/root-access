import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
import { requireRole } from "@/middlewares/projectMiddleware";

const router = express.Router();

router.get("/", requireAuth, require("./listProjects").default);
router.get("/:project_id", requireAuth, requireRole, require("./readProject").default);
router.get("/:project_id/keys", requireAuth, requireRole, require("./readProjectKey").default);
router.post("/", requireAuth, require("./createProject").default);
router.delete("/:project_id", requireAuth, requireRole, require("./deleteProject").default);
router.patch("/:project_id", requireAuth, requireRole, require("./updateProject").default);

router.use("/:project_id/members", requireAuth, requireRole, require("./members").default);
router.use("/:project_id/aliases", requireAuth, requireRole, require("./aliases").default);
router.use("/:project_id/repo", requireAuth, requireRole, require("./repo").default);

export default router;
