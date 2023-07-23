import { Router } from "express";
import eventRouter from './events.routes'
import userRouter from './user.routes';

const router = Router();

router.use('/events', eventRouter);
router.use('/user', userRouter);

export default router;