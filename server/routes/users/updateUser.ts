import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import UserModel, { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.ADMIN, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        if (!req.params.handle) {
            throw new EndpointError(400, "Handle is required");
        }

        if (!req.body.role || !Object.values(UserRole).includes(req.body.role)) {
            throw new EndpointError(400, "Missing or invalid role");
        }

        if (req.user?.handle === req.params.handle) {
            throw new EndpointError(400, "Cannot update your own role");
        }

        // Update user
        const user = await UserModel.findOneAndUpdate({ handle: req.params.handle }, { role: req.body.role }, { new: false });

        if (!user) {
            throw new EndpointError(404, "User not found");
        }

        return new EndpointResponse(200, {
            message: "User updated",
            from: user.role,
            to: req.body.role,
        });
    },
);
