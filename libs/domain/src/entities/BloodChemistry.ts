import { LabRequestId } from '../value-objects/LabRequestId';
import { PatientId } from '../value-objects/PatientId';
import {
  InvalidPatientNameException,
  InvalidBloodChemistryValueException,
} from '../exceptions/DomainExceptions';

interface IBloodChemistry {
  id?: LabRequestId;
  patientName: string;
  age: number;
  sex: 'Male' | 'Female';
  dateTaken: Date;
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uricAcid?: number;
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
  alkPhosphatase?: number;
  totalProtein?: number;
  albumin?: number;
  globulin?: number;
  agRatio?: number;
  totalBilirubin?: number;
  directBilirubin?: number;
  indirectBilirubin?: number;
  ionisedCalcium?: number;
  magnesium?: number;
  hba1c?: number;
  ogtt30min?: number;
  ogtt1hr?: number;
  ogtt2hr?: number;
  ppbs2hr?: number;
  inorPhosphorus?: number;
  createdAt: Date;
}

export class BloodChemistry implements IBloodChemistry {
  private readonly _id?: LabRequestId;
  private readonly _patientName: string;
  private readonly _age: number;
  private readonly _sex: 'Male' | 'Female';
  private readonly _dateTaken: Date;
  private readonly _fbs?: number;
  private readonly _bun?: number;
  private readonly _creatinine?: number;
  private readonly _uricAcid?: number;
  private readonly _cholesterol?: number;
  private readonly _triglycerides?: number;
  private readonly _hdl?: number;
  private readonly _ldl?: number;
  private readonly _vldl?: number;
  private readonly _sodium?: number;
  private readonly _potassium?: number;
  private readonly _chloride?: number;
  private readonly _calcium?: number;
  private readonly _sgot?: number;
  private readonly _sgpt?: number;
  private readonly _rbs?: number;
  private readonly _alkPhosphatase?: number;
  private readonly _totalProtein?: number;
  private readonly _albumin?: number;
  private readonly _globulin?: number;
  private readonly _agRatio?: number;
  private readonly _totalBilirubin?: number;
  private readonly _directBilirubin?: number;
  private readonly _indirectBilirubin?: number;
  private readonly _ionisedCalcium?: number;
  private readonly _magnesium?: number;
  private readonly _hba1c?: number;
  private readonly _ogtt30min?: number;
  private readonly _ogtt1hr?: number;
  private readonly _ogtt2hr?: number;
  private readonly _ppbs2hr?: number;
  private readonly _inorPhosphorus?: number;
  private readonly _createdAt: Date;

  constructor(
    patientName: string,
    age: number,
    sex: 'Male' | 'Female',
    dateTaken: Date,
    results: Partial<{
      fbs: number;
      bun: number;
      creatinine: number;
      uricAcid: number;
      cholesterol: number;
      triglycerides: number;
      hdl: number;
      ldl: number;
      vldl: number;
      sodium: number;
      potassium: number;
      chloride: number;
      calcium: number;
      sgot: number;
      sgpt: number;
      rbs: number;
      alkPhosphatase: number;
      totalProtein: number;
      albumin: number;
      globulin: number;
      agRatio: number;
      totalBilirubin: number;
      directBilirubin: number;
      indirectBilirubin: number;
      ionisedCalcium: number;
      magnesium: number;
      hba1c: number;
      ogtt30min: number;
      ogtt1hr: number;
      ogtt2hr: number;
      ppbs2hr: number;
      inorPhosphorus: number;
    }> = {},
    id?: string | LabRequestId,
    createdAt: Date = new Date()
  ) {
    this.validatePatientName(patientName);
    this.validateAge(age);
    this.validateSex(sex);
    this.validateNumericValues(results);

    this._patientName = patientName.trim();
    this._age = age;
    this._sex = sex;
    this._dateTaken = dateTaken;
    this._fbs = results.fbs;
    this._bun = results.bun;
    this._creatinine = results.creatinine;
    this._uricAcid = results.uricAcid;
    this._cholesterol = results.cholesterol;
    this._triglycerides = results.triglycerides;
    this._hdl = results.hdl;
    this._ldl = results.ldl;
    this._vldl = results.vldl;
    this._sodium = results.sodium;
    this._potassium = results.potassium;
    this._chloride = results.chloride;
    this._calcium = results.calcium;
    this._sgot = results.sgot;
    this._sgpt = results.sgpt;
    this._rbs = results.rbs;
    this._alkPhosphatase = results.alkPhosphatase;
    this._totalProtein = results.totalProtein;
    this._albumin = results.albumin;
    this._globulin = results.globulin;
    this._agRatio = results.agRatio;
    this._totalBilirubin = results.totalBilirubin;
    this._directBilirubin = results.directBilirubin;
    this._indirectBilirubin = results.indirectBilirubin;
    this._ionisedCalcium = results.ionisedCalcium;
    this._magnesium = results.magnesium;
    this._hba1c = results.hba1c;
    this._ogtt30min = results.ogtt30min;
    this._ogtt1hr = results.ogtt1hr;
    this._ogtt2hr = results.ogtt2hr;
    this._ppbs2hr = results.ppbs2hr;
    this._inorPhosphorus = results.inorPhosphorus;
    this._id = id instanceof LabRequestId ? id : id ? new LabRequestId(id) : undefined;
    this._createdAt = createdAt;
  }

  // Getters
  get id(): LabRequestId | undefined {
    return this._id;
  }

  get patientName(): string {
    return this._patientName;
  }

  get age(): number {
    return this._age;
  }

  get sex(): 'Male' | 'Female' {
    return this._sex;
  }

