import { Request, Response, NextFunction } from "express";

import ProjectModel, { ProjectRole } from "@/models/project";
import { UserRole } from "@/models/user";

export const requireRole = async (req: Request, res: Response, next: NextFunction) => {
    // Verify project
    const project_id = req.query.project_id;

    if (!project_id) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "No project id provided",
            },
        });
    }

    // Get project from id
    const project = await ProjectModel.findById(project_id).exec();

    if (!project) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid project id",
            },
        });
    }

    // Check for admin or respo
    if (req.user?.role === UserRole.ADMIN || req.user?.role === UserRole.RESPO) {
        // Add to request
        req.project = project.toObject();
        req.permissionRole = req.user?.role === UserRole.ADMIN ? ProjectRole.ADMIN : ProjectRole.RESPO;

        return next();
    }

    // Get user role from project
    const permission = project.permissions.find((value) => value.userId === req.user?._id);

    if (!permission) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to access this project",
            },
        });
    }

    // Add to request
    req.project = project.toObject();
    req.permissionRole = permission.role;

    next();
};
