import Workspace from "@/controllers/workspace";
import { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to delete this project",
            },
        });
    }

    Workspace.fromProject(req.project as Project).delete();

    res.status(200).json({
        status: "success",
        payload: {
            message: "Project deleted",
        },
    });
};
