import { z } from 'zod';

/**
 * Zod schemas for Laboratory command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Base Lab Request validation schemas
export const PatientIdSchema = z.string().min(1, 'Patient ID is required').max(50, 'Patient ID cannot exceed 50 characters');

export const PatientNameSchema = z.string()
  .min(2, 'Patient name must be at least 2 characters')
  .max(255, 'Patient name cannot exceed 255 characters')
  .regex(/^[a-zA-Z\s\-'.]+$/, 'Patient name can only contain letters, spaces, hyphens, and apostrophes');

export const AgeGenderSchema = z.string()
  .min(3, 'Age/Gender must be at least 3 characters')
  .max(50, 'Age/Gender cannot exceed 50 characters')
  .regex(/^(\d{1,3})\s*[\/\-\s]\s*(M|F|Male|Female)$/i, 'Age/Gender must be in format like "25/M", "32/F", "45 Male", or "28 Female"');

export const LabRequestStatusSchema = z.enum(['Pending', 'In Progress', 'Complete']);

// Lab Request Commands
export const CreateLabRequestCommandSchema = z.object({
  patientId: PatientIdSchema,
  patientName: PatientNameSchema,
  ageGender: AgeGenderSchema,
  requestDate: z.date().or(z.string().transform((str) => new Date(str))),
  others: z.string().optional(),
  // Lab Tests
  cbcWithPlatelet: z.string().optional(),
  pregnancyTest: z.string().optional(),
  urinalysis: z.string().optional(),
  fecalysis: z.string().optional(),
  occultBloodTest: z.string().optional(),
  hepaBScreening: z.string().optional(),
  hepaAScreening: z.string().optional(),
  hepatitisProfile: z.string().optional(),
  vdrlRpr: z.string().optional(),
  dengueNs1: z.string().optional(),
  ca125CeaPsa: z.string().optional(),
  fbs: z.string().optional(),
  bun: z.string().optional(),
  creatinine: z.string().optional(),
  bloodUricAcid: z.string().optional(),
  lipidProfile: z.string().optional(),
  sgot: z.string().optional(),
  sgpt: z.string().optional(),
  alp: z.string().optional(),
  sodiumNa: z.string().optional(),
  potassiumK: z.string().optional(),
  hbalc: z.string().optional(),
  ecg: z.string().optional(),
  t3: z.string().optional(),
  t4: z.string().optional(),
  ft3: z.string().optional(),
  ft4: z.string().optional(),
  tsh: z.string().optional(),
});

export const UpdateLabRequestResultsCommandSchema = z.object({
  patientId: PatientIdSchema,
  requestDate: z.date().or(z.string().transform((str) => new Date(str))),
  fbs: z.string().optional(),
  bun: z.string().optional(),
  creatinine: z.string().optional(),
  bloodUricAcid: z.string().optional(),
  lipidProfile: z.string().optional(),
  sgot: z.string().optional(),
  sgpt: z.string().optional(),
  alp: z.string().optional(),
  sodiumNa: z.string().optional(),
  potassiumK: z.string().optional(),
  hbalc: z.string().optional(),
  ecg: z.string().optional(),
  t3: z.string().optional(),
  t4: z.string().optional(),
  ft3: z.string().optional(),
  ft4: z.string().optional(),
  tsh: z.string().optional(),
  status: LabRequestStatusSchema.optional(),
  dateTaken: z.date().or(z.string().transform((str) => new Date(str))).optional(),
});

export const GetLabRequestByPatientIdCommandSchema = z.object({
  patientId: PatientIdSchema,
});

export const DeleteLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'Lab Request ID is required'),
});

// Blood Chemistry Commands
export const CreateBloodChemistryCommandSchema = z.object({
  patientName: PatientNameSchema,
  age: z.number().min(0, 'Age must be at least 0').max(150, 'Age cannot exceed 150'),
  sex: z.enum(['Male', 'Female']),
  dateTaken: z.date().or(z.string().transform((str) => new Date(str))),
  // Blood Chemistry Results
  fbs: z.union([z.number(), z.string()]).optional(),
  bun: z.union([z.number(), z.string()]).optional(),
  creatinine: z.union([z.number(), z.string()]).optional(),
  uricAcid: z.union([z.number(), z.string()]).optional(),
  cholesterol: z.union([z.number(), z.string()]).optional(),
  triglycerides: z.union([z.number(), z.string()]).optional(),
  hdl: z.union([z.number(), z.string()]).optional(),
  ldl: z.union([z.number(), z.string()]).optional(),
  vldl: z.union([z.number(), z.string()]).optional(),
  sodium: z.union([z.number(), z.string()]).optional(),
  potassium: z.union([z.number(), z.string()]).optional(),
  chloride: z.union([z.number(), z.string()]).optional(),
  calcium: z.union([z.number(), z.string()]).optional(),
  sgot: z.union([z.number(), z.string()]).optional(),
  sgpt: z.union([z.number(), z.string()]).optional(),
  rbs: z.union([z.number(), z.string()]).optional(),
  alkPhosphatase: z.union([z.number(), z.string()]).optional(),
  totalProtein: z.union([z.number(), z.string()]).optional(),
  albumin: z.union([z.number(), z.string()]).optional(),
  globulin: z.union([z.number(), z.string()]).optional(),
  agRatio: z.union([z.number(), z.string()]).optional(),
  totalBilirubin: z.union([z.number(), z.string()]).optional(),
  directBilirubin: z.union([z.number(), z.string()]).optional(),
  indirectBilirubin: z.union([z.number(), z.string()]).optional(),
  ionisedCalcium: z.union([z.number(), z.string()]).optional(),
  magnesium: z.union([z.number(), z.string()]).optional(),
  hbalc: z.union([z.number(), z.string()]).optional(),
  ogtt30min: z.union([z.number(), z.string()]).optional(),
  ogtt1hr: z.union([z.number(), z.string()]).optional(),
  ogtt2hr: z.union([z.number(), z.string()]).optional(),
  ppbs2hr: z.union([z.number(), z.string()]).optional(),
  inorPhosphorus: z.union([z.number(), z.string()]).optional(),
});

export const DeleteBloodChemistryCommandSchema = z.object({
  id: z.string().min(1, 'Blood Chemistry ID is required'),
});

// Query Schemas
export const LabRequestIdSchema = z.string().min(1, 'Lab Request ID is required');
export const BloodChemistryIdSchema = z.string().min(1, 'Blood Chemistry ID is required');

// Type exports
export type CreateLabRequestCommand = z.infer<typeof CreateLabRequestCommandSchema>;
export type UpdateLabRequestResultsCommand = z.infer<typeof UpdateLabRequestResultsCommandSchema>;
export type GetLabRequestByPatientIdCommand = z.infer<typeof GetLabRequestByPatientIdCommandSchema>;
export type DeleteLabRequestCommand = z.infer<typeof DeleteLabRequestCommandSchema>;
export type CreateBloodChemistryCommand = z.infer<typeof CreateBloodChemistryCommandSchema>;
export type DeleteBloodChemistryCommand = z.infer<typeof DeleteBloodChemistryCommandSchema>;

// Validation schemas collection
export const LaboratoryValidationSchemas = {
  CreateLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  GetLabRequestByPatientIdCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  PatientIdSchema,
  PatientNameSchema,
  AgeGenderSchema,
  LabRequestStatusSchema,
  LabRequestIdSchema,
  BloodChemistryIdSchema,
} as const;