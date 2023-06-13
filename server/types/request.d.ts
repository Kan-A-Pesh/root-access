import { Project, ProjectRole } from "@/models/project";
import { User } from "@/models/user";

declare module "express" {
    interface Request {
        user?: User;
        project?: Project;
        permissionRole?: ProjectRole;
    }
}
