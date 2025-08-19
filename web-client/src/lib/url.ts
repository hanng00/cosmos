/**
 * @param url - The URL to validate. Supports sloppy URLs wihtout protocol.
 * @returns The URL if it is valid, otherwise null.
 */
export const getUrlIfValid = (url: string): URL | null => {
  try {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return new URL(url);
    }

    return new URL(`https://${url}`);
  } catch {
    return null;
  }
};
