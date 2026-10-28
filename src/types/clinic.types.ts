export interface ClinicInfo {
  name: string;
  tagline: string;
  about: string;
  address: string;
  phones: string[];
  email: string;
  workingHoursLabel: string;
  years: number;
  patientCount: number;
  doctorCount: number;
}

export interface UpdateClinicDto {
  name?: string;
  tagline?: string;
  about?: string;
  address?: string;
  phones?: string[];
  email?: string;
  workingHoursLabel?: string;
  years?: number;
  patientCount?: number;
  doctorCount?: number;
}

