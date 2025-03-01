
import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    register(req: Request, res: Response, next: NextFunction): Promise<void>
}