  get dateTaken(): Date {
    return this._dateTaken;
  }

  get fbs(): number | undefined {
    return this._fbs;
  }

  get bun(): number | undefined {
    return this._bun;
  }

  get creatinine(): number | undefined {
    return this._creatinine;
  }

  get uricAcid(): number | undefined {
    return this._uricAcid;
  }

  get cholesterol(): number | undefined {
    return this._cholesterol;
  }

  get triglycerides(): number | undefined {
    return this._triglycerides;
  }

  get hdl(): number | undefined {
    return this._hdl;
  }

  get ldl(): number | undefined {
    return this._ldl;
  }

  get vldl(): number | undefined {
    return this._vldl;
  }

  get sodium(): number | undefined {
    return this._sodium;
  }

  get potassium(): number | undefined {
    return this._potassium;
  }

  get chloride(): number | undefined {
    return this._chloride;
  }

  get calcium(): number | undefined {
    return this._calcium;
  }

  get sgot(): number | undefined {
    return this._sgot;
  }

  get sgpt(): number | undefined {
    return this._sgpt;
  }

  get rbs(): number | undefined {
    return this._rbs;
  }

  get alkPhosphatase(): number | undefined {
    return this._alkPhosphatase;
  }

  get totalProtein(): number | undefined {
    return this._totalProtein;
  }

  get albumin(): number | undefined {
    return this._albumin;
  }

  get globulin(): number | undefined {
    return this._globulin;
  }

  get agRatio(): number | undefined {
    return this._agRatio;
  }

  get totalBilirubin(): number | undefined {
    return this._totalBilirubin;
  }

  get directBilirubin(): number | undefined {
    return this._directBilirubin;
  }

  get indirectBilirubin(): number | undefined {
    return this._indirectBilirubin;
  }

  get ionisedCalcium(): number | undefined {
    return this._ionisedCalcium;
  }

  get magnesium(): number | undefined {
    return this._magnesium;
  }

  get hba1c(): number | undefined {
    return this._hba1c;
  }

  get ogtt30min(): number | undefined {
    return this._ogtt30min;
  }

  get ogtt1hr(): number | undefined {
    return this._ogtt1hr;
  }

  get ogtt2hr(): number | undefined {
    return this._ogtt2hr;
  }

  get ppbs2hr(): number | undefined {
    return this._ppbs2hr;
  }

  get inorPhosphorus(): number | undefined {
    return this._inorPhosphorus;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For backwards compatibility
  get stringId(): string | undefined {
    return this._id?.value;
  }

  // Domain business logic methods
  isGlucoseAbnormal(): boolean {
    if (this._fbs !== undefined) {
      return this._fbs < 70 || this._fbs > 100; // Normal fasting glucose: 70-100 mg/dL
    }
    return false;
  }

  isKidneyFunctionAbnormal(): boolean {
    const bunAbnormal = this._bun !== undefined && (this._bun < 7 || this._bun > 20);
    const creatinineAbnormal = this._creatinine !== undefined && (this._creatinine > 1.2);
    return bunAbnormal || creatinineAbnormal;
  }

  isLiverFunctionAbnormal(): boolean {
    const sgotAbnormal = this._sgot !== undefined && this._sgot > 40;
    const sgptAbnormal = this._sgpt !== undefined && this._sgpt > 41;
    return sgotAbnormal || sgptAbnormal;
  }

  isLipidProfileAbnormal(): boolean {
    const cholesterolHigh = this._cholesterol !== undefined && this._cholesterol > 200;
    const triglyceridesHigh = this._triglycerides !== undefined && this._triglycerides > 150;
    const hdlLow = this._hdl !== undefined && this._hdl < 40;
    const ldlHigh = this._ldl !== undefined && this._ldl > 100;
    
    return cholesterolHigh || triglyceridesHigh || hdlLow || ldlHigh;
  }

  hasAbnormalResults(): boolean {
    return this.isGlucoseAbnormal() ||
           this.isKidneyFunctionAbnormal() ||
           this.isLiverFunctionAbnormal() ||
           this.isLipidProfileAbnormal();
  }

  // Validation methods
  private validatePatientName(name: string): void {
    if (!name || !name.trim()) {
      throw new InvalidPatientNameException('cannot be empty');
    }

    if (name.trim().length > 255) {
      throw new InvalidPatientNameException('cannot exceed 255 characters');
    }

    if (name.trim().length < 2) {
      throw new InvalidPatientNameException('must be at least 2 characters long');
    }
  }

  private validateAge(age: number): void {
    if (!Number.isInteger(age) || age < 0 || age > 150) {
      throw new InvalidBloodChemistryValueException('age', 'must be a valid age between 0 and 150');
    }
  }

  private validateSex(sex: 'Male' | 'Female'): void {
    if (sex !== 'Male' && sex !== 'Female') {
      throw new InvalidBloodChemistryValueException('sex', 'must be either Male or Female');
    }
  }

  private validateNumericValues(results: Record<string, number | undefined>): void {
    for (const [key, value] of Object.entries(results)) {
      if (value !== undefined && (typeof value !== 'number' || value < 0)) {
        throw new InvalidBloodChemistryValueException(key, 'must be a positive number');
      }
    }
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: BloodChemistry): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._patientName || this._patientName.trim().length === 0) {
      throw new Error('Blood chemistry record must have a valid patient name');
    }

    if (this._dateTaken > new Date()) {
      throw new Error('Date taken cannot be in the future');
    }

    if (this._age < 0 || this._age > 150) {
      throw new Error('Age must be between 0 and 150');
    }
  }
}

export type { IBloodChemistry };