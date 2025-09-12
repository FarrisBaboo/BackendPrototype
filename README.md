## BackendPrototype

A minimal Express-based backend prototype with a clean layering: routes → controllers → services → repositories. Includes mock data endpoints and passthrough endpoints to a Python Flask service for analysis and visualization.

### Project structure
```text
BackendPrototype/
  BackendCode/
    __tests__/               # Jest tests
      api.test.js            # Integration tests for HTTP endpoints
    controllers/             # HTTP request handlers (thin)
      mockController.js      # Handles mock data endpoints (streams, names, filter)
      pythonController.js    # Handles Python-backed endpoints (analyze, visualize, CSV, corr)
    data/                    # Example JSON data (not used by repos directly)
      mock.json
    jest.setup.js            # Test setup (loaded via Jest config in package.json)
    mock_data/               # Sample CSVs and a processed JSON for mock endpoints
      2881821.csv
      complex_formatted.csv
      complex.csv
      processed_data.json    # Consumed by MockRepository via PROCESSED_DATA_PATH
    repositories/            # Data access layer (filesystem/HTTP), no DB yet
      mockRepository.js      # Reads processed JSON from disk
      pythonRepository.js    # Sends multipart requests to Python Flask service
    routes/                  # Express routers
      mock.js                # All API endpoints are mounted here under /api
    server.js                # Express app bootstrap and middleware
    services/                # Business logic layer
      mockService.js         # Stream name extraction and filtering logic
      pythonService.js       # Calls repositories for Python endpoints
  controllers/               # Reserved for future top-level structure (currently empty)
  data/                      # Reserved for future datasets (currently empty)
  db/                        # Reserved for future database artifacts (currently empty)
  mock_data/                 # Reserved for future raw mocks (currently empty)
  node_modules/
  package-lock.json
  package.json               # Dependencies, Jest config, scripts
  README.md                  # This file
  repositories/              # Reserved (currently empty)
  routes/                    # Reserved (currently empty)
  services/                  # Reserved (currently empty)
  SETUP_GUIDE.md             # Setup/run instructions
```

### What each file does
- **BackendCode/server.js**: Sets up Express, CORS, JSON parsing, health root route `/`, and mounts API routes under `/api`. Reads `PORT` from env.
- **BackendCode/routes/mock.js**: Declares all API endpoints and wires them to controllers:
  - `GET /api/streams`: Return full processed dataset.
  - `GET /api/stream-names`: Return available stream names (excluding metadata fields).
  - `POST /api/filter-streams`: Filter dataset to specific streams.
  - `POST /api/analyze`: Forward correlation analysis to Python service.
  - `POST /api/analyze-csv`: Forward CSV cleaning to Python service (downloads CSV).
  - `POST /api/analyze-corr`: Forward correlation matrix to Python service (WIP noted in code).
  - `POST /api/visualize`: Forward visualization request to Python service (returns base64 PNG).
