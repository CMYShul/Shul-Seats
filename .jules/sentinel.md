## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2026-05-22 - CSV Injection in Google Sheets Logging
**Vulnerability:** User-provided strings (like First Name or Comments) were being written directly to Google Sheets without sanitization, allowing for formula injection (CSV Injection).
**Learning:** When data is exported or logged to spreadsheet software (Google Sheets, Excel), strings starting with formula characters (`=`, `+`, `-`, `@`) can be interpreted as executable code by the spreadsheet application.
**Prevention:** Prepend a single quote (`'`) to any string value that starts with formula-triggering characters before adding it to a spreadsheet row.
