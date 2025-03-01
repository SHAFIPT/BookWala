import { IAuthRepository } from "../interface/IAuth.repository";
import { IUser } from "../../types/auth.types";
import userModel from "../../model/User.model";
import { BaseRepository } from "../BaseRepository";

export class AuthRepository extends BaseRepository<IUser> implements IAuthRepository {
  constructor() {
    super(userModel);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
    return this.update(userId, { password: newPassword });
  }
}
