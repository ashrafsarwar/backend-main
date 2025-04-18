import express from "express";
import {
  getAdmins,
  getSuperAdmin,
  removeAdmin,
  SignIn,
  SignUp,
} from "../controllers/admin.js";

const adminRouter = express.Router();

adminRouter.post("/signup", SignUp);
adminRouter.post("/signin", SignIn);
adminRouter.post("/getadmins", getAdmins);
adminRouter.post("/getsuperadmin", getSuperAdmin);
adminRouter.post("/removeadmin", removeAdmin);

export default adminRouter;
