import { IAuthService } from "../interface/IAuthservice";
import { IAuthRepository } from "../../repository/interface/IAuth.repository";
import { injectable, inject } from "tsyringe";
import { IOTPservices } from "../../services/interface/IOtpService";
import { IUser } from "../../types/auth.types";
import { hashPassword } from "../../helpers/hashPass";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IAuthRepository") private readonly authRepo: IAuthRepository,
    @inject("IOTPservices") private readonly otpService: IOTPservices
  ) {}

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new Error("User not found");
    await this.otpService.sendOtp(email);
    return true;
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<IUser> {

    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const updatedUser = await this.authRepo.updatePassword(
      user.id,
      newPassword
    );
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }
  async register(name: string, email: string, password: string): Promise<IUser> {
    const user = await this.authRepo.findUserByEmail(email);
    if (user) throw new Error("User Already Exists");
  

    const hashedPassword = await hashPassword(password);
  
    const newUser = await this.authRepo.register(name, email, hashedPassword);
    if (!newUser) throw new Error("User registration failed");
    return newUser;
  }
}
