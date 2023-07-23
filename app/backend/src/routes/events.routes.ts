import { Request, Router, Response } from 'express';
import EventController from '../controllers/EventController';

const eventController = new EventController();
const router = Router();

router.get('/', (req: Request, res: Response) => eventController.findAllOpened(req, res));

export default router;