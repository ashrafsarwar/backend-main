import { Admin } from "../models/admin.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, superAdmin, image } =
      req.body;
    console.log(req.body);
    const user = await Admin.findOne({ email });

    if (user) {
      return res.send({ success: false, message: "User already exists" });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      superAdmin,
      image,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "secret");
    console.log(token);
    if (!token) {
      return res.send({ success: false, message: "Token generation failed" });
    }
    return res.send({ success: true, token });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.send({ success: false, message: "User doesn't exist" });
    }

    const { superAdmin } = user; // Destructure superAdmin from user

    console.log(superAdmin);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "secret");

    if (!token) {
      return res.send({ success: false, message: "Token generation failed" });
    } else {
      return res.send({ success: true, data: { token, user, superAdmin } });
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const getSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await Admin.findOne({ superAdmin: true });
    if (!superAdmin) {
      return res.send({ success: false, message: "No super admin found" });
    }
    return res.send({ success: true, superAdmin });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    if (!admins) {
      return res.send({ success: false, message: "No admins found" });
    }

    return res.send({ success: true, admins });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const removeAdmin = async (req, res) => {
  try {
    let { email, filename } = req.body;

    const imageName = path.basename(filename); // <-- This is key!

    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.send({ success: false, message: "Admin not found" });
    }

    const result = await Admin.deleteOne({ email });
    if (result.deletedCount > 0) {
      const filePath = path.join(__dirname, "../uploads/images", imageName);

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
      return res.send({
        success: false,
        message: "Failed to delete the product",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

export { SignUp, SignIn, getAdmins, getSuperAdmin, removeAdmin };
