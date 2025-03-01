import { IUser } from "../../types/auth.types";

export interface IAuthService {
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<IUser>
    register(name: string, email: string, password: string): Promise<IUser>
  }