import { Task } from '../models/task.model.js';

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
        .populate('id_projet')
        .populate('statut_tache')
        .populate('type_tache');
        res.json({data:tasks});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {

    try {
        const task = await Task.findById(req.params.id)
        // .populate('Id_Client')
        // .populate('Id_Projet')
        // .populate('Id_Collaborateur');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({data:task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {


    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log("err", error);

        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};