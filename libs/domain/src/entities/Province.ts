import { ProvinceCode } from '../value-objects/ProvinceCode';
import { ProvinceName } from '../value-objects/ProvinceName';

interface IProvince {
  code: ProvinceCode;
  name: ProvinceName;
}

export class Province implements IProvince {
  private readonly _code: ProvinceCode;
  private readonly _name: ProvinceName;

  constructor(
    code: string | ProvinceCode,
    name: string | ProvinceName
  ) {
    this._code = code instanceof ProvinceCode ? code : new ProvinceCode(code);
    this._name = name instanceof ProvinceName ? name : new ProvinceName(name);
  }

  get code(): ProvinceCode {
    return this._code;
  }

  get name(): ProvinceName {
    return this._name;
  }

  /**
   * Create a new Province with updated name
   */
  public updateName(newName: string | ProvinceName): Province {
    return new Province(this._code, newName);
  }

  /**
   * Check if this province equals another province
   */
  public equals(other: Province): boolean {
    return this._code.equals(other._code) && this._name.equals(other._name);
  }

  /**
   * Get a string representation of the province
   */
  public toString(): string {
    return `${this._code.value}: ${this._name.value}`;
  }
}