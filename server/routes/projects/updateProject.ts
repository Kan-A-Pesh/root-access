import Endpoint, { EndpointError, EndpointResponse } from "@/endpoint";
import ProjectModel, { ProjectRole, ProjectUtils } from "@/models/project";
import { Request, Response } from "express";

export default new Endpoint(
    null, // requiredRole
    ProjectRole.CHIEF, // requiredPermission
    async (req: Request) => {
        if (!req.project) {
            throw new EndpointError(500, "Project found, but not attached to request");
        }

        let changes: any = {};

        if (req.body.displayName) {
            changes.displayName = req.body.displayName;
        }

        if (req.body.description) {
            changes.description = req.body.description;
        }

        if (req.body.status) {
            if (!Object.values(ProjectRole).includes(req.body.status)) {
                throw new EndpointError(400, "Invalid project status");
            }

            changes.status = req.body.status;
        }

        if (req.body.startDate) {
            if (isNaN(Date.parse(req.body.startDate))) {
                throw new EndpointError(400, "Invalid start date");
            }

            changes.startDate = Date.parse(req.body.startDate);
        }

        if (req.body.endDate) {
            if (isNaN(Date.parse(req.body.endDate))) {
                throw new EndpointError(400, "Invalid end date");
            }

            changes.endDate = Date.parse(req.body.endDate);
        }

        if (req.body.githubRepo) {
            throw new EndpointError(400, "Github repo cannot be updated through this endpoint, use /projects/:id/repo instead");
        }

        const project = await ProjectModel.updateOne({ _id: req.project._id }, changes);

        if (!project) {
            throw new EndpointError(500, "Unexpected error occurred while updating project");
        }

        return new EndpointResponse(200, {
            message: "Project updated successfully",
            changes: changes,
        });
    },
);
