# <myAppName> — Backend

The backend is written in Kotlin and built with Spring Boot. It follows a hexagonal (ports & adapters) architecture and groups multiple independent application modules into a single deployment unit.

- Description: <myAppName & myAppDescription>
- Technologies: Kotlin 1.9.22, Java 21, Spring Boot 3.5.6
- Architecture: Hexagonal with multiple apps in one deployment unit


## Repository layout

This README describes the backend located under `backend/`. The build is managed as a Gradle multi-module project in `backend/codebase`.

Top-level files relevant to the backend:
- `backend/codebase/` — Gradle multi-module codebase
- `contracts/openapi.yaml` — API contract shared with the frontend (contract-first approach)
- `docker-compose.yml` — Local dev dependencies (if used)


## Gradle modules structure

Modules live under `backend/codebase/modules`. The structure intentionally separates application concerns and keeps the deployment (Spring Boot application class and endpoints wiring) isolated.

- apps
  - login — security and authentication
  - myAppName — a classic hexagon with submodules:
    - application — application services, use cases, input DTOs, orchestration
    - assembly — wiring of ports/adapters for this hexagon
    - domain — domain model, entities, value objects, domain services, ports (interfaces)
    - infrastructure — adapters and integrations (DB, HTTP clients, messaging)
    - openapi-specification — OpenAPI docs for this app, consistent with `/contracts/openapi.yaml`
- config — global/shared configuration (e.g., logging, object mapper, etc.)
- deployment — Spring Boot Application class, status & health endpoint configuration, production-ready runtime wiring
- utilities — shared utilities (commons, commons-test, local libraries, client implementations)

Notes:
- Some modules above may be introduced incrementally. Check `backend/codebase/modules` for the current state.
- The versions used are centrally defined in `backend/codebase/gradle.properties` (e.g., Kotlin 1.9.22, Java 21, Spring Boot 3.5.6).


## Build, test, and run

All commands below are executed from `backend/codebase` (where the Gradle wrapper lives).

- Build everything (with tests):
  ./gradlew build

- Run unit tests:
  ./gradlew test

- Static analysis (Detekt):
  ./gradlew detekt

- Run the application locally (deployment module):
  ./gradlew :modules:deployment:bootRun

- Run with specific profile:
  ./gradlew :modules:deployment:bootRun --args='--spring.profiles.active=<profile>'

- Packaging a bootable jar (from the deployment module):
  ./gradlew :modules:deployment:bootJar

Configuration:
- Default Spring profiles and config live under `modules/deployment/src/main/resources`.
- Available profiles:
  - `default` - standard configuration (application.yaml)
  - `intellij` - IntelliJ-friendly profile with JWT secrets and CORS settings (application-intellij.yaml)
  - `agent` - AI agent profile with extended CORS and AI-specific configurations (application-agent.yaml)

Health and status:
- The deployment module wires status/health endpoints. By default with Spring Boot you can rely on management endpoints (e.g., `/actuator/health`). Custom endpoints are configured in the deployment module (see `HealthHandler`, `MetricsRoutingConfig`).
- Custom status endpoint: `http://localhost:8080/_status` - returns application status with commit information.


## Architecture and conventions

We follow a hexagonal architecture. Key rules:
- Domain-centric: The `domain` module holds the business model and ports (interfaces). It must not depend on frameworks.
- Use cases in `application`: Orchestrate domain logic, transactions, and input/output boundaries.
- Adapters in `infrastructure`: Implement ports to talk to external systems (DB, HTTP, file systems, etc.). Keep side effects at the edges.
- `assembly` wires ports to adapters for a concrete runtime configuration.
- `deployment` focuses on the Spring Boot runtime: application entry point, HTTP routing/controllers, configuration, and ops endpoints.
- Multiple apps can coexist under `apps/*` and are composed into a single deployment unit.

API-first:
- `/contracts/openapi.yaml` is the source of truth for HTTP APIs. Backend implementations and frontend clients should conform to this contract.
- Keep `apps/myAppName/openapi-specification` consistent with the top-level contract.

## OpenAPI Code Generation

The backend uses OpenAPI Generator to automatically create Kotlin classes from the API specification. This ensures type safety and consistency between the contract and implementation.

