export const randomUUID: () => string = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// Generate a random 5-character string
export const randomText: () => string = () => {
    return Math.random().toString(36).slice(-5);
};

// Generate a random password (e.g. "abcde-fghij-klmno")
export const randomPassword: () => string = () => {
    return randomText() + "-" + randomText() + "-" + randomText();
};
