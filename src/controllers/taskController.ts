import { Request, Response } from 'express';
import TaskModel from '../models/taskModel';
import UserModel from '../models/userModel';
import cleanInput from '../utils/cleanInput';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = cleanInput(req.body);
    const userId = req.user?.id;

    if (!title || !description) {
      res.status(400).json({ success: false, message: "Title and description are required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized - user not found" });
      return;
    }

    const newTask = new TaskModel({ title, description, user: userId });
    await newTask.save();


    await UserModel.findByIdAndUpdate(userId, {
      $push: { task: newTask._id },
    },{new:true});

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });

  } catch (e) {
    console.error("Error in createTask:", e);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};



export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });

  } catch (e) {
    console.error("Error in getAllTasks:", e);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};



export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!taskId) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found or not authorized" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });

  } catch (e) {
    console.error("Error in getTask:", e);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
};



export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = cleanInput(req.body);
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!taskId) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const taskToUpdate = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!taskToUpdate) {
      res.status(404).json({ success: false, message: "Task not found or not authorized" });
      return;
    }

    if (title) taskToUpdate.title = title;
    if (description) taskToUpdate.description = description;

    await taskToUpdate.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: taskToUpdate,
    });

  } catch (e) {
    console.error("Error in updateTask:", e);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};


export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!taskId) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const deletedTask = await TaskModel.findOneAndDelete({ _id: taskId, user: userId });

    if (!deletedTask) {
      res.status(404).json({ success: false, message: "Task not found or not authorized" });
      return;
    }

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { task: taskId }
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (e) {
    console.error("Error in deleteTask:", e);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};
