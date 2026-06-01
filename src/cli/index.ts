import { runCore } from "../core/run-core.js";
import type { RunOptions } from "../types.js";

function printHelp(): void {
  console.log("drift-check - Detect drift between OpenAPI, backend, SDK, and documentation");
  console.log("");
  console.log("Usage:");
  console.log("  drift-check --openapi <path> --backend <path> [--json] [--help]");
  console.log("");
  console.log("Options:");
  console.log("  --openapi <path>   Path to OpenAPI YAML file (required)");
  console.log("  --backend <path>   Path to backend metadata YAML file (required)");
  console.log("  --json             Print JSON output");
  console.log("  --help             Show this help message");
}

function parseArgs(args: string[]): RunOptions | null {
  const opts: RunOptions = { json: false };
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    if (arg === "--json") {
      opts.json = true;
      i++;
    } else if (arg === "--openapi" && i + 1 < args.length) {
      opts.openapi = args[i + 1];
      i += 2;
    } else if (arg === "--backend" && i + 1 < args.length) {
      opts.backend = args[i + 1];
      i += 2;
    } else {
      i++;
    }
  }

  if (!opts.openapi || !opts.backend) {
    return null;
  }

  return opts;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    printHelp();
    process.exit(args.length === 0 ? 2 : 0);
  }

  const opts = parseArgs(args);
  if (!opts) {
    console.error("Error: --openapi and --backend are required");
    printHelp();
    process.exit(2);
  }

  const result = runCore(opts);

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[${result.command}] ${result.summary}`);
    console.log(`\nStats: ${result.stats.totalEndpoints} endpoints, ${result.stats.errors} errors, ${result.stats.warnings} warnings\n`);

    if (result.findings.length > 0) {
      for (const finding of result.findings) {
        const icon = finding.severity === "error" ? "❌" : "⚠️";
        console.log(`${icon} [${finding.type}] ${finding.message}`);
      }
    } else {
      console.log("✅ No drift detected!");
    }
  }

  const exitCode = result.stats.errors > 0 ? 1 : 0;
  process.exit(exitCode);
}

main();

