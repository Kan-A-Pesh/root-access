import express from "express";

const router = express.Router();

router.get("/", require("./listMembers").default);
router.post("/", require("./addMember").default);
router.delete("/:handle", require("./removeMember").default);
router.patch("/:handle", require("./updateMember").default);

export default router;
