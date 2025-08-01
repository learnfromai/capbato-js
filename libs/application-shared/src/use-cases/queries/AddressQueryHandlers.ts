import { injectable, inject } from 'tsyringe';
import { Province, City, Barangay, IProvinceRepository, ICityRepository, IBarangayRepository } from '@nx-starter/domain';
import { 
  GetProvincesQuery, 
  GetCitiesByProvinceQuery, 
  GetBarangaysByCityQuery 
} from '../../dto/AddressQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handlers for address data retrieval following CQRS pattern
 */

@injectable()
export class GetAllProvincesQueryHandler {
  constructor(
    @inject(TOKENS.ProvinceRepository)
    private provinceRepository: IProvinceRepository
  ) {}

  async execute(query?: GetProvincesQuery): Promise<Province[]> {
    return await this.provinceRepository.getAll();
  }
}

@injectable()
export class GetCitiesByProvinceQueryHandler {
  constructor(
    @inject(TOKENS.CityRepository)
    private cityRepository: ICityRepository
  ) {}

  async execute(query: GetCitiesByProvinceQuery): Promise<City[]> {
    return await this.cityRepository.getByProvinceCode(query.provinceCode);
  }
}

@injectable()
export class GetBarangaysByCityQueryHandler {
  constructor(
    @inject(TOKENS.BarangayRepository)
    private barangayRepository: IBarangayRepository
  ) {}

  async execute(query: GetBarangaysByCityQuery): Promise<Barangay[]> {
    return await this.barangayRepository.getByCityCode(query.cityCode);
  }
}