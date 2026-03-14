export function verifyHotmartToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const expectedToken = process.env.HOTMART_HOTTOK;

  if (!expectedToken) {
    console.error("HOTMART_HOTTOK no esta configurado en las variables de entorno");
    return false;
  }

  return token === expectedToken;
}