import OtpModal from "../../model/Otp.modal";
import { IOtpData } from "../../types/otp.types";
import { generateExpirationTime, generateOtp } from "../../utils/otpUtils";
import { BaseRepository } from "../BaseRepository";
import { IOtpRepository } from "../interface/IOtp.repository";


export class OtpRepository extends BaseRepository <IOtpData> implements IOtpRepository{
    constructor() {
        super(OtpModal)
    }
    async createOtp(email: string, role: string): Promise<IOtpData | null> {
        try {

            const otp = generateOtp()
            const expirationTime = generateExpirationTime(1);

            const newOtp = new OtpModal({
                email,
                otp,
                expirationTime,
                attempts: 0,
                reSendCount: 0,
                lastResendTime: null,
                role
            });

            await newOtp.save()
            return newOtp;
            
        } catch (error) {
            console.error(error)
            throw new Error('Error in create new otp...')
        }
    }
}