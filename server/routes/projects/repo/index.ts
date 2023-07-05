import express from "express";
const router = express.Router();

import setRepo from "./setRepo";
import pullRepo from "./pullRepo";
import deleteRepo from "./deleteRepo";

router.post("/", setRepo.express);
router.post("/pull", pullRepo.express);
router.delete("/", deleteRepo.express);

export default router;
