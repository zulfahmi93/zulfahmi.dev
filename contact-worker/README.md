# Contact relay (Cloudflare Worker → Resend)

The portfolio is a static site (no server), so it can't hold the Resend API key.
This Worker is the thin server-side hop: the contact form POSTs JSON here, the
Worker validates it and sends the email via Resend using a key stored as a Worker
secret. The key never reaches the browser.

```
browser form  ──POST JSON──▶  this Worker  ──Resend API──▶  your inbox
```

## One-time setup

1. **Verify a sending domain in Resend** (e.g. `zulfahmi.dev`) and create an API
   key: <https://resend.com>. Set `FROM_EMAIL` in `wrangler.toml` to a sender on
   that verified domain.

2. **Install + log in**

   ```sh
   cd contact-worker
   npm install
   npx wrangler login
   ```

3. **Store the API key as a secret** (never commit it):

   ```sh
   npx wrangler secret put RESEND_API_KEY
   # paste the re_... key when prompted
   ```

4. **Deploy**

   ```sh
   npm run deploy
   ```

   Wrangler prints the Worker URL, e.g.
   `https://zulfahmi-contact-relay.<subdomain>.workers.dev`.

## Wire the site to it

Set the endpoint as a build-time env var for the Next.js site (it's read in
`app/_components/contact-form.tsx` as `NEXT_PUBLIC_CONTACT_ENDPOINT`):

- **GitHub Actions** (current host): add a repo variable
  `NEXT_PUBLIC_CONTACT_ENDPOINT` and expose it to the `next build` step.
- **Local**: add to `.env.local`:

  ```
  NEXT_PUBLIC_CONTACT_ENDPOINT=https://zulfahmi-contact-relay.<subdomain>.workers.dev
  ```

If the var is unset, the form falls back to composing a `mailto:` — it's never a
dead end.

## Local testing (no CORS pain, prod stays locked)

`localhost:3000` isn't the deployed Worker's allowed origin, so posting to the
live Worker from `npm run dev` is correctly CORS-blocked (403). Test the full
send loop against a **local** Worker instead:

1. Create `contact-worker/.dev.vars` (git-ignored) with the key for local runs:

   ```
   RESEND_API_KEY=re_...
   ```

2. Run the Worker locally, allowing the dev origin for this session only — the
   deployed Worker's `ALLOWED_ORIGIN` is untouched:

   ```sh
   cd contact-worker
   npx wrangler dev --var ALLOWED_ORIGIN:http://localhost:3000
   # serves at http://localhost:8787
   ```

3. Point the site at the local Worker — project-root `.env.local`:

   ```
   NEXT_PUBLIC_CONTACT_ENDPOINT=http://localhost:8787
   ```

4. `npm run dev`, submit the form → posts to the local Worker → Resend sends a
   real email. (Alternatively, allow the dev origin on the deployed Worker by
   setting `ALLOWED_ORIGIN` to a comma-separated list and redeploying.)

## Config (`wrangler.toml` `[vars]`)

| Var              | Meaning                                              |
| ---------------- | ---------------------------------------------------- |
| `ALLOWED_ORIGIN` | Comma-separated origins allowed to POST (CORS lock). `https://zulfahmi.dev` |
| `FROM_EMAIL`     | Verified Resend sender, e.g. `Portfolio <contact@zulfahmi.dev>` |
| `TO_EMAIL`       | Inbox that receives messages                         |
| `RESEND_API_KEY` | **Secret** — set via `wrangler secret put`, not in this file |

## Hardening notes

- Input is type-checked, length-capped, and email-validated; oversized bodies are
  rejected (413).
- CORS is locked to `ALLOWED_ORIGIN`, not `*`.
- Add a **Cloudflare Rate Limiting rule** on the Worker route (e.g. 5 req/min/IP)
  for spam protection — the Worker is intentionally stateless.
- The site form also carries a honeypot field, so most bots are dropped client-side
  before they ever reach the Worker.

## If the whole site moves to Cloudflare Pages

This same `src/index.ts` drops in as a Pages Function at
`functions/api/contact.ts` (same-origin, no CORS needed) — move the file, keep the
validation, read the secret from the Pages project env instead of a Worker secret.
