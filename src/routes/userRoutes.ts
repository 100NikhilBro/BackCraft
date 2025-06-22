import {Router} from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, loginUserSchema } from '../validations/userSchema';
import { createUser, deleteUser, getMyProfile, logIn, logoutUser, refreshTokenHandler, updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post("/createUser",validateRequest(createUserSchema),createUser);
router.post("/login",validateRequest(loginUserSchema),logIn);
router.post('/logout',authMiddleware,logoutUser);
router.get("/profile",authMiddleware,getMyProfile);
router.put('/updateProfile',authMiddleware,updateProfile);
router.delete("/deleteUser",authMiddleware,deleteUser);
router.get('/refreshToken',refreshTokenHandler);

export default router;


