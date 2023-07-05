import Settings from "@/controllers/settings";
import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import { UserRole } from "@/models/user";
import { Request, Response } from "express";

export default new Endpoint(
    UserRole.ADMIN, // requiredRole
    null, // requiredPermission
    async (req: Request) => {
        if (!req.body) {
            throw new EndpointError(400, "No settings provided");
        }

        const settings = req.body;
        const defaultSettingsKeys = Settings.listKeys();

        for (const key of Object.keys(settings)) {
            if (!defaultSettingsKeys.includes(key)) {
                throw new EndpointError(400, `Invalid setting key: ${key}`);
            }

            if (typeof settings[key] !== "string") {
                throw new EndpointError(400, `Invalid setting value for key ${key}`);
            }

            await Settings.set(key, settings[key]);
        }

        return new EndpointResponse(200, "Settings updated");
    },
);
