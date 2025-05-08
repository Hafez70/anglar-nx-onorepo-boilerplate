import { IZoneEntity } from "./zone.domain";

export class ZoneSpecification {
    /**
     * Validates if the zone name is valid
     * @param zone The zone to validate
     * @returns true if the zone name is valid, false otherwise
     */
    static hasValidName(zone: IZoneEntity): boolean {
      return !!zone.name && zone.name.trim().length > 0;
    }
  
    /**
     * Validates if the zone has a valid ID
     * @param zone The zone to validate
     * @returns true if the zone ID is valid, false otherwise
     */
    static hasValidId(zone: IZoneEntity): boolean {
      return zone.id > 0;
    }
  
    /**
     * Validates if the zone is valid
     * @param zone The zone to validate
     * @returns true if the zone is valid, false otherwise
     */
    static isValid(zone: IZoneEntity): boolean {
      return this.hasValidId(zone) && this.hasValidName(zone);
    }
  }