import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./libs/DB.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
});
