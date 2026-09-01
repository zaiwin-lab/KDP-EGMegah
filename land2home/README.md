# Land2Home Concierge

**Member Home-Building Journey Portal** — *From Land. To Vision. To Home.*

A guided home-building portal for KPSM members building with EGMH, built and
operated by KOBIS Berhad. It is a digital concierge, not a construction ERP:
it tells a member where their house is, what has been done, what happens next,
whether anything is needed from them, and where their money has reached.

> **This is a demonstration build.** Amir, Hana, the land title, the prices and
> the payment records are invented. Nothing here describes a real member,
> a real project or a real payment.

---

## Who does what

| Party | Responsibility |
|---|---|
| **KPSM** | Member verification, payment governance, staged-payment authorisation |
| **KOBIS Berhad** | Portal owner, journey coordination, records, communication, service monitoring |
| **EGMH** | Site assessment, design, quotation, construction, progress, quality, handover, warranty |
| **Buyer / member** | Selects the home, provides information once, monitors progress, gives the approvals that are theirs |

## The six stages

`My Land` → `My Home` → `My Plan` → `My Build` → `My Inspection` → `My Keys`

---

## Running it

```bash
cd land2home
npm install
npm run dev          # http://localhost:5173
```

No configuration is needed. With no environment variables set the portal runs
on its built-in demonstration data, stored in the browser's `localStorage`, and
every feature works offline.

```bash
npm run build        # typecheck + production build into dist/
npm run preview      # serve the production build
```

### Demonstration accounts

Any password is accepted in demonstration mode.

| Email | Who | Sees |
|---|---|---|
| `amir@demo.land2home.my` | Amir bin Rahman, member | The member journey |
| `kobis@demo.land2home.my` | Nurul Aisyah, KOBIS | Coordination, verification, publishing |
| `kpsm@demo.land2home.my` | Hj. Zulkifli Awang, KPSM | Payment authorisation, audit trail |
| `egmh@demo.land2home.my` | Sim Chee Hong, EGMH | Progress updates, claims, rectification |

The demonstration project: **Type B — Family**, 1,280 sq ft, on Lot 2214,
Kampung Skibang, **Bau, Sarawak**. Structural works, **42%** complete, next
milestone roof structure installation, on schedule. Release 1 is paid and
release 2 is sitting with KPSM for authorisation, so the payment workflow can
be driven end to end: sign in as KPSM, authorise release 2, record the payment,
then sign back in as Amir to see the notification.

**My details → Reset the demonstration** puts everything back to the seeded state.

---

## Deploying to Netlify

The repository root holds a separate static site (KODC), so this app lives in a
subdirectory.

1. **Base directory:** `land2home`
2. **Build command:** `npm run build`
3. **Publish directory:** `land2home/dist`
4. **Functions directory:** `land2home/netlify/functions`

`netlify.toml` in this directory already sets the build, the SPA redirect and
the security headers. Set environment variables under *Site configuration →
Environment variables* (see `.env.example`).

---

## Connecting Supabase

