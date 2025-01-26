import { Client } from '../models/client.model.js';
import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Fetch counts for all entities
    const [clientCount, taskCount, projectCount] = await Promise.all([
      Client.countDocuments(), // Count clients
      taskModel.countDocuments(), // Count tasks
      Project.countDocuments() // Count projects
    ]);

    // Calculate additional stats if needed (e.g., task completion rate)
    const completedTasks = await Task.countDocuments({ isCompleted: true });
    const taskCompletionRate = ((completedTasks / taskCount) * 100).toFixed(2);

    // Return aggregated data
    res.json({
      clients: clientCount,
      tasks: taskCount,
      projects: projectCount,
      taskCompletionRate: `${taskCompletionRate}%`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
