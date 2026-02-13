const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL no está configurada");
}

export { APP_URL };
