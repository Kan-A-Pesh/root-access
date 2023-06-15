import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

export enum ProjectRole {
    ADMIN = "admin",
    RESPO = "respo",
    CHIEF = "chief",
    DEV = "dev",
}

export enum ProjectStatus {
    PLANED = "planed",
    IN_PROGRESS = "in_progress",
    FINISHED = "finished",
    ABANDONED = "abandoned",
}

export class ProjectUtils {
    public static hasPermission(userPermission: ProjectRole, requiredPermission: ProjectRole) {
        if (userPermission === ProjectRole.ADMIN) return true;
        if (userPermission === ProjectRole.DEV && requiredPermission === ProjectRole.DEV) return true;
        if (userPermission === ProjectRole.RESPO && requiredPermission !== ProjectRole.ADMIN) return true;
        if (userPermission === ProjectRole.CHIEF && requiredPermission !== ProjectRole.ADMIN && requiredPermission !== ProjectRole.RESPO)
            return true;

        return false;
    }
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
    proxyAliases: Array<{
        id: number;
        remoteUrls: string[];
        destination: string;
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
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
    githubRepo: {
        type: String,
        required: false,
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
    proxyAliases: [
        {
            id: {
                type: Number,
                required: true,
            },
            remoteUrls: {
                type: [String],
                required: true,
            },
            destination: {
                type: String,
                required: true,
            },
        },
    ],
});

const ProjectModel = model<Project>("Project", projectSchema);

export default ProjectModel;
