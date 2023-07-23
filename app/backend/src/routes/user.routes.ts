import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import Validations from '../middlewares/Validations';

const userController = new UserController();
const router = Router();

router.post('/login', Validations.validateLogin, (req: Request, res: Response) => userController.login(req, res));

export default router;