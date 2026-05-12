## 2026-05-12 - [Zelle Email Copy Button]
**Learning:** Users often need to copy obfuscated or protected information (like Zelle emails) to external apps. Providing a dedicated copy button with clear feedback improves the user experience significantly.
**Action:** Always include a "Copy" button for sensitive or protected strings that users are likely to need elsewhere, and use visual feedback (e.g., "Copied!") to confirm the action.

## 2026-05-12 - [Accessible Total Price Updates]
**Learning:** Dynamic UI updates (like a changing total price) are not automatically announced to screen reader users.
**Action:** Use 'aria-live="polite"' on elements that update dynamically to ensure accessibility.
