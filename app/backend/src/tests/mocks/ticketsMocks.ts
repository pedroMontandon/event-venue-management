import { ITicket } from "../../interfaces/tickets/ITicket";

export const validTickets: ITicket[] = [
  {
    id: 1,
    eventId: 1,
    userId: 1,
    visitor: 'visitor1',
    reclaimed: false,
    accessKey: 'accessKey1',
  },
  {
    id: 2,
    eventId: 2,
    userId: 2,
    visitor: 'visitor2',
    reclaimed: false,
    accessKey: 'accessKey2',
  },
  {
    id: 3,
    eventId: 2,
    userId: 3,
    visitor: 'visitor3',
    reclaimed: true,
    accessKey: 'accessKey3',
  }  
];

export const sameEventTickets: ITicket[] = [
  {
    id: 1,
    eventId: 1,
    userId: 1,
    visitor: 'visitor1',
    reclaimed: false,
    accessKey: 'accessKey1',
  },
  {
    id: 2,
    eventId: 1,
    userId: 2,
    visitor: 'visitor2',
    reclaimed: false,
    accessKey: 'accessKey2',
  },
  {
    id: 3,
    eventId: 1,
    userId: 3,
    visitor: 'visitor3',
    reclaimed: true,
    accessKey: 'accessKey3',
  }
];