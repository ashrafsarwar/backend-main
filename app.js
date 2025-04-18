import express from "express";
import cors from "cors";
import mongoDB from "./libs/DB.js";
import router from "./routes/route.js";
import routerProduct from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRouter.js";
import adminRouter from "./routes/adminRouter.js";
import orderRouter from "./routes/orderRouter.js";
import bodyParser from "body-parser";



mongoDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/images", express.static("uploads/images"));

app.use("/", router);
app.use("/products", routerProduct);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/admins", adminRouter);
app.use("/orders", orderRouter);

export default app;