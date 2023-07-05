import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
const router = express.Router();

import getUser from "./getUser";
import listUsers from "./listUsers";
import deleteUser from "./deleteUser";
import updateUser from "./updateUser";

router.get("/", requireAuth, getUser.express);
router.get("/list", requireAuth, listUsers.express);
router.get("/:handle", requireAuth, getUser.express);
router.delete("/:handle", requireAuth, deleteUser.express);
router.patch("/:handle", requireAuth, updateUser.express);

export default router;
