import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { Project, ProjectStatus } from "@/models/project";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.RESPO, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        // Check project name
        if (!req.body.name) {
            throw new EndpointError(400, "Project name is required");
        }

        if (!/^[a-z][a-z0-9_-]*$/.test(req.body.name)) {
            throw new EndpointError(400, "Project name must only contain lowercase letters, numbers, underscores, and dashes");
        }

        // Check project status
        let status = ProjectStatus.PLANED;
        if (req.body.status) {
            if (!Object.values(ProjectStatus).includes(req.body.status)) {
                throw new EndpointError(400, "Invalid project status");
            }

            status = req.body.status;
        }

        const workspace = Workspace.fromName(req.body.name);

        if (workspace.exists()) {
            throw new EndpointError(409, "Project name is already taken");
        }

        workspace.create();

        const project = {
            name: req.body.name,
            password: workspace.password,
            displayName: req.body.displayName ?? req.body.name,
            description: req.body.description ?? "A new project",
            status: status,
            startDate: (req.body.startDate as Date) ?? null,
            endDate: (req.body.endDate as Date) ?? null,
            githubRepo: req.body.githubRepo ?? null,
            permissions: [],
            proxyAliases: [],
        };

        const projectModel = await ProjectModel.create(project);

        return new EndpointResponse(201, {
            message: "Project created successfully",
            id: projectModel._id,
        });
    },
);
