import express from 'express';
import { deleteUser, getUsers, updateUser } from '../Controllers/userController.js';
import { middleWare } from '../Middleware/MiddleWare.js';

const router = express.Router();

router.put('/update/:id',middleWare,updateUser)
router.delete('/delete/:id',middleWare,deleteUser)
router.get('/getusers',getUsers)
export default router;
