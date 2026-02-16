// src/types/ApiTypes.ts
export interface CustomResponse<T> {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  isSuccess: boolean;
  value: T;
}
