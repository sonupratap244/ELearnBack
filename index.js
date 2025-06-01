import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Use Middlewares
app.use(express.json());
app.use(cors());

// ✅ Serve static files BEFORE routes
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.get("/", (req, res) => {
    res.send("Server is Working");
});

// ✅ Importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import AdminRoutes from "./routes/Admin.js";

// ✅ Using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", AdminRoutes);

// ✅ Start Server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(` Server is running at http://localhost:${port}`);
    connectDb();
});
