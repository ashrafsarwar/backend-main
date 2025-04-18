import express from "express";
import { auth } from "../utils/auth.js";
import {
  addToCart,
  getCartItems,
  removeAll,
  removeFromCart,
} from "../controllers/users.js";
const cartRouter = express.Router();

cartRouter.post("/addtocart", auth, addToCart);
cartRouter.post("/removefromcart", auth, removeFromCart);
cartRouter.post("/removeall", auth, removeAll);
cartRouter.post("/getcart", auth, getCartItems);

export default cartRouter;
