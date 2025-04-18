import expres from "express";
import { auth } from "../utils/auth.js";
import { getOrders, order, updateOrderStatus,deleteAll, getOrdersOfUser } from "../controllers/order.js";

const orderRouter = expres.Router();

orderRouter.post("/addtoorder", auth, order);
orderRouter.post("/getorders", auth, getOrders);
orderRouter.post("/updateorder", auth, updateOrderStatus);
orderRouter.post("/deleteallorders", deleteAll);
orderRouter.post("/getuserorders", getOrdersOfUser);



export default orderRouter;
