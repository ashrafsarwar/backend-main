import multer from "multer";
import path from "path";
import fs from "fs";

// Set up storage for multer
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Create multer instance
const upload = multer({ storage: storage });

// Handle image upload
const handleImageUpload = upload.single("upload"); // Ensure the field name matches

const getImage = (req, res) => {
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "No file uploaded" });
  }

  res.send({
    success: true,
    imageUrl: `https://e-commerce-backend-as-production.up.railway.app/images/${file.filename}`,
  });
};

const deleteImage = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", "images", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(500)
        .send({ success: false, message: "File not found" });
    }
    res.send({ success: true, message: "File deleted successfully" });
  });
};

export { handleImageUpload, getImage, deleteImage };
