import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN && req.user?.role !== UserRole.RESPO) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You are not authorized to create a project",
            },
        });
    }

    // Check project name
    if (!req.body.name) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Project name is required",
            },
        });
    }

    if (!/^[a-z][a-z0-9_-]*$/.test(req.body.name)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Project name must only contain lowercase letters, numbers, underscores, and dashes",
            },
        });
    }

    // TODO: implement endpoint
    res.status(500).json({ status: "not implemented" });
};
