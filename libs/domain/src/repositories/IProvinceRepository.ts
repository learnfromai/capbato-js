import { Province } from '../entities/Province';

export interface IProvinceRepository {
  /**
   * Get all provinces
   */
  getAll(): Promise<Province[]>;

  /**
   * Get province by code
   */
  getByCode(code: string): Promise<Province | undefined>;
}