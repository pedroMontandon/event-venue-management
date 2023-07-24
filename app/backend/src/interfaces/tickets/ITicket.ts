export interface ITicket {
  id: number;
  eventId: number;
  userId: number;
  visitor: string;
  reclaimed: boolean;
  accessKey: string;
}