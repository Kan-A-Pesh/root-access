import Github from "@/controllers/github";
import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import Repository from "@/models/repository";
import { Request, Response } from "express";

export default new Endpoint(
    null, //  requiredRole
    ProjectRole.RESPO, // requiredPermission
    async (req: Request) => {
        if (!req.body.repo) {
            throw new EndpointError(400, "Missing repo");
        }

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

        return new EndpointResponse(200, "Successfully updated project repo");
    },
);
