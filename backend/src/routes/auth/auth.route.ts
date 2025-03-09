import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../../controller/Implementation/Auth/auth.contorller";
import { decodedUserRefreshToken } from "../../middleware/authMiddleWare";
import { AuthenticatedRequest } from "../../types/AuthenticateRequst";

const authRoute = Router()

const authController = container.resolve(AuthController)    

authRoute.post('/login', (req, res , next) => authController.login(req, res ,next));
authRoute.post('/sendOtp', (req, res , next) => authController.sendOtp(req, res ,next));
authRoute.post('/verifyOtp', (req, res, next) => authController.verifyOtp(req, res, next));
authRoute.post('/resendOtp', (req, res, next) => authController.resendOtp(req, res, next));
authRoute.post('/registerUser', (req, res, next) => authController.register(req, res, next));
authRoute.post('/sendPasswordResetOTP', (req, res, next) => authController.forgotPassword(req, res, next));
authRoute.post('/resetPassword', (req, res, next) => authController.resetPassword(req, res, next));
authRoute.post('/logout',decodedUserRefreshToken, (req, res , next) => authController.logout(req as AuthenticatedRequest, res , next));

export default authRoute