import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import dummyRouter from "./routes/dummy-router";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isDummy = !process.env.DATABASE_URL;
if (isDummy) {
  logger.warn("DATABASE_URL not set — running in dummy (in-memory) mode");
  app.use("/api", dummyRouter);
} else {
  app.use("/api", router);
}

export default app;