The portal runs on demonstration data until **both** `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are set; then it switches to the Supabase adapter
automatically.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor (or `supabase db push`). It
   creates every table, the enums, the private `member-documents` storage
   bucket, and the row-level security policies.
3. Create auth users, then insert a matching row in `user_accounts` giving each
   one a role (`member`, `kobis`, `kpsm`, `egmh`). A member also needs a
   `member_profiles` row whose `user_id` is their auth user id.
4. Put the URL and the **anon** key in the environment.

The anon key is meant to be public. What actually protects the data is
row-level security, and two guarantees are enforced in the database rather
than in application code:

- **`payment_authorisation_guard`** refuses to let a payment stage reach
  `authorised` or `paid` without a named authorising officer, and refuses to
  record a payment that was never authorised.
- **`audit_records_immutable`** refuses every update and delete on the audit
  table. History cannot be rewritten by anyone, including an administrator
  using the dashboard.

Never expose the `service_role` key to the browser. It bypasses row-level
security entirely.

---

## What the AI does, and what it must never do

Assistance runs **server-side** in `netlify/functions/`, which read
`ANTHROPIC_API_KEY` from the function environment. The browser bundle never
holds a key. If no key is configured, the functions return `501` and the
browser falls back to a deterministic local engine (`src/ai/localAssistant.ts`)
so nothing breaks.

**It may:**

- Read an uploaded document and *propose* values for a form
  (`netlify/functions/extract-document.ts`)
- Rewrite an EGMH site report into plain language for the member
  (`netlify/functions/assist.ts`)
- Explain a form question, recommend a house type, summarise what is missing

**It must never** approve a payment, certify construction work, verify a
document, or make a contractual decision. That boundary is enforced in three
places, not just in the prompt:

1. Extracted values are always shown back to the member for confirmation.
   Low-certainty values are flagged, values that disagree with the profile
   block confirmation until the member picks one, and unreadable fields are
   named. Confirming means "use these to prefill" — never "this is verified".
2. Verification is a separate act by a KOBIS or KPSM officer, recorded against
   their name.
3. The database triggers above make an unauthorised payment impossible
   regardless of what any code, or any model, tries to write.

---

## One Member, One Profile

Information is captured once and reused. `src/lib/journey.ts` derives what a
member must do from state rather than from a hand-kept list, so an empty
actions list is a real answer: *nothing is needed from you right now*.

- Personal and membership details are entered once and prefill every form
- The application wizard auto-saves on a debounce and resumes at the last step
- Conditional logic hides irrelevant questions (a custom house asks for a
  brief; the KPSM financing route asks about income; land with no road access
  explains what changes)
- A member who already has a live application is shown it instead of being
  allowed to start a duplicate
- A document that is on file and still valid is never requested again;
  `documentGaps()` surfaces only what is genuinely missing or expiring
- A confirmation summary is shown before anything is submitted

---

## Layout of the code

```
land2home/
├── netlify/functions/     Server-side assistance. The only place a key lives.
├── supabase/schema.sql    Tables, triggers, RLS policies, storage bucket.
└── src/
    ├── ai/                Local engine + the client that calls the functions
    ├── components/        UI primitives, layout, artwork, shared panels
    ├── data/              Repository interface + local and Supabase adapters
    ├── lib/               Types, journey derivation, formatting, house types
    ├── pages/             public · member · admin (KPSM/KOBIS) · egmh
    └── state/             Portal context
```

`src/data/repository.ts` is the seam. Screens never touch Supabase or the demo
store directly, so swapping the backing store, or pointing the platform at a
different cooperative and builder, touches one layer.

Every root table carries an `org_id`, and the operator, cooperative and builder
names come from the `orgs` row rather than being hard-coded, so the same
platform can serve another cooperative, contractor and location without a
rebuild.

---

## Replacing the artwork

The hero scene (`src/components/art/HeroScene.tsx`) and the site photographs
(`src/components/art/SitePhoto.tsx`) are hand-built SVG, not stock photography.
They render identically everywhere, need no network request, and cannot ship as
broken images. Each `SitePhoto` plate depicts the construction stage it is
captioned with.

For production, replace `SitePhoto` with an `<img>` pointing at the photograph
in Supabase storage (`PhotoRef.path` already carries the storage path), and the
hero with a real photograph of a member's site.

---

## Deliberately not built

BIM integration · 3D configurator · native mobile app · full accounting ·
supplier marketplace · IoT site monitoring · bank integration · contractor ERP ·
a general-purpose chatbot.

---

## Known limits of this build

- Uploaded files are recorded and read, but bytes are not persisted in
  demonstration mode; wire `documents.storage_path` to Supabase storage for
  real uploads.
- `extract-document` needs the file bytes forwarded to it (`media`) to read a
  real document. Without them it returns `422` and the local engine answers.
- Progress photographs are illustrative SVG (see above).
- The demonstration store lives in `localStorage`, so it is per-browser.
