# Privacy Contact Email Design

## Goal

Add a direct email entry point to the Privacy Policy contact section using the
same `support@chugchug.app` address already exposed in the home page footer.

## Design

- Define the support email once in a small shared contact module.
- Update the home page footer to consume the shared email value.
- Add localized email labels for Simplified Chinese, Traditional Chinese, and
  English privacy copy.
- Render the email as a `mailto:` link above the existing website link in the
  Privacy Policy contact list.
- Reuse the existing yellow link styling so the new entry matches the website
  contact method.

## Scope

This change does not add a contact form, email service integration, or new
navigation. Clicking the email link delegates message composition to the
visitor's configured email client.

## Verification

- Build and prerender all configured language variants.
- Confirm generated Privacy Policy pages contain the support email and
  `mailto:support@chugchug.app`.
- Confirm the home page still uses the same shared email address.
