import { Barangay } from '../entities/Barangay';

export interface IBarangayRepository {
  /**
   * Get all barangays
   */
  getAll(): Promise<Barangay[]>;

  /**
   * Get barangays by city code
   */
  getByCityCode(cityCode: string): Promise<Barangay[]>;

  /**
   * Get barangay by code
   */
  getByCode(code: string): Promise<Barangay | undefined>;
}