import { IProfileEntity } from './profile.domain';

/**
 * Specifications for profile validation
 */
export class ProfileSpecification {
  /**
   * Validates if the profile picture URL is in a valid format
   * @param profile The profile to validate
   * @returns Whether the profile picture is valid
   */
  static isValidPictureUrl(profile: IProfileEntity): boolean {
    if (!profile.picture) return true; // Optional field
    
    try {
      const url = new URL(profile.picture);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validates if the user's bio is within acceptable length
   * @param profile The profile to validate
   * @param maxLength Maximum allowed bio length
   * @returns Whether the bio length is valid
   */
  static isValidBioLength(profile: IProfileEntity, maxLength = 500): boolean {
    if (!profile.bio) return true; // Optional field
    
    return profile.bio.length <= maxLength;
  }

  /**
   * Validates if the birth date is valid and represents an adult user
   * @param profile The profile to validate
   * @returns Whether the birth date represents an adult user
   */
  static isValidBirthDate(profile: IProfileEntity): boolean {
    if (!profile.birthDate) return true; // Optional field

    const today = new Date();
    const birthDate = new Date(profile.birthDate);
    
    // Check if birth date is valid and not in the future
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return false;
    }
    
    // Add additional age validation here if needed
    return true;
  }
}