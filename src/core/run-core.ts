import type { RunOptions, RunResult, DriftFinding, OpenAPISpec, BackendRoute } from "../types.js";
import { parseOpenAPI } from "../adapters/openapi-parser.js";
import { parseBackendRoutes } from "../adapters/backend-parser.js";
import { compareEndpoints } from "../core/drift-engine.js";

export function runCore(options: RunOptions): RunResult {
  try {
    let findings: DriftFinding[] = [];
    let totalEndpoints = 0;

    // Parse inputs
    let openapi: OpenAPISpec | null = null;
    let backend: BackendRoute[] = [];

    if (options.openapi) {
      try {
        openapi = parseOpenAPI(options.openapi);
        totalEndpoints = openapi.endpoints.length;
      } catch (e) {
        findings.push({
          type: "missing_in_backend",
          severity: "error",
          endpoint: "(global)",
          message: `Failed to parse OpenAPI: ${e instanceof Error ? e.message : String(e)}`,
          source: "openapi"
        });
      }
    }

    if (options.backend) {
      try {
        backend = parseBackendRoutes(options.backend);
      } catch (e) {
        findings.push({
          type: "missing_in_backend",
          severity: "error",
          endpoint: "(global)",
          message: `Failed to parse backend metadata: ${e instanceof Error ? e.message : String(e)}`,
          source: "backend"
        });
      }
    }

    // Run drift detection
    if (openapi && backend.length > 0) {
      const driftResults = compareEndpoints(openapi.endpoints, backend);
      findings.push(...driftResults);
    }

    const stats = {
      totalEndpoints,
      drifted: findings.filter(f => f.severity === "error").length,
      errors: findings.filter(f => f.severity === "error").length,
      warnings: findings.filter(f => f.severity === "warning").length
    };

    const hasErrors = stats.errors > 0;
    const summary = hasErrors
      ? `Found ${stats.drifted} drift issues across ${totalEndpoints} endpoints.`
      : `All ${totalEndpoints} endpoints match specifications.`;

    return {
      project: "api-contract-drift-detector",
      command: "drift-check",
      summary,
      findings,
      stats
    };
  } catch (e) {
    return {
      project: "api-contract-drift-detector",
      command: "drift-check",
      summary: `Internal error: ${e instanceof Error ? e.message : String(e)}`,
      findings: [],
      stats: { totalEndpoints: 0, drifted: 0, errors: 1, warnings: 0 }
    };
  }
}
