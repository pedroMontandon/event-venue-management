import { Request, Router, Response } from 'express';
import TicketController from '../controllers/TicketController';
import Validations from '../middlewares/Validations';

const ticketController = new TicketController();
const router = Router();

router.get('/mytickets', Validations.validateToken, (req: Request, res: Response) => ticketController.getMyTickets(req, res));
router.post('/buyticket/:eventId', Validations.validateToken, Validations.validateVisitor, (req: Request, res: Response) => ticketController.buyTicket(req, res));

export default router;