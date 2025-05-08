/**
 * Profile domain model representing user profile information
 */
export interface IProfileEntity {
  id:number;// can use as SupervisorUserId
  picture?: string;
  theme?: string;
  bio?: string;
  birthDate?: Date;
  city?: string;
  zoneId?: number;
  lastLoginDate?: Date;
  firstName: string;
  lastName: string;
}