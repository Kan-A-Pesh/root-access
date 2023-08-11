import express from "express";
const router = express.Router();

import listAliases from "./listAliases";
import addAlias from "./addAlias";
import editAliases from "./editAliases";
import removeAlias from "./removeAlias";

router.get("/", listAliases.express);
router.post("/", addAlias.express);
router.put("/", editAliases.express);
router.delete("/:alias_id", removeAlias.express);

export default router;
