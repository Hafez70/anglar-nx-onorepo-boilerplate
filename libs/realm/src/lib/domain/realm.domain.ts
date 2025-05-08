/**
 * Represents a Realm entity model
 */
/**
 * Interface defining the shape of a Realm entity
 */
export interface IRealmEntity {
    id: number;
    name: string | null;
  }

export class Realm implements IRealmEntity {
  /**
   * The unique identifier for the realm
   */
  public id: number;
  
  /**
   * The name of the realm
   */
  public name: string | null;

  constructor(data?: Partial<IRealmEntity>) {
    this.id = data?.id ?? 0;
    this.name = data?.name ?? null;
  }
}