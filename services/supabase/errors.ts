/**
 * Supabase/PostgREST errors come back as plain objects ({ message, details,
 * hint, code }), not `Error` instances — so `error instanceof Error` is false
 * and naive handlers swallow the real message. This normalises anything thrown
 * by the data layer into a readable string.
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.';
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null) {
    const maybe = error as { message?: unknown; details?: unknown };
    if (typeof maybe.message === 'string' && maybe.message) return maybe.message;
    if (typeof maybe.details === 'string' && maybe.details) return maybe.details;
  }
  return 'Something went wrong. Please try again.';
}
