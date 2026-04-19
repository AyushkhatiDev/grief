export default {
  async fetch(request: Request, env: any, ctx: any) {
    const server = await import("./dist/client/server/server.js");
    return server.default.fetch(request, env, ctx);
  },
};
