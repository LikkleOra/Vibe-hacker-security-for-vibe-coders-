import { httpRouter } from "convex/server";

const http = httpRouter();

// Example HTTP endpoint (not used in MVP, but good for future expansion)
http.route({
  path: "/hello",
  method: "GET",
  handler: async (ctx, request) => {
    return new Response("Hello from Convex HTTP!");
  },
});

export default http;
