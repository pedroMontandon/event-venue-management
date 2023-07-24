export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  activationCode: string;
  activated: boolean;
}