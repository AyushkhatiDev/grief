// functions/[[path]].ts

// @ts-ignore - resolved at build time
import server from "../dist/server/server.js";

export const onRequest = async (context: any) => {
  return server.fetch(context.request, context.env, context);
};