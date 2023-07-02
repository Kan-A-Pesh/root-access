import express from "express";

const router = express.Router();

router.get("/", require("./listAliases").default);
router.post("/", require("./addAlias").default);
router.delete("/:alias_id", require("./removeAlias").default);

export default router;
