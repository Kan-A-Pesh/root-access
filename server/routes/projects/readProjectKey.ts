import Workspace from "@/controllers/workspace";
import { ProjectUtils, ProjectRole } from "@/models/project";
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    if (!ProjectUtils.hasPermission(req.permissionRole ?? ProjectRole.DEV, ProjectRole.RESPO)) {
        return res.status(403).json({
            status: "error",
            message: "Insufficient permissions",
        });
    }

    const workspace = new Workspace(req.project?.name ?? "");

    res.status(200).json({
        status: "success",
        payload: {
            private: workspace.getSSHPrivateKey(),
            public: workspace.getSSHPublicKey(),
        },
    });
};
