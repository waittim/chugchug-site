# Privacy Contact Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a localized, clickable support email entry to the Privacy Policy contact section while keeping the address shared with the home page footer.

**Architecture:** A focused `src/contact.js` module owns the support email address. The home and Privacy Policy components import that value, while the existing privacy localization object owns only the translated email label.

**Tech Stack:** React 18, Vite 5, Node.js built-in test runner, react-snap

---

### Task 1: Add a failing contact-email regression test

**Files:**
- Create: `tests/privacy-contact.test.mjs`
- Inspect: `src/App.jsx`
- Inspect: `src/privacy.jsx`
- Inspect: `src/content/privacy.js`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRIVACY_COPY } from '../src/content/privacy.js';

const readSource = async (path) => {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
};

const contactSource = await readSource('../src/contact.js');
const homeSource = await readSource('../src/App.jsx');
const privacySource = await readSource('../src/privacy.jsx');

test('uses one shared support email in the home and privacy pages', () => {
  assert.match(
    contactSource,
    /export const SUPPORT_EMAIL = 'support@chugchug\.app';/,
  );
  assert.match(homeSource, /import \{ SUPPORT_EMAIL \} from '\.\/contact\.js';/);
  assert.match(privacySource, /import \{ SUPPORT_EMAIL \} from '\.\/contact\.js';/);
});

test('provides a localized email label for every privacy language', () => {
  assert.equal(PRIVACY_COPY.zh.email_label, '邮箱');
  assert.equal(PRIVACY_COPY['zh-Hant'].email_label, '電子郵件');
  assert.equal(PRIVACY_COPY.en.email_label, 'Email');
});

test('renders the shared email as a mailto link in both pages', () => {
  assert.match(homeSource, /href=\{`mailto:\$\{SUPPORT_EMAIL\}`\}/);
  assert.match(privacySource, /href=\{`mailto:\$\{SUPPORT_EMAIL\}`\}/);
  assert.match(privacySource, /\{current\.email_label\}/);
  assert.match(privacySource, /\{SUPPORT_EMAIL\}/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/privacy-contact.test.mjs`

Expected: FAIL because `src/contact.js`, the localized `email_label` values, and the Privacy Policy mail link do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/privacy-contact.test.mjs
git commit -m "test: cover privacy contact email"
```

### Task 2: Implement the shared support email and Privacy Policy link

**Files:**
- Create: `src/contact.js`
- Modify: `src/App.jsx`
- Modify: `src/privacy.jsx`
- Modify: `src/content/privacy.js`

- [ ] **Step 1: Add the shared support email**

Create `src/contact.js`:

```js
export const SUPPORT_EMAIL = 'support@chugchug.app';
```

- [ ] **Step 2: Use the shared email in the home footer**

Add this import to `src/App.jsx`:

```js
import { SUPPORT_EMAIL } from './contact.js';
```

Replace the hard-coded footer link with:

```jsx
href={`mailto:${SUPPORT_EMAIL}`}
```

- [ ] **Step 3: Add localized email labels**

Add the following property to each matching language object in
`src/content/privacy.js`:

```js
email_label: '邮箱',
```

```js
email_label: '電子郵件',
```

```js
email_label: 'Email',
```

- [ ] **Step 4: Render the email contact method**

Add this import to `src/privacy.jsx`:

```js
import { SUPPORT_EMAIL } from './contact.js';
```

Insert this list item above the existing website entry:

```jsx
<li>
  {current.email_label}:{' '}
  <a
    className="text-[#FFE85F] hover:underline"
    href={`mailto:${SUPPORT_EMAIL}`}
  >
    {SUPPORT_EMAIL}
  </a>
</li>
```

- [ ] **Step 5: Run the regression test to verify it passes**

Run: `node --test tests/privacy-contact.test.mjs`

Expected: PASS with 3 tests and 0 failures.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/contact.js src/App.jsx src/privacy.jsx src/content/privacy.js
git commit -m "Add email link to privacy contact section"
```

### Task 3: Verify build and prerendered output

**Files:**
- Verify: `dist/index.html`
- Verify: `dist/privacy.html`

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: Vite build and react-snap prerender complete with exit code 0.

- [ ] **Step 2: Check generated email links**

Run:

```bash
rg -n 'mailto:support@chugchug\.app|support@chugchug\.app' dist/index.html dist/privacy.html
```

Expected: Both generated pages contain the support email, and the Privacy
Policy output contains `mailto:support@chugchug.app`.

- [ ] **Step 3: Check the final diff**

Run: `git status --short && git diff --check HEAD~2..HEAD`

Expected: No uncommitted source changes and no whitespace errors.
