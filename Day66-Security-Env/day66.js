// Day 66: Env + OWASP App Security
// Goal: understand runtime configuration and the security baseline expected from
// a production-minded software engineer.
// Learn:
// - https://12factor.net/config
// - https://nodejs.org/api/process.html#processenv
// - https://owasp.org/Top10/2025/en/
// - https://owasp.org/API-Security/editions/2023/en/0x11-t10/
// - https://cheatsheetseries.owasp.org/

/*
Mental model
------------
1. An environment variable is a key/value available to a process.
   Example: DATABASE_URL, NODE_ENV, STRIPE_SECRET_KEY.

2. A .env file is not the environment by itself.
   It is just a text file. A framework or package such as dotenv reads it and
   injects values into the process environment.

3. process.env is what the current Node.js process can see.
   If a variable is missing from process.env, either the parent shell/service did
   not pass it in, or the app did not load the .env file.

4. export makes a shell variable available to child processes.
   API_KEY=abc node app.js        -> available only for that command
   API_KEY=abc; node app.js       -> not exported, usually not available
   export API_KEY=abc; node app.js -> available to node

5. PATH is an environment variable too.
   The OS/shell searches folders in PATH to find commands like node, npm, git.
   If a command "disappears", inspect PATH before reinstalling tools.

6. Local env and service env are different contexts.
   Your terminal, VS Code, Docker, CI, Vercel, Supabase Edge Functions, and a
   systemd service can all have different environment variables.
*/

/*
Core commands to practice
-------------------------
macOS/Linux shell:

  echo "$PATH"
  env
  printenv API_KEY
  API_KEY=one node -e "console.log(process.env.API_KEY)"
  API_KEY=one; node -e "console.log(process.env.API_KEY)"
  export API_KEY=one
  node -e "console.log(process.env.API_KEY)"
  which node

Common debug questions:

  - Which process is reading the env?
  - Who starts that process?
  - Does the parent process pass this variable to the child process?
  - Is the value loaded at build time or runtime?
  - Is the variable intentionally public?
  - Did the deploy platform receive the value, or only my local machine?
*/

/*
Frontend/backend API key rule
-----------------------------
If a key is shipped to browser JavaScript, assume users and attackers can read it.
Frontend code is public after bundling. "Hiding" a key in React, Next.js client
components, localStorage, or a minified bundle does not protect it.

There is no honest "protect from hackers 99.99%" trick if the frontend directly
holds a powerful secret. The practical goal is defense in depth:
  - do not expose high-impact secrets
  - make every request attributable to a real user/session
  - limit how much damage one user/IP/key can do
  - monitor and rotate quickly when something leaks

The safer pattern:

  Browser -> your backend route/server action -> third-party API

The browser sends the user's authenticated request to your backend. Your backend
keeps the provider secret in server-only env and calls the provider.

What to send from frontend to backend:
  - user session token, short-lived access token, or httpOnly session cookie
  - request payload that the user is allowed to submit
  - never a provider secret such as STRIPE_SECRET_KEY or OPENAI_API_KEY

What not to use as the main browser -> backend protection:
  - a shared "frontend API key" embedded in the bundle
  - a secret stored in localStorage
  - obfuscated/minified JavaScript
  - checking only the Referer header

Better browser -> backend controls:
  - httpOnly Secure SameSite cookies for session-based apps
  - short-lived JWT/access token for token-based apps
  - CSRF protection when using cookies for unsafe methods
  - strict CORS/origin allowlist as one layer, not the only layer
  - backend authorization per resource/action

API keys are still useful for server-to-server calls, internal services, CLIs,
webhooks, or machine clients. For browser clients, prefer user auth/session over
a shared secret because browser code and browser-stored values are inspectable.

What to enforce on the backend:
  - authentication
  - authorization
  - input validation
  - rate limit per user/IP
  - quota per plan/account
  - origin/CORS check for browser calls
  - optional IP allowlist for server-to-server integrations
  - provider key rotation
  - audit logging for sensitive actions
  - short timeouts and clear error handling

Important nuance:
  Public keys are different from secret keys.
  NEXT_PUBLIC_*, VITE_*, Supabase anon keys, publishable Stripe keys, and similar
  values are designed to be visible. They must be paired with backend rules such
  as RLS, auth, domain restrictions, quotas, and least privilege.

Examples:
  - Stripe publishable key in frontend: OK. Stripe secret key in frontend: not OK.
  - Supabase anon key in frontend: OK with correct RLS. Service role key in
    frontend: not OK.
  - Map tile public key in frontend: OK only if domain/quota restricted.
  - OpenAI/paid provider secret in frontend: not OK. Proxy through backend.
*/

