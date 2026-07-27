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
const homeSource = await readSource('../src/AppGlass.jsx');
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
  assert.match(homeSource, /mailto:\$\{SUPPORT_EMAIL\}/);
  assert.match(privacySource, /href=\{`mailto:\$\{SUPPORT_EMAIL\}`\}/);
  assert.match(privacySource, /\{current\.email_label\}/);
  assert.match(privacySource, /\{SUPPORT_EMAIL\}/);
});
