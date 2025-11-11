

export interface ResponseViewModel<T> {
  status: boolean;
  msg: string;
  data: T | null;
}