> Mirror Policy: This repository is an automated mirror of the monorepo https://github.com/amitgaikwad2837/SDK.
>
> Do not push changes directly here. All changes must be made in the SDK monorepo and synced by workflow.
> Pull requests opened in this repo are for review visibility only and may be overwritten by the next sync.
# API Contract Drift Detector

Detect drift between OpenAPI specs and backend implementations before it reaches production.

## 📦 Registry & Repository

- **npm**: [@amitgaikwad37/api-contract-drift-detector](https://www.npmjs.com/package/@amitgaikwad37/api-contract-drift-detector)
- **GitHub**: [amitgaikwad2837/api-contract-drift-detector](https://github.com/amitgaikwad2837/api-contract-drift-detector)

## Overview

This SDK detects breaking changes between OpenAPI contract definitions and actual backend implementations, catching regressions before they reach production. Ideal for API-first development and contract testing in CI/CD pipelines.

## Installation

~~~bash
npm install @amitgaikwad37/api-contract-drift-detector
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

