import { IUser } from "../interfaces/users/IUser";
import { ServiceResponse } from "../interfaces/ServiceResponse";
import UserModel from "../models/UserModel";
import JwtUtils from "../utils/JwtUtils";
import { Token } from "../interfaces";

export default class UserService {
  constructor(private userModel = new UserModel()) {}
  async login(user: { email: string, password: string }): Promise<ServiceResponse<Token>> {
    const jwtUtils = new JwtUtils();
    const foundUser = await this.userModel.findByEmail(user.email);
    if (!foundUser || foundUser.password !== user.password) {
      return { status: 'INVALID_DATA', data: { message: 'Wrong username or password' } };
    }
    const token = jwtUtils.sign({ id: foundUser.id, email: foundUser.email, role: foundUser.role });
      return { status: "SUCCESSFUL", data: { token: token } };
  }   
}