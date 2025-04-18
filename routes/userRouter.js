import express from "express";
import { getUserDetails, SignIn, SignUp } from "../controllers/users.js";
import { auth } from "../utils/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", SignUp);
userRouter.post("/signin", SignIn);
userRouter.post("/getUserDetails", auth, getUserDetails);

export default userRouter;
