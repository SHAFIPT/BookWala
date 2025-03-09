
import "reflect-metadata";
import { container } from "tsyringe";
import { IOtpRepository } from "../repository/interface/IOtp.repository";
import { IOTPservices } from "../services/interface/IOtpService";
import { AuthController } from "../controller/Implementation/Auth/auth.contorller";
import { OtpService } from "../services/implimentation/Otp.service";
import { OtpRepository } from "../repository/implimentation/Otp.repository";
import { IEmailService } from "../services/interface/IEmailservice";
import { EmailService } from "../services/implimentation/Email.service";
import { IAuthController } from "../controller/interface/IAuthController";
import { IAuthRepository } from "../repository/interface/IAuth.repository";
import { IAuthService } from "../services/interface/IAuthservice";
import { AuthRepository } from "../repository/implimentation/Auth.repository";
import { AuthService } from "../services/implimentation/Auth.service";
import { ITokenService } from "../services/interface/ITokenService";
import { TokenService } from "../services/implimentation/token.service";
// Register all dependencies
container.registerSingleton<IEmailService>("IEmailService", EmailService);
container.register<IOtpRepository>("IOtpRepository", { useClass: OtpRepository });
container.register<IOTPservices>("IOTPservices", { useClass: OtpService });
container.register<IAuthRepository>("IAuthRepository", { useClass: AuthRepository });
container.register<IAuthService>("IAuthService", { useClass: AuthService });
container.register<ITokenService>("ITokenService", { useClass: TokenService });
container.register<IAuthController>("IAuthController", { useClass: AuthController });

export { container };