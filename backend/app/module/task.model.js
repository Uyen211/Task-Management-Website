import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    progress: {
        type: String,
        default: "To Do"
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

}, {timestamps: true});

const Task = mongoose.model("Task", taskSchema);

export default Task;
