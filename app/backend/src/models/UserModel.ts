import { NewEntity } from "../interfaces";
import SequelizeUser from "../database/models/SequelizeUser";
import { IUserModel } from "../interfaces/users/IUserModel";
import { IUser } from "../interfaces/users/IUser";


export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async create(data: NewEntity<IUser>): Promise<IUser> {
    const user = await this.model.create(data);
    return user;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.model.findAll();
    return users;
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.model.findByPk(id);
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    return user;
  }

  async update(id: number, data: Partial<IUser>): Promise<IUser | null> {
    const user = await this.model.findByPk(id);
    if (!user) return null;
    const modifiedUser = await this.model.update(data, { where: { id } });
    return { ...user, ...data };
  }

  async delete(id: number): Promise<number> {
    const deletedUser = await this.model.destroy({where: {id}});
    return deletedUser;
  }
}