import { IAuthService } from "../interface/IAuthservice";
import { IAuthRepository } from "../../repository/interface/IAuth.repository";
import { injectable, inject } from "tsyringe";
import { IOTPservices } from "../../services/interface/IOtpService";
import { IUser } from "../../types/auth.types";
import { comparePassword, hashPassword } from "../../helpers/hashPass";
import { ITokenService } from "../interface/ITokenService";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IAuthRepository") private readonly authRepo: IAuthRepository,
    @inject("IOTPservices") private readonly otpService: IOTPservices,
    @inject("ITokenService") private readonly tokenService: ITokenService
  ) {}

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new Error("User not found");
    await this.otpService.sendOtp(email);
    return true;
  }

  async resetPassword(email: string, newPassword: string): Promise<IUser> {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const hashedPassword = await hashPassword(newPassword)

    const updatedUser = await this.authRepo.updatePassword(
      user.id,
      hashedPassword
    );
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{
    user: Omit<IUser, "password" | "refreshToken">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.authRepo.findUserByEmail(email);

    if (existingUser) throw new Error("User Already Exists");

    const hashedPassword = await hashPassword(password);

    const userRole = role || "user";
    const newUser = await this.authRepo.register(
      name,
      email,
      hashedPassword,
      userRole
    );

    const tokenPayload = {
      id: newUser.id,
      role: newUser.role || role,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    await this.authRepo.saveUserRefreshToken(newUser.id, refreshToken);

    const {
      password: pwd,
      refreshToken: rt,
      ...userWithoutSensitive
    } = newUser.toObject
      ? newUser.toObject()
      : JSON.parse(JSON.stringify(newUser));

    return {
      user: userWithoutSensitive as IUser,
      accessToken,
      refreshToken,
    };
  }
  async logout(token: string, id: string): Promise<IUser | null> {
    try {
      const user = await this.authRepo.removeRefreshToken(id, token);

      return user ? user : null;
    } catch (error) {
      return null;
    }
  }
  async login(credentials: { email: string; password: string; role: string; }): Promise<{ user: Omit<IUser, "password">; accessToken: string; refreshToken: string; }> {
     try {
            let user;
            const { email, password, role } = credentials;
            
            // Based on role, query the appropriate collection
            if (role === 'admin') {
                user = await this.authRepo.findByAdminEmail(email);
            } else if (role === 'user') {
                user = await this.authRepo.findUserByEmail(email);
            } else {
                throw new Error('Invalid role specified.');
            }
            
            if (!user) {
                throw new Error('Invalid email or password.');
            }    
            
            if (!user.password) {
                throw new Error('User password not set.');
            }

            // Compare password
            const isPasswordValid = await comparePassword(password , user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password.');
            }

            // Generate tokens
            const tokenPayload = {
                id: user.id,
                role: user.role || role // Use the role from user object if available, otherwise use the provided role
            };
                
            const accessToken = this.tokenService.generateAccessToken(tokenPayload);
            const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

            // Save refresh token
            if (role === 'admin') {
            await this.authRepo.saveAdminRefreshToken(user.id, refreshToken);
            } else {
                await this.authRepo.saveUserRefreshToken(user.id, refreshToken);
            }

            // Remove sensitive data
             const { password: _, refreshToken: __, ...userWithoutSensitive } = user.toObject();

            return {
                user: userWithoutSensitive as IUser,
                accessToken,
                refreshToken
            };
            
      
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }
}
