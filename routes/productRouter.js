import express from "express";
import {
  addProduct,
  getProducts,
  NewCollection,
  PopularProducts,
  RelatedProducts,
  removeProduct,
} from "../controllers/products.js";

const routerProduct = express.Router();

routerProduct.post("/addproduct", addProduct);
routerProduct.post("/removeproduct", removeProduct);
routerProduct.get("/getproduct", getProducts);
routerProduct.get("/newCollection", NewCollection);
routerProduct.get("/popularProduct", PopularProducts);
routerProduct.post("/relatedProducts", RelatedProducts);

export default routerProduct;
