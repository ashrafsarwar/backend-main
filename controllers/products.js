import fs from "fs";
import path from "path";
import { Product } from "../models/product.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addProduct = async (req, res) => {
  try {
    const { name, new_price, old_price, category, availabel, date, image } =
      req.body;
    let id;
    console.log(req.body);
    const products = await Product.find();
    if (products.length === 0) {
      id = 1;
    } else {
      id = products[products.length - 1].id + 1;
    }
    const product = new Product({
      id: id,
      name,
      new_price,
      old_price,
      category,
      availabel,
      date,
      image,
    });
    await product.save();
    res.send({ success: true, product });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    let { id, filename } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.send({ success: false, message: "Product not found" });
    }

    const result = await Product.deleteOne({ id });

    if (result.deletedCount > 0) {
      const imageName = path.basename(filename);
      const filePath = path.join(__dirname, "../uploads/images", imageName);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send({
              success: false,
              message: "Product removed, but image deletion failed",
            });
          }
          return res.send({
            success: true,
            message: "Product and image deleted successfully",
          });
        });
      } else {
        console.warn("⚠️ Image file not found:", filePath);
        return res.send({
          success: true,
          message: "Product deleted, but image file was not found",
        });
      }
    } else {
      return res.send({
        success: false,
        message: "Failed to delete the product",
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.send({ success: true, products });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const NewCollection = async (req, res) => {
  try {
    const products = await Product.find({});
    const newCollection = products.slice(1).slice(-8);
    res.send({ success: true, newCollection });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const PopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const popularProducts = products.slice(1, 5);
    res.send({ success: true, popularProducts });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const RelatedProducts = async (req, res) => {
  try {
    const { category } = req.body;
    console.log(category);
    const products = await Product.find({ category });
    const relatedProducts = products.slice(1, 4);
    res.send({ success: true, relatedProducts });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

export {
  addProduct,
  removeProduct,
  getProducts,
  NewCollection,
  PopularProducts,
  RelatedProducts,
};