- **BackendCode/controllers/mockController.js**: Thin HTTP handlers that validate input and call mock service methods. Handles errors and status codes.
- **BackendCode/controllers/pythonController.js**: Thin HTTP handlers that call Python service methods, set headers (for CSV download), and map errors.
- **BackendCode/services/mockService.js**: Business logic for mock data: reading processed data, extracting stream names, and filtering entries by requested streams.
- **BackendCode/services/pythonService.js**: Business logic that delegates to `pythonRepository` with the correct endpoints and response types.
- **BackendCode/repositories/mockRepository.js**: Reads `processed_data.json` from disk using `PROCESSED_DATA_PATH` env var. Throws errors on read/parse failure.
- **BackendCode/repositories/pythonRepository.js**: Builds `FormData` with a CSV file from `RAW_CSV_PATH`, posts to the Flask service at `PYTHON_URL`, supports different `responseType` (JSON/arraybuffer).
- **BackendCode/mock_data/**: Sample CSV inputs and a processed JSON used by mock endpoints.
- **BackendCode/data/mock.json**: Example JSON (not wired by repository by default).
- **BackendCode/__tests__/api.test.js**: Tests endpoints using Supertest/Jest.
- **BackendCode/jest.setup.js**: Setup file loaded by Jest as configured in `package.json`.
- **package.json**: Project metadata, dependencies, Jest config pointing to `BackendCode/jest.setup.js`, and `test` script.
- **SETUP_GUIDE.md**: Step-by-step environment and run instructions.
- Root-level `controllers/`, `data/`, `db/`, `mock_data/`, `repositories/`, `routes/`, `services/`: Placeholders for a future monorepo-like layout; current implementation lives under `BackendCode/`.

### Environment variables
Create a `.env` file at the repository root (one level above `BackendCode/`). The repositories load it with `require('dotenv').config({ path: '../.env' })`.

- **PORT**: Port for the Node server (default `3000`).
- **PROCESSED_DATA_PATH**: Absolute or relative path to `processed_data.json` (e.g., `BackendCode/mock_data/processed_data.json`).
- **RAW_CSV_PATH**: Path to a raw CSV used when posting to the Python service.
- **PYTHON_URL**: Base URL of the Flask service (e.g., `http://localhost:5000`).

### Run and test
- **Run the server**: from repo root
  - `node BackendCode/server.js`
- **Health check**:
  - `GET /` → "Backend is running"
  - `GET /api/streams`, `GET /api/stream-names`
- **Run tests**:
  - `npm test`

### Layering and flow
Request path for mock data: `route` → `mockController` → `mockService` → `mockRepository` → filesystem JSON.

Request path for Python endpoints: `route` → `pythonController` → `pythonService` → `pythonRepository` → HTTP to Flask service with `FormData` (CSV + params).

### Validation and typed contracts
- Zod schemas under `BackendCode/validation/schemas.js` define request contracts for each endpoint.
- `validateRequest` middleware in `BackendCode/middleware/validateRequest.js` parses and validates `params`, `query`, and `body`, attaching `req.validatedParams`, `req.validatedQuery`, and `req.validatedBody` on success.
- Routes apply validation per endpoint, e.g. `router.post('/analyze', validateRequest({ body: analyzeBody }), postAnalyze)`.

Sample 400 response when validation fails:
```json
{
  "error": "ValidationError",
  "issues": [
    { "path": ["streams"], "message": "Array must contain at least 1 element(s)" },
    { "path": ["threshold"], "message": "Number must be less than or equal to 1" }
  ]
}
```

### Response shaping (DTOs)
- DTO mappers in `BackendCode/dtos/index.js` normalize response objects for predictability (explicit fields, stable key order).
- Currently applied to:
  - `GET /api/streams`
  - `POST /api/filter-streams`
  More endpoints can adopt DTOs as they stabilize.

### API Examples

**GET /api/streams**
```bash
curl http://localhost:3000/api/streams
```

**GET /api/stream-names**
```bash
curl http://localhost:3000/api/stream-names
```

**POST /api/filter-streams**
```bash
curl -X POST http://localhost:3000/api/filter-streams \
  -H "Content-Type: application/json" \
  -d '{"streamNames": ["Temperature", "Voltage Charge"]}'
```

**POST /api/analyze**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "streams": ["s1", "s2", "s3"],
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-01-06T00:10:00Z",
    "threshold": 0.5,
    "algo_type": "correlation"
  }'
```

**POST /api/analyze-csv**
```bash
curl -X POST http://localhost:3000/api/analyze-csv \
  -H "Content-Type: application/json" \
  -d '{"window_size": 15}' \
  --output report.csv
```

**POST /api/analyze-corr**
```bash
curl -X POST http://localhost:3000/api/analyze-corr \
  -H "Content-Type: application/json" \
  -d '{
    "streams": ["s1", "s2", "s3"],
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-01-06T00:10:00Z",
    "threshold": 0.5
  }'
```

**POST /api/visualize**
```bash
curl -X POST http://localhost:3000/api/visualize \
  -H "Content-Type: application/json" \
  -d '{
    "streams": ["field1", "field2", "field3"],
    "start_date": "2025-03-18T06:55:31Z",
    "end_date": "2025-03-18T07:00:43Z",
    "type": "grouped_bar_chart"
  }'
```

**Validation Error Example**
```bash
curl -X POST http://localhost:3000/api/filter-streams \
  -H "Content-Type: application/json" \
  -d '{"streamNames": []}'
# Returns 400 with validation error details
```
