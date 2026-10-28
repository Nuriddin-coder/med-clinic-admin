import { BaseQueryParams } from './pagination.types';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  durationMinutes?: number;
  patientName: string;
  patientPhone: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
}

export type AppointmentSortOption =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'date-desc'
  | 'date-asc'
  | 'patientName-asc'
  | 'patientName-desc';

export interface AppointmentQueryParams extends BaseQueryParams {
  phone?: string;
  doctorId?: string;
  serviceId?: string;
  date?: string;
  status?: AppointmentStatus | 'ALL';
  sort?: AppointmentSortOption;
}

export interface CreateAppointmentDto {
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  notes?: string;
}

export interface CancelAppointmentDto {
  phone: string;
}
