import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Todo Schema & Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Manual validation function
const validateTodo = (data: { title?: string; completed?: boolean }) => {
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
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

app.get("/", (_: any, res: any) => {
  return res.status(200).json({ msg: "Successfully running" });
});

// Create a new Todo
app.post("/todos", async (req: any, res: any) => {
  const validation = validateTodo(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    const newTodo = new Todo(validation.data);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all Todos with search and filtering
app.get("/todos", async (req: any, res: any) => {
  const { search, completed } = req.query;
  let filter: Record<string, unknown> = {};

  if (search) filter.title = { $regex: search, $options: "i" };
  if (completed) filter.completed = completed === "true";

  try {
    const todos = await Todo.find(filter);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Update a Todo
app.put("/todos/:id", async (req: any, res: any) => {
  const validation = validateTodo(req.body);
  if (!validation.success)
    return res.status(400).json({ error: validation.error });

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a Todo
app.delete("/todos/:id", async (req: any, res: any) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
