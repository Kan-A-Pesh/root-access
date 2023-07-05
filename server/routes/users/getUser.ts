import Endpoint, { EndpointResponse, EndpointError } from "@/endpoint";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        if (!req.params.handle) {
            return new EndpointResponse(200, req.user);
        }

        const userModel = await UserModel.findOne({ handle: req.params.handle });

        if (!userModel) {
            throw new EndpointError(404, "User not found");
        }

        // Remove passhash
        const { passhash, ...user } = userModel.toObject();

        return new EndpointResponse(200, user);
    },
);
