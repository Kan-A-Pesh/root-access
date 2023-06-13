import express from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.post("/login", require("./login").default);
router.post("/register", requireAuth, require("./register").default);
router.post("/register/admin", require("./registerAdmin").default);
router.post("/register/finish", require("./registerFinish").default);
router.post("/logout", requireAuth, require("./logout").default);

export default router;
