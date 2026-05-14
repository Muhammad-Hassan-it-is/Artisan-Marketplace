// Vercel Serverless Function bridge
// This file imports the pre-built Express app and exports it so Vercel
// can treat it as a Serverless Function. Run `pnpm build:vercel` first
// to produce artifacts/api-server/dist/app.mjs before deploying.
import app from "../artifacts/api-server/dist/app.mjs";

export default app;
