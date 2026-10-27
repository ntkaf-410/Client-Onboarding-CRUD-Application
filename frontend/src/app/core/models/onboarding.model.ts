import { Address } from './address.model';
import { Personal } from './personal.model';

export type OnboardingStatus = 'DRAFT' | 'SUBMITTED';

export interface OnboardingListItem {
  id: number;
  clientName: string;
  idNumber: string;
  status: OnboardingStatus;
  currentStep: number;
  updatedAt: string;
}

export interface Onboarding {
  id: number;
  personalId: number;
  status: OnboardingStatus;
  currentStep: number;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  personal: Personal;
  addresses: Address[];
}