import { Request, Router, Response } from 'express';
import AdminController from '../controllers/AdminController';
import Validations from '../middlewares/Validations';

const adminController = new AdminController();
const router = Router();

router.post('/inviteUser/:userId/:eventId', Validations.validateToken, Validations.validateAdmin, Validations.validateVisitor, (req: Request, res: Response) => adminController.inviteUser(req, res));

export default router;