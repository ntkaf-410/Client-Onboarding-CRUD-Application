# Architecture note

## Overview
Three tiers: an Angular front end, one ASP.NET Core REST microservice and a PostgreSQL database. The Angular app talks only to the microservice, and the microservice is the only component that reads or writes the database.

## Microservice layers
| Layer | Responsibility | Examples |
|---|---|---|
| Controller | HTTP in and out, status codes, DTO binding | `PersonalsController`, `OnboardingsController` |
| Service | Business rules (BR-01 to BR-08) and mapping to DTOs | `PersonalService`, `OnboardingService`, `OnboardingRules` |
| Repository | All database access through EF Core | `PersonalRepository`, `AddressRepository` |
| Database | Keys, unique and check constraints, cascade deletes | `schema.sql` |

Cross-cutting pieces: request logging middleware, exception handling middleware (one JSON error shape), CORS for the Angular dev server, and `OnboardingGuard` (BR-05).

## Key design decisions
1. **Draft first, submit later.** An onboarding is saved after each step as DRAFT and becomes SUBMITTED on the review page.
2. **One client, up to two addresses.** One RESIDENTIAL and an optional POSTAL address, enforced by a unique (`personal_id`, `address_type`) pair.
3. **One table per concept.** `personal`, `address` and `personal_onboarding`.
4. **Database-generated numeric IDs.**
5. **One service owns all three tables.** A delete is a single statement on `personal`, and `ON DELETE CASCADE` removes the rest atomically (BR-06).
6. **Rules enforced in more than one place.** Validation in DTOs, rules in services, and constraints in the database as a last defence.

## Where each rule is enforced
| Layer | Enforces |
|---|---|
| Angular | VAL-01 to VAL-10 for instant feedback |
| Controller (DTOs) | Structure, types, lengths and formats |
| Service | BR-01 to BR-08 |
| Database | Primary and foreign keys, unique, check and NOT NULL constraints |

## Error handling
Every error returns `{ status, error, message, fieldErrors? }`. 400 validation, 404 not found, 409 duplicate, 422 business rule, 500 unexpected (generic message, details in the log).

## Timestamps
Columns are `timestamp without time zone` holding UTC. The service writes with `DbTime.Now()` and reads with `DbTime.AsUtc()`, so JSON timestamps end in `Z`.