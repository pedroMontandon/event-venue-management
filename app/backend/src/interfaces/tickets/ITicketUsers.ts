import { IUser } from "../users/IUser";
import { ITicket } from "./ITicket";

export interface ITicketUsers extends ITicket {
    id: number;
    eventId: number;
    userId: number;
    visitor: string;
    reclaimed: boolean;
    accessKey: string;
    users: IUser[];
}