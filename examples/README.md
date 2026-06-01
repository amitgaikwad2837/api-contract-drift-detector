# API Contract Drift Detector Examples

## CLI Example

Run this command from your project root:

~~~bash
npx drift-check --openapi ./examples/openapi.yaml --backend ./examples/backend.yaml --json
~~~

## CI Example (GitHub Actions)

~~~yaml
- name: Run API Contract Drift Detector
  run: npx drift-check --openapi ./examples/openapi.yaml --backend ./examples/backend.yaml --json
~~~

## Notes

- Keep example inputs small and deterministic.
- Commit expected outputs when you want regression visibility in pull requests.
