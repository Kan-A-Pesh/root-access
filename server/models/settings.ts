import { Schema, model, Document } from "mongoose";

export interface Setting extends Document {
    value: string;
}

const settingSchema = new Schema<Setting>({
    _id: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});

const SettingModel = model<Setting>("Setting", settingSchema);

export default SettingModel;
