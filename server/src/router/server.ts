import express from "express";
import { Nats } from "../nats";
import logger from "../logger";

const serverRouter = express.Router();

serverRouter.get("/nats-server/info", async (req, res) => {
    try {
        const nats = await Nats.getInstance();

        // Assuming there's a method in your NATS instance to get server info
        const serverInfo = await nats.nc.info;

        res.status(200).json({ response: serverInfo });
    } catch (error) {
        logger.error({ error }, "Error getting server info from NATS");
        res.status(500).json({ error });
    }
});

export default serverRouter;
