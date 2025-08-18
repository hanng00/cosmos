export const getUrlIfValid = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};
