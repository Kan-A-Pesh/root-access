import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface Session extends Document {
    userId: ObjectId;
    lastUsed: Date;
}

const sessionSchema = new Schema<Session>({
    _id: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lastUsed: {
        type: Date,
        default: Date.now,
    },
});

const SessionModel = model<Session>("Session", sessionSchema);

export default SessionModel;
