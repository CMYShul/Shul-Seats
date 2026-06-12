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

## 2025-05-14 - [Contextual Accessibility for Dynamic Updates]
**Learning:** For screen readers to announce dynamic updates with full context (e.g., "Total: $10.00"), `aria-live="polite"` should be placed on the parent container (like an `<h2>`) rather than just the updating numeric `<span>`.
**Action:** Ensure `aria-live` covers the descriptive label as well as the value.

## 2025-05-15 - [Mobile Usability and Interactive Feedback]
**Learning:** Adding 'autocomplete' and 'inputmode="numeric"' significantly reduces friction on mobile devices by minimizing typing errors and providing the correct keyboard context. Subtle visual feedback like ':active' scaling on buttons and hover states on rows makes the interface feel more responsive and "alive".
**Action:** Always include 'autocomplete', 'inputmode', and 'enterkeyhint' for form fields, and provide tactile feedback for interactive elements.

## 2026-06-12 - [Enhanced Seat Selection Interaction]
**Learning:** For forms with repeated rows of inputs (like seat selection), making the entire row clickable to focus the input dramatically increases the hit target and reduces user frustration. Combining this with a visual "selected" state and auto-selection of text on focus creates a highly efficient "cart-like" experience for numeric data entry.
**Action:** Implement row-level click-to-focus and visual selection states for tabular or list-based form inputs to improve mobile and accessibility ergonomics.
