import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    // Check user role
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You do not have permission to add a member to this project",
            },
        });
    }

    // Check if role is valid
    if (!Object.values(ProjectRole).includes(req.body.role)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "Invalid role",
            },
        });
    }

    const role = req.body.role as ProjectRole;

    // Check if the user exists
    const user = await UserModel.findOne({ handle: req.body.handle });

    if (!user) {
        return res.status(404).json({
            status: "error",
            payload: {
                message: "User not found",
            },
        });
    }

    // Check if the user is already a member
    if (req.project?.permissions.find((permission) => permission.userId === user._id)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User is already a member of this project",
            },
        });
    }

    // Add the user to the project
    await ProjectModel.updateOne({ _id: req.project?._id }, { $push: { permissions: { userId: user._id, role: role } } }).exec();

    res.status(200).json({
        status: "success",
        payload: {
            message: "User added to project",
            id: user._id,
            role: role,
        },
    });
};