/*
Software engineer security baseline
-----------------------------------
Security is not only "use HTTPS" or "hide API keys". A strong full-stack engineer
must be able to design, implement, review, and debug these controls:

1. Threat modeling
   - What assets are valuable? money, user data, admin actions, API credits.
   - Who can attack? anonymous users, logged-in users, insiders, bots.
   - What can go wrong? data leak, privilege escalation, account takeover, fraud.
   - What is the blast radius if one user/key/session is compromised?

2. Authentication
   - Know who is calling: session cookie, access token, OAuth, magic link, SSO.
   - Store passwords with a slow password hash such as bcrypt/argon2.
   - Use MFA for admin/high-risk accounts where possible.
   - Never trust only "userId" sent from the client.

3. Authorization
   - Authn asks "who are you?" Authz asks "can you do this?"
   - Check ownership and role on every sensitive read/write.
   - Enforce authorization on the backend and database policy layer when possible.
   - Do not hide buttons in UI and call that security.

4. Input validation and injection defense
   - Validate request body, params, query, files, webhooks.
   - Use parameterized queries/ORM query builders for SQL.
   - Avoid building shell commands from user input.
   - Treat HTML/Markdown rendering as dangerous unless sanitized.

5. XSS
   - Escape untrusted content before rendering.
   - Avoid dangerouslySetInnerHTML unless content is sanitized.
   - Use Content Security Policy to reduce impact.
   - Keep tokens out of localStorage when XSS impact would be severe.

6. CSRF and CORS
   - CORS is browser access control, not authentication.
   - CSRF matters when cookies are automatically sent on unsafe methods.
   - Use SameSite cookies, CSRF tokens, and origin checks where appropriate.

7. Session and token safety
   - Prefer httpOnly Secure SameSite cookies for many browser apps.
   - If using bearer tokens, keep access tokens short-lived.
   - Rotate refresh tokens and revoke compromised sessions.
   - Do not log tokens, cookies, reset links, or OTPs.

8. File upload safety
   - Validate file type, size, and count.
   - Store uploads outside executable paths.
   - Rename files; do not trust original filenames.
   - Virus scan or async review for risky domains.
   - Use signed URLs and access checks for private files.

9. Security headers and transport
   - HTTPS everywhere.
   - Secure, httpOnly, SameSite cookies.
   - Content-Security-Policy, X-Frame-Options/frame-ancestors, HSTS.
   - Avoid leaking stack traces or internal errors to users.

10. Dependency and supply-chain hygiene
   - Keep dependencies updated.
   - Run npm audit or a dependency scanner, but verify impact before panic.
   - Lock dependency versions.
   - Avoid random packages for tiny utilities in sensitive paths.

11. Logging, monitoring, and incident response
   - Log security events: login, logout, failed login, password reset, admin action.
   - Never log secrets or raw credentials.
   - Add alerts for unusual traffic, quota spikes, or auth failures.
   - Have a playbook: revoke, rotate, patch, audit, notify.

12. Secure defaults
   - Least privilege for service accounts and database roles.
   - Separate dev/staging/prod secrets.
   - Backups and recovery tests.
   - Feature flags or kill switches for risky integrations.
*/

/*
OWASP Top 10:2025 mapping
-------------------------
Use OWASP Top 10 as the baseline vocabulary for app security reviews.

A01:2025 Broken Access Control
  - Check object ownership, tenant isolation, RBAC/ABAC, admin-only functions.
  - Never trust userId, role, isAdmin, or price sent from the frontend.
  - Tests: user A cannot read/update/delete user B's data.

A02:2025 Security Misconfiguration
  - Disable debug mode, public stack traces, default credentials, open buckets.
  - Set secure cookies, CORS, security headers, and production-safe error pages.
  - Review cloud/platform config, not only application code.

A03:2025 Software Supply Chain Failures
  - Keep package inventory, lockfiles, dependency scanning, and update process.
  - Treat build scripts, CI, package managers, and deployment tokens as sensitive.
  - Avoid unmaintained packages in auth, crypto, parsing, uploads, or payments.

A04:2025 Cryptographic Failures
  - Use TLS, strong password hashing, correct key management, and rotation.
  - Do not invent crypto or use weak hashes like MD5/SHA1 for passwords.
  - Classify data: public, internal, confidential, regulated.

A05:2025 Injection
  - Parameterize SQL, validate inputs, avoid shell command construction.
  - Sanitize/escape HTML and Markdown rendering.
  - Treat XSS as injection into the browser runtime.

A06:2025 Insecure Design
  - Add threat modeling before building high-risk features.
  - Design abuse resistance: quotas, workflow checks, approvals, fraud limits.
  - Security cannot be patched only with validation after a broken design ships.

A07:2025 Authentication Failures
  - Use proven auth libraries/providers when possible.
  - Protect password reset, session fixation, brute force, MFA, token expiry.
  - Do not log credentials, tokens, OTPs, or reset links.

A08:2025 Software or Data Integrity Failures
  - Verify webhook signatures, signed artifacts, CI/CD provenance, migrations.
  - Do not blindly trust data from third-party APIs or client-side state.
  - Protect update flows and admin imports/exports.

A09:2025 Security Logging and Alerting Failures
  - Log security events and alert on unusual behavior.
  - Logging without alerting is weak incident detection.
  - Keep logs useful but scrub secrets and personal data.

A10:2025 Mishandling of Exceptional Conditions
  - Fail closed, not open, on authz, payment, quota, and webhook errors.
  - Use centralized error handling and sanitized responses.
  - Release resources on upload/stream failures to avoid DoS.
*/

