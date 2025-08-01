/**
 * Value Object for Reason for Visit  
 * Encapsulates the reason/purpose of the appointment
 */
export class ReasonForVisit {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 500;

  constructor(reason: string) {
    this.validateReason(reason);
    this._value = reason.trim();
  }

  get value(): string {
    return this._value;
  }

  get reason(): string {
    return this._value;
  }

  private validateReason(reason: string): void {
    if (typeof reason !== 'string') {
      throw new Error('Reason for visit must be a string');
    }

    const trimmedReason = reason.trim();
    
    if (trimmedReason.length === 0) {
      throw new Error('Reason for visit is required');
    }

    if (trimmedReason.length < ReasonForVisit.MIN_LENGTH) {
      throw new Error(`Reason for visit must be at least ${ReasonForVisit.MIN_LENGTH} characters long`);
    }

    if (trimmedReason.length > ReasonForVisit.MAX_LENGTH) {
      throw new Error(`Reason for visit cannot exceed ${ReasonForVisit.MAX_LENGTH} characters`);
    }

    // Check for inappropriate content (basic sanitization)
    if (this.containsInappropriateContent(trimmedReason)) {
      throw new Error('Reason for visit contains inappropriate content');
    }
  }

  private containsInappropriateContent(reason: string): boolean {
    // Basic check for inappropriate content - can be expanded
    const inappropriatePatterns = [
      /<script/i,
      /javascript:/i,
      /<iframe/i,
      /on\w+\s*=/i, // event handlers like onclick=
    ];

    return inappropriatePatterns.some(pattern => pattern.test(reason));
  }

  /**
   * Get a truncated version of the reason for display
   */
  getTruncated(maxLength: number = 50): string {
    const reason = this.reason;
    if (reason.length <= maxLength) {
      return reason;
    }
    return reason.substring(0, maxLength - 3) + '...';
  }

  /**
   * Get word count
   */
  getWordCount(): number {
    return this.reason.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Check if reason contains specific keywords
   */
  containsKeywords(keywords: string[]): boolean {
    const reasonLower = this.reason.toLowerCase();
    return keywords.some(keyword => reasonLower.includes(keyword.toLowerCase()));
  }

  /**
   * Get a sanitized version for display
   */
  getSanitized(): string {
    return this.reason
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/&/g, '&amp;') // Escape ampersands
      .trim();
  }

  /**
   * Check if this is likely an emergency/urgent visit
   */
  isUrgent(): boolean {
    const urgentKeywords = [
      'emergency', 'urgent', 'pain', 'chest pain', 'difficulty breathing',
      'severe', 'bleeding', 'accident', 'injury', 'fever', 'high fever'
    ];
    
    return this.containsKeywords(urgentKeywords);
  }

  equals(other: ReasonForVisit): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Factory methods for common visit reasons
   */
  static checkup(): ReasonForVisit {
    return new ReasonForVisit('Regular checkup');
  }

  static followUp(): ReasonForVisit {
    return new ReasonForVisit('Follow-up visit');
  }

  static consultation(): ReasonForVisit {
    return new ReasonForVisit('Medical consultation');
  }

  static fromString(reason: string): ReasonForVisit {
    return new ReasonForVisit(reason);
  }
}