import express from 'express';
import { middleWare } from '../Middleware/MiddleWare.js';
import { createPost, getAllPost } from '../Controllers/postController.js';

const router = express.Router();

router.post("/createpost",middleWare,createPost)
router.get("/getposts",getAllPost)

export default router;