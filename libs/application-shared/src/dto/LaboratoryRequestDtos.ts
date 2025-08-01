// Laboratory Request DTOs for API endpoints

import type { LabRequestDto, BloodChemistryDto, CompletedLabTestDto, LabRequestStatsDto, BloodChemistryStatsDto } from './LaboratoryDto';

// Lab Request API DTOs
export interface CreateLabRequestRequestDto {
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string; // ISO date string or date string
  others?: string;
  // Lab Tests (using legacy naming for compatibility)
  cbc_with_platelet?: string;
  pregnancy_test?: string;
  urinalysis?: string;
  fecalysis?: string;
  occult_blood_test?: string;
  hepa_b_screening?: string;
  hepa_a_screening?: string;
  hepatitis_profile?: string;
  vdrl_rpr?: string;
  dengue_ns1?: string;
  ca_125_cea_psa?: string;
  fbs?: string;
  bun?: string;
  creatinine?: string;
  blood_uric_acid?: string;
  lipid_profile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodium_na?: string;
  potassium_k?: string;
  hbalc?: string;
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export interface UpdateLabRequestResultsRequestDto {
  fbs?: string;
  bun?: string;
  creatinine?: string;
  blood_uric_acid?: string;
  lipid_profile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodium_na?: string;
  potassium_k?: string;
  hbalc?: string;
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
  status?: 'Pending' | 'In Progress' | 'Complete';
  date_taken?: string; // ISO date string
}

// Blood Chemistry API DTOs
export interface CreateBloodChemistryRequestDto {
  patient_name: string;
  age: number;
  sex: 'Male' | 'Female';
  date_taken: string; // ISO date string
  // Blood Chemistry Results (using legacy naming for compatibility)
  fbs?: number | string;
  bun?: number | string;
  creatinine?: number | string;
  uric_acid?: number | string;
  cholesterol?: number | string;
  triglycerides?: number | string;
  hdl?: number | string;
  ldl?: number | string;
  vldl?: number | string;
  sodium?: number | string;
  potassium?: number | string;
  chloride?: number | string;
  calcium?: number | string;
  sgot?: number | string;
  sgpt?: number | string;
  rbs?: number | string;
  alk_phosphatase?: number | string;
  total_protein?: number | string;
  albumin?: number | string;
  globulin?: number | string;
  ag_ratio?: number | string;
  total_bilirubin?: number | string;
  direct_bilirubin?: number | string;
  indirect_bilirubin?: number | string;
  ionised_calcium?: number | string;
  magnesium?: number | string;
  hbalc?: number | string;
  ogtt_30min?: number | string;
  ogtt_1hr?: number | string;
  ogtt_2hr?: number | string;
  ppbs_2hr?: number | string;
  inor_phosphorus?: number | string;
}

// Response DTOs
export interface LabRequestResponse {
  success: true;
  data: LabRequestDto;
}

export interface LabRequestListResponse {
  success: true;
  data: LabRequestDto[];
}

export interface CompletedLabTestListResponse {
  success: true;
  data: CompletedLabTestDto[];
}

export interface LabRequestStatsResponse {
  success: true;
  data: LabRequestStatsDto;
}

export interface BloodChemistryResponse {
  success: true;
  data: BloodChemistryDto;
}

export interface BloodChemistryListResponse {
  success: true;
  data: BloodChemistryDto[];
}

export interface BloodChemistryStatsResponse {
  success: true;
  data: BloodChemistryStatsDto;
}

export interface LaboratoryOperationResponse {
  success: true;
  message: string;
}