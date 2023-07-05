import Endpoint, { EndpointResponse } from "@/endpoint";
import SessionModel from "@/models/session";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        const token = req.headers.authorization?.split(" ")[1];

        await SessionModel.findByIdAndDelete(token).exec();

        return new EndpointResponse(200);
    },
);
