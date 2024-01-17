import z from "zod";
import { Nats } from "../nats";
import logger from "../logger";
import { StreamInfo } from "nats";
import express from "express";

const streamRouter = express.Router({ strict: true });

const getStreamsQuerySchema = z.object({ subject: z.string().optional() });

streamRouter.get("/streams", async (req, res) => {
    try {
        const parsedQuery = getStreamsQuerySchema.parse(req.query);

        const nats = await Nats.getInstance();
        const streams = nats.jsm.streams.list(parsedQuery.subject);

        const response: StreamInfo[] = [];

        for await (const s of streams) {
            response.push(s);
        }
        res.status(200).json({ response });
    } catch (error) {
        logger.error({ error }, "Error getting streams from jetstream");
        res.status(500).json({ error });
    }
});

const addStreamBodyResponse = z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    subjects: z.string().min(1).array().optional(),
});

streamRouter.post("/streams", async (req, res) => {
    try {
        const parsedBody = addStreamBodyResponse.parse(req.body);

        const nats = await Nats.getInstance();

        const response = await nats.jsm.streams.add({
            ...parsedBody,
        });
        res.status(200).json({ response });
    } catch (error) {
        logger.error({ error }, "Error adding streams from jetstream [getStreams procedure]");
        res.status(500).json({ error });
    }
});

const updateStreamBodySchema = z.object({
    config: z.record(z.unknown()),
});

streamRouter.put("/streams/:name", async (req, res) => {
    try {
        const params = streamNameParamsSchema.parse(req.params);

        const parsedBody = updateStreamBodySchema.parse(req.body);

        const nats = await Nats.getInstance();

        // Check if the stream exists
        let streamInfo;
        try {
            streamInfo = await nats.jsm.streams.info(params.name);
        } catch (streamNotFoundError) {
            return res.status(404).json({ error: streamNotFoundError });
        }

        // Existing options are in streamInfo.config
        // Overlap the newly added options using spread
        const updatedConfig = {
            ...streamInfo.config,
            ...parsedBody.config,
        };

        // Update the stream with the new configuration
        const response = await nats.jsm.streams.update(params.name, updatedConfig);

        res.status(200).json({ response, old: streamInfo });
    } catch (error) {
        logger.error({ error }, "Error updating stream in jetstream");
        res.status(500).json({ error });
    }
});

const streamNameParamsSchema = z.object({ name: z.string().min(1) });

const purgeStreamParamsSchema = z.object({ name: z.string().min(1) });
const purgeStreamBodySchema = z
    .object({
        // You can add options for purging here if needed
        // For example:
        subject: z.string().optional(),
        seq: z.number(),
        keep: z.number().optional(),
    })
    .optional();

streamRouter.post("/streams/:name/purge", async (req, res) => {
    try {
        const params = purgeStreamParamsSchema.parse(req.params);
        const purgeOptions = purgeStreamBodySchema.parse(req.body);

        const nats = await Nats.getInstance();
        const response = await nats.jsm.streams.purge(params.name, purgeOptions);

        res.status(200).json({ response });
    } catch (error) {
        logger.error({ error }, "Error purging messages from stream in jetstream");
        res.status(500).json({ error });
    }
});

export default streamRouter;
