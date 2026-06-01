import type { BackendRoute } from "../types.js";
import { readFileSync } from "fs";
import { parse } from "yaml";

export function parseBackendRoutes(filePath: string): BackendRoute[] {
  const content = readFileSync(filePath, "utf-8");
  const spec = parse(content) as any;

  if (!Array.isArray(spec.routes)) {
    throw new Error("Invalid backend metadata: routes must be an array");
  }

  return spec.routes.map((route: any) => ({
    path: route.path,
    method: (route.method || "GET").toUpperCase(),
    handler: route.handler || "unknown"
  }));
}
