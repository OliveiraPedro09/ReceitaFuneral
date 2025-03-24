import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", userRoutes);

app.listen(3000, () => console.log("Server Running on port -> 3000"));
