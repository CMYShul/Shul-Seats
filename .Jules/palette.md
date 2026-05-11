## 2025-05-14 - [Accessibility & UX Basics]
**Learning:** Adding `aria-live="polite"` to dynamic elements like total prices is crucial for screen reader users to be aware of changes without focus shift. A "Copy" button for payment info (Zelle) significantly reduces friction and prevents errors.
**Action:** Always check for dynamic text updates that should be announced, and look for "copyable" strings in checkout/payment flows.

## 2025-05-14 - [Copying Obfuscated Content]
**Learning:** When providing a copy button for obfuscated or human-friendly formatted strings (like emails with spaces to avoid scrapers), always sanitize the string (e.g., `.replace(/\s+/g, '')`) before writing to the clipboard to ensure the resulting value is valid for its intended use.
**Action:** Sanitize data for clipboard operations to match the expected format of the receiving application.
