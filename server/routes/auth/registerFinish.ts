import { Request, Response } from "express";
import UserModel from "@/models/user";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/cypher";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        // Parse token
        let payload: any;
        try {
            payload = jwt.verify(req.body.token, process.env.JWT_SECRET as string);
        } catch (err) {
            throw new EndpointError(400, "Invalid token");
        }

        // Verify handle
        if (!req.body.handle) {
            throw new EndpointError(400, "Handle is required");
        }

        if (/^[a-z][a-z0-9_-]*$/.test(req.body.handle) === false) {
            throw new EndpointError(400, "Invalid handle");
        }

        // Verify password
        if (!req.body.password) {
            throw new EndpointError(400, "Password is required");
        }

        if (req.body.password.length < 8) {
            throw new EndpointError(400, "Password too short");
        }

        // Hash password
        const passhash = await hashPassword(req.body.password);

        // Check if user already exists
        const user = await UserModel.findOne({
            $or: [{ handle: req.body.handle }, { email: payload.email }, { realname: payload.realname }],
        });

        if (user) {
            throw new EndpointError(400, "User already exists");
        }

        // Create user

        const request = await UserModel.create({
            handle: req.body.handle,
            email: payload.email,
            realname: payload.realname,
            passhash: passhash,
            role: payload.role,
            created: new Date(),
            lastLogin: new Date(),
        });

        if (!request) {
            throw new EndpointError(500, "Failed to create user");
        }

        // Send response
        return new EndpointResponse(200, {
            message: "User created",
            id: request._id,
        });
    },
);
