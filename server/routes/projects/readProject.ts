import Workspace from "@/controllers/workspace";
import { ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    let project: any = {
        id: req.project?._id,
        name: req.project?.name,
        displayName: req.project?.displayName,
        description: req.project?.description,
        status: req.project?.status,
        startDate: req.project?.startDate,
        endDate: req.project?.endDate,
        aliases: req.project?.proxyAliases,
        editGithubRepo: false,
        editPermissions: false,
        editAliases: false,
        editMetadata: false,
        readPrivateKey: false,
    };

    // Add permissions if user has Chief or higher role
    if (ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
        project.githubRepo = req.project?.githubRepo;
        project.permissions = req.project?.permissions;
        project.editMetadata = true;
        project.editAliases = true;
    }

    if (ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
        project.password = req.project?.password;
        project.privateKey = Workspace.fromName(req.project?.name ?? "").getSSHPrivateKey();
        project.editGithubRepo = true;
        project.editPermissions = true;
        project.readPrivateKey = true;
    }

    res.status(200).json({
        status: "success",
        payload: project,
    });
};
