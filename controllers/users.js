import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.send({ success: false, message: "User already exists" });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cartItems: cart,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "secret");
    if (!token) {
      return res.send({ success: false, message: "Token generation failed" });
    } else {
      return res.send({ success: true, token });
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send({ success: false, message: "Invalid password" });
    } else {
      const token = jwt.sign({ id: user._id }, "secret");
      if (!token) {
        return res.send({
          success: false,
          message: "Token generation failed",
        });
      } else {
        return res.send({ success: true, data: { token, user } });
      }
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  console.log(req.headers);
  const token = req.headers["token"];
  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret"); // Replace 'your_secret_key' with your actual secret key
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.send({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to authenticate token" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    let cartItems = user.cartItems;
    res.send({ success: true, cartItems });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { itemId } = req.body;
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Initialize cartItems[itemId] if it doesn't exist
    if (!user.cartItems[itemId]) {
      user.cartItems[itemId] = 1;
    } else {
      user.cartItems[itemId] += 1;
    }

    await User.findByIdAndUpdate(
      { _id: req.userId },
      { cartItems: user.cartItems }
    );

    res.status(200).send({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send({ message: "Error adding item to cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { itemId } = req.body;
  let user = await User.findOne({ _id: req.userId });
  user.cartItems[itemId] -= 1;
  await User.findByIdAndUpdate(
    { _id: req.userId },
    { cartItems: user.cartItems }
  );
};

const removeAll = async (req, res) => {
  try {
    // Find the user by userId (assumed to be set in req.userId)
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    // Clear all items from the cart
    user.cartItems = {}; // or use $set in the update operation directly

    // Update the user document
    await User.findByIdAndUpdate(req.userId, { $set: { cartItems: {} } });

    // Send a success response
    res.send({
      success: true,
      message: "All items removed from cart successfully.",
    });
  } catch (error) {
    console.error("Error removing all items from cart:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while removing all items from the cart.",
    });
  }
};

export {
  SignUp,
  SignIn,
  addToCart,
  removeFromCart,
  getCartItems,
  removeAll,
  getUserDetails,
};
