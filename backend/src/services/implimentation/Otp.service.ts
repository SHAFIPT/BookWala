import { IOtpRepository } from "./../../repository/interface/IOtp.repository";
import { injectable, inject } from "tsyringe";
import { IOTPservices } from "../interface/IOtpService";
import { IOtpData } from "../../types/otp.types";
import { IEmailService } from "../interface/IEmailservice";

@injectable()
export class OtpService implements IOTPservices {
  constructor(
    @inject("IOtpRepository") private readonly otpRepo: IOtpRepository,
    @inject("IEmailService") private readonly emailService: IEmailService
  ) {}
  async sendOtp(email: string): Promise<IOtpData | null> {
    const otpRecord = await this.otpRepo.createOtp(email);

    console.log('this si teh createdopt ;;;',otpRecord)

    if (otpRecord) {
      await this.emailService.sendOtpEmail(email, otpRecord.otp);
    }

    console.log('Thsi is the otpRecode ;;;;;',otpRecord)

    return otpRecord;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return this.otpRepo.verifyOtp(email, otp);
  }

  async resendOtp(email: string): Promise<IOtpData | null> {
    const otpRecord = await this.otpRepo.resendOtp(email);

    if (otpRecord) {
      await this.emailService.sendOtpEmail(email, otpRecord.otp);
    }

    return otpRecord;
  }
} 
