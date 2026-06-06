# Day 66 Reflection: Env + OWASP App Security

## What I built
- 

## What was hard
- 

## Env mental model
- Difference between `.env`, OS env, shell variables, exported variables, and `process.env`:
- How `PATH` affects command execution:
- Difference between local env and service/deploy env:

## API key security
- Why frontend/browser code cannot keep provider secrets:
- Correct frontend -> backend -> provider architecture:
- Why browser -> backend should use user auth/session instead of a shared secret:
- Public keys vs secret keys:
- Abuse controls used: auth, authorization, rate limit, quota, origin/CORS, IP allowlist, CSRF, validation, logging, rotation:
- Why "99.99% protection" comes from layered controls, not one hidden frontend key:

## Software engineer security baseline
- Threat model: assets, attackers, abuse cases, blast radius:
- Authn/authz checks added:
- Input validation and injection risks found:
- XSS/CSRF/session risks found:
- File upload/webhook/admin risks found:
- Security headers/cookie/deploy settings checked:
- Dependency/supply-chain risks checked:
- Logging and monitoring changes:

## OWASP mapping
- OWASP Top 10:2025 risks found:
- OWASP API Security Top 10:2023 risks found:
- Highest-risk exploit scenario:
- Fix shipped or planned:
- Tests added to prevent regression:

## Leak response plan
- Rotate:
- Revoke:
- Audit logs:
- Patch root cause:
- Notify if needed:

## Confidence (1-5)
- 

## Next fix
- 
