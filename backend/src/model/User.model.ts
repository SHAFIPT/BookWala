import mongoose , {Schema ,model} from 'mongoose';
import { IUser } from '../types/auth.types';
   
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  ProfilePic: { type: String, default: "https://www.svgrepo.com/show/192247/man-user.svg" },
  role: { type: String, default: 'user' },
  isBlocked: { type: Boolean, default: false },
  refreshToken: { type: [String], default: [] }, 
  lastLogin: { type: Date, default: null },
}, {timestamps : true});

const User = mongoose.model<IUser>('User', UserSchema)

export default User;