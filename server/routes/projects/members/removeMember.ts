import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    // Check user role
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.CHIEF)) {
        return res.status(403).json({
            status: "error",
            payload: {
                message: "You do not have permission to remove a member from this project",
            },
        });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ handle: req.params.handle });

    if (!user) {
        return res.status(404).json({
            status: "error",
            payload: {
                message: "User not found",
            },
        });
    }

    // Check if the user is a member
    if (!req.project?.permissions.find((permission) => permission.userId === user._id)) {
        return res.status(400).json({
            status: "error",
            payload: {
                message: "User is not a member of this project",
            },
        });
    }

    // Remove the user from the project
    await ProjectModel.updateOne({ _id: req.project?._id }, { $pull: { permissions: { userId: user._id } } }).exec();

    res.status(200).json({
        status: "success",
        payload: {
            message: "User removed from project",
            id: user._id,
        },
    });
};
