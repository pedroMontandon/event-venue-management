import { Router } from "express";
import eventRouter from './events.routes'
import userRouter from './user.routes';
import ticketRouter from './tickets.routes';

const router = Router();

router.use('/events', eventRouter);
router.use('/user', userRouter);
router.use('/tickets', ticketRouter);

export default router;