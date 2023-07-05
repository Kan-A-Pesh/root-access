import Github from "@/controllers/github";
import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import Repository from "@/models/repository";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        const githubAgent = await Github.create();
        const workspace = Workspace.fromProject(req.project!);

        await githubAgent.pullRepo(workspace);

        return new EndpointResponse(200, "Successfully updated project repo");
    },
);
