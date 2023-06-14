import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

export enum ProjectRole {
    ADMIN = "admin",
    RESPO = "respo",
    CHIEF = "chief",
    DEV = "dev",
}

export enum ProjectStatus {
    IDEA = "idea",
    PLANED = "planed",
    IN_PROGRESS = "in_progress",
    FINISHED = "finished",
    ABANDONED = "abandoned",
}

export interface Project extends Document {
    name: string;
    password: string;
    displayName: string;
    description: string;
    status: ProjectStatus;
    startDate: Date;
    endDate: Date;
    githubRepo: string;
    permissions: Array<{
        userId: ObjectId;
        role: ProjectRole;
    }>;
}

const projectSchema = new Schema<Project>({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: /^[a-z][a-z0-9_-]*$/,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    githubRepo: {
        type: String,
        required: true,
    },
    permissions: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            role: {
                type: String,
                enum: Object.values(ProjectRole),
                required: true,
            },
        },
    ],
});

const ProjectModel = model<Project>("Project", projectSchema);

export default ProjectModel;
