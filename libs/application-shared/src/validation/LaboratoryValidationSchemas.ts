import { z } from 'zod';
import type { TestTypeName } from '@nx-starter/domain';

/**
 * Zod schemas for Laboratory command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Base validation schemas
export const PatientIdSchema = z.string()
  .min(1, 'Patient ID is required')
  .max(50, 'Patient ID cannot exceed 50 characters')
  .trim();

export const PatientNameSchema = z.string()
  .min(2, 'Patient name must be at least 2 characters')
  .max(255, 'Patient name cannot exceed 255 characters')
  .trim();

export const AgeGenderSchema = z.string()
  .min(1, 'Age/Gender is required')
  .max(50, 'Age/Gender cannot exceed 50 characters')
  .trim();

export const TestTypeValueSchema = z.string()
  .max(500, 'Test value cannot exceed 500 characters')
  .trim()
  .optional();

export const LabStatusSchema = z.enum(['Pending', 'In Progress', 'Complete', 'Cancelled']);

// Test selection validation
const TestSelectionSchema = z.object({
  cbc_with_platelet: TestTypeValueSchema,
  pregnancy_test: TestTypeValueSchema,
  urinalysis: TestTypeValueSchema,
  fecalysis: TestTypeValueSchema,
  occult_blood_test: TestTypeValueSchema,
  hepa_b_screening: TestTypeValueSchema,
  hepa_a_screening: TestTypeValueSchema,
  hepatitis_profile: TestTypeValueSchema,
  vdrl_rpr: TestTypeValueSchema,
  dengue_ns1: TestTypeValueSchema,
  ca_125_cea_psa: TestTypeValueSchema,
  fbs: TestTypeValueSchema,
  bun: TestTypeValueSchema,
  creatinine: TestTypeValueSchema,
  blood_uric_acid: TestTypeValueSchema,
  lipid_profile: TestTypeValueSchema,
  sgot: TestTypeValueSchema,
  sgpt: TestTypeValueSchema,
  alp: TestTypeValueSchema,
  sodium_na: TestTypeValueSchema,
  potassium_k: TestTypeValueSchema,
  hbalc: TestTypeValueSchema,
  ecg: TestTypeValueSchema,
  t3: TestTypeValueSchema,
  t4: TestTypeValueSchema,
  ft3: TestTypeValueSchema,
  ft4: TestTypeValueSchema,
  tsh: TestTypeValueSchema,
}).partial();

// Lab Request Commands
export const CreateLabRequestCommandSchema = z.object({
  patient_id: PatientIdSchema,
  patient_name: PatientNameSchema,
  age_gender: AgeGenderSchema,
  request_date: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    return val;
  }),
  others: z.string().max(1000, 'Others field cannot exceed 1000 characters').trim().optional(),
}).merge(TestSelectionSchema);

export const UpdateLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'Lab request ID is required'),
  patient_id: PatientIdSchema,
  request_date: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    return val;
  }),
  status: LabStatusSchema.optional(),
  date_taken: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    return val;
  }).optional(),
}).merge(TestSelectionSchema.partial());

export const DeleteLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'Lab request ID is required'),
});

// Blood Chemistry Commands
export const CreateBloodChemistryCommandSchema = z.object({
  patient_name: PatientNameSchema,
  age: z.number().int().min(0, 'Age must be non-negative').max(150, 'Age must be realistic'),
  sex: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Sex must be either Male or Female' }),
  }),
  date_taken: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    return val;
  }),
  // Blood chemistry values (all optional)
  fbs: z.number().min(0).optional(),
  bun: z.number().min(0).optional(),
  creatinine: z.number().min(0).optional(),
  uric_acid: z.number().min(0).optional(),
  cholesterol: z.number().min(0).optional(),
  triglycerides: z.number().min(0).optional(),
  hdl: z.number().min(0).optional(),
  ldl: z.number().min(0).optional(),
  vldl: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  potassium: z.number().min(0).optional(),
  chloride: z.number().min(0).optional(),
  calcium: z.number().min(0).optional(),
  sgot: z.number().min(0).optional(),
  sgpt: z.number().min(0).optional(),
  rbs: z.number().min(0).optional(),
  alk_phosphatase: z.number().min(0).optional(),
  total_protein: z.number().min(0).optional(),
  albumin: z.number().min(0).optional(),
  globulin: z.number().min(0).optional(),
  ag_ratio: z.number().min(0).optional(),
  total_bilirubin: z.number().min(0).optional(),
  direct_bilirubin: z.number().min(0).optional(),
  indirect_bilirubin: z.number().min(0).optional(),
  ionised_calcium: z.number().min(0).optional(),
  magnesium: z.number().min(0).optional(),
  hbalc: z.number().min(0).optional(),
  ogtt_30min: z.number().min(0).optional(),
  ogtt_1hr: z.number().min(0).optional(),
  ogtt_2hr: z.number().min(0).optional(),
  ppbs_2hr: z.number().min(0).optional(),
  inor_phosphorus: z.number().min(0).optional(),
});

// Query parameter schemas
export const GetLabRequestByPatientIdSchema = z.object({
  patientId: PatientIdSchema,
});

export const GetLabRequestByIdSchema = z.object({
  id: z.string().min(1, 'Lab request ID is required'),
});

export const LabRequestIdSchema = z.string().min(1, 'Lab request ID is required');

// Export TypeScript types generated from schemas
export type CreateLabRequestCommand = z.infer<typeof CreateLabRequestCommandSchema>;
export type UpdateLabRequestCommand = z.infer<typeof UpdateLabRequestCommandSchema>;
export type DeleteLabRequestCommand = z.infer<typeof DeleteLabRequestCommandSchema>;
export type CreateBloodChemistryCommand = z.infer<typeof CreateBloodChemistryCommandSchema>;
export type GetLabRequestByPatientIdQuery = z.infer<typeof GetLabRequestByPatientIdSchema>;
export type GetLabRequestByIdQuery = z.infer<typeof GetLabRequestByIdSchema>;

// Collection of all validation schemas
export const LaboratoryValidationSchemas = {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  CreateBloodChemistryCommandSchema,
  GetLabRequestByPatientIdSchema,
  GetLabRequestByIdSchema,
  LabRequestIdSchema,
} as const;