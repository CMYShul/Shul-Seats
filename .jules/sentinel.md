## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2025-05-13 - PII Leakage via Form Fallback
**Vulnerability:** A `SyntaxError` in `script.js` (duplicate declaration) disabled all client-side logic, causing the form to fall back to a default GET request. This would have leaked PII (names, emails, phones) in URL parameters.
**Learning:** Client-side JavaScript is a fragile layer. If it fails, browsers fallback to default behaviors which may be insecure (like GET for forms).
**Prevention:** Always explicitly set `method="POST"` on HTML forms containing sensitive data as a defense-in-depth measure. Use `node -c` to verify script validity in CI/CD.
