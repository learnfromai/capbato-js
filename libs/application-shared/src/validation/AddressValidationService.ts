import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  ProvinceCodeSchema,
  CityCodeSchema,
  BarangayCodeSchema,
  GetCitiesByProvinceQuerySchema,
  GetBarangaysByCityQuerySchema,
  ValidatedProvinceCode,
  ValidatedCityCode,
  ValidatedBarangayCode,
  ValidatedGetCitiesByProvinceQuery,
  ValidatedGetBarangaysByCityQuery,
} from './AddressValidationSchemas';

/**
 * Individual validation services for address operations
 */

@injectable()
export class GetCitiesByProvinceValidationService extends ValidationService<
  { provinceCode: string },
  ValidatedGetCitiesByProvinceQuery
> {
  protected schema = GetCitiesByProvinceQuerySchema;
}

@injectable()
export class GetBarangaysByCityValidationService extends ValidationService<
  { cityCode: string },
  ValidatedGetBarangaysByCityQuery
> {
  protected schema = GetBarangaysByCityQuerySchema;
}

/**
 * Composite validation service for all address operations
 */
@injectable()
export class AddressValidationService {
  constructor(
    @inject(TOKENS.GetCitiesByProvinceValidationService)
    private getCitiesByProvinceValidationService: GetCitiesByProvinceValidationService,
    @inject(TOKENS.GetBarangaysByCityValidationService)
    private getBarangaysByCityValidationService: GetBarangaysByCityValidationService
  ) {}

  public validateGetCitiesByProvinceQuery(data: { provinceCode: string }): ValidatedGetCitiesByProvinceQuery {
    return this.getCitiesByProvinceValidationService.validate(data);
  }

  public validateGetBarangaysByCityQuery(data: { cityCode: string }): ValidatedGetBarangaysByCityQuery {
    return this.getBarangaysByCityValidationService.validate(data);
  }

  public validateProvinceCode(provinceCode: string): ValidatedProvinceCode {
    return ProvinceCodeSchema.parse(provinceCode);
  }

  public validateCityCode(cityCode: string): ValidatedCityCode {
    return CityCodeSchema.parse(cityCode);
  }

  public validateBarangayCode(barangayCode: string): ValidatedBarangayCode {
    return BarangayCodeSchema.parse(barangayCode);
  }
}