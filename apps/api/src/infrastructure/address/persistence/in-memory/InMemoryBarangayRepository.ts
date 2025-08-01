import { readFileSync } from 'fs';
import { join } from 'path';
import { Barangay, IBarangayRepository } from '@nx-starter/domain';

export class InMemoryBarangayRepository implements IBarangayRepository {
  private barangays: Barangay[] = [];
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
            const municipalities = region.province_list[provinceName].municipality_list;
            
            Object.keys(municipalities).forEach(municipalityName => {
              const cityCode = municipalityName.replace(/\s+/g, '_').toLowerCase();
              const barangayList = municipalities[municipalityName].barangay_list;
              
              barangayList.forEach((barangayName: string, index: number) => {
                const barangayCode = `B${(index + 1).toString().padStart(3, '0')}`;
                this.barangays.push(new Barangay(barangayCode, barangayName, cityCode));
              });
            });
          });
        }
      });
      
      // Sort barangays alphabetically by name
      this.barangays.sort((a, b) => a.name.value.localeCompare(b.name.value));
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading Philippine barangays data:', error);
      throw new Error('Failed to initialize barangay data');
    }
  }

  async getAll(): Promise<Barangay[]> {
    return [...this.barangays];
  }

  async getByCityCode(cityCode: string): Promise<Barangay[]> {
    const normalizedCityCode = cityCode.toLowerCase().trim();
    return this.barangays.filter(barangay => barangay.cityCode.value === normalizedCityCode);
  }

  async getByCode(code: string): Promise<Barangay | undefined> {
    const normalizedCode = code.trim();
    return this.barangays.find(barangay => barangay.code.value === normalizedCode);
  }
}