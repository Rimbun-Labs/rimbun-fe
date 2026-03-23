export type EmploymentType =
  | 'government'
  | 'private_salaried'
  | 'self_employed'
  | 'business_owner'
  | 'student'
  | 'unemployed'
  | 'retired'
  | 'other';

export interface EconomicProfileDto {
  employmentType: EmploymentType | null;
  employmentDetail?: string | null;
  dependents: number | null;
  plannedRetirementAge?: number | null;
}

