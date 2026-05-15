## 2026-05-12 - [Zelle Email Copy Button]
**Learning:** Users often need to copy obfuscated or protected information (like Zelle emails) to external apps. Providing a dedicated copy button with clear feedback improves the user experience significantly.
**Action:** Always include a "Copy" button for sensitive or protected strings that users are likely to need elsewhere, and use visual feedback (e.g., "Copied!") to confirm the action.

## 2026-05-12 - [Accessible Total Price Updates]
**Learning:** Dynamic UI updates (like a changing total price) are not automatically announced to screen reader users.
**Action:** Use 'aria-live="polite"' on elements that update dynamically to ensure accessibility.
## 2025-05-14 - [Accessibility & UX Basics]
**Learning:** Adding `aria-live="polite"` to dynamic elements like total prices is crucial for screen reader users to be aware of changes without focus shift. A "Copy" button for payment info (Zelle) significantly reduces friction and prevents errors.
**Action:** Always check for dynamic text updates that should be announced, and look for "copyable" strings in checkout/payment flows.

## 2025-05-14 - [Copying Obfuscated Content]
**Learning:** When providing a copy button for obfuscated or human-friendly formatted strings (like emails with spaces to avoid scrapers), always sanitize the string (e.g., `.replace(/\s+/g, '')`) before writing to the clipboard to ensure the resulting value is valid for its intended use.
**Action:** Sanitize data for clipboard operations to match the expected format of the receiving application.

## 2025-05-15 - [Explicit Focus Indicators]
**Learning:** Default browser focus outlines can be inconsistent or hard to see. Explicitly defining ':focus-visible' styles with 'outline' and 'outline-offset' ensures that keyboard users can easily navigate the interface and see which element is active.
**Action:** Always add explicit ':focus-visible' styles for all interactive elements using the project's brand color.

## 2025-05-15 - [Confirmation for Destructive Actions]
**Learning:** Destructive UI actions, such as "Clear All" on a long form, can lead to accidental data loss and user frustration if triggered by mistake.
**Action:** Implement a simple confirmation dialog (e.g., 'confirm()') for any action that resets or deletes significant user progress.
