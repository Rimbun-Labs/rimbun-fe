/** Session payload when Firebase auth succeeds but tenant entitlement fails. */
export const ACCESS_RESTRICTED_KEY = 'rimbun.accessRestricted';

export type AccessRestrictedState = {
  email?: string | null;
};

export class AccessRestrictedError extends Error {
  readonly code = 'ACCESS_RESTRICTED' as const;
  readonly email?: string | null;

  constructor(
    message = 'This account is not linked to a Rimbun workspace.',
    email?: string | null
  ) {
    super(message);
    this.name = 'AccessRestrictedError';
    this.email = email;
  }
}

export function isAccessRestrictedError(error: unknown): error is AccessRestrictedError {
  return (
    error instanceof AccessRestrictedError ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'ACCESS_RESTRICTED')
  );
}

export function markAccessRestricted(email?: string | null): void {
  try {
    const payload: AccessRestrictedState = { email: email ?? null };
    sessionStorage.setItem(ACCESS_RESTRICTED_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

export function consumeAccessRestricted(): AccessRestrictedState | null {
  try {
    const raw = sessionStorage.getItem(ACCESS_RESTRICTED_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(ACCESS_RESTRICTED_KEY);

    // Legacy flag from earlier gate versions.
    if (raw === '1') return {};

    try {
      return JSON.parse(raw) as AccessRestrictedState;
    } catch {
      return {};
    }
  } catch {
    return null;
  }
}
