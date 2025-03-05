import { IOTPservices } from '../../../services/interface/IOtpService';
import { IAuthController } from "../../interface/IAuthController";
import { injectable, inject } from "tsyringe";
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { IAuthService } from '../../../services/interface/IAuthservice';

@injectable()
export class AuthController implements IAuthController{
    constructor(
         @inject("IOTPservices") private readonly otpService: IOTPservices,
         @inject("IAuthService") private readonly authService: IAuthService,
    ) { }

    private readonly REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    public async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email} = req.body;

            const result = await this.otpService.sendOtp(email);
            
            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                data: result
            });
            
            
        } catch (error) {
            next(error)
        }
    }
    public async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { email, otp } = req.body;
          const isVerified = await this.otpService.verifyOtp(email, otp);
    
          if (!isVerified) throw new Error("Invalid OTP.");
    
          res.status(200).json({
            success: true,
            message: "OTP verified successfully"
          });
        } catch (error) {
          next(error);
        }
      }
    
      public async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { email, role } = req.body;
          const result = await this.otpService.resendOtp(email);
    
          res.status(200).json({
            success: true,
            message: "OTP resent successfully",
            data: result
          });
        } catch (error) {
          next(error);
        }
      }

      public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { email } = req.body;
          await this.authService.forgotPassword(email);
          res.status(200).json({
            success: true,
            message: "Password reset token sent to email"
          });
        } catch (error) {
          next(error);
        }
      }
      public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { email, newPassword } = req.body;
          const updatedUser = await this.authService.resetPassword(email, newPassword);
          res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: updatedUser
          });
        } catch (error) {
          next(error);
        }
      }

      public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const {name, email, password } = req.body;
          const user = await this.authService.register(name, email, password);
          res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: user
          });
        } catch (error) {
          next(error);
        }
      }
     
      }

    
