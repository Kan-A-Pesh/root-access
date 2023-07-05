import { Request, Response } from "express";
import { UserRole, UserUtils } from "./models/user";
import { ProjectRole, ProjectUtils } from "./models/project";

class EndpointError extends Error {
    public code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

class EndpointResponse {
    public code: number;
    public payload?: any;

    constructor(code: number, payload?: any) {
        this.code = code;
        this.payload = payload;
    }
}

class Endpoint {
    private func: (req: Request) => Promise<EndpointResponse>;
    private requiredRole: UserRole | null;
    private requiredPermission: ProjectRole | null;

    constructor(requiredRole: UserRole | null, requiredPermission: ProjectRole | null, func: (req: Request) => Promise<EndpointResponse>) {
        this.func = func;
        this.requiredRole = requiredRole;
        this.requiredPermission = requiredPermission;
    }

    public express = async (req: Request, res: Response) => {
        // Check user role
        if (this.requiredRole && !UserUtils.hasPermission(req.user?.role, this.requiredRole)) {
            return res.status(403).json({
                status: "error",
                payload: {
                    message: "You do not have the required role to access this endpoint",
                },
            });
        }

        // Check project permission
        if (this.requiredPermission && !ProjectUtils.hasPermission(req.permissionRole, this.requiredPermission)) {
            return res.status(403).json({
                status: "error",
                payload: {
                    message: "You do not have the required permission to access this endpoint",
                },
            });
        }

        let code: number = 500;
        let payload: any = "Unknown error";

        try {
            // Run the endpoint
            const result = await this.func(req);
            code = result.code;
            payload = result.payload;
        } catch (err) {
            // Handle errors
            if (err instanceof EndpointError) {
                code = err.code;
                payload = err.message;
            } else if (err instanceof Error) {
                code = 500;
                payload = err.message;
            } else {
                code = 500;
                payload = "Unknown error";
            }
        }

        // Parse status from code
        let status = "unknown";
        if (code >= 100) status = "info";
        if (code >= 200) status = "success";
        if (code >= 300) status = "redirect";
        if (code >= 400) status = "error";
        if (code >= 500) status = "failure";

        // Convert string payload to object
        if (typeof payload === "string") {
            payload = {
                message: payload,
            };
        }

        // Return the response
        return res.status(code).json({
            status: status,
            payload: payload,
        });
    };
}

export default Endpoint;

export { EndpointError, EndpointResponse };
