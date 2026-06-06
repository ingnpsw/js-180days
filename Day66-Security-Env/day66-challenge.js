// Day 66 Challenge
// Topic: Env + OWASP App Security

/*
Challenge A: Env debugging
--------------------------
Create env-lab.js and prove each claim with command output:

1. API_KEY=demo node env-lab.js is visible to Node.
2. API_KEY=demo; node env-lab.js is not the same as export API_KEY=demo.
3. PATH controls how the shell finds node/npm/git.
4. A .env file does nothing unless a framework/package loads it.

Write your explanation in Day66-Security-Env/day66-reflection.md.
*/

/*
Challenge B: Secure API key proxy
---------------------------------
Design and implement a backend route or pseudocode route for:

  POST /api/provider/proxy

The route must:
  - read PROVIDER_SECRET_KEY only on the server
  - reject unauthenticated requests
  - identify the real user/session, not only a shared browser API key
  - authorize that user for the requested action
  - validate request body
  - rate limit by user ID or IP
  - enforce quota
  - apply origin/CORS checks for browser requests
  - include CSRF protection if cookie-based auth is used
  - call the provider from backend only
  - return sanitized errors

Frontend must:
  - call your backend route
  - send only user input/session/access token, never provider secret
  - avoid storing secrets in localStorage or bundled JavaScript

Add a short README section:
  - local env setup
  - deploy env setup
  - which variables are public vs server-only
  - rotation plan if a key leaks
*/

/*
Challenge C: Security review
----------------------------
Review this bad idea:

  const key = import.meta.env.VITE_PROVIDER_SECRET_KEY;
  fetch("https://paid-provider.example.com", {
    headers: { Authorization: `Bearer ${key}` },
  });

Explain:
  - why the key is exposed
  - why minification is not protection
  - what the corrected architecture is
  - why "99.99% protection" is not one feature but defense in depth
  - which controls you add: auth, rate limit, quota, IP allowlist, origin check,
    CSRF if cookie-based, key rotation, logs
*/

/*
Challenge D: Frontend -> backend auth design
--------------------------------------------
Design the request flow for a frontend calling your own backend:

  POST /api/report/generate

Answer:
  - Will you use httpOnly cookie session or short-lived bearer token? Why?
  - How does the backend know which user is calling?
  - How does the backend know the user can perform this action?
  - What rate limit and quota are applied?
  - What is checked by Origin/CORS, and why is that not enough by itself?
  - If a shared frontend API key leaks, what damage is possible?
*/

/*
Challenge E: Full-stack security audit
--------------------------------------
Pick one project and audit these areas. Write findings and fixes in the
reflection file.

1. Authn/authz
   - Which routes require login?
   - Which routes require ownership or role checks?
   - Can a user access another user's data by changing an ID?

2. Input validation
   - Which route accepts body/query/params?
   - Is each field validated for type, length, format, and allowed values?

3. Injection
   - Are SQL queries parameterized?
   - Is user input ever passed into shell commands, HTML, Markdown, or eval-like APIs?

4. XSS/CSRF/session
   - Where are tokens stored?
   - Are cookies httpOnly, Secure, and SameSite?
   - Are unsafe cookie-authenticated requests protected from CSRF?

5. Uploads/webhooks/admin
   - Are uploads size/type limited?
   - Are private files protected by authorization or signed URLs?
   - Are webhook signatures verified?
   - Are admin actions checked on the backend?

6. Deploy/security operations
   - Are secrets split between dev/staging/prod?
   - Are stack traces hidden from users?
   - Are sensitive events logged without leaking secrets?
   - Is there a rotate/revoke/patch/audit plan?

7. OWASP mapping
   - Map each finding to OWASP Top 10:2025 when possible.
   - Map API findings to OWASP API Security Top 10:2023 when possible.
   - For each high-risk finding, write one exploit scenario and one fix.
*/

/*
Challenge F: Code review drill
------------------------------
For each snippet, explain the bug and the fix:

1. app.get("/api/orders/:userId", async (req, res) => {
     const orders = await db.query(`select * from orders where user_id = ${req.params.userId}`);
     res.json(orders);
   });

2. app.post("/api/admin/delete-user", async (req, res) => {
     if (!req.user) return res.sendStatus(401);
     await deleteUser(req.body.userId);
     res.sendStatus(204);
   });

3. console.log("reset token", token, "for", email);

4. <div dangerouslySetInnerHTML={{ __html: userBio }} />

5. app.post("/webhook/stripe", express.json(), handleStripeEvent);
*/

/*
Challenge G: OWASP classification drill
---------------------------------------
Classify each issue using OWASP Top 10:2025 and/or OWASP API Security Top 10:2023:

1. A logged-in user changes /api/invoices/100 to /api/invoices/101 and sees
   another customer's invoice.

2. An update profile endpoint accepts { "role": "admin" } and saves it.

3. An API calls a paid AI provider with no per-user quota, timeout, or body size
   limit.

4. Production returns stack traces with SQL errors and internal file paths.

5. A webhook endpoint accepts events without verifying the provider signature.

6. CI publishes a build using an unpinned package pulled during deployment.

7. The app catches an authorization exception and continues as if the check
   passed.
*/
