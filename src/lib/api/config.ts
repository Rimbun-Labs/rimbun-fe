export const isMockEnvironment = () => {
  const host = window.location.hostname;
  return host.includes('lovable') || host.includes('preview');
};

export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  isMock: false
}; 