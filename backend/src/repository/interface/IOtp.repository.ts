import { IOtpData } from "../../types/otp.types";

export interface IOtpRepository {
    createOtp(email: string, role: string): Promise<IOtpData | null>;
    // findByEmail(email: string): Promise<IOtpData | null>;
    // verifyOtp(email: string, otp: string): Promise<boolean>;
    // deleteOtp(email: string): Promise<boolean>;
    // updateOtp(email: string, otp: string): Promise<IOtpData | null>;
}
