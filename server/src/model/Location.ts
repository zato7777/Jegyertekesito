import mongoose, { Document, Model, Schema } from "mongoose";

interface ILocation extends Document {
    name: String;
    address?: String;
    rows: Number;
    columns: Number;
}

const LocationSchema: Schema<ILocation> = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: false },
    rows: { type: Number, required: true },
    columns: { type: Number, required: true }
})

LocationSchema.pre('findOneAndDelete', async function(next) {
    const location = await this.model.findOne(this.getFilter());
    if (location) {
      await mongoose.model('Seat').deleteMany({ location: location._id });
    }
    next();
});

LocationSchema.index({ name: 1, address: 1 }, { unique: true });

export const Location: Model<ILocation> = mongoose.model<ILocation>("Location", LocationSchema);
