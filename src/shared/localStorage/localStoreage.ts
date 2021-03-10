export const saveAccessToken = (token: string): void => {
  localStorage.setItem('ACCESS_TOKEN', token);
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('ACCESS_TOKEN');
}

export const clearToken = (): void => {
  localStorage.clear();
}