### How it works

1. **Source**: The OpenAPI specification is read from `/contracts/openapi.yaml`
2. **Generator**: Uses `kotlin-spring` generator to create Spring Boot compatible classes
3. **Output**: Generated classes are placed in `src/main/kotlin/pl/myAppName/model/` with "View" suffix
4. **Configuration**: Managed in `modules/apps/myAppName/openapi-specification/build.gradle.kts`

### Generated Classes

The generator creates:
- **Only Model classes**: Data classes with Jackson annotations and Jakarta Validation
The generator not creates (we need to implement it separately in infrastructure module adapters layer):
- **API classes**: Spring Boot controllers and service interfaces (when enabled)
- **Infrastructure**: Serialization, validation, and HTTP client utilities

### Regenerating Classes

To regenerate classes after updating the OpenAPI specification:

```bash
cd backend/codebase
./gradlew :modules:apps:myAppName:openapi-specification:openApiGenerate
```

### Configuration

The generation is configured with:
- **Generator**: `kotlin-spring` for Spring Boot compatibility
- **Package**: `pl.myAppName.model` for generated models
- **Suffix**: "View" added to all model class names
- **Validation**: Jakarta Validation annotations included
- **Serialization**: Jackson annotations for JSON handling

### Workflow

1. Update `/contracts/openapi.yaml` with new endpoints or schemas
2. Run the generation command above
3. Review generated classes in `src/main/kotlin/pl/myAppName/model/`
4. Use generated classes in your application code
5. Implement controllers and services using the generated models


## Security

- The `apps/login` module provides security and authentication concerns.
- Use stateless auth (e.g., JWT) unless a stateful approach is explicitly required.
- Protect all externally exposed endpoints by default, then explicitly open public ones.
- Never log secrets, tokens, or credentials. Scrub sensitive data in logs.


## Good development practices

Code quality and style:
- Kotlin style guided by the Kotlin official style; enforce with Detekt. Run `./gradlew detekt` locally.
- Keep functions and classes small, cohesive, and with single responsibility.
- Prefer data classes and value objects for domain concepts. Avoid primitive obsession.
- Write clear, intention-revealing names. Avoid abbreviations.

Testing:
- Use JUnit 5 (Jupiter) and Kotest assert style for expressive tests.
- Follow testing pyramid: unit tests in domain and application layers; integration tests for adapters; end-to-end tests for critical flows.
- Tests should be deterministic, isolated, and fast. Mock only external systems and side effects.

Hexagonal boundaries:
- Domain must NOT depend on Spring or infrastructure libraries.
- Communicate across layers via ports (interfaces) and DTOs.
- Keep input validation near boundaries (controllers/adapters) and business invariants inside the domain.

API and contracts:
- Treat the OpenAPI file as a contract. Discuss breaking changes early.
- Version APIs when making incompatible changes; maintain backward compatibility when feasible.
- Document new endpoints and error responses in OpenAPI before implementation.

Configuration and environments:
- Keep configuration in `deployment` resources; use profiles for local vs. prod.
- Favor environment variables and configuration files over hard-coded values.
- Provide sensible defaults for local dev, but never commit secrets.

Observability:
- Ensure health endpoints, basic metrics, and structured logs are available by default.
- Add correlation IDs to logs when propagating requests across services.

Performance and reliability:
- Use timeouts, retries, and circuit breakers for external calls where appropriate.
- Guard critical sections with idempotency and deduplication strategies when needed.

Collaboration:
- Small, focused PRs with clear descriptions and links to issues.
- Keep commit messages in imperative mood (e.g., "Add health check for …").
- Update documentation and OpenAPI as part of the same change set when relevant.


## Local development tips

- Use the IntelliJ IDEA Kotlin plugin and enable "Treat warnings as errors" where practical.
- Run `:modules:deployment:bootRun` to start the app and iterate quickly.
- If you add a new adapter, wire it in `assembly` and verify via integration tests.
- Keep your modules decoupled; run `./gradlew :modules:domain:tests` for fast feedback where possible.


## License

This project may be private/internal. Consult your organization’s licensing and contribution policies before sharing code externally.
