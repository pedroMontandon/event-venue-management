import { NewEntity } from "../interfaces";
import SequelizeTicket from "../database/models/SequelizeTicket";
import { ITicketModel } from "../interfaces/tickets/ITicketModel";
import { ITicket } from "../interfaces/tickets/ITicket";

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