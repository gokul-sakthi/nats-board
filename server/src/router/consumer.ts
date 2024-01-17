import z from "zod";
import { Nats } from "../nats";
import logger from "../logger";
import express from "express";

const consumerRouter = express.Router({ strict: true });

const getConsumerQuerySchema = z.object({
    streamName: z.string().min(1),
    durableName: z.string().min(1),
});

consumerRouter.get("/consumers", async (req, res) => {
    try {
        const nats = await Nats.getInstance();
        const parsedQuery = getConsumerQuerySchema.parse(req.query);
        // Assuming a method to list consumers is available
        const consumers = await nats.jsm.consumers.list(parsedQuery.streamName);

        res.status(200).json({ response: consumers });
    } catch (error) {
        logger.error({ error }, "Error getting consumer list from jetstream");
        res.status(500).json({ error });
    }
});

const updateConsumerBodySchema = z.object({
    config: z.record(z.unknown()),
});

const updateConsumerQuerySchema = z.object({
    streamName: z.string().min(1),
    durableName: z.string().min(1),
});

consumerRouter.put("/consumers", async (req, res) => {
    try {
        const nats = await Nats.getInstance();
        const parsedBody = updateConsumerBodySchema.parse(req.body);
        const parsedQuery = updateConsumerQuerySchema.parse(req.query);

        const consumer = await nats.jsm.consumers.info(
            parsedQuery.streamName,
            parsedQuery.durableName
        );

        const updatedConsumer = await nats.jsm.consumers.update(
            parsedQuery.streamName,
            parsedQuery.durableName,
            { ...consumer.config, ...parsedBody.config }
        );

        res.status(200).json({ response: updatedConsumer });
    } catch (error) {
        logger.error({ error }, "Error updating consumer in jetstream");
        res.status(500).json({ error });
    }
});

const getMessageQuerySchema = z.object({
    streamName: z.string().min(1),
    durableName: z.string().min(1).optional(),
    startSequence: z.number().optional(),
    filterSubjects: z.string().min(1).optional(),
});

consumerRouter.get("/consumers/messages", async (req, res) => {
    try {
        const nats = await Nats.getInstance();
        const parsedQuery = getMessageQuerySchema.parse(req.query);

        const c = await nats.js.consumers.get(parsedQuery.streamName, {
            filterSubjects: parsedQuery.filterSubjects,
        });

        const messages: unknown[] = [];

        const data = await c.fetch();

        for await (const d of data) {
            messages.push({
                headers: d.headers,
                redelivered: d.redelivered,
                data: d.json(),
                seq: d.seq,
                subject: d.subject,
                info: d.info,
            });

            data.stop();
        }

        // const response = await new Promise((res) => res(messages));
        res.status(200).json({ response: messages });
    } catch (error) {
        logger.error({ error }, "Error getting messages from consumer in jetstream");
        res.status(500).json({ error });
    }
});

const deleteConsumerQuerySchema = z.object({
    streamName: z.string().min(1),
    durableName: z.string().min(1),
});

consumerRouter.delete("/consumers", async (req, res) => {
    try {
        const nats = await Nats.getInstance();
        const parsedQuery = deleteConsumerQuerySchema.parse(req.query);

        const response = await nats.jsm.consumers.delete(
            parsedQuery.streamName,
            parsedQuery.durableName
        );

        res.status(200).json({ response });
    } catch (error) {
        logger.error({ error }, "Error deleting consumer in jetstream");
        res.status(500).json({ error });
    }
});

export default consumerRouter;
