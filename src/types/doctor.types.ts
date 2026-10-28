import { BaseQueryParams } from './pagination.types';

export interface DaySchedule {
  start: string;
  end: string;
}

export type WeekSchedule = Record<string, DaySchedule | null>;

export interface DoctorReview {
  id: string;
  date: string;
  rating: number;
  comment: string;
  authorName: string;
}

export type DoctorGender = 'male' | 'female';

export interface Doctor {
  id: string;
  fullName: string;
  specialtyIds: string[];
  title: string;
  experienceYears: number;
  rating?: number;
  reviewCount?: number;
  consultationPrice: number;
  bio: string;
  education: string[];
  languages: string[];
  gender: DoctorGender;
  photoInitials?: string;
  photoHue?: number;
  schedule?: WeekSchedule;
  reviews?: DoctorReview[];
}

export type DoctorSortOption =
  | 'rating-desc'
  | 'name-asc'
  | 'name-desc'
  | 'experience-desc'
  | 'price-asc'
  | 'price-desc';

export interface DoctorQueryParams extends BaseQueryParams {
  specialtyId?: string;
  gender?: DoctorGender;
  sort?: DoctorSortOption;
}

export interface CreateDoctorDto {
  id?: string;
  fullName: string;
  specialtyIds: string[];
  title: string;
  experienceYears: number;
  consultationPrice: number;
  bio: string;
  education: string[];
  languages: string[];
  gender: 'male' | 'female';
  photoInitials?: string;
  photoHue?: number;
  schedule?: WeekSchedule;
}

export interface UpdateDoctorDto {
  fullName?: string;
  specialtyIds?: string[];
  title?: string;
  experienceYears?: number;
  consultationPrice?: number;
  bio?: string;
  education?: string[];
  languages?: string[];
  gender?: 'male' | 'female';
  photoInitials?: string;
  photoHue?: number;
  schedule?: WeekSchedule;
}
