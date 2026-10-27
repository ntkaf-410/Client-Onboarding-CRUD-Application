import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Address, AddressRequest } from '../../../core/models/address.model';
import { Onboarding, OnboardingListItem, OnboardingStatus } from '../../../core/models/onboarding.model';
import { Page } from '../../../core/models/page.model';
import { Personal, PersonalRequest } from '../../../core/models/personal.model';
import {API_BASE_URL} from '../../../core/api-config';

export interface OnboardingListQuery {
  page?: number;
  size?: number;
  status?: OnboardingStatus | '';
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class OnboardingApiService {
  private readonly http = inject(HttpClient);


  listOnboardings(query: OnboardingListQuery = {}): Observable<Page<OnboardingListItem>> {
    let params = new HttpParams();
    if (query.page !== undefined) params = params.set('page', query.page);
    if (query.size !== undefined) params = params.set('size', query.size);
    if (query.status) params = params.set('status', query.status);
    if (query.search?.trim()) params = params.set('search', query.search.trim());
    return this.http.get<Page<OnboardingListItem>>(`${API_BASE_URL}/onboardings`, { params });
  }

  getOnboarding(id: number): Observable<Onboarding> {
    return this.http.get<Onboarding>(`${API_BASE_URL}/onboardings/${id}`);
  }

  createOnboarding(personalId: number): Observable<Onboarding> {
    return this.http.post<Onboarding>(`${API_BASE_URL}/onboardings`, { personalId });
  }

  updateOnboardingStep(id: number, currentStep: number): Observable<Onboarding> {
    return this.http.put<Onboarding>(`${API_BASE_URL}/onboardings/${id}`, { currentStep });
  }

  submitOnboarding(id: number): Observable<Onboarding> {
    return this.http.post<Onboarding>(`${API_BASE_URL}/onboardings/${id}/submit`, {});
  }

  deleteOnboarding(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/onboardings/${id}`);
  }


  createPersonal(request: PersonalRequest): Observable<Personal> {
    return this.http.post<Personal>(`${API_BASE_URL}/personals`, request);
  }

  updatePersonal(id: number, request: PersonalRequest): Observable<Personal> {
    return this.http.put<Personal>(`${API_BASE_URL}/personals/${id}`, request);
  }


  listAddresses(personalId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${API_BASE_URL}/personals/${personalId}/addresses`);
  }

  createAddress(personalId: number, request: AddressRequest): Observable<Address> {
    return this.http.post<Address>(`${API_BASE_URL}/personals/${personalId}/addresses`, request);
  }

  updateAddress(id: number, request: AddressRequest): Observable<Address> {
    return this.http.put<Address>(`${API_BASE_URL}/addresses/${id}`, request);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/addresses/${id}`);
  }
}