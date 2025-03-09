import { IAuthRepository } from "../interface/IAuth.repository";
import { IAdmin, IUser } from "../../types/auth.types";
import userModel from "../../model/User.model";
import { BaseRepository } from "../BaseRepository";
import User from "../../model/User.model";
import Admin from "../../model/Admin.modal";

export class AuthRepository extends BaseRepository<IUser> implements IAuthRepository {
  constructor() {
    super(userModel);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    console.log("This is the email that chekc allready existt ;;;;", email);
    return this.findOne({ email });
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    console.log('Thsi si the passowd to uddate ;;:; ',userId)
    console.log('Thsi si the newPassword to newPassword ;;:; ',newPassword)
    return this.update(userId, { password: newPassword });
  }
  async register(
    name: string,
    email: string,
    password: string,    
    role: string
  ): Promise<IUser> {
    const newUser = await this.create({
      name,
      email,
      password,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newUser;
  }
  async saveUserRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<IUser | null> {
    try {
      return this.update(userId, { refreshToken });
    } catch (error) {
      console.error("Error saving refresh token:", error);
      throw new Error("Failed to save refresh token.");
    }
  }
  async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<IUser | null> {
    try {
      const userWithRemovedToken = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");

      return userWithRemovedToken;
    } catch (error) {
      return null;
    }
  }
  async findByAdminEmail(email: string): Promise<IAdmin | null> {
        try {

            const registedUser = await Admin.findOneAndUpdate(
                { email: email },  // Search for the user by email
                { $set: { lastLogin: new Date() } },  // Update lastLogin field
                { new: true }  // Return the updated user
            );


            if (!registedUser) {
                throw new Error('Admin is not found')
            }

            return registedUser
            
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw new Error('Failed to find Admin.');
        }
  }
  
  async saveAdminRefreshToken(userId: string, refreshToken: string): Promise<IAdmin | null>{
        try {
        
            return await Admin.findByIdAndUpdate(userId, { refreshToken });
            
        } catch (error) {
            console.error('Error saving refresh token:', error);
            throw new Error('Failed to save refresh token.');
        }
    } 
}
