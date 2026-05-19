## 2026-05-11 - Information Leakage in API Error Responses
**Vulnerability:** Internal error messages were being leaked to the client via a `detail` property in JSON error responses.
**Learning:** The application was catching errors and explicitly including `err.message` in the response to the client. While helpful for debugging, this can expose sensitive information about the database, file system, or third-party integrations (like Google Sheets or Web3Forms).
**Prevention:** Always return generic error messages to the client. Log the full error details on the server for debugging purposes.

## 2026-05-12 - Formula Injection (CSV Injection) in Spreadsheet Logging
**Vulnerability:** User-provided strings starting with formula-triggering characters (=, +, -, @) were logged directly to Google Sheets without escaping.
**Learning:** Spreadsheets like Google Sheets and Excel can execute strings starting with these characters as formulas. If an administrator opens the sheet, these formulas could perform malicious actions like data exfiltration or credential theft from the admin's session.
**Prevention:** Always prepend a single quote (') to any string value that starts with =, +, -, or @ before writing it to a spreadsheet. This ensures the spreadsheet treats the value as literal text.
