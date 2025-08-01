import { injectable, inject } from 'tsyringe';
import { Controller, Get, Param } from 'routing-controllers';
import {
  GetAllProvincesQueryHandler,
  GetCitiesByProvinceQueryHandler,
  GetBarangaysByCityQueryHandler,
  AddressMapper,
  TOKENS,
  AddressValidationService,
  ProvinceCodeSchema,
  CityCodeSchema,
} from '@nx-starter/application-shared';
import {
  ProvinceListResponse,
  CityListResponse,
  BarangayListResponse,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Address operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/address')
@injectable()
export class AddressController {
  constructor(
    @inject(TOKENS.GetAllProvincesQueryHandler)
    private getAllProvincesQueryHandler: GetAllProvincesQueryHandler,
    @inject(TOKENS.GetCitiesByProvinceQueryHandler)
    private getCitiesByProvinceQueryHandler: GetCitiesByProvinceQueryHandler,
    @inject(TOKENS.GetBarangaysByCityQueryHandler)
    private getBarangaysByCityQueryHandler: GetBarangaysByCityQueryHandler,
    @inject(TOKENS.AddressValidationService)
    private validationService: AddressValidationService
  ) {}

  /**
   * GET /api/address/provinces - Get all provinces
   */
  @Get('/provinces')
  async getProvinces(): Promise<ProvinceListResponse> {
    const provinces = await this.getAllProvincesQueryHandler.execute();
    const provinceDtos = AddressMapper.provincesToDtoArray(provinces);

    return ApiResponseBuilder.success(provinceDtos);
  }

  /**
   * GET /api/address/cities/:provinceCode - Get cities by province
   */
  @Get('/cities/:provinceCode')
  async getCitiesByProvince(@Param('provinceCode') provinceCode: string): Promise<CityListResponse> {
    // Validate the province code parameter
    const validatedProvinceCode = ProvinceCodeSchema.parse(provinceCode);
    
    const cities = await this.getCitiesByProvinceQueryHandler.execute({ 
      provinceCode: validatedProvinceCode 
    });
    const cityDtos = AddressMapper.citiesToDtoArray(cities);

    return ApiResponseBuilder.success(cityDtos);
  }

  /**
   * GET /api/address/barangays/:cityCode - Get barangays by city
   */
  @Get('/barangays/:cityCode')
  async getBarangaysByCity(@Param('cityCode') cityCode: string): Promise<BarangayListResponse> {
    // Validate the city code parameter
    const validatedCityCode = CityCodeSchema.parse(cityCode);
    
    const barangays = await this.getBarangaysByCityQueryHandler.execute({ 
      cityCode: validatedCityCode 
    });
    const barangayDtos = AddressMapper.barangaysToDtoArray(barangays);

    return ApiResponseBuilder.success(barangayDtos);
  }
}