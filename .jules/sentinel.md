## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2026-05-14 - Secure Form Submission and API Hardening
**Vulnerability:** Multiple security gaps including potential PII leakage via URL parameters on JS failure, CSV injection in Google Sheets logging, and missing security headers.
**Learning:** A syntax error in 'script.js' could prevent the 'submit' event listener from being attached, causing the browser to fall back to a default GET submission. This would append all form data (including PII) to the URL. Additionally, user-provided data logged to Google Sheets could trigger formula execution if it starts with characters like '='.
**Prevention:**
1. Always set 'method="POST"' on forms with sensitive data as a fail-safe.
2. Sanitize data before logging to spreadsheets by prepending a single quote to strings starting with '=', '+', '-', or '@'.
3. Implement a standard set of security headers (CSP, HSTS, Referrer-Policy, XCTO, XFO) on all API endpoints.
4. Use 'node -c' to verify script syntax before deployment.
