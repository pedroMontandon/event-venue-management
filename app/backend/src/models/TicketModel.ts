import { NewEntity } from "../interfaces";
import SequelizeTicket from "../database/models/SequelizeTicket";
import { ITicketModel } from "../interfaces/tickets/ITicketModel";
import { ITicket } from "../interfaces/tickets/ITicket";
import SequelizeEvent from "../database/models/SequelizeEvent";
import SequelizeUser from "../database/models/SequelizeUser";

export default class TicketModel implements ITicketModel {
  private model = SequelizeTicket;

  async create(data: NewEntity<ITicket>): Promise<ITicket> {
    const ticket = await this.model.create(data);
    return ticket;
  }

  async findAll(): Promise<ITicket[]> {
    const tickets = await this.model.findAll();
    return tickets;
  }

  async findById(id: number): Promise<ITicket | null> {
    const ticket = await this.model.findByPk(id);
    return ticket;
  }

  async findByEventId(id: number): Promise<ITicket[]> {
    const tickets = await this.model.findAll({ where: { eventId: id }, include: { model: SequelizeUser, as: 'users' } });
    return tickets;
  }

  async findMyTickets(userId: number): Promise<ITicket[]> {
    const tickets = await this.model.findAll({ where: { userId } });
    return tickets;
  }

  async update(id: number, data: Partial<ITicket>): Promise<ITicket | null> {
    const ticket = await this.model.findByPk(id);
    if (!ticket) return null;
    const modifiedTicket = await this.model.update(data, { where: { id } });
    return { ...ticket, ...data };
  }

  async delete(id: number): Promise<number> {
    const deletedTicket = await this.model.destroy({ where: { id } });
    return deletedTicket;
  }
}