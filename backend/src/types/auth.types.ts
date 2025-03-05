import { Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  ProfilePic?: string;
  role?: string;
  isBlocked?: boolean;
  refreshToken?: string[];
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
