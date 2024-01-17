import { configDotenv } from "dotenv";
import { z } from "zod";
configDotenv();

export const DEFAULT_PAGINATION_MAX_COUNT = 1000;

export const stringToBooleanSchema = z
    .enum(["true", "false"])
    .default("false")
    .transform<boolean>((arg) => arg === "true");

const stringToNumberSchema = z
    .string()
    .refine((data) => !isNaN(Number(data)), {
        message: "PORT must be a number",
    })
    .transform((data) => parseInt(data, 10));

const envSchema = z.object({
    LOG_LEVEL: z.enum(["info", "warn", "error", "verbose", "debug"]).default("info"),
    PORT: stringToNumberSchema.default("3010"),
    NATS_SERVER_URL: z.string().min(1).optional(),
});
const validatedEnv = envSchema.parse({
    LOG_LEVEL: process.env.LOG_LEVEL,
    PORT: process.env.PORT,
    NATS_SERVER_URL: process.env.NATS_SERVER_URL,
});

export default validatedEnv;
