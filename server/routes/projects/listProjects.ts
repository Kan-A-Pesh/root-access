import ProjectModel, { ProjectStatus } from "@/models/project";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    let query: any = { $and: [] };

    if (req.query.name) {
        query.$and.push({
            $or: [
                { name: { $regex: req.query.name, $options: "i" } },
                { displayName: { $regex: req.query.name, $options: "i" } },
                { description: { $regex: req.query.name, $options: "i" } },
            ],
        });
    }

    if (req.query.status) {
        if (Object.values(ProjectStatus).includes(req.query.status as any) === false) {
            return res.status(400).json({
                status: "error",
                payload: {
                    message: "Invalid status",
                },
            });
        }

        query.$and.push({ status: req.query.status });
    }

    if (req.query.startDate) {
        query.$and.push({ startDate: { $gte: req.query.startDate } });
    }

    if (req.query.endDate) {
        query.$and.push({ endDate: { $lte: req.query.endDate } });
    }

    const projectModels = await ProjectModel.find(query).exec();

    const projects = projectModels.map((projectModel) => {
        return {
            id: projectModel._id,
            name: projectModel.name,
            displayName: projectModel.displayName,
            description: projectModel.description,
            status: projectModel.status,
            startDate: projectModel.startDate,
            endDate: projectModel.endDate,
            canAccess: projectModel.permissions.some((permission) => {
                return permission.userId.toString() === req.user?._id.toString();
            }),
        };
    });

    res.status(200).json({
        status: "success",
        payload: projects,
    });
};
