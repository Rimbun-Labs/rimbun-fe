/** Frontend product zone — not marketing, not backend API paths. */
export const APP_ROOT = "/app";

export function appHome(): string {
  return APP_ROOT;
}

export function appCustomers(): string {
  return `${APP_ROOT}/customers`;
}

export function appCustomer(customerId: string): string {
  return `${APP_ROOT}/customers/${customerId}`;
}

export function appCustomerAssessment(customerId: string): string {
  return `${appCustomer(customerId)}/assessment`;
}

export function appCustomerProducts(customerId: string): string {
  return `${appCustomer(customerId)}/products`;
}

/** Direct-business workspace pages live under /app; FI business-customer under /app/customers/:id/... */
export function businessWorkspaceBase(customerIdOverride?: string): string {
  if (customerIdOverride) {
    return `${appCustomer(customerIdOverride)}/business`;
  }
  return APP_ROOT;
}
