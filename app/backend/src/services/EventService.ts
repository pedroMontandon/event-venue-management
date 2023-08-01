import { IEventModel } from "../interfaces/events/IEventModel";
import EventModel from "../models/EventModel";
import { IEvent } from "../interfaces/events/IEvent";
import { ServiceResponse } from "../interfaces/ServiceResponse";
import JwtUtils from '../utils/JwtUtils';

export default class EventService {
  constructor(private eventModel = new EventModel()) {}
  private jwtUtils = new JwtUtils();

  async findAll(token: string | undefined): Promise<ServiceResponse<IEvent[]>> {
    try {
      if (!token || !this.jwtUtils.isAdmin(token)) {
        const events = await this.eventModel.findAllOpened();
        return { status: "SUCCESSFUL", data: events };
      }
    } catch {
      return { status: 'INTERNAL_SERVER_ERROR', data: { message: "Internal server error" } };
    }
    const events = await this.eventModel.findAll();
    return { status: "SUCCESSFUL", data: events };
  }
}