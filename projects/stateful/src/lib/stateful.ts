export interface ResultState<R = unknown, E = unknown> {
  isLoading: boolean;
  error: E;
  result: R;
}
