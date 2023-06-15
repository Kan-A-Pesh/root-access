import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (req.permissionRole === ProjectRole.DEV) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User does not have permission to update this project",
            },
        });
    }

    if (!req.project) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: "Project found, but not attached to request",
            },
        });
    }

    let changes: any = {};

    if (req.body.displayName) {
        changes.displayName = req.body.displayName;
    }

    if (req.body.description) {
        changes.description = req.body.description;
    }

    if (req.body.status) {
        if (!Object.values(ProjectRole).includes(req.body.status)) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid project status",
                },
            });
        }

        changes.status = req.body.status;
    }

    if (req.body.startDate) {
        if (isNaN(Date.parse(req.body.startDate))) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid start date",
                },
            });
        }

        changes.startDate = Date.parse(req.body.startDate);
    }

    if (req.body.endDate) {
        if (isNaN(Date.parse(req.body.endDate))) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid end date",
                },
            });
        }

        changes.endDate = Date.parse(req.body.endDate);
    }

    if (req.body.githubRepo) {
        if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "User does not have permission to update the GitHub repo url",
                },
            });
        }
    }

    const project = await ProjectModel.updateOne({ _id: req.project._id }, changes);

    if (!project) {
        return res.status(500).json({
            status: "error",
            payload: {
                message: "Un expected error occurred while updating project",
            },
        });
    }

    res.status(200).json({
        status: "success",
        payload: {
            message: "Project updated successfully",
            changes: changes,
        },
    });
};
