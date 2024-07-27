import { Router } from "express";
import { signin, signup, handleResetRequest } from "../controllers/AuthController.js";

const router = Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/send', handleResetRequest);

export default router;