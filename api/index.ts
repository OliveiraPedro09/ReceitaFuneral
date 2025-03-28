import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes";
import tagRoutes from "./routes/tagRoutes";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", transactionRoutes);
app.use("/api", tagRoutes);

app.listen(3000, () => console.log("Server Running on port -> 3000"));
