import pointOfView, { PointOfViewOptions } from "@fastify/view";
import fp from "fastify-plugin";

/**
 * Views Plugin
 */
export const views = fp<PointOfViewOptions>(async (server, opts) => {
    server.register(pointOfView, opts);
});
