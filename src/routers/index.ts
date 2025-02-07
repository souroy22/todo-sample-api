import express from "express";
import todoRouter from "./todo.router";

const mainRouter = express.Router();

mainRouter.use("/todo", todoRouter);

export default mainRouter;
