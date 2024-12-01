import mongoose, { Schema, Document } from 'mongoose';

interface IProfile extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBusiness: boolean;
}

const profileSchema: Schema = new Schema(
  {
    firstName: { type: Schema.Types.String, required: true},
    lastName: { type: Schema.Types.String, required: true},
    email: { type: Schema.Types.String, required: true, unique: true  },
    password: { type: Schema.Types.String, required: true, unique: true  },
    isBusinessOwner: {type: Schema.Types.Boolean, required: true}
  },
  { timestamps: true }
);

const Profile = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;