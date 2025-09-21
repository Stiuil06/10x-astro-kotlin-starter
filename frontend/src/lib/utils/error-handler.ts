export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: (error as any).message,
      status: (error as any).status,
      code: (error as any).code,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

