import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import leadRoutes from "./routes/lead.routes.js";

const app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Caprae Acquisition Intelligence API is running"
  });
});

app.use("/api/leads", leadRoutes);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(
        `Server running at http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();