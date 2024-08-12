export interface User {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    langKey: string;
    roles: string[];
    initialUsagePeriod: string | null; 
    country: string | null; 
    member: Record<string, any>;
}
  