import { IUser } from "../../interfaces/users/IUser";
import { NewEntity } from "../../interfaces/";

export const validNewUser: NewEntity<IUser> = {
  username: "Valid User",
  email: "valid@email.com",
  password: "validPassword",
  role: "user",
  activationCode: "test",
  activated: false,
}

export default {
  validNewUser
}