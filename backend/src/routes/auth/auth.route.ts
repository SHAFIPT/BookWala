import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../../controller/Implementation/Auth/auth.contorller";

const authRoute = Router()

const authController = container.resolve(AuthController)    

authRoute.post('/sendOtp', (req, res , next) => authController.sendOtp(req, res ,next));

export default authRoute