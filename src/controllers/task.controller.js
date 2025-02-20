import {StatutTache, Task, TypeTache} from '../models/task.model.js';
import {StatutProjet, TypeProjet} from "../models/project.model.js";


// ******** Controller Code for Tasks  ********* //
// ****************************************************
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
// ****************************************************
// ****************************************************



// ******** Controller Code for Task Types ********* //
// ****************************************************
export const getAllTypeTasks = async (req, res) => {
    try {
        const typeTasks = await TypeTache.find()
        ;
        res.json({ data: typeTasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getTypeTask= async (req, res) => {
    try {
        const typeTask = await TypeTache.findById(
            req.params.id
        );
        if (!typeTask) {
            return res.status(404).json({ message: 'Type Task  not found' });
        }
        res.json(typeTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const createTypeTask = async (req, res) => {
    const typeTask = new TypeTache(req.body);
    try {
        const newTypeTask = await typeTask.save();
        res.status(201).json(newTypeTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateTypeTask = async (req, res) => {
    try {
        const typeTask = await TypeTache.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!typeTask) {
            return res.status(404).json({ message: 'Type Task not found' });
        }
        res.json(typeTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTypeTask = async (req, res) => {
    try {
        const typeTask = await TypeTache.findByIdAndDelete(req.params.id);
        if (!typeTask) {
            return res.status(404).json({ message: 'Type Task  not found' });
        }
        res.json({ message: 'Type Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ****************************************************
// ****************************************************



// ******** Controller Code for Task Status ********* //
// ****************************************************

export const getAllTaskStatus = async (req, res) => {
    try {
        const statusTask = await StatutTache.find()
        ;
        res.json({ data: statusTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTaskStatus = async (req, res) => {
    try {
        const statusTask = await StatutTache.findById(
            req.params.id
        );
        if (!statusTask) {
            return res.status(404).json({ message: 'Status Task  not found' });
        }
        res.json(StatutTache);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const createTaskStatus = async (req, res) => {
    const statusTask = new StatutTache(req.body);
    try {
        const newStatusTask = await statusTask.save();
        res.status(201).json(newStatusTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateTaskStatus = async (req, res) => {
    try {
        const statusTask = await StatutTache.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!statusTask) {
            return res.status(404).json({ message: 'Status Task not found' });
        }
        res.json(statusTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTaskStatus = async (req, res) => {
    try {
        const statusTask = await StatutTache.findByIdAndDelete(req.params.id);
        if (!statusTask) {
            return res.status(404).json({ message: 'Status Task  not found' });
        }
        res.json({ message: 'Status Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ****************************************************
// ****************************************************
