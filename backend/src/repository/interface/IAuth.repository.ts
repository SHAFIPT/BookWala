import { IUser } from "../../types/auth.types"

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<IUser | null>
    updatePassword(userId: string, newPassword: string): Promise<IUser | null>
  }