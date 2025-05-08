import { Realm } from './realm.domain';



/**
 * Specifications for realm validation
 */
export class RealmSpecification {
  /**
   * Validates if the realm name is valid
   * @param realm The realm to validate
   * @returns true if the realm name is valid, false otherwise
   */
  static hasValidName(realm: Realm): boolean {
    return !!realm.name && realm.name.trim().length > 0;
  }

  /**
   * Validates if the realm has a valid ID
   * @param realm The realm to validate
   * @returns true if the realm ID is valid, false otherwise
   */
  static hasValidId(realm: Realm): boolean {
    return realm.id > 0;
  }

  /**
   * Validates if the realm is valid
   * @param realm The realm to validate
   * @returns true if the realm is valid, false otherwise
   */
  static isValid(realm: Realm): boolean {
    return this.hasValidId(realm) && this.hasValidName(realm);
  }
}