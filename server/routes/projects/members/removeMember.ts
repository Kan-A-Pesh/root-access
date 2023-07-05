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

        // Remove the user from the project
        await ProjectModel.updateOne({ _id: req.project?._id }, { $pull: { permissions: { userId: user._id } } }).exec();

        return new EndpointResponse(200, {
            message: "User removed from project",
            id: user._id,
        });
    },
);
