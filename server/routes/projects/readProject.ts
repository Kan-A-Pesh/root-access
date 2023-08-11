import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointResponse } from "@/endpoint";
import { ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.DEV, // requiredPermission
    async (req: Request) => {
        let project: any = {
            id: req.project?._id,
            name: req.project?.name,
            displayName: req.project?.displayName,
            description: req.project?.description,
            status: req.project?.status,
            startDate: req.project?.startDate,
            endDate: req.project?.endDate,
            aliases: req.project?.proxyAliases,
            role: req.permissionRole,
            editGithubRepo: false,
            editPermissions: false,
            editService: false,
            editAliases: false,
            editMetadata: false,
            readPrivateKey: false,
            canDelete: false,
        };

        // Add permissions if user has Chief or higher role
        if (ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
            project.githubRepo = req.project?.githubRepo;
            project.permissions = req.project?.permissions;
            project.editMetadata = true;
            project.editAliases = true;
            project.editService = true;
        }

        if (ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
            project.password = req.project?.password;
            project.editGithubRepo = true;
            project.editPermissions = true;
            project.readPrivateKey = true;
            project.canDelete = true;
        }

        return new EndpointResponse(200, project);
    },
);
