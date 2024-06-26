import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  therapist_Id: mongoose.Types.ObjectId;
  first_name: string;
  last_name: string;
  patient_email: string;
  injury_details?: string;
  password: string;
  salt: string;
  exercise_reminder_time: string;
  medicine_reminder_time: string;
  date_of_birth: String;
  allergy_if_any?: string;
  profile_photo?: string;
  gender: string;
  medical_history?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean; 
}

const PatientSchema: Schema = new Schema({
  therapist_Id: { type: Schema.Types.ObjectId,ref:"Therapist", required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_no: { type: String, required: true},
  address: {type: String, required: true},
  patient_email: { type: String, required: true, unique: true },
  injury_details: { type: String, required: false},
  password: { type: String, required: false },
  salt: { type: String, required: false, select: false },
  exercise_reminder_time: { type: String, required: false },
  medicine_reminder_time: { type: String, required: false },
  date_of_birth: { type: String, required: true },
  allergy_if_any: { type: String },
  profile_photo: { type: String },
  gender: { type: String, required: true },
  medical_history: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }
});

const Patient = mongoose.model<IPatient>('Patients', PatientSchema);

export default Patient;
