import { Button, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import endpoints from "../endpoint";
import { NatsConnection } from "nats";

enum Status {
  Online = "Online",
  Offline = "Offline",
}

interface NatsStatus {
  status: Status;
  error: null | unknown;
  data: null | NatsConnection["info"];
}

const StatusHandler: React.FC<unknown> = () => {
  const [status, setStatus] = useState<NatsStatus>({
    data: null,
    error: null,
    status: Status.Offline,
  });

  const [loading, setLoading] = useState(false);

  const getStatus = useCallback(async () => {
    const response = await api.get<{
      error: unknown | null;
      response: NatsConnection["info"] | null;
    }>(endpoints.NATS_SERVER_HEALTH.url);

    if (response.error) {
      setStatus({
        data: null,
        error: response.error,
        status: Status.Offline,
      });
    } else {
      if (response.result?.response) {
        setStatus({
          data: response.result.response,
          error: null,
          status: Status.Online,
        });
      } else {
        setStatus({
          data: null,
          error: response.result?.error,
          status: Status.Offline,
        });
      }
    }
  }, []);

  const pollServerStatus = useCallback(() => {
    const intervalId = setInterval(async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));
      getStatus().finally(() => setLoading(false));
    }, 5000);

    return intervalId;
  }, [getStatus]);

  useEffect(() => {
    const intervalId = pollServerStatus();

    return () => {
      clearInterval(intervalId);
    };
  }, [pollServerStatus]);

  return (
    <>
      <Button
        bgColor={status.status === Status.Offline ? "gray" : "teal"}
        color={"white"}
        onClick={() => getStatus()}
      >
        <Text marginX={3}>Server {status.status.toString()}</Text>
        <Spinner boxSize={4} visibility={!loading ? "hidden" : undefined} />
      </Button>
    </>
  );
};

export default StatusHandler;
