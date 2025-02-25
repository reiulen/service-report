type ApiResponse<T> = {
  status: boolean;
  message: string;
  data?: T | null;
  error?: Record<string, string[]> | string | null;
};

export const successResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  status: true,
  message,
  data: data ?? null,
});

export const errorResponse = (
  message: string,
  error?: Record<string, string[]> | string
): ApiResponse<null> => ({
  status: false,
  message,
  error: error ?? null,
});