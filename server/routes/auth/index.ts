import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";
const router = express.Router();

import login from "./login";
import register from "./register";
import registerAdmin from "./registerAdmin";
import registerFinish from "./registerFinish";
import logout from "./logout";

router.post("/login", login.express);
router.post("/register", requireAuth, register.express);
router.post("/register/admin", registerAdmin.express);
router.post("/register/finish", registerFinish.express);
router.post("/logout", requireAuth, logout.express);

export default router;
