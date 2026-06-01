import type { Endpoint, BackendRoute, DriftFinding } from "../types.js";

export function compareEndpoints(openapi: Endpoint[], backend: BackendRoute[]): DriftFinding[] {
  const findings: DriftFinding[] = [];
  const backendMap = new Map<string, BackendRoute>();

  // Build backend route map for fast lookup
  for (const route of backend) {
    backendMap.set(`${route.method}:${route.path}`, route);
  }

  // Check for missing or mismatched endpoints in backend
  for (const endpoint of openapi) {
    const key = `${endpoint.method}:${endpoint.path}`;
    const backendRoute = backendMap.get(key);

    if (!backendRoute) {
      findings.push({
        type: "missing_in_backend",
        severity: "error",
        endpoint: endpoint.path,
        method: endpoint.method,
        message: `OpenAPI endpoint not found in backend: ${endpoint.method} ${endpoint.path}`,
        source: "backend"
      });
    }
  }

  // Check for extra endpoints in backend (not in OpenAPI)
  for (const [key, route] of backendMap.entries()) {
    const found = openapi.some(e => `${e.method}:${e.path}` === key);
    if (!found) {
      findings.push({
        type: "extra_in_sdk",
        severity: "warning",
        endpoint: route.path,
        method: route.method,
        message: `Backend route not documented in OpenAPI: ${route.method} ${route.path}`,
        source: "backend"
      });
    }
  }

  return findings;
}
