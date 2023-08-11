import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
import { requireRole } from "@/middlewares/projectMiddleware";
const router = express.Router();

import listProjects from "./listProjects";
import readProject from "./readProject";
import readProjectKey from "./readProjectKey";
import createProject from "./createProject";
import deleteProject from "./deleteProject";
import updateProject from "./updateProject";

router.get("/", requireAuth, listProjects.express);
router.get("/:project_id", requireAuth, requireRole, readProject.express);
router.get("/:project_id/keys", requireAuth, requireRole, readProjectKey.express);
router.post("/", requireAuth, createProject.express);
router.delete("/:project_id", requireAuth, requireRole, deleteProject.express);
router.patch("/:project_id", requireAuth, requireRole, updateProject.express);

router.use("/:project_id/members", requireAuth, requireRole, require("./members").default);
router.use("/:project_id/aliases", requireAuth, requireRole, require("./aliases").default);
router.use("/:project_id/repo", requireAuth, requireRole, require("./repo").default);
router.use("/:project_id/service", requireAuth, requireRole, require("./service").default);

export default router;
