import mongoose, { Schema, Document } from 'mongoose';

interface IProfile extends Document {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBusiness: boolean;
}

const profileSchema: Schema = new Schema(
  {
    id: { type: Number, required: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true  },
    password: { type: String, required: true, unique: true  },
    isBusinessOwner: {type: Boolean, required: true}
  },
  { timestamps: true }
);

const Profile = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;