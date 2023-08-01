import { ServiceResponse } from "../interfaces/ServiceResponse";
import UserModel from "../models/UserModel";
import JwtUtils from "../utils/JwtUtils";
import { Token } from "../interfaces";
import * as bcrypt from "bcryptjs";
import { emailQueue } from "./QueueService";
import buildActivationUrl from "../utils/activationUrlBuilder";
import activationCodeGenerator from "../utils/activationCodeGenerator";

export default class UserService {
  constructor(private userModel = new UserModel()) {}
  
  async login(user: { email: string, password: string }): Promise<ServiceResponse<Token>> {
    const jwtUtils = new JwtUtils();
    const foundUser = await this.userModel.findByEmail(user.email);
    if (!foundUser || !bcrypt.compareSync(user.password, foundUser?.password)) {
      return { status: 'INVALID_DATA', data: { message: 'Invalid username or password' } };
    }
    const token = jwtUtils.sign({ id: foundUser.id, email: foundUser.email, role: foundUser.role });
      return { status: "SUCCESSFUL", data: { token: token } };
  }
  
  async signUp(user: { email: string, username: string, password: string }): Promise<ServiceResponse<{ message: string }>> {
    if (await this.userModel.findByEmail(user.email)) {
      return { status: 'INVALID_DATA', data: { message: 'User already exists' } };
    }
    const cryptedPassword = await bcrypt.hash(user.password, 10);
    const { id, activationCode } = await this.userModel.create({ username: user.username, email: user.email, password: cryptedPassword, role: 'user', activationCode: activationCodeGenerator.generateActivationCode(), activated: false });
    await emailQueue.add({method: 'sendCodeEmail', email: user.email, username: user.username, code: buildActivationUrl({ id, activationCode })});
    return { status: 'CREATED', data: { message: `${user.username} account was created. Access ${user.email} and click on the link to activate your account` } };
  }

  async activateAccount(id: number, activationCode: string): Promise<ServiceResponse<{ message: string }>> {
    const user = await this.userModel.findById(id);
    if(!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    if(user?.activationCode === activationCode) {
      await this.userModel.update(id, { activated: true });
      return { status: 'SUCCESSFUL', data: { message: 'Account activated successfully' } };
    }
    return { status: 'INVALID_DATA', data: { message: 'Invalid activation code' } };
  }
}