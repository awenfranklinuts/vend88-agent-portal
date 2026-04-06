// Server-side backend base URL for API proxy routes.
// Reads NEXT_PUBLIC_API_BASE_URL so the same env var controls both client & server.
export function getBackendBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.vend88.com';
}
