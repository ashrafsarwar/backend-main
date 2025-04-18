import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Catch uncaught async errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

try {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Server failed to start:", error);
}
