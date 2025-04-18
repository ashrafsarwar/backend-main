import express from "express";
import {
  deleteImage,
  getImage,
  handleImageUpload,
} from "../controllers/image.js";

const router = express.Router();

router.post("/upload", handleImageUpload, getImage);
router.delete("/delete/:filename", deleteImage);

export default router;
