export const checkSudoPermission: () => boolean = () => {
    if (process.platform !== "linux") return true;

    if (!process.getuid) return false;

    return process.getuid() === 0;
};
