import { Request, Response } from "express";
import { addassignExercise, editAssignExercise, getAssignedExercise } from "../../../models/Therapist/Exercise/exerciseModel";

export const addAssignmentExercise = async (req: Request, res: Response) => {
  try {
    const {
      exercise_id,
      patient_id,
      start_date,
      end_date,
      frequency,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
      patient_watch_Data
    } = req.body;

    console.log('Received data for creating assignment:', req.body);

    const result = await addassignExercise({
      exercise_id,
      patient_id,
      start_date,
      end_date,
      frequency,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
      patient_watch_Data
    });

    if (result && result.success) {
      res.status(201).json({ status: 201, success: true, message: result.message, data: result.data });
    } else {
      res.status(400).json({ status: 400, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in addAssignment controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};

export const editAssignmentExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    console.log('Received data for editing assignment:', newData);

    const result = await editAssignExercise(id, newData);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in editAssignment controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};

export const getAssignmentExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('Received ID for getting assignment:', id);

    const result = await getAssignedExercise(id);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in getAssignment controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};