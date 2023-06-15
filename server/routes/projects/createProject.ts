import Workspace from "@/controllers/workspace";
import ProjectModel, { Project, ProjectStatus } from "@/models/project";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN && req.user?.role !== UserRole.RESPO) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You are not authorized to create a project",
            },
        });
    }

    // Check project name
    if (!req.body.name) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Project name is required",
            },
        });
    }

    if (!/^[a-z][a-z0-9_-]*$/.test(req.body.name)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Project name must only contain lowercase letters, numbers, underscores, and dashes",
            },
        });
    }

    // Check project status
    let status = ProjectStatus.PLANED;
    if (req.body.status) {
        if (!Object.values(ProjectStatus).includes(req.body.status)) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid project status",
                },
            });
        }

        status = req.body.status;
    }

    const workspace = Workspace.fromName(req.body.name);

    if (workspace.exists()) {
        return res.status(409).json({
            status: "error",
            payload: {
                message: "Project name is already taken",
            },
        });
    }

    workspace.create();

    const project = {
        name: req.body.name,
        password: workspace.password,
        displayName: req.body.displayName ?? req.body.name,
        description: req.body.description ?? "",
        status: status,
        startDate: (req.body.startDate as Date) ?? null,
        endDate: (req.body.endDate as Date) ?? null,
        githubRepo: req.body.githubRepo ?? null,
        permissions: [],
        proxyAliases: [],
    };

    const projectModel = await ProjectModel.create(project);

    res.status(201).json({
        status: "success",
        payload: {
            message: "Project created successfully",
            id: projectModel._id,
        },
    });
};
