import express from "express";

const router = express.Router();

router.post("/", require("./setRepo").default);
router.post("/pull", require("./pullRepo").default);
router.delete("/", require("./deleteRepo").default);

export default router;
