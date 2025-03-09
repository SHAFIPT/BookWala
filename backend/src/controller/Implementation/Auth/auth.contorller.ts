import { IOTPservices } from '../../../services/interface/IOtpService';
import { IAuthController } from "../../interface/IAuthController";
import { injectable, inject } from "tsyringe";
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { IAuthService } from '../../../services/interface/IAuthservice';
import { HttpStatus } from '../../../enums/HttpStatus';
import { ResponseMessages } from '../../../constants/Messages';
import { error } from 'console';
import { AuthenticatedRequest } from '../../../types/AuthenticateRequst';

@injectable()
export class AuthController implements IAuthController {
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

      const { email } = req.body;
            
      console.log('Thsi si the reseved dataa ;;', email)

      const result = await this.otpService.sendOtp(email);
            
      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.OTP_SENT,
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
    
      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.OTP_VERIFIED
      });
    } catch (error) {
      next(error);
    }
  }
    
  public async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, role } = req.body;
      const result = await this.otpService.resendOtp(email);
    
      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.OTP_RESENT,
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
      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.PASSWORD_RESET_EMAIL
      });
    } catch (error) {
      next(error);
    }
  }
  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      console.log('Ths i sithe requ.t body emai and pass ::',req.body)
      const updatedUser = await this.authService.resetPassword(email, newPassword);
      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.PASSWORD_UPDATED,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, password, role } = req.body;

      console.log('Thsi is the all data that get ;::::', {
        email,
        password,
        role,
        name
      })
          

      if (!email || !name || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.MISSING_FIELDS
        });
        return
      }

      const { user, accessToken, refreshToken } = await this.authService.register(name, email, password, role);

      res.status(HttpStatus.OK)
        .cookie('refreshToken', refreshToken, this.REFRESH_TOKEN_COOKIE_OPTIONS)
        .json({
          success: true,
          message: ResponseMessages.USER_REGISTERED,
          data: {
            user,
            accessToken
          }
        });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { email, password, role } = req.body;
          
          console.log('This are teh data get in backend ;::::',
            req.body
          )

            if (!email || !password || !role ) {
                res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: ResponseMessages.MISSING_FIELDS
                });
              return
            }
            

            const loginResult = await this.authService.login({ email, password, role });
            
            if (loginResult) {
                
                res.cookie('refreshToken', loginResult.refreshToken, this.REFRESH_TOKEN_COOKIE_OPTIONS);
                
                res.status(HttpStatus.OK).json({
                    message: 'Login successful',
                    user: loginResult.user,
                    accessToken: loginResult.accessToken
                });
            } else {
                res.status(500).json({
                    message: 'Login faild',
                });
            }


        } catch (error) {
            next(error);
        }
    }
      
  public async logout(
  req: AuthenticatedRequest,
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const { user } = req;

    const logoutData = await this.authService.logout(user.rawToken, user.id);

    if (logoutData) {
      res.status(HttpStatus.OK)
        .clearCookie("refreshToken")
        .json({message :  ResponseMessages.USER_LOGGED_OUT});
    }
  } catch (error) {
    next(error);
  }
}
}

    
