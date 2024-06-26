import { Request, Response } from 'express';
import addExerciseModel from '../../../models/exercise/exercises_model';
import { addassignExercise, editAssignExercise,  getNotification } from '../../../models/Therapist/Exercise/exerciseModel';
import Patient from '../../../models/Patient/patientModel';
import PatientWatchData from '../../../models/Patient/watchData'
import messages from 'router/messages/messages';
import Therapist from '../../../models/Therapist/therapistSignupSchema';
import Assignment, { IAssignment } from '../../../models/Therapist/Exercise/exerciseSchema'; 


export const createExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const {sessionToken} = req.params;

      const therapist = await Therapist.findOne({ sessionToken: sessionToken });

      if (!therapist) {
         res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
         return
      }
      const { category_id, category_name, video_Url, video_title, description } = req.body;
      const newExercise = new addExerciseModel({
        therapist_Id: therapist._id,
        category_id,
        category_name,
        video_Url,
        video_title,
        description,
      });

      const savedExercise = await newExercise.save();
      
      console.log("New exercise added successfully !")
      
      res.status(201).json({ message: 'Exercise has been added', success: true, data: savedExercise });
    
    } catch (error) {
      console.error('Error creating exercise:', error);
      res.status(500).json({ message: 'Internal Server Error', success: false});
    }
  };

export const getAllExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const {sessionToken} = req.params;
    const {name} = req.query;
    
    const therapist = await Therapist.findOne({ sessionToken: sessionToken });

    if (!therapist) {
         res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
         return
    }
    
    if (!name) {
      res.status(400).json({ message: 'Name query parameter is required' });
      return;
    }

     const exercises = await addExerciseModel.find({category_name: name}, {therapist_Id: therapist._id} );
     
     res.status(200).json({success: true, data: exercises});

  } catch (error) {
    console.error('Error retrieving exercise categories:', error);
    res.status(500).json({ message: 'Internal Server Error' , success: false});
  }
};

export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { exerciseId } = req.params;
    const updateData = req.body;
   
    const updatedExercise = await addExerciseModel.findByIdAndUpdate(exerciseId, updateData, { new: true });
   
    if (!updatedExercise) {
      res.status(404).json({ message: 'Exercise not found', success: false });
      return;
    }
   
    res.status(200).json({message: 'Exercise has been Updated', success: true});
  
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

export const delete_exercise = async (req: Request, res:Response): Promise<void>=>{
  try{
    const { exerciseId } = req.params;
    const deleted_exercise = await addExerciseModel.findByIdAndDelete(exerciseId);
  
    if (!deleted_exercise) {
    res.status(404).json({ message: 'Exercise Not Found', success: false });
    return;
  }

  res.status(200).json({message: 'Exercise has been deleted', success: true});
  
  console.log('Exercise deleted successfully:', deleted_exercise);

} catch (error) {
  console.error('Error deleting exercise:', error);
  res.status(500).json({ message: 'Internal Server Error', success: false });
}}

export const addAssignmentExercise = async (req: Request, res: Response) => {

  try {
    
    const {sessionToken} = req.params;
    
    const therapist = await Therapist.findOne({ sessionToken: sessionToken });

    if (!therapist) {
      res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
      return
    }
    
    const {
      exercise_ids,
      patient_id,
      start_date,
      end_date,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
      } = req.body;

    console.log('Received data for creating assignment:', req.body);

    const result = await addassignExercise({
      exercise_ids,
      patient_id,
      start_date,
      end_date,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
      therapist_id: therapist._id as string,
    });

    if (result && result.success) {
      res.status(201).json({ status: 201, success: true, message: result.message, data: result.data });
    } else {
      res.status(400).json({ status: 400, success: false, error: result.message })
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
  
      console.log('Received data for editing assignment:', id);
  
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

//   export const getAssignmentExercise = async (req: Request, res: Response) => {
//     try {
//       const { patient_id } = req.params;
  
//       console.log('Received ID for getting assignment:', patient_id);

//       const data = await getAssignedExercise(patient_id)

//       res.status(200).json({ 
//       success: true, 
//       message: 'Assignment found successfully',
//       data: data 
//     });

//   } catch (error: any) {
//     console.error('Error in getAssignment controller:', error.message);
//     res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
//   }
// };
export const getAssignmentExercise = async (req: Request, res: Response) => {
  try {
      const { patient_id } = req.params;

      const patient = await Patient.findById(patient_id);
      if (!patient) {
          return res.status(404).json({ error: 'Patient not found' });
      }
      
      const watchDataArray = await PatientWatchData.find({ patient_id })
      const assignments = await Assignment.find({ patient_id, is_awaiting_reviews: false }).populate('exercise_ids');
      const watchData = watchDataArray[0];
      const patientData = {
          
          
        patient: patient,
          data: assignments || [],
          watchData: watchData, 
      };

      res.status(200).json(patientData);
  } catch (error) {
      console.error('Error fetching patient data:', error);
      res.status(500).json({ error: 'An error occurred while fetching patient data' });
  }
};

export const getTherapistNotification = async (req: Request, res: Response) => {
  try {
    const {sessionToken} = req.params;
    
    const therapist = await Therapist.findOne({ sessionToken: sessionToken });

    if (!therapist) {
      res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
      return
    }

    const result = await getNotification(therapist._id as string);

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