/*
OWASP API Security Top 10:2023 mapping
--------------------------------------
Full-stack engineers ship APIs, so API-specific OWASP risks must be checked too.

API1 Broken Object Level Authorization
  - Every endpoint that accepts an object ID must check ownership/tenant access.

API2 Broken Authentication
  - Tokens, sessions, OAuth callbacks, refresh flows, and password reset must be
    implemented with proven patterns and tested for abuse.

API3 Broken Object Property Level Authorization
  - Prevent excessive data exposure and mass assignment.
  - Return only allowed fields; accept only allowed fields.

API4 Unrestricted Resource Consumption
  - Rate limit, quota, size limit, pagination cap, timeout, concurrency limit.
  - Especially important when each request calls a paid provider API.

API5 Broken Function Level Authorization
  - Regular users must not reach admin/manager/internal functions.

API6 Unrestricted Access to Sensitive Business Flows
  - Protect workflows like checkout, booking, bidding, posting, coupon use, signup.
  - Add friction, quotas, approvals, or detection where automation harms business.

API7 Server Side Request Forgery
  - Never fetch arbitrary user-provided URLs from the server without allowlists.
  - Block internal IP ranges and metadata services.

API8 Security Misconfiguration
  - Review CORS, headers, debug endpoints, cloud permissions, API gateways.

API9 Improper Inventory Management
  - Track all API versions, hosts, environments, and deprecated endpoints.
  - Remove stale debug/test routes before deploy.

API10 Unsafe Consumption of APIs
  - Validate third-party API responses as untrusted input.
  - Add timeouts, retries with limits, schema checks, and safe error handling.
*/

/*
Common security mistakes to catch in code review
------------------------------------------------
- Frontend sends isAdmin=true or userId=123 and backend trusts it.
- API route checks login but not ownership of the resource.
- Database query concatenates user input into SQL.
- Secret is stored in NEXT_PUBLIC_*, VITE_*, localStorage, logs, or Git history.
- Upload accepts any file and serves it from a public executable path.
- Error response returns stack trace, provider payload, SQL error, or internal ID.
- Rate limit is global only, so one user can consume the whole quota.
- Admin route relies only on hiding UI links.
- Webhook endpoint does not verify provider signature.
- Password reset token never expires or is not single-use.
*/

/*
Mini lab
--------
Create a tiny Node.js file named env-lab.js:

  console.log({
    nodeEnv: process.env.NODE_ENV,
    apiKeyExists: Boolean(process.env.API_KEY),
    pathFirstFive: process.env.PATH?.split(":").slice(0, 5),
  });

Run it four ways:

  node env-lab.js
  API_KEY=demo node env-lab.js
  API_KEY=demo; node env-lab.js
  export API_KEY=demo
  node env-lab.js

Then explain why the results differ.
*/

/*
Build task
----------
Perform a security hardening pass on your SaaS project and add a server-only
proxy route:

  POST /api/ai/summarize

Requirements:
  - provider API key lives only in backend/server env
  - frontend never receives the provider key
  - request requires an authenticated user
  - request body is validated before calling provider
  - rate limit by user ID or IP
  - quota check for free vs paid users
  - error response never leaks the secret or raw provider debug payload
  - README documents required env names and where to set them locally/deploy
  - sensitive API routes check ownership/role, not only login
  - all external input is validated before use
  - cookies/tokens are stored deliberately and not logged
  - file uploads, webhooks, and admin routes have explicit security rules
  - deployment has HTTPS, secure cookies, and basic security headers
  - OWASP Top 10:2025 and OWASP API Security Top 10:2023 risks are reviewed
*/
