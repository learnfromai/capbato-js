/**
 * Laboratory Data Transfer Objects (DTOs)
 * Used for API responses and data transfer between layers
 */

// Base Lab Request DTO
export interface LabRequestDto {
  id?: string;
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string; // ISO date string
  status: 'Pending' | 'In Progress' | 'Complete' | 'Cancelled';
  others?: string;
  date_taken?: string; // ISO date string
  created_at: string; // ISO date string
  
  // Test selections
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

// Blood Chemistry DTO
export interface BloodChemistryDto {
  id?: string;
  patient_name: string;
  age: number;
  sex: 'Male' | 'Female';
  date_taken: string; // ISO date string
  created_at: string; // ISO date string
  
  // Blood chemistry values
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uric_acid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  calcium?: number;
  sgot?: number;
  sgpt?: number;
  rbs?: number;
  alk_phosphatase?: number;
  total_protein?: number;
  albumin?: number;
  globulin?: number;
  ag_ratio?: number;
  total_bilirubin?: number;
  direct_bilirubin?: number;
  indirect_bilirubin?: number;
  ionised_calcium?: number;
  magnesium?: number;
  hbalc?: number;
  ogtt_30min?: number;
  ogtt_1hr?: number;
  ogtt_2hr?: number;
  ppbs_2hr?: number;
  inor_phosphorus?: number;
}

// Laboratory Statistics DTO
export interface LaboratoryStatsDto {
  total_lab_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  cancelled_requests: number;
  total_blood_chemistries: number;
  requests_today: number;
  completion_rate: number; // percentage
}

// Request DTOs for API endpoints
export interface CreateLabRequestRequestDto {
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string | Date;
  others?: string;
  
  // Test selections
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

export interface UpdateLabRequestRequestDto {
  status?: 'Pending' | 'In Progress' | 'Complete' | 'Cancelled';
  date_taken?: string | Date;
  
  // Test results updates
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

export interface CreateBloodChemistryRequestDto {
  patient_name: string;
  age: number;
  sex: 'Male' | 'Female';
  date_taken: string | Date;
  
  // Blood chemistry values
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uric_acid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  calcium?: number;
  sgot?: number;
  sgpt?: number;
  rbs?: number;
  alk_phosphatase?: number;
  total_protein?: number;
  albumin?: number;
  globulin?: number;
  ag_ratio?: number;
  total_bilirubin?: number;
  direct_bilirubin?: number;
  indirect_bilirubin?: number;
  ionised_calcium?: number;
  magnesium?: number;
  hbalc?: number;
  ogtt_30min?: number;
  ogtt_1hr?: number;
  ogtt_2hr?: number;
  ppbs_2hr?: number;
  inor_phosphorus?: number;
}