import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        // Check if the user exists
        const user = await UserModel.findOne({ handle: req.params.handle });

        if (!user) {
            throw new EndpointError(404, "User not found");
        }

        // Check if the user is a member
        if (!req.project?.permissions.find((permission) => permission.userId === user._id)) {
            throw new EndpointError(400, "User is not a member of this project");
        }

        // Check if role is valid
        if (!Object.values(ProjectRole).includes(req.body.role)) {
            throw new EndpointError(400, "Invalid role");
        }

        const role = req.body.role as ProjectRole;

        // Check if the role is not too high
        if (ProjectUtils.hasPermission(role, ProjectRole.RESPO)) {
            throw new EndpointError(400, "You cannot set a member's role to RESPO or higher");
        }

        // Update the user's role
        await ProjectModel.updateOne(
            { _id: req.project?._id, "permissions.userId": user._id },
            { $set: { "permissions.$.role": role } },
        ).exec();

        return new EndpointResponse(200, {
            message: "User updated",
            id: user._id,
            role: role,
        });
    },
);
