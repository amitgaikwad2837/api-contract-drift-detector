// ============ INPUT MODELS ============

export type Endpoint = {
  path: string;
  method: string;
  summary?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
};

export type Parameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required: boolean;
  schema: any;
};

export type RequestBody = {
  required: boolean;
  content: Record<string, { schema: any }>;
};

export type Response = {
  description: string;
  content?: Record<string, { schema: any }>;
};

export type OpenAPISpec = {
  version: string;
  title: string;
  endpoints: Endpoint[];
  schemas: Record<string, any>;
};

export type BackendRoute = {
  path: string;
  method: string;
  handler: string;
};

export type SDKMethod = {
  name: string;
  endpoint: string;
  signature: string;
};

export type DocExample = {
  endpoint: string;
  method: string;
  example: string;
};

// ============ FINDINGS ============

export type DriftFinding = {
  type: "missing_in_sdk" | "missing_in_backend" | "schema_mismatch" | "doc_stale" | "extra_in_sdk";
  severity: "error" | "warning";
  endpoint: string;
  method?: string;
  message: string;
  details?: string;
  source: "openapi" | "backend" | "sdk" | "docs";
};

// ============ OUTPUT MODELS ============

export type RunResult = {
  project: string;
  command: string;
  summary: string;
  findings: DriftFinding[];
  stats: {
    totalEndpoints: number;
    drifted: number;
    errors: number;
    warnings: number;
  };
};

export type RunOptions = {
  json: boolean;
  openapi?: string;
  backend?: string;
  sdk?: string;
  docs?: string;
};
