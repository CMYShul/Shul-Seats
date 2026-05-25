## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2026-05-12 - CSV Injection in Google Sheets Logging
**Vulnerability:** User-provided strings starting with characters like `=`, `+`, `-`, or `@` were being written directly to Google Sheets, potentially triggering formula execution when the sheet is opened in Excel or Google Sheets.
**Learning:** Even if data is "just a log", if the destination is a spreadsheet, formula injection is a risk. Sanitization must happen before the data is written to the spreadsheet.
**Prevention:** Prepend a single quote (`'`) to any string value starting with formula-triggering characters (`=`, `+`, `-`, `@`, `\t`, `\r`) to ensure it is treated as literal text.
