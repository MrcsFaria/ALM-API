import { Router } from "express";
import { signin, signup, handleResetRequest ,getCodeByEmail, ResetPassword} from "../controllers/AuthController.js";

const router = Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/send', handleResetRequest);
router.get('/code/:email', getCodeByEmail);
router.post('/reset-password', ResetPassword);

export default router;