import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrder extends Document {
    orderDate: Date;
    status: String;
    user: mongoose.Schema.Types.ObjectId;
    event: mongoose.Schema.Types.ObjectId;
}

const OrderSchema: Schema<IOrder>  = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "compleated"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }
});

OrderSchema.pre('findOneAndDelete', async function(next) {
    const order = await this.model.findOne(this.getFilter());
    if (order) {
      await mongoose.model('Ticket').deleteMany({ order: order._id });
    }
    next();
});

export const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);