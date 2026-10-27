export interface AddressFields {
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

export interface AddressFormValue {
  residential: AddressFields & { residentialStatus: string };
  samePostal: boolean;
  postal: AddressFields;
}