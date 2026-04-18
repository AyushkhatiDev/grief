// @ts-ignore
import server from "./dist/client/server/server.js";

export default {
  fetch: (request: Request, env: any, ctx: any) => {
    return server.fetch(request, env, ctx);
  },
};
