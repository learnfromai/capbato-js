import { ProvinceDto, CityDto, BarangayDto } from './AddressDto';

/**
 * Query DTOs for address requests
 */

export interface GetProvincesQuery {
  // No parameters needed for getting all provinces
}

export interface GetCitiesByProvinceQuery {
  provinceCode: string;
}

export interface GetBarangaysByCityQuery {
  cityCode: string;
}

/**
 * Response DTOs for address API
 */
export interface ProvinceResponse {
  success: boolean;
  data: ProvinceDto;
  message?: string;
}

export interface ProvinceListResponse {
  success: boolean;
  data: ProvinceDto[];
  message?: string;
}

export interface CityResponse {
  success: boolean;
  data: CityDto;
  message?: string;
}

export interface CityListResponse {
  success: boolean;
  data: CityDto[];
  message?: string;
}

export interface BarangayResponse {
  success: boolean;
  data: BarangayDto;
  message?: string;
}

export interface BarangayListResponse {
  success: boolean;
  data: BarangayDto[];
  message?: string;
}