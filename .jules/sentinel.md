## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2026-05-12 - CSV Injection Mitigation and Security Header Standardization
**Vulnerability:** Potential for CSV (formula) injection in Google Sheets via unsanitized user input, and inconsistent security headers across API endpoints.
**Learning:** Data logged directly to spreadsheets can execute formulas if they start with certain characters (`=`, `+`, `-`, `@`). Standardizing security headers across all API endpoints (HSTS, CSP, Referrer-Policy) provides a baseline layer of defense.
**Prevention:** Prepend a single quote (`'`) to any string value starting with formula-triggering characters when logging to Google Sheets. Ensure all API responses include a comprehensive set of security headers.

## 2026-05-13 - PII Leakage via URL Parameters and SyntaxError Impact
**Vulnerability:** Personally Identifiable Information (PII) like names, email, and phone numbers could be leaked in URL parameters if client-side JavaScript failed to intercept form submission (e.g., due to a SyntaxError).
**Learning:** A duplicate variable declaration (`const copyButton`) in `script.js` was a "silent" failure that could prevent the entire script from loading, causing the form to fall back to a default GET submission.
**Prevention:** Always explicitly set `method="POST"` on forms containing sensitive data as a defense-in-depth measure. Use `node -c` to verify script syntax and avoid duplicate declarations.

## 2026-05-28 - Bot Mitigation and Resource Exhaustion Prevention
**Vulnerability:** The booking form was vulnerable to automated spam submissions and potential resource exhaustion (filling up Google Sheets) due to a lack of bot protection and global seat quantity limits.
**Learning:** Even with per-field limits, a lack of global constraints allows for bulk submissions that can hit API or spreadsheet row limits. A simple honeypot (`middle_name`) is an effective first layer of defense for static sites.
**Prevention:** Implement honeypot fields for all public-facing forms. Enforce global aggregate limits (e.g., `MAX_TOTAL_SEATS`) in the backend validation, not just per-item limits.
