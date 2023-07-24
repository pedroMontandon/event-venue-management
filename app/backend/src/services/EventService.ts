import { IEventModel } from "../interfaces/events/IEventModel";
import EventModel from "../models/EventModel";
import { IEvent } from "../interfaces/events/IEvent";
import { ServiceResponse } from "../interfaces/ServiceResponse";

export default class EventService {
  constructor(private eventModel = new EventModel()) {}

  async findAllOpened(): Promise<ServiceResponse<IEvent[]>> {
    const events = await this.eventModel.findAllOpened();
    return { status: "SUCCESSFUL", data: events };
  }

  async findAll(): Promise<ServiceResponse<IEvent[]>> {
    const events = await this.eventModel.findAll();
    return { status: "SUCCESSFUL", data: events };
  }
}