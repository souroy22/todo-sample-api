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
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
// Todo Schema & Model
const todoSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const Todo = mongoose_1.default.model("Todo", todoSchema);
// Manual validation function
const validateTodo = (data) => {
    if (!data.title ||
        typeof data.title !== "string" ||
        data.title.trim() === "") {
        return {
            success: false,
            error: "Title is required and must be a non-empty string",
        };
    }
    if (data.completed !== undefined && typeof data.completed !== "boolean") {
        return { success: false, error: "Completed must be a boolean" };
    }
    return { success: true, data };
};
// Create a new Todo
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = validateTodo(req.body);
    if (!validation.success)
        return res.status(400).json({ error: validation.error });
    try {
        const newTodo = new Todo(validation.data);
        yield newTodo.save();
        return res.status(201).json(newTodo);
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}));
// Get all Todos with search and filtering
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, completed } = req.query;
    let filter = {};
    if (typeof search === "string")
        filter.title = { $regex: search, $options: "i" };
    if (typeof completed === "string")
        filter.completed = completed === "true";
    try {
        const todos = yield Todo.find(filter);
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
}));
// Update a Todo
app.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = validateTodo(req.body);
    if (!validation.success)
        return res.status(400).json({ error: validation.error });
    try {
        const updatedTodo = yield Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedTodo)
            return res.status(404).json({ error: "Todo not found" });
        res.json(updatedTodo);
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
}));
// Delete a Todo
app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTodo = yield Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo)
            return res.status(404).json({ error: "Todo not found" });
        res.json({ message: "Todo deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
}));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map