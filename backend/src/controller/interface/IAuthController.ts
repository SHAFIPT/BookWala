
import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
}
