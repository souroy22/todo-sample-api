import mongoose, { Document, model, Schema } from "mongoose";

export interface ITodo extends Document {
  title: Schema.Types.String;
  completed: Schema.Types.Boolean;
}

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
