import Github from "@/controllers/github";
import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import Repository from "@/models/repository";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.RESPO, // requiredPermission
    async (req: Request) => {
        const githubAgent = await Github.create();
        const workspace = Workspace.fromProject(req.project!);

        await githubAgent.removeRepo(workspace);

        await ProjectModel.findByIdAndUpdate(req.project!._id, {
            githubRepo: null,
        });

        return new EndpointResponse(200, "Successfully deleted project repo");
    },
);
