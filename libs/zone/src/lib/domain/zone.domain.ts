export interface IZoneEntity {
    id: number;
    name?: string;
    description?: string;
    domainName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    theme?:'dark' | 'winter' | 'fall' | 'summer' | 'spring' | 'light';
    realmId?: number;
}