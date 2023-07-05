import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import UserModel, { UserRole, UserUtils } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        // Check if role is valid
        if (!Object.values(ProjectRole).includes(req.body.role)) {
            throw new EndpointError(400, "Invalid role");
        }

        const role = req.body.role as ProjectRole;

        // Check if the user exists
        const user = await UserModel.findOne({ handle: req.body.handle });

        if (!user) {
            throw new EndpointError(404, "User not found");
        }

        // Check if the user is a ADMIN or RESPO
        if (UserUtils.hasPermission(user.role, UserRole.RESPO)) {
            throw new EndpointError(400, "User is already a member of this project");
        }

        // Check if the user is already a member
        if (req.project?.permissions.find((permission) => permission.userId === user._id)) {
            throw new EndpointError(400, "User is already a member of this project");
        }

        // Add the user to the project
        await ProjectModel.updateOne({ _id: req.project?._id }, { $push: { permissions: { userId: user._id, role: role } } }).exec();

        return new EndpointResponse(200, "User added to project");
    },
);
