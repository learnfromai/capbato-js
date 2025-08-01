import { Province, City, Barangay } from '@nx-starter/domain';
import { ProvinceDto, CityDto, BarangayDto } from '../dto/AddressDto';

/**
 * Mappers for transforming address domain entities to DTOs
 */
export class AddressMapper {
  /**
   * Map Province entity to DTO
   */
  static provinceToDto(province: Province): ProvinceDto {
    return {
      code: province.code.value,
      name: province.name.value,
    };
  }

  /**
   * Map array of Province entities to DTOs
   */
  static provincesToDtoArray(provinces: Province[]): ProvinceDto[] {
    return provinces.map(province => this.provinceToDto(province));
  }

  /**
   * Map City entity to DTO
   */
  static cityToDto(city: City): CityDto {
    return {
      code: city.code.value,
      name: city.name.value,
    };
  }

  /**
   * Map array of City entities to DTOs
   */
  static citiesToDtoArray(cities: City[]): CityDto[] {
    return cities.map(city => this.cityToDto(city));
  }

  /**
   * Map Barangay entity to DTO
   */
  static barangayToDto(barangay: Barangay): BarangayDto {
    return {
      code: barangay.code.value,
      name: barangay.name.value,
    };
  }

  /**
   * Map array of Barangay entities to DTOs
   */
  static barangaysToDtoArray(barangays: Barangay[]): BarangayDto[] {
    return barangays.map(barangay => this.barangayToDto(barangay));
  }
}