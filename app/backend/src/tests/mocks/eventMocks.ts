import { IEvent } from "../../interfaces/events/IEvent";

export const validEvents: IEvent[] = [
  {
    id: 1,
    eventName: 'openEvent',
    description: 'open and paid event',
    date: new Date("2023-08-01T16:44:38.149Z"),
    price: 10,
    isOpen: true,
    placesRemaining: 10
  },
  {
    id: 2,
    eventName: 'closedEvent',
    description: 'Only appears if you are invited or if you are an admin',
    date: new Date("2023-08-02T16:44:38.149Z"),
    price: 10,
    isOpen: false,
    placesRemaining: 10
  }
];

export const closedEvent: IEvent = {
  id: 2,
  eventName: 'closedEvent',
  description: 'Only appears if you are invited or if you are an admin',
  date: new Date("2023-08-02T16:44:38.149Z"),
  price: 10,
  isOpen: false,
  placesRemaining: 10
};

export const fullEvent: IEvent = {
  id: 1,
  eventName: 'openEvent',
  description: 'open and paid event',
  date: new Date("2023-08-01T16:44:38.149Z"),
  price: 10,
  isOpen: true,
  placesRemaining: 0
};

export const freeOpenEvent: IEvent = {
  id: 4,
  eventName: 'openEvent',
  description: 'open and free event',
  date: new Date("2023-08-01T16:44:38.149Z"),
  price: 10,
  isOpen: true,
}

export const returnedEvents = [
  {
    id: 1,
    eventName: 'openEvent',
    description: 'open and paid event',
    date: "2023-08-01T16:44:38.149Z",
    price: 10,
    isOpen: true,
    placesRemaining: 10
  },
  {
    id: 2,
    eventName: 'closedEvent',
    description: 'Only appears if you are invited or if you are an admin',
    date: "2023-08-02T16:44:38.149Z",
    price: 10,
    isOpen: false,
    placesRemaining: 10
  }
]