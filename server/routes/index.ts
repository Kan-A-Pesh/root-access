import express, { Request, Response } from "express";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = express.Router();

router.use("/auth", require("./auth").default);
router.use("/projects", require("./projects").default);
router.use("/users", require("./users").default);

router.get("/coffee", (req: Request, res: Response) => {
    return res.status(418).send("Thanks for the coffee ☕️! But honestly, I prefer tea 🍵...");
});

router.get("/status", (req: Request, res: Response) => {
    return res.status(200).json({ status: "bread 👍" });
});

router.get("/protected", requireAuth, (req: Request, res: Response) => {
    return res.status(200).json({ status: "protected" });
});

router.get("/", (req: Request, res: Response) => {
    return res.status(204).send();
});

router.get("*", (req: Request, res: Response) => {
    return res.status(404).json({ status: "404" });
});

export default router;
