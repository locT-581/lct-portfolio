import "server-only";
import ky from "ky";

const baseUrl = process.env.EMDASH_API_URL;
const apiKey = process.env.EMDASH_API_KEY;

if (!baseUrl && process.env.NODE_ENV !== "test") {
  console.warn(
    "[Em-dash API Client] Warning: EMDASH_API_URL environment variable is not defined.",
  );
}

export const client = ky.create({
  prefix: baseUrl,
  timeout: 10000,
  headers: {
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  },
});

export default client;
