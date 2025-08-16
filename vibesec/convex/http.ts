import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Example HTTP endpoint (not used in MVP, but good for future expansion)
http.route({
  path: "/hello",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("Hello from Convex HTTP!");
  }),
});

export default http;
