# API Contract Drift Detector

## Overview

Detect drift between OpenAPI specs and backend implementations before it reaches production.

## Installation

~~~bash
npm install @public-sdk/api-contract-drift-detector
~~~

## Quick Start

~~~bash
npx drift-check --help
~~~

## Integration Example

1. Add this SDK to your CI workflow or local tooling script.
2. Run the command against your project inputs.
3. Fail the pipeline on non-zero exit code to enforce quality gates.

~~~bash
npx drift-check --openapi ./examples/openapi.yaml --backend ./examples/backend.yaml --json
~~~

## Typical Output

~~~json
{
  "command": "drift-check",
  "summary": "2 warnings detected",
  "stats": {
    "totalEndpoints": 18,
    "errors": 0,
    "warnings": 2
  }
}
~~~

## Local Development

~~~bash
npm ci
npm run build
npm test
~~~

## License

MIT
