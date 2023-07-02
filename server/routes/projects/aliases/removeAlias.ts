import { Proxy } from "@/controllers/proxy";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to remove aliases from this project",
            },
        });
    }

    // Check if alias id exists
    if (req.project?.proxyAliases.find((alias) => alias.id === Number(req.params.alias_id)) === undefined) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Alias id not found",
            },
        });
    }

    // Remove alias
    req.project.proxyAliases = req.project.proxyAliases.filter((alias) => alias.id !== Number(req.params.alias_id));

    // Apply changes
    Proxy.writeProjectAliases(req.project as Project);
    Proxy.applyConfig();

    const project = await ProjectModel.updateOne({ _id: req.project._id }, { proxyAliases: req.project.proxyAliases });

    if (!project) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: "Failed to update project",
            },
        });
    }

    return res.status(200).json({
        status: "success",
        payload: {
            message: "Alias removed",
        },
    });
};
