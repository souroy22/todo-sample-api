"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateTodo_utils_1 = __importDefault(require("../utils/validateTodo.utils"));
const todo_model_1 = __importDefault(require("../model/todo.model"));
const todoRouter = express_1.default.Router();
// Create a new Todo
todoRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = (0, validateTodo_utils_1.default)(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    try {
        const newTodo = new todo_model_1.default(validation.data);
        yield newTodo.save();
        return res
            .status(201)
            .json({ data: newTodo, message: "Todo added successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}));
// Get all Todos with search, filtering, and pagination
todoRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, completed, page = "1", limit = "10" } = req.query;
        let filter = {};
        if (search)
            filter.title = { $regex: search, $options: "i" };
        if (completed)
            filter.completed = completed === "true";
        const pageNumber = Math.max(1, parseInt(page, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));
        const totalTodos = yield todo_model_1.default.countDocuments(filter);
        const todos = yield todo_model_1.default.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        return res.json({
            data: todos,
            pagination: {
                totalItems: totalTodos,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalTodos / pageSize),
                pageSize,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}));
// Update a Todo
todoRouter.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = (0, validateTodo_utils_1.default)(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    try {
        const updatedTodo = yield todo_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.json({
            data: updatedTodo,
            message: "Todo updated successfully",
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}));
// Delete a Todo
todoRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTodo = yield todo_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.json({ message: "Todo deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}));
exports.default = todoRouter;
//# sourceMappingURL=todo.router.js.map