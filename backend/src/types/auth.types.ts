import { Document, ObjectId } from "mongoose";

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


export interface IAdmin extends Document {
  _id: ObjectId;
  email: string | null;
  password: string | null;
  role: string | null;
  refreshToken: string [] | null;
}