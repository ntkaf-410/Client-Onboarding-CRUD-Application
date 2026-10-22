# Client Onboarding CRUD Application

A two-step client onboarding workflow (Personal Information, Address Information, then Review and Submit). A banker captures a client's details, reviews them and submits. The system stores the data and lets the user list, open, edit and delete onboardings.

## Architecture

Three tiers: an Angular front end, one REST microservice, and a PostgreSQL database. The Angular app talks only to the microservice, and the microservice is the only component that reads or writes the database.

The microservice is layered: **Controller** (HTTP and DTOs) → **Service** (business rules) → **Repository** (data access).

| Tier | Technology |
|---|---|
| Front end | Angular, Reactive Forms, Angular Router, Angular Material |
| Microservice | ASP.NET Core Web API (TODO: .NET version), Entity Framework Core, Npgsql |
| Database | PostgreSQL |
| API documentation | Swagger UI (OpenAPI) |

## Repository layout

```
client-onboarding/
  frontend/    Angular application
  backend/     ASP.NET Core microservice (controller, service, repository)
  database/    schema.sql and seed.sql
  docs/        ERD image and notes
  README.md
```

## Prerequisites

- Git
- .NET SDK (TODO: version)
- PostgreSQL
- Node.js (LTS) and Angular CLI (for the front end)
- A database client such as pgAdmin or DBeaver (optional)

## Getting started

### 1. Clone

```powershell
git clone https://github.com/ntkaf-410/Client-Onboarding-CRUD-Application
cd Client-Onboarding-CRUD-Application
```

### 2. Create the database

```powershell
psql -U postgres -c "CREATE DATABASE client_onboarding;"
psql -U postgres -d client_onboarding -f database/schema.sql
psql -U postgres -d client_onboarding -f database/seed.sql
```

If `psql` is not recognised, either add the PostgreSQL `bin` folder to your PATH or run the two scripts from pgAdmin's Query Tool.

`schema.sql` drops and recreates the three tables, so running it again resets the database. `seed.sql` loads 10 sample onboardings (4 SUBMITTED and 6 DRAFT, at steps 1 to 3).

### 3. Configure the microservice

The connection string is stored in .NET user-secrets, so the password never goes into Git:

```powershell
cd backend/ClientOnboarding.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" 'Host=localhost;Port=5432;Database=client_onboarding;Username=postgres;Password=<your-password>'
```

Other settings are in `appsettings.json` and can be overridden with environment variables. See `.env.example` for the full list. Note that .NET does not read the `.env` file itself.

| Variable | Purpose | Default |
|---|---|---|
| `ConnectionStrings__Default` | PostgreSQL connection string | none (set it in user-secrets) |
| `AllowedOrigin` | Origin allowed by CORS | `http://localhost:4200` |
| `Logging__LogLevel__Default` | Log level | `Information` |
| `ASPNETCORE_URLS` | Address the API listens on | `http://localhost:5193` |

### 4. Run the microservice

```powershell
cd backend
dotnet run --project .\ClientOnboarding.Api
```

The API listens on `http://localhost:5193`. Swagger UI is at `http://localhost:5193/swagger-ui`.

### 5. Run the Angular app

TODO: fill in when the front end is ready.

```powershell
cd frontend
npm install
npm start
```

The app opens at `http://localhost:4200`.

## API overview

All endpoints are under `/api`, use JSON with camelCase field names, and are documented in Swagger UI.

| Resource | Endpoints |
|---|---|
| Personal | `POST /api/personals`, `GET /api/personals`, `GET /api/personals/{id}`, `PUT /api/personals/{id}`, `DELETE /api/personals/{id}` |
| Address | `POST /api/personals/{personalId}/addresses`, `GET /api/personals/{personalId}/addresses`, `GET /api/addresses/{id}`, `PUT /api/addresses/{id}`, `DELETE /api/addresses/{id}` |
| Onboarding | `POST /api/onboardings`, `GET /api/onboardings`, `GET /api/onboardings/{id}`, `PUT /api/onboardings/{id}`, `DELETE /api/onboardings/{id}`, `POST /api/onboardings/{id}/submit` |

List endpoints take `page` (default 0), `size` (default 10, maximum 50) and `search`. The onboarding list also takes `status` (`DRAFT` or `SUBMITTED`). Results are sorted by `updatedAt`, newest first.

### Error format

Every error uses the same shape:

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "One or more fields are invalid",
  "fieldErrors": [ { "field": "email", "message": "Must be a valid email address" } ]
}
```

| Status | Error code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | A field fails validation, or the JSON is malformed |
| 404 | `NOT_FOUND` | The id does not exist |
| 409 | `DUPLICATE_RESOURCE` | The ID type and number already exist, or the address type already exists for the client |
| 422 | `BUSINESS_RULE_VIOLATION` | A rule fails, such as submitting an incomplete or already submitted onboarding |
| 500 | `INTERNAL_ERROR` | Unexpected failure. The details go to the log |

## Business rules

| Rule | Summary |
|---|---|
| BR-01 | An ID type and number belong to one client |
| BR-02 | A client has at most one RESIDENTIAL and one POSTAL address |
| BR-03, BR-04 | Submit needs a complete personal record and a residential address with a residential status. Otherwise the API returns 422 and lists what is missing |
| BR-05 | Only a DRAFT onboarding can be changed. A SUBMITTED one is read-only |
| BR-06 | Deleting an onboarding removes the client and addresses in one statement (foreign keys with `ON DELETE CASCADE`) |
| BR-07 | `currentStep` only moves forward, between 1 and 3 |
| BR-08 | `submittedAt` is set by the service on submit |

## Database

![ERD](docs/ER Diagram.pdf)

Three tables: `personal`, `address` and `personal_onboarding`. One client has one or two addresses and exactly one onboarding. Foreign keys use `ON DELETE CASCADE`. Table and column names use `snake_case` in the database and `camelCase` in the API.

## Testing

TODO: either describe how to run the tests, or state that automated tests are not included in this project and that verification is done manually through Swagger UI and the end-to-end script.

## Git workflow

- Branch from `main` as `feature/<short-name>`, with one task per branch.
- Commit messages follow `type(scope): subject`, for example `feat(api): add create personal endpoint`.
- Every change goes through a pull request that a mentor reviews before it is merged.

## Troubleshooting

| Problem | Fix |
|---|---|
| `The ConnectionString property has not been initialized` | The user-secret is missing. Run the `dotnet user-secrets set` command from step 3 inside `backend/ClientOnboarding.Api` |
| `psql` is not recognised | Add PostgreSQL's `bin` folder to your PATH, or use pgAdmin |
| `null value in column "id"` when loading the seed | The tables were not created from `schema.sql`. Run it again |
| Browser blocks calls from Angular | `AllowedOrigin` does not match the Angular URL. It must have no trailing slash |