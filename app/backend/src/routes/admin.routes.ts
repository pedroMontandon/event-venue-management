import { Request, Router, Response } from 'express';
import AdminController from '../controllers/AdminController';
import Validations from '../middlewares/Validations';

const adminController = new AdminController();
const router = Router();

router.post('/inviteUser/:userId/:eventId', Validations.validateToken, Validations.validateAdmin, Validations.validateVisitor, (req: Request, res: Response) => adminController.inviteUser(req, res));
router.post('/createEvent', Validations.validateToken, Validations.validateAdmin, Validations.validateEvent, (req: Request, res: Response) => adminController.createEvent(req, res));
router.patch('/updateEvent/:eventId', Validations.validateToken, Validations.validateAdmin, (req: Request, res: Response) => adminController.updateEvent(req, res));
router.delete('/deleteEvent/:eventId', Validations.validateToken, Validations.validateAdmin, (req: Request, res: Response) => adminController.deleteEvent(req, res));

export default router;