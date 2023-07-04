import Github from "@/controllers/github";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN && req.user?.role !== UserRole.RESPO) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You are not authorized to perform this action.",
            },
        });
    }

    try {
        const githubAgent = await Github.create();

        const repos = githubAgent.listRepos();

        res.status(200).json({
            status: "success",
            payload: {
                repos: repos,
            },
        });
    } catch (err: any) {
        let message = err;

        if (err instanceof Error) {
            message = err.message;
        }

        res.status(500).json({
            status: "error",
            payload: {
                message: message,
            },
        });
    }
};
