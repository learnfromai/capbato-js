import { CityCode } from '../value-objects/CityCode';
import { CityName } from '../value-objects/CityName';
import { ProvinceCode } from '../value-objects/ProvinceCode';

interface ICity {
  code: CityCode;
  name: CityName;
  provinceCode: ProvinceCode;
}

export class City implements ICity {
  private readonly _code: CityCode;
  private readonly _name: CityName;
  private readonly _provinceCode: ProvinceCode;

  constructor(
    code: string | CityCode,
    name: string | CityName,
    provinceCode: string | ProvinceCode
  ) {
    this._code = code instanceof CityCode ? code : new CityCode(code);
    this._name = name instanceof CityName ? name : new CityName(name);
    this._provinceCode = provinceCode instanceof ProvinceCode ? provinceCode : new ProvinceCode(provinceCode);
  }

  get code(): CityCode {
    return this._code;
  }

  get name(): CityName {
    return this._name;
  }

  get provinceCode(): ProvinceCode {
    return this._provinceCode;
  }

  /**
   * Create a new City with updated name
   */
  public updateName(newName: string | CityName): City {
    return new City(this._code, newName, this._provinceCode);
  }

  /**
   * Check if this city belongs to the specified province
   */
  public belongsToProvince(provinceCode: string | ProvinceCode): boolean {
    const codeToCheck = provinceCode instanceof ProvinceCode ? provinceCode : new ProvinceCode(provinceCode);
    return this._provinceCode.equals(codeToCheck);
  }

  /**
   * Check if this city equals another city
   */
  public equals(other: City): boolean {
    return this._code.equals(other._code) && 
           this._name.equals(other._name) && 
           this._provinceCode.equals(other._provinceCode);
  }

  /**
   * Get a string representation of the city
   */
  public toString(): string {
    return `${this._code.value}: ${this._name.value} (${this._provinceCode.value})`;
  }
}