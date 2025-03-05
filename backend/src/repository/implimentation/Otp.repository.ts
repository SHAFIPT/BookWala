import OtpModel from "../../model/Otp.model";
import { IOtpData } from "../../types/otp.types";
import { generateExpirationTime, generateOtp } from "../../utils/otpUtils";
import { BaseRepository } from "../BaseRepository";
import { IOtpRepository } from "../interface/IOtp.repository";

export class OtpRepository
  extends BaseRepository<IOtpData>
  implements IOtpRepository
{
  constructor() {
    super(OtpModel);
  }
  async createOtp(email: string): Promise<IOtpData | null> {
    try {
      const otp = generateOtp();
      const expirationTime = generateExpirationTime(1);

      const newOtp = new OtpModel({
        email,
        otp,
        expirationTime,
        attempts: 0,
        reSendCount: 0,
        lastResendTime: null,
      });
      return await this.create(newOtp);
    } catch (error) {
      console.error(error);
      throw new Error("Error in create new otp...");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const otpRecord = await this.findOne({ email });

      if (!otpRecord) throw new Error("OTP not found.");
      if (otpRecord.otp !== otp) throw new Error("Invalid OTP.");
      if (new Date() > otpRecord.expirationTime)
        throw new Error("OTP expired.");

      await this.model.deleteMany({ email });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resendOtp(email: string): Promise<IOtpData | null> {
    try {
      const existingOtp = await this.findOne({ email });

      if (existingOtp && existingOtp.reSendCount >= 3) {
        throw new Error("Maximum OTP resend limit reached.");
      }

      const otp = generateOtp();
      const expirationTime = generateExpirationTime(1);

      const newOtp = new OtpModel({
        email,
        otp,
        expirationTime,
        attempts: 0,
        reSendCount: existingOtp ? existingOtp.reSendCount + 1 : 0,
        lastResendTime: new Date(),
      });

      return await this.create(newOtp);
    } catch (error) {
      console.error(error);
      throw new Error("Error in resending OTP.");
    }
  }
}
