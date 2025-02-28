import mongoose, { Document, ObjectId } from "mongoose";

export interface IOtpData extends Document {
    email: string;
    otp: string;       
    expirationTime: Date;
    attempts: number;
    reSendCount: number;
    lastResendTime: Date | null;    
    role: string;
}