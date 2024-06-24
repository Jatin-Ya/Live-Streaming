import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./config/config";
import { globalErrorHandler } from "./middleware/global.error";
import path from "path";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);

app.use(express.static(path.join(__dirname, "public")));

// app.get("/application", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// })

app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.use(globalErrorHandler);

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

export default app;
