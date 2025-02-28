import { IOtpData } from "../../types/otp.types";



export interface IOTPservices {
    sendOtp(email: string, role: string): Promise<IOtpData | null>;
    // verifyOtp(email: string, otp: string): Promise<boolean>;
    // resendOtp(email: string, role: string): Promise<IOtpData | null>;
    // isOtpValid(email: string, otp: string): Promise<boolean>;
}