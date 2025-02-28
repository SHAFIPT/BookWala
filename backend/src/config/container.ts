// src/container.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { IOtpRepository } from "../repository/interface/IOtp.repository";
import { IOTPservices } from "../services/interface/IOtpService";
import { AuthController } from "../controller/Implementation/Auth/auth.contorller";
import { OtpService } from "../services/implimentation/Otp.service";
import { OtpRepository } from "../repository/implimentation/Otp.repository";
// Register all dependencies
container.register<IOtpRepository>("IOtpRepository", { useClass: OtpRepository });
container.register<IOTPservices>("IOTPservices", { useClass: OtpService });
container.register<AuthController>(AuthController, { useClass: AuthController });

export { container };