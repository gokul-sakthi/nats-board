import express from "express";
import logger from "./logger";
import validatedEnv from "./config";
import streamRouter from "./router/streams";
import http from "http";
import ws from "ws";
import consumerRouter from "./router/consumer";
import serverRouter from "./router/server";
import cors from "cors";
const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = validatedEnv.PORT;

app.use("/", streamRouter);
app.use("/", consumerRouter);
app.use("/", serverRouter);

app.get("/", (req, res) => {
    res.json({ message: "Hello from nats-board server!" });
});

app.listen(PORT, async () => {
    logger.info(`Server running on port ${PORT}`);
});

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("Received:", message);
        ws.send(`Echo: ${message}`);
    });

    ws.send("Connected to WebSocket server");
});
