// Laboratory DTO types for API responses and data transfer

export interface LabRequestDto {
  id?: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: string; // ISO date string
  others?: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  dateTaken?: string; // ISO date string
  // Lab Tests
  tests: Record<string, string>;
  // Individual test fields for backward compatibility
  cbcWithPlatelet?: string;
  pregnancyTest?: string;
  urinalysis?: string;
  fecalysis?: string;
  occultBloodTest?: string;
  hepaBScreening?: string;
  hepaAScreening?: string;
  hepatitisProfile?: string;
  vdrlRpr?: string;
  dengueNs1?: string;
  ca125CeaPsa?: string;
  fbs?: string;
  bun?: string;
  creatinine?: string;
  bloodUricAcid?: string;
  lipidProfile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodiumNa?: string;
  potassiumK?: string;
  hbalc?: string;
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export interface BloodChemistryDto {
  id?: string;
  patientName: string;
  age: number;
  sex: 'Male' | 'Female';
  dateTaken: string; // ISO date string
  results: Record<string, number | string>;
  // Individual result fields for backward compatibility
  fbs?: number | string;
  bun?: number | string;
  creatinine?: number | string;
  uricAcid?: number | string;
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
  alkPhosphatase?: number | string;
  totalProtein?: number | string;
  albumin?: number | string;
  globulin?: number | string;
  agRatio?: number | string;
  totalBilirubin?: number | string;
  directBilirubin?: number | string;
  indirectBilirubin?: number | string;
  ionisedCalcium?: number | string;
  magnesium?: number | string;
  hbalc?: number | string;
  ogtt30min?: number | string;
  ogtt1hr?: number | string;
  ogtt2hr?: number | string;
  ppbs2hr?: number | string;
  inorPhosphorus?: number | string;
}

// Specialized DTOs for specific endpoints
export interface CompletedLabTestDto {
  patientId: string;
  patientName: string;
  labTest: string; // Comma-separated list of selected tests
  date: string; // ISO date string
  status: string;
}

export interface LabRequestStatsDto {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  todayRequests: number;
  thisWeekRequests: number;
  thisMonthRequests: number;
}

export interface BloodChemistryStatsDto {
  totalResults: number;
  todayResults: number;
  thisWeekResults: number;
  thisMonthResults: number;
  averageAge: number;
  maleCount: number;
  femaleCount: number;
}