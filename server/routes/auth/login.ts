import { verifyPassword } from "@/utils/cypher";
import UserModel from "@/models/user";
import { Request, Response } from "express";
import SessionModel from "@/models/session";
import { randomUUID } from "@/utils/random";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        // Check handle
        if (!req.body.handle) {
            throw new EndpointError(400, "Handle is required");
        }

        // Check password
        if (!req.body.password) {
            throw new EndpointError(400, "Password is required");
        }

        // Find user
        const user = await UserModel.findOne({
            handle: req.body.handle,
        });

        if (!user) {
            throw new EndpointError(400, "Invalid handle or password");
        }

        // Check password
        if ((await verifyPassword(req.body.password, user.passhash)) === false) {
            throw new EndpointError(400, "Invalid handle or password");
        }

        // Create session
        const session = await SessionModel.create({
            _id: randomUUID(),
            userId: user._id,
        });

        // Send token
        return new EndpointResponse(200, {
            token: session._id,
        });
    },
);
