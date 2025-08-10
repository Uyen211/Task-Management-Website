import user from '../module/user.model.js';
import task from '../module/task.model.js';
import authenticate from '../../middleware/authenticate.js';

export default class TaskController {
    //[GET] get task list
    static async getTasks(req, res) {
        try {
            const tasks = await task.find({ host: req.user.id });
            res.status(200).json({ Tasks: tasks });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error!' });
        }
    }

    //[POS] create
    static async createTask(req, res) {
        try {
            const { name, priority } = req.body;

            let existingTask = await task.findOne({ name: name });
            if (existingTask) {
                return res
                    .status(400)
                    .json({ message: 'Tên nhiệm vụ đã tồn tại!' });
            }

            const newTask = new task({
                name: name,
                priority: priority,
                host: req.user.id,
            });

            await newTask.save();

            res.status(201).json({ task: newTask });
        } catch (error) {
            console.error('Error when creating task:', error);
            res.status(500).json({ message: 'Server error!' });
        }
    }

    //[PATCH] edit
    static async editTask(req, res) {
        try {
            let existingTask = await task.findById(req.params.id);
            if (!existingTask) {
                return res
                    .status(400)
                    .json({ message: 'Không tồn tại nhiệm vụ!' });
            }
            if (existingTask.host.toString() != req.user.id) {
                return res.status(403).json({
                    message:
                        'Bạn không có quyền chỉnh sửa hay xóa nhiệm vụ này!',
                });
            }

            const { name, priority, progress } = req.body;

            if (name !== undefined) existingTask.name = name;
            if (priority !== undefined) existingTask.priority = priority;
            if (progress !== undefined) existingTask.progress = progress;

            await existingTask.save();

            res.status(200).json({ task: existingTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error!' });
        }
    }

    //[DELETE] delete
    static async deleteTask(req, res) {
        try {
            let existingTask = await task.findById(req.params.id);
            if (!existingTask) {
                return res
                    .status(400)
                    .json({ message: 'Không tồn tại nhiệm vụ!' });
            }
            if (existingTask.host.toString() != req.user.id) {
                return res.status(403).json({
                    message:
                        'Bạn không có quyền chỉnh sửa hay xóa nhiệm vụ này!',
                });
            }

            await task.findByIdAndDelete(existingTask._id);

            res.status(200).json({ message: 'Đã xóa nhiệm vụ!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error!' });
        }
    }
}
