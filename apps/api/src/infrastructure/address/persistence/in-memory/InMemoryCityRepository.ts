import { readFileSync } from 'fs';
import { join } from 'path';
import { City, ICityRepository } from '@nx-starter/domain';

export class InMemoryCityRepository implements ICityRepository {
  private cities: City[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.isInitialized) return;

    try {
      const dataPath = join(__dirname, '../../../data/philippines-complete.json');
      const philippinesData = JSON.parse(readFileSync(dataPath, 'utf8'));
      
      Object.keys(philippinesData).forEach(regionKey => {
        const region = philippinesData[regionKey];
        if (region.province_list) {
          Object.keys(region.province_list).forEach(provinceName => {
            const provinceCode = provinceName.replace(/\s+/g, '_').toUpperCase();
            const municipalities = region.province_list[provinceName].municipality_list;
            
            Object.keys(municipalities).forEach(municipalityName => {
              const cityCode = municipalityName.replace(/\s+/g, '_').toLowerCase();
              this.cities.push(new City(cityCode, municipalityName, provinceCode));
            });
          });
        }
      });
      
      // Sort cities alphabetically by name
      this.cities.sort((a, b) => a.name.value.localeCompare(b.name.value));
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading Philippine cities data:', error);
      throw new Error('Failed to initialize city data');
    }
  }

  async getAll(): Promise<City[]> {
    return [...this.cities];
  }

  async getByProvinceCode(provinceCode: string): Promise<City[]> {
    const normalizedProvinceCode = provinceCode.toUpperCase().trim();
    return this.cities.filter(city => city.provinceCode.value === normalizedProvinceCode);
  }

  async getByCode(code: string): Promise<City | undefined> {
    const normalizedCode = code.toLowerCase().trim();
    return this.cities.find(city => city.code.value === normalizedCode);
  }
}