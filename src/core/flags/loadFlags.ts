const FEATURE_FLAG_APP_URL = process.env.FEATURE_FLAG_APP_URL as string;
if (!FEATURE_FLAG_APP_URL) {
  throw new Error("FEATURE_FLAG_APP_URL is not set in environment variables");
}

const FEATURE_FLAG_APP_URL_TOKEN = process.env.FEATURE_FLAG_APP_URL_TOKEN as string;
if (!FEATURE_FLAG_APP_URL_TOKEN) {
  throw new Error("FEATURE_FLAG_APP_URL_TOKEN is not set in environment variables");
}

export { FEATURE_FLAG_APP_URL, FEATURE_FLAG_APP_URL_TOKEN };