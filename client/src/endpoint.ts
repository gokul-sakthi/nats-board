const BASE_URL = "http://localhost:3010";

enum API_URL_KEY {
  NATS_SERVER_HEALTH = "NATS_SERVER_HEALTH",
  NATS_STREAM_LIST = "NATS_STREAM_LIST",
}

interface Endpoint {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

const endpoints: Record<API_URL_KEY, Endpoint> = {
  NATS_SERVER_HEALTH: { url: `${BASE_URL}/nats-server/info`, method: "GET" },
  NATS_STREAM_LIST: { url: `${BASE_URL}/nats/status`, method: "GET" },
} as const;

export default endpoints;
