import { IOTPservices } from '../../../services/interface/IOtpService';
import { IAuthController } from "../../interface/IAuthController";
import { injectable, inject } from "tsyringe";
import { CookieOptions, NextFunction, Request, Response } from 'express';

@injectable()
export class AuthController implements IAuthController{
    constructor(
         @inject("IOTPservices") private readonly otpService: IOTPservices,
    ) { }

    private readonly REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    public async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email, role } = req.body;

            const result = await this.otpService.sendOtp(email, role);
            
            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                data: result
            });
            
            
        } catch (error) {
            next(error)
        }
    }
    
}