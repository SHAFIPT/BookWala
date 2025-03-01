import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../../controller/Implementation/Auth/auth.contorller";

const authRoute = Router()

const authController = container.resolve(AuthController)    

authRoute.post('/sendOtp', (req, res , next) => authController.sendOtp(req, res ,next));
authRoute.post('/verifyOtp', (req, res, next) => authController.verifyOtp(req, res, next));
authRoute.post('/resendOtp', (req, res, next) => authController.resendOtp(req, res, next));
authRoute.post('/forgotPassword', (req, res, next) => authController.forgotPassword(req, res, next));
authRoute.post('/resetPassword', (req, res, next) => authController.resetPassword(req, res, next));

export default authRoute