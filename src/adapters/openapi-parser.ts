import type { OpenAPISpec, Endpoint } from "../types.js";
import { readFileSync } from "fs";
import { parse } from "yaml";

export function parseOpenAPI(filePath: string): OpenAPISpec {
  const content = readFileSync(filePath, "utf-8");
  const spec = parse(content) as any;

  if (!spec.openapi && !spec.swagger) {
    throw new Error("Invalid OpenAPI spec: missing openapi or swagger field");
  }

  const endpoints: Endpoint[] = [];
  const paths = spec.paths || {};

  for (const [path, pathItem] of Object.entries(paths)) {
    const item = pathItem as any;
    for (const method of ["get", "post", "put", "delete", "patch", "head"]) {
      if (method in item) {
        const operation = item[method];
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          parameters: operation.parameters || [],
          requestBody: operation.requestBody,
          responses: operation.responses || {}
        });
      }
    }
  }

  return {
    version: spec.openapi || spec.swagger,
    title: spec.info?.title || "Unknown",
    endpoints,
    schemas: spec.components?.schemas || spec.definitions || {}
  };
}
