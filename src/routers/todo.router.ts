import express from "express";
import validateTodo from "../utils/validateTodo.utils";
import Todo from "../model/todo.model";

const todoRouter = express.Router();

// Create a new Todo
todoRouter.post("/create", async (req: any, res: any) => {
  const validation = validateTodo(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const newTodo = new Todo(validation.data);
    await newTodo.save();
    return res.status(201).json({ message: "Todo added successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

// Get all Todos with search, filtering, and pagination
todoRouter.get("/all", async (req: any, res: any) => {
  try {
    const { search, completed, page = "1", limit = "10" } = req.query;

    let filter: Record<string, unknown> = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (completed) filter.completed = completed === "true";

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));

    const totalTodos = await Todo.countDocuments(filter);
    const todos = await Todo.find(filter)
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
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Get a Todo by ID
todoRouter.get("/:id", async (req: any, res: any) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json({ data: todo });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

// Update a Todo
todoRouter.put("/update/:id", async (req: any, res: any) => {
  const validation = validateTodo(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json({
      message: "Todo updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

// Delete a Todo
todoRouter.delete("/delete/:id", async (req: any, res: any) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

export default todoRouter;
