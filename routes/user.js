

import express from "express";
import { register,
     verifyUser,
     loginUser, 
     myProfile, 
     forgotPassword, 
     resetPassword } 
     from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Change to POST request for registration
router.post("/user/register", register);
router.post("/user/verify",verifyUser);
router.post("/user/login",loginUser);
router.get("/user/me",isAuth,myProfile);
router.post("/user/forgot",forgotPassword);
router.post("/user/reset",resetPassword);

export default router;