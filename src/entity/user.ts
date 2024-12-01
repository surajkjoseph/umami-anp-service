import mongoose, { Schema, Document } from 'mongoose';

interface IProfile extends Document {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isBusiness: boolean;
}

const profileSchema: Schema = new Schema(
  {
    id: { type: Number, required: true },
    firstName: { type: Number, required: true },
    lastName: { type: Number, required: true },
    email: { type: Number, required: true },
    isBusiness: {type: Boolean, required: true}
  },
  { timestamps: true }
);

const Profile = mongoose.model<IProfile>('Item', profileSchema);
export default Profile;