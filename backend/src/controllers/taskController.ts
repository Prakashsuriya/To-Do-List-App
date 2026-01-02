import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description, date, deadline, priority, category } = req.body;

    try {
        const task = new Task({
            user: req.user._id,
            title,
            description,
            date,
            deadline,
            priority,
            category,
        });

        const createdTask = await Task.create(task);
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response) => {
    const { title, description, status, date, deadline, priority, category } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Check user
            if (task.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            task.date = date || task.date;
            task.deadline = deadline || task.deadline;
            task.priority = priority || task.priority;
            task.category = category || task.category;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Check user
            if (task.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
