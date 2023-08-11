import express from "express";
const router = express.Router();

import getService from "./getService";
import startService from "./startService";
import stopService from "./stopService";

router.get("/", getService.express);
router.post("/start", startService.express);
router.post("/stop", stopService.express);

export default router;
