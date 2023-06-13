export const parseRole = (role: string) => {
    switch (role) {
        case "admin":
            return "Administrator";
        case "respo":
            return "Manager";
        case "member":
            return "Member";
        default:
            return "Unknown";
    }
};
