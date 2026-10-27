export type AddressType = 'RESIDENTIAL' | 'POSTAL';

export interface AddressRequest {
  addressType: AddressType;
  addressLine1: string;
  addressLine2: string | null;
  suburb: string | null;
  city: string;
  district: string | null;
  postalCode: string | null;
  country: string;
  residentialStatus: string | null;
}

export interface Address extends AddressRequest {
  id: number;
  personalId: number;
  createdAt: string;
  updatedAt: string;
}