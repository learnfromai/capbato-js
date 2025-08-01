import { readFileSync } from 'fs';
import { join } from 'path';
import { Province, IProvinceRepository } from '@nx-starter/domain';

export class InMemoryProvinceRepository implements IProvinceRepository {
  private provinces: Province[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.isInitialized) return;

    try {
      const dataPath = join(__dirname, '../../../data/philippines-complete.json');
      const philippinesData = JSON.parse(readFileSync(dataPath, 'utf8'));
      
      const provinceSet = new Set<string>();
      
      Object.keys(philippinesData).forEach(regionKey => {
        const region = philippinesData[regionKey];
        if (region.province_list) {
          Object.keys(region.province_list).forEach(provinceName => {
            if (!provinceSet.has(provinceName)) {
              provinceSet.add(provinceName);
              const provinceCode = provinceName.replace(/\s+/g, '_').toUpperCase();
              this.provinces.push(new Province(provinceCode, provinceName));
            }
          });
        }
      });
      
      // Sort provinces alphabetically by name
      this.provinces.sort((a, b) => a.name.value.localeCompare(b.name.value));
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading Philippine provinces data:', error);
      throw new Error('Failed to initialize province data');
    }
  }

  async getAll(): Promise<Province[]> {
    return [...this.provinces];
  }

  async getByCode(code: string): Promise<Province | undefined> {
    const normalizedCode = code.toUpperCase().trim();
    return this.provinces.find(province => province.code.value === normalizedCode);
  }
}