export interface IEvent {
  id: number;
  eventName: string;
  description: string;
  date: Date;
  price: number;
  isOpen: boolean;
  placesRemaining: number;
}