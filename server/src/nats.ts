import { NatsConnection, connect, StringCodec, JSONCodec } from "nats";
import logger from "./logger";
import { createAsyncSingleton } from "./singleton";
import validatedEnv from "./config";

export const Nats = createAsyncSingleton({
    init: async () => {
        const nc: NatsConnection = await connect({
            servers: validatedEnv.NATS_SERVER_URL,
            reconnect: true,
        });
        const jsm = await nc.jetstreamManager();
        const js = nc.jetstream();
        const sc = StringCodec();
        const jc = JSONCodec();
        return { nc, js, jsm, jc, sc };
    },
    close: (nats) => {
        if (nats.nc.isClosed()) {
            logger.warn({}, "NatsConnection is already closed!");
        } else if (nats.nc.isDraining()) {
            logger.warn({}, "NatsConnection is draining!");
        } else {
            nats.nc.drain();
        }
    },
});
