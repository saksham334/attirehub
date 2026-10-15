# AttireHub Security Checklist

Status of basic protections. This is a learning project and has NOT had a professional security review.

## Done
- [x] Passwords hashed with bcrypt (salted); never returned by the API (`select: false`)
- [x] JWT signed with a secret of 32+ characters; algorithm pinned to HS256; 7-day expiry
- [x] Secrets only in `.env`; `.env` git-ignored; `.env.example` has placeholders only
- [x] Server refuses to start with missing or weak secrets
- [x] Authentication (`protect`) and authorization (`adminOnly`) enforced on the server
- [x] Role is never read from request bodies; users can't change their own role
- [x] Resource ownership checks: carts, wishlists and orders use the token's user id
- [x] Prices and totals recalculated on the server; clients never send prices
- [x] Input validation with express-validator; fields whitelisted for profile and product updates
- [x] NoSQL injection defenses: type checks, validation, and operator-key rejection
- [x] Regex input escaped in search
- [x] Rate limiting: whole API, plus stricter limits on login, register and password reset
- [x] Request body size limited to 100 KB
- [x] Password reset tokens: random, stored hashed, 15-minute expiry, single use, identical response for unknown emails
- [x] Login error message identical for unknown email and wrong password
- [x] Helmet security headers; CORS limited to configured origins
- [x] Central error handler hides internal details from clients
- [x] Demo payments only; no card data is collected or stored
- [x] `npm audit` run and reviewed

## Known limitations (be honest about these)
- JWT is stored in localStorage: readable by any script if an XSS bug exists. httpOnly cookies with CSRF protection are stronger.
- No email verification, no multi-factor authentication, no account lockout beyond IP rate limits
- Rate limit counters live in memory: reset on restart and not shared across several servers
- Order creation uses conditional stock updates, not a database transaction
- Admin product images are URLs only; no file upload scanning
- No audit log of admin actions
- No automated security scanning in CI; no penetration test

## Before a real launch
- Professional security review and penetration test
- httpOnly cookie sessions, email verification, MFA for admins
- Real payment provider (never handle card numbers yourself)
- Monitoring, alerting and log retention