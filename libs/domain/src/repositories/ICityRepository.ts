import { City } from '../entities/City';

export interface ICityRepository {
  /**
   * Get all cities
   */
  getAll(): Promise<City[]>;

  /**
   * Get cities by province code
   */
  getByProvinceCode(provinceCode: string): Promise<City[]>;

  /**
   * Get city by code
   */
  getByCode(code: string): Promise<City | undefined>;
}