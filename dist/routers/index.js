"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_router_1 = __importDefault(require("./todo.router"));
const mainRouter = express_1.default.Router();
mainRouter.use("/todo", todo_router_1.default);
exports.default = mainRouter;
//# sourceMappingURL=index.js.map