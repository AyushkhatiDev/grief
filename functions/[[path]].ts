/**
 * Cloudflare Pages catch-all function handler.
 *
 * NOTE: Cloudflare now recommends deploying TanStack Start to Cloudflare Workers
 * (not Pages Functions) using `wrangler deploy`. The wrangler.jsonc in this repo
 * points "main" to "@tanstack/react-start/server-entry" which is the correct
 * Workers entrypoint.
 *
 * If you are deploying to Cloudflare Pages (legacy path), this file acts as
 * the catch-all. It imports the compiled server bundle produced by
 * `@cloudflare/vite-plugin` (SSR environment named "ssr" → builds to dist/worker/index.js)
 * and forwards every request to TanStack Start's fetch handler.
 *
 * Cloudflare Pages build settings:
 *   Build command:       npm run build
 *   Build output dir:    dist/client
 *   Functions dir:       functions        ← this file lives here
 */

import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { getRouter } from "../src/router";

const handler = createStartHandler({
  createRouter: getRouter,
})(defaultStreamHandler);

export const onRequest: PagesFunction = (context) => {
  return handler(context.request, context.env as Record<string, unknown>);
};
