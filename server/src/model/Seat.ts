import mongoose, { Document, Model, Schema } from "mongoose";

interface ISeat extends Document {
    row: number;
    number: number;
    category: String;
    location: mongoose.Schema.Types.ObjectId;
}

const SeatSchema: Schema<ISeat> = new mongoose.Schema({
    row: { type: Number, required: true },
    number: { type: Number, required: true },
    category: { type: String, enum: ["normal", "featured", "premium", "disabled"], default: "normal" },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    
});

SeatSchema.index({ row: 1, number: 1, location: 1 }, { unique: true });

export const Seat: Model<ISeat> = mongoose.model<ISeat>("Seat", SeatSchema);
