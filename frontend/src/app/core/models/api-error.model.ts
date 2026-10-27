export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  fieldErrors?: FieldError[];
}