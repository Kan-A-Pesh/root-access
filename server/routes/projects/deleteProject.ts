import Workspace from "@/controllers/workspace";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to delete this project",
            },
        });
    }

    Workspace.fromProject(req.project as Project).delete();
    await ProjectModel.deleteOne({ _id: req.project?._id }).exec();

    res.status(200).json({
        status: "success",
        payload: {
            message: "Project deleted",
        },
    });
};
