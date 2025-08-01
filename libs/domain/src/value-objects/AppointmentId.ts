/**
 * Interface for ID validation strategies
 */
interface IdValidator {
  isValid(id: string): boolean;
  getTypeName(): string;
}

/**
 * UUID validator implementation
 */
class UuidValidator implements IdValidator {
  isValid(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{32}$/i;
    return uuidRegex.test(id);
  }

  getTypeName(): string {
    return 'uuid';
  }
}

/**
 * MongoDB ObjectId validator implementation
 */
class MongoIdValidator implements IdValidator {
  isValid(id: string): boolean {
    const mongoIdRegex = /^[0-9a-f]{24}$/i;
    return mongoIdRegex.test(id);
  }

  getTypeName(): string {
    return 'mongodb';
  }
}

/**
 * Numeric ID validator implementation (for legacy support)
 */
class NumericIdValidator implements IdValidator {
  isValid(id: string): boolean {
    const numericRegex = /^\d+$/;
    return numericRegex.test(id) && parseInt(id, 10) > 0;
  }

  getTypeName(): string {
    return 'numeric';
  }
}

/**
 * Value Object for Appointment ID
 * Ensures type safety and validation for appointment identifiers
 * Uses Strategy pattern for OCP compliance
 */
export class AppointmentId {
  private readonly _value: string;
  private readonly _validator: IdValidator;

  private static readonly validators: IdValidator[] = [
    new UuidValidator(),
    new MongoIdValidator(),
    new NumericIdValidator(),
  ];

  constructor(value: string) {
    this.validateId(value);
    this._value = value;
    this._validator = this.findValidator(value);
  }

  get value(): string {
    return this._value;
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Appointment ID must be a non-empty string');
    }

    const isValid = AppointmentId.validators.some((validator) =>
      validator.isValid(id)
    );

    if (!isValid) {
      const supportedFormats = AppointmentId.validators
        .map((v) => v.getTypeName())
        .join(', ');
      throw new Error(
        `Appointment ID must be a valid format. Supported formats: ${supportedFormats}`
      );
    }
  }

  private findValidator(id: string): IdValidator {
    const validator = AppointmentId.validators.find((v) => v.isValid(id));
    if (!validator) {
      throw new Error('No validator found for the given ID');
    }
    return validator;
  }

  equals(other: AppointmentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static fromString(value: string): AppointmentId {
    return new AppointmentId(value);
  }

  isUUID(): boolean {
    return this._validator.getTypeName() === 'uuid';
  }

  isMongoObjectId(): boolean {
    return this._validator.getTypeName() === 'mongodb';
  }

  isNumeric(): boolean {
    return this._validator.getTypeName() === 'numeric';
  }

  getIdType(): 'uuid' | 'mongodb' | 'numeric' {
    return this._validator.getTypeName() as 'uuid' | 'mongodb' | 'numeric';
  }

  static addValidator(validator: IdValidator): void {
    AppointmentId.validators.push(validator);
  }
}