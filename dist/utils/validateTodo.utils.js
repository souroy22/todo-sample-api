"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = validateTodo;
//# sourceMappingURL=validateTodo.utils.js.map