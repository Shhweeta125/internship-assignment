import { Hono } from "hono";
import { serve } from "@hono/node-server";
import auth from "./routes/auth";
import prisma from "./lib/prisma";
import transactions from "./routes/transactions";
const app = new Hono();

app.get("/", (c) => {
  return c.text("Backend Working");
});

app.get("/test-db", async (c) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    return c.json({
      success: true,
      result,
    });
  } catch (error) {
    return c.json({
      success: false,
      error,
    });
  }
});
app.route("/api/auth", auth);
serve({
  fetch: app.fetch,
  port: 3001,
});
app.route("/api/transactions", transactions);

console.log("Server running on port 3001");