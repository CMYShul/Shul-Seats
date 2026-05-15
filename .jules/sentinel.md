## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2025-10-31 - CSV Injection (Formula Injection) in Google Sheets Logging
**Vulnerability:** User-provided strings (like names or comments) starting with characters like `=`, `+`, `-`, or `@` could trigger formula execution when the logged spreadsheet was opened.
**Learning:** The application was directly writing user input to spreadsheet rows without sanitization against spreadsheet-specific injection.
**Prevention:** Prepend a single quote (`'`) to any user-provided string starting with formula-triggering characters before writing to the spreadsheet.
