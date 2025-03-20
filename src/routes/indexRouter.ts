import { Router } from "express";
import { handleError } from "../utils/controlUtils";
import auth from "../controllers/authController";

const router = Router();
router.post('/login', auth.login, handleError);
router.post('/logout', auth.logout, handleError)
router.post('/refresh', auth.refresh, handleError);

export default router;