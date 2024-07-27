import { Router } from "express";
import { signin, signup, handleResetRequest ,getCodeByEmail} from "../controllers/AuthController.js";

const router = Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/send', handleResetRequest);
router.get('/code/:email', getCodeByEmail);

export default router;