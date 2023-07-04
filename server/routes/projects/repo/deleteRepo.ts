import Github from "@/controllers/github";
import Workspace from "@/controllers/workspace";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import Repository from "@/models/repository";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (ProjectUtils.hasPermission(req.permissionRole, ProjectRole.RESPO)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to delete the project repo",
            },
        });
    }

    try {
        const githubAgent = await Github.create();
        const workspace = Workspace.fromProject(req.project!);

        await githubAgent.removeRepo(workspace);

        await ProjectModel.findByIdAndUpdate(req.project!._id, {
            githubRepo: null,
        });

        return res.status(200).json({
            status: "success",
            payload: {
                message: "Successfully deleted project repo",
            },
        });
    } catch (err) {
        let message = err;
        if (err instanceof Error) {
            message = err.message;
        }

        return res.status(500).json({
            status: "error",
            payload: {
                message,
            },
        });
    }
};
