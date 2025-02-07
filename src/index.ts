import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "./routers";
import { PaginationOptions } from "./utils/pagination.util";
import connectDB from "./config/db.config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      user: Record<string, any>;
      token: string | null;
      pagination: PaginationOptions;
    }
  }
}

connectDB();

app.get("/", (_: any, res: any) => {
  return res.status(200).json({ msg: "Successfully running" });
});

app.use("/api/v1", mainRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
