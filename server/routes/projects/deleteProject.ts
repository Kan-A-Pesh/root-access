import Workspace from "@/controllers/workspace";
import Endpoint, { EndpointResponse } from "@/endpoint";
import ProjectModel, { Project, ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.RESPO, // requiredPermission
    async (req: Request) => {
        try {
            Workspace.fromProject(req.project as Project).delete();
        } catch (err) {
            console.warn("[⚠️ WARNING] Failed to delete workspace (Not found)");
        }

        await ProjectModel.deleteOne({ _id: req.project?._id }).exec();

        return new EndpointResponse(200, "Successfully deleted project");
    },
);
