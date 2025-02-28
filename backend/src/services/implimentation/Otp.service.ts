import { IOtpRepository } from './../../repository/interface/IOtp.repository';
import { injectable, inject } from "tsyringe";
import { IOTPservices } from "../interface/IOtpService";
import { IOtpData } from '../../types/otp.types';


@injectable()
export class OtpService implements IOTPservices{
    constructor(
       @inject("IOtpRepository") private readonly otpRepo : IOtpRepository 
    ) { }
    async sendOtp(email: string, role: string): Promise<IOtpData | null> {
        return this.otpRepo.createOtp(email ,role)
    }
}

