import { Schema, model, Document } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    RESPO = "respo",
    MEMBER = "member",
}

export class UserUtils {
    public static hasPermission(userPermission: UserRole | undefined, requiredPermission: UserRole) {
        if (!userPermission) return false;

        if (userPermission === UserRole.ADMIN) return true;
        if (userPermission === UserRole.RESPO && requiredPermission !== UserRole.ADMIN) return true;
        if (userPermission === UserRole.MEMBER && requiredPermission === UserRole.MEMBER) return true;

        return false;
    }
}

export interface User extends Document {
    handle: string;
    email: string;
    realname: string;
    passhash: string;
    role: UserRole;

    created: Date;
    lastLogin: Date;

    githubhandle?: string;
    discordId?: string;
}

const userSchema = new Schema<User>({
    handle: {
        type: String,
        required: true,
        unique: true,
        validate: /^[a-z][a-z0-9_-]*$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/,
    },
    realname: {
        type: String,
        required: true,
        validate: /^[a-zA-Z -'.]+$/,
    },
    passhash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
    },

    created: {
        type: Date,
        required: true,
    },
    lastLogin: {
        type: Date,
        required: true,
    },

    githubhandle: {
        type: String,
        required: false,
    },
    discordId: {
        type: String,
        required: false,
    },
});

const UserModel = model<User>("User", userSchema);

export default UserModel;
