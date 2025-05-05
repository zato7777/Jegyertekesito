import mongoose, { Document, Model, Schema } from "mongoose";

interface IEvent extends Document {
    title: String;
    date: Date;
    defaultPrice: Number;
    images?: String[];
    organizer: mongoose.Schema.Types.ObjectId;
    location: mongoose.Schema.Types.ObjectId;
}

const EventSchema: Schema<IEvent>  = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    defaultPrice: { type: Number, required: true },
    images: [{ type: String }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
});

EventSchema.index({ location: 1, date: 1 }, { unique: true });

export const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);