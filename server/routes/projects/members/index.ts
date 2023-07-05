import express from "express";
const router = express.Router();

import listMembers from "./listMembers";
import addMember from "./addMember";
import removeMember from "./removeMember";
import updateMember from "./updateMember";

router.get("/", listMembers.express);
router.post("/", addMember.express);
router.delete("/:handle", removeMember.express);
router.patch("/:handle", updateMember.express);

export default router;
