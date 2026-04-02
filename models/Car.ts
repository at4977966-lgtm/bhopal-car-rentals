import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  name: string;
  brand: string;
  image: string;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'EV' | 'Hybrid';
  seats: number;
  selfDrivePrice: number;
  withDriverPrice: number;
  availableSelfDrive: boolean;
  availableDriver: boolean;
}

const CarSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
  fuel: { type: String, enum: ['Petrol', 'Diesel', 'EV', 'Hybrid'], required: true },
  seats: { type: Number, required: true },
  selfDrivePrice: { type: Number, required: true },
  withDriverPrice: { type: Number, required: true },
  availableSelfDrive: { type: Boolean, default: true },
  availableDriver: { type: Boolean, default: true },
});

export default mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);