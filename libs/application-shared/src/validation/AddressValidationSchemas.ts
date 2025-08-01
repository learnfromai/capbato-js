import { z } from 'zod';

/**
 * Validation schemas for address-related operations
 */

export const ProvinceCodeSchema = z
  .string()
  .min(1, 'Province code cannot be empty')
  .max(100, 'Province code cannot exceed 100 characters')
  .transform((value) => value.toUpperCase().trim());

export const CityCodeSchema = z
  .string()
  .min(1, 'City code cannot be empty')
  .max(100, 'City code cannot exceed 100 characters')
  .transform((value) => value.toLowerCase().trim());

export const BarangayCodeSchema = z
  .string()
  .min(1, 'Barangay code cannot be empty')
  .max(100, 'Barangay code cannot exceed 100 characters')
  .transform((value) => value.trim());

/**
 * Query validation schemas
 */
export const GetCitiesByProvinceQuerySchema = z.object({
  provinceCode: ProvinceCodeSchema,
});

export const GetBarangaysByCityQuerySchema = z.object({
  cityCode: CityCodeSchema,
});

// Type exports for validated data
export type ValidatedProvinceCode = z.infer<typeof ProvinceCodeSchema>;
export type ValidatedCityCode = z.infer<typeof CityCodeSchema>;
export type ValidatedBarangayCode = z.infer<typeof BarangayCodeSchema>;
export type ValidatedGetCitiesByProvinceQuery = z.infer<typeof GetCitiesByProvinceQuerySchema>;
export type ValidatedGetBarangaysByCityQuery = z.infer<typeof GetBarangaysByCityQuerySchema>;