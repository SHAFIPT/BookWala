import { IUser } from "../../types/auth.types";

export interface IAuthService {
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<IUser>
    register(name: string, email: string, password: string, role: string): Promise<{
    user: Omit<IUser, 'password' | 'refreshToken'>;
    accessToken: string;
    refreshToken: string;
    }> 
  logout(token: string, id: string): Promise<IUser | null>;
  login(credentials: { email: string; password: string; role: string }): Promise<{
    user: Omit<IUser, "password">;
    accessToken: string;
    refreshToken: string;
}>
  }