import Endpoint, { EndpointResponse } from "@/endpoint";
import UserModel from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        const userModels = await UserModel.find({});

        // Remove passhash
        const users = userModels.map((user) => {
            const { passhash, ...rest } = user.toObject();
            return rest;
        });

        return new EndpointResponse(200, users);
    },
);
