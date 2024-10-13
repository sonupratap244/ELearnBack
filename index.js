import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";


dotenv.config();

const app = express();

//using middlewares..

app.use(express.json());
app.use(cors()); 

const port = process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Server is Working");
});

app.use("/uploads",express.static("uploads"));

//Importing routes 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import AdminRoutes from "./routes/Admin.js";
//import PostRoutes from "./routes/poste.js";


//Using Routes.
app.use("/api",userRoutes);
app.use("/api",courseRoutes);
app.use("/api",AdminRoutes);
//app.use("/api", PostRoutes);


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
});