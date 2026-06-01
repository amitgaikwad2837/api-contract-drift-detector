import { describe, expect, it } from "vitest";
import { runCore } from "../../src/core/run-core.js";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const fixturesDir = resolve(__dirname, "../fixtures");

describe("drift-check core", () => {
  it("returns a basic scaffold result", () => {
    // Verify SDK returns correct structure with command, project name, and stats
    const result = runCore({ json: false });
    expect(result.command).toBe("drift-check");
    expect(result.stats).toBeDefined();
  });

  it("detects drift between OpenAPI and backend", () => {
    // Verify SDK identifies discrepancies between API spec and actual backend implementation
    // Fixture has 3 defined endpoints; should detect missing/extra implementations
    const result = runCore({
      json: false,
      openapi: `${fixturesDir}/openapi.yaml`,
      backend: `${fixturesDir}/backend.yaml`
    });

    expect(result.stats.totalEndpoints).toBe(3); // GET /pets, POST /pets, GET /pets/{id}
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.stats.errors).toBeGreaterThan(0);
  });

  it("includes missing endpoint in findings", () => {
    // Verify SDK detects POST /pets endpoint in spec but missing in backend implementation
    const result = runCore({
      json: false,
      openapi: `${fixturesDir}/openapi.yaml`,
      backend: `${fixturesDir}/backend.yaml`
    });

    const missingPost = result.findings.some(
      f => f.type === "missing_in_backend" && f.method === "POST"
    );
    expect(missingPost).toBe(true);
  });

  it("includes extra endpoint in findings", () => {
    // Verify SDK detects /users endpoint in backend that's not in OpenAPI spec (potential security risk)
    const result = runCore({
      json: false,
      openapi: `${fixturesDir}/openapi.yaml`,
      backend: `${fixturesDir}/backend.yaml`
    });

    const extraUsers = result.findings.some(
      f => f.endpoint === "/users" && f.severity === "warning"
    );
    expect(extraUsers).toBe(true);
  });
});
