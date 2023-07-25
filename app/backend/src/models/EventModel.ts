import { NewEntity } from "../interfaces";
import SequelizeEvent from "../database/models/SequelizeEvent";
import { IEventModel } from "../interfaces/events/IEventModel";
import { IEvent } from "../interfaces/events/IEvent";

export default class EventModel implements IEventModel {
  private model = SequelizeEvent;

  async create(data: NewEntity<IEvent>): Promise<IEvent> {
    const event = await this.model.create(data);
    return event;
  }

  async findAll(): Promise<IEvent[]> {
    const events = await this.model.findAll();
    return events;
  }

  async findAllOpened(): Promise<IEvent[]> {
    const events = await this.model.findAll({ where: { isOpen: true } });
    return events;
  }

  async findById(id: number): Promise<IEvent | null> {
    const event = await this.model.findByPk(id);
    return event;
  }

  async update(id: number, data: Partial<IEvent>): Promise<IEvent | null> {
    const event = await this.model.findByPk(id);
    if (!event) return null;
    const modifiedEvent = await this.model.update(data, { where: { id } });
    return { ...event, ...data };
  }

  async updatePlaces(id: number): Promise<void> {
    const event = await this.model.findByPk(id);
    const placesRemaining = event?.placesRemaining as number - 1;
    await this.model.update({ placesRemaining }, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    const deletedEvent = await this.model.destroy({where: {id}});
    return deletedEvent;
  }
}