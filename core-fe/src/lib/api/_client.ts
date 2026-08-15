import "server-only";
import ky from "ky";
import { env } from "@/env";

export const client = ky.create({
  prefix: env.EMDASH_API_URL,
  timeout: 10000,
  headers: {
    ...(env.EMDASH_API_KEY
      ? { Authorization: `Bearer ${env.EMDASH_API_KEY}` }
      : {}),
  },
});

export interface EmdashApiResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
  };
}

export default client;
