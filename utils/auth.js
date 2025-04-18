import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.send({ success: false, message: "Please Login!" });
  }
  try {
    const decode = jwt.verify(token, "secret");
    if (!decode) {
      return res.send({ success: false, message: "Invalid Token" });
    }
    req.userId = decode.id;
    next();
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

export { auth };
