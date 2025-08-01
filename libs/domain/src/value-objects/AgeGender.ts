import { InvalidAgeGenderException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Age and Gender information
 * Encapsulates business rules for age/gender data
 */
export class AgeGender {
  private readonly _value: string;

  constructor(value: string) {
    this.validateAgeGender(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validateAgeGender(ageGender: string): void {
    if (!ageGender || !ageGender.trim()) {
      throw new InvalidAgeGenderException('cannot be empty');
    }

    if (ageGender.trim().length > 50) {
      throw new InvalidAgeGenderException('cannot exceed 50 characters');
    }

    if (ageGender.trim().length < 3) {
      throw new InvalidAgeGenderException('must be at least 3 characters long');
    }

    // Basic validation - should contain age and gender info
    // Examples: "25/M", "32/F", "45 Male", "28 Female"
    const ageGenderPattern = /^(\d{1,3})\s*[\/\-\s]\s*(M|F|Male|Female)$/i;
    if (!ageGenderPattern.test(ageGender.trim())) {
      throw new InvalidAgeGenderException('must be in format like "25/M", "32/F", "45 Male", or "28 Female"');
    }
  }

  /**
   * Extract age from the age/gender string
   */
  getAge(): number {
    const match = this._value.match(/^(\d{1,3})/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Extract gender from the age/gender string
   */
  getGender(): 'M' | 'F' | 'Male' | 'Female' {
    const match = this._value.match(/[\/\-\s]\s*(M|F|Male|Female)$/i);
    return match ? match[1] as 'M' | 'F' | 'Male' | 'Female' : 'M';
  }

  equals(other: AgeGender): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}