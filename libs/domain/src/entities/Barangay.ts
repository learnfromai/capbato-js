import { BarangayCode } from '../value-objects/BarangayCode';
import { BarangayName } from '../value-objects/BarangayName';
import { CityCode } from '../value-objects/CityCode';

interface IBarangay {
  code: BarangayCode;
  name: BarangayName;
  cityCode: CityCode;
}

export class Barangay implements IBarangay {
  private readonly _code: BarangayCode;
  private readonly _name: BarangayName;
  private readonly _cityCode: CityCode;

  constructor(
    code: string | BarangayCode,
    name: string | BarangayName,
    cityCode: string | CityCode
  ) {
    this._code = code instanceof BarangayCode ? code : new BarangayCode(code);
    this._name = name instanceof BarangayName ? name : new BarangayName(name);
    this._cityCode = cityCode instanceof CityCode ? cityCode : new CityCode(cityCode);
  }

  get code(): BarangayCode {
    return this._code;
  }

  get name(): BarangayName {
    return this._name;
  }

  get cityCode(): CityCode {
    return this._cityCode;
  }

  /**
   * Create a new Barangay with updated name
   */
  public updateName(newName: string | BarangayName): Barangay {
    return new Barangay(this._code, newName, this._cityCode);
  }

  /**
   * Check if this barangay belongs to the specified city
   */
  public belongsToCity(cityCode: string | CityCode): boolean {
    const codeToCheck = cityCode instanceof CityCode ? cityCode : new CityCode(cityCode);
    return this._cityCode.equals(codeToCheck);
  }

  /**
   * Check if this barangay equals another barangay
   */
  public equals(other: Barangay): boolean {
    return this._code.equals(other._code) && 
           this._name.equals(other._name) && 
           this._cityCode.equals(other._cityCode);
  }

  /**
   * Get a string representation of the barangay
   */
  public toString(): string {
    return `${this._code.value}: ${this._name.value} (${this._cityCode.value})`;
  }
}