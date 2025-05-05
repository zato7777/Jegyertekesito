import mongoose, { Document, Model, Schema } from "mongoose";

interface ITicket extends Document {
    discount: String;
    order: mongoose.Schema.Types.ObjectId;
    seat: mongoose.Schema.Types.ObjectId;
    event: mongoose.Schema.Types.ObjectId;
}

const TicketSchema: Schema<ITicket> = new mongoose.Schema({
    discount: { type: String, enum: ["none", "child", "student", "retired", "veteran"], default: "none" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }
});

TicketSchema.index({ seat: 1, event: 1 }, { unique: true });
TicketSchema.index({ order: 1, seat: 1 }, { unique: true });

export const Ticket: Model<ITicket> = mongoose.model<ITicket>("Ticket", TicketSchema);