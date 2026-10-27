export interface PersonalRequest {
  title: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  idType: string;
  idNumber: string;
  idExpiryDate: string | null;
  email: string;
  mobileNumber: string;
  occupation: string | null;
  employmentStatus: string;
}

export interface Personal extends PersonalRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
}