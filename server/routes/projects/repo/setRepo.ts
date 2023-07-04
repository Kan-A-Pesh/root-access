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
                message: "User does not have permission to update the project repo",
            },
        });
    }

    if (!req.body.repo) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Missing repo",
            },
        });
    }

    try {
        const repo = new Repository(req.body.repo.name ?? "N/A", req.body.repo.owner ?? "N/A");
        const githubAgent = await Github.create();
        const workspace = Workspace.fromProject(req.project!);

        if (await githubAgent.hasRepo(workspace)) {
            await githubAgent.removeRepo(workspace);
        }

        await githubAgent.cloneRepo(workspace, repo);

        await ProjectModel.findByIdAndUpdate(req.project!._id, {
            githubRepo: repo.owner + "/" + repo.name,
        });

        return res.status(200).json({
            status: "success",
            payload: {
                message: "Successfully updated project repo",
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
