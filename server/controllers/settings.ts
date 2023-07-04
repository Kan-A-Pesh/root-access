import defaultSettings from "@/config/defaultSettings";
import SettingModel from "@/models/settings";

class Settings {
    public static listKeys(): string[] {
        return Object.keys(defaultSettings);
    }

    public static async get(key: string): Promise<string> {
        if (!Settings.listKeys().includes(key)) {
            throw new Error(`Invalid setting key: ${key}`);
        }

        const res = await SettingModel.findById(key);

        if (!res) {
            return defaultSettings[key as keyof typeof defaultSettings] as string;
        }

        return res.value;
    }

    public static async set(key: string, value: string): Promise<void> {
        if (!Settings.listKeys().includes(key)) {
            throw new Error(`Invalid setting key: ${key}`);
        }

        await SettingModel.findByIdAndUpdate(
            key,
            { value },
            { upsert: true }, // Create if it doesn't exist
        );

        return;
    }

    public static async getAll(): Promise<Record<string, string>> {
        const res = await SettingModel.find();

        const settings: Record<string, string> = {};

        // Fill with default values
        for (const [key, value] of Object.entries(defaultSettings)) {
            settings[key] = value as string;
        }

        // Fill with database values
        for (const setting of res) {
            settings[setting._id] = setting.value;
        }

        return settings;
    }

    public static async setAll(settings: Record<string, string>): Promise<void> {
        for (const key of Object.keys(settings)) {
            await Settings.set(key, settings[key]);
        }

        return;
    }

    public static async resetAll(): Promise<void> {
        await SettingModel.deleteMany({});

        return;
    }

    public static async reset(key: string): Promise<void> {
        if (!Settings.listKeys().includes(key)) {
            throw new Error(`Invalid setting key: ${key}`);
        }

        await SettingModel.findByIdAndDelete(key);

        return;
    }
}

export default Settings;
