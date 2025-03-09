import { IAdmin, IUser } from "../../types/auth.types"

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<IUser | null>
    updatePassword(userId: string, newPassword: string): Promise<IUser | null>
    register(name: string, email: string, password: string , role : string): Promise<IUser>
  saveUserRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>
  saveAdminRefreshToken(userId: string, refreshToken: string): Promise<IAdmin | null>
  removeRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>;
  findByAdminEmail(email: string): Promise<IAdmin | null>;
  }