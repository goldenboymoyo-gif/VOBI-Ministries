# VOBI — Research Document

**Project:** Official website for Valley of Blessings International Ministries (VOBI), Victoria Falls, Zimbabwe.
**Compiled:** 2026-10-07
**Rule of this document:** every line below is traceable to a public source, or explicitly marked as unverified/needed.

---

## 0. Verification method

Sources consulted:

| # | Source | URL | How it was checked |
|---|--------|-----|--------------------|
| S1 | YouTube channel "PROPHET PROMISE MINISTRIES" | `youtube.com/@prophetpromiseministries4267` (channel id `UCAFcgnT0wjnwlRQarojjuIQ`) | Fetched channel HTML + official RSS feed `feeds/videos.xml?channel_id=UCAFcgnT0wjnwlRQarojjuIQ` |
| S2 | YouTube video pages | `youtube.com/watch?v=…` | Parsed `ownerChannelName`, `shortDescription`, `publishDate` |
| S3 | Facebook page | `facebook.com/VOBI_Ministries` (page id `100080156115361`) | `m.facebook.com/VOBI_Ministries/` Open Graph tags |
| S4 | Instagram | `instagram.com/vobiministries` | Search index result: "Prophet Promise Ministries (@vobiministries)" |
| S5 | TikTok | `tiktok.com/@vobiministries` | Search index result: "VOBI MINISTRIES (@vobiministries)" |
| S6 | Business/place listings | `africabizinfo.com/ZW/vobi-ministries-valley-of-blessings-077-587-9390`, `exa.ai/library/place/7fvy7jkrccz`, `zw.near-place.com/vobi-ministries-victoria-falls`, `findglocal.com/ZW/Victoria-Falls/109894508229633/VOBI-Ministries` | Search index snippets + direct fetch |
| S7 | Full channel video index | 882 video titles pulled from the channel (yt-dlp flat playlist) | Local file `research/yt_videos.txt` |
| S8 | Per-video metadata | upload date / duration / views for 31 selected videos | Local file `research/video_meta.txt` |

**Rejected sources (deliberately not used):**

- `adequatetravel.com/…/vobi-ministries-valley-of-blessings-international-in-zimbabwe-history-facts-services`
  — content is clearly machine-generated and **contradicts verified fact**. It claims founders "Apostle Dr. Motsi Moses and Apostle Dr. Getrude Motsi", an "international office in Austin, Texas", a "branch office in Harare", affiliation with "World Assemblies of God Fellowship", "over forty-five thousand people reached", "two decades" of operation. None of this is corroborated anywhere, and the verified leader is Prophet Promise. **None of this content appears on the site.**
- Any "Prophet Promise" material from Eswatini (Sithembiso N. Shongwe, "The Upper Room of Prayer", Mbabane, `prophetpromiseupperroom.org`). Different ministry, different country, different branding. **Not VOBI. Not used.**
- Other ministries named "Valley of Blessings" (Chehalis WA, Musoma TZ, Accra GH, Ethel WA, Krugersdorp SA, Gweru ZW). **Not VOBI. Not used.**

---

## 1. Identity

| Field | Value | Status | Source |
|-------|-------|--------|--------|
| Official ministry name | Valley Of Blessings International Ministries | ✅ Verified | S3 (FB bio: "Welcome to the official Facebook page of Valley Of Blessings Internat…"), S6 listings |
| Short name | VOBI / VOBI Ministries | ✅ Verified | S1 video titles, S3 page name, S6 |
| Expanded on YouTube | PROPHET PROMISE MINISTRIES | ✅ Verified | S1 |
| Meaning of VOBI | Valley Of Blessings International | ✅ Verified | S6 (`africabizinfo` slug: `vobi-ministries-valley-of-blessings`) |
| Logo | **Supplied by VOBI (7 Oct 2026)** — `images/Logo.jpeg` (gold mark on black) | ✅ Supplied | See §8 |
| Brand colours | **Gold `#e6c453`, sampled from the supplied mark** | ✅ Derived from supplied logo | See §8 |
| Typography | **Not discoverable from public assets** | ⛔ **NEEDED** | See §8 |
| Official tagline | **None found** | ⛔ **NEEDED** | Closest verified phrases below |

### Verified phrases VOBI actually uses (safe to quote as editorial copy)

- **"Because of Christ we are saved."** — first line of the official Facebook bio (S3).
- **"Distance is not a barrier to the Spirit of God."** — recurring line in official Sunday-service descriptions (S2).
- **"Distance is not a barrier in Jesus' name!"** — recurring sermon/livestream title wording (S7).
- **"Viewers around the globe, welcome to the Sunday service in the presence of God Almighty in VOBI Ministries with the man of God Prophet Promise."** — official Sunday service description (S2).
- **"Welcome to our Sunday service with Prophet Promise. As we gather in one spirit, let us quiet our hearts and prepare to connect deeply with our Heavenly Father through worship and prayer."** — official description (S2).
- Hashtags used by the ministry: `#vobiminitsries` (sic), `#PPministries`, `#ANewDream`, `#CrossoverNight` (S7).

> **Editorial rule:** any homepage statement that is not one of the verified phrases above is marked in code as `CONTENT NEEDED — VOBI` and must be approved by ministry leadership before launch.

---

## 2. Leadership

| Field | Value | Status | Source |
|-------|-------|--------|--------|
| Leader name | **Prophet Promise** | ✅ Verified | S1, S2, S3, S6, S7 (referenced as "the man of God Prophet Promise") |
| Official title used by VOBI | "Prophet"; also "the man of God" | ✅ Verified | S2 descriptions, S7 titles |
| Full name / biography | **Not published anywhere public** | ⛔ **NEEDED** | Do not invent |
| Ordination, training, family, education | **Not published** | ⛔ **NEEDED** | Do not invent |
| Other staff / associates / pastors | **Not verifiable** | ⛔ **NEEDED** | Do not name anyone |

**Cross-check performed:** a separate Eswatini prophet also trades under the name "Prophet Promise" (Sithembiso N. Shongwe, The Upper Room of Prayer, Mbabane). Public reporting there is *not* about VOBI. No source links the two. Treated as unrelated.

---

## 3. Location & contact

| Field | Value | Status | Source |
|-------|-------|--------|--------|
| City | Victoria Falls, Zimbabwe | ✅ Verified | S3, S6 |
| Province | Matabeleland North | ✅ Verified | S6 (`exa.ai` place record) |
| Suburb / area | Mkhosana (also indexed as Chinotimba) | ✅ Verified (two listings, both accepted names for the same area) | S6 |
| Address line (listing A) | **8875 CBZ, Mkhosana, Victoria Falls, Zimbabwe** | ⚠️ Listed, needs leadership confirmation | S6 |
| Address line (listing B) | **8876 Bufferzone, Victoria Falls** | ⚠️ Listed, conflicts with A | S6 (`findglocal`) |
| Coordinates (listing A) | -17.939334, 25.822199 | ⚠️ Listed | S6 (`exa.ai`) |
| Coordinates (listing B) | -17.9318052, 25.8255575 | ⚠️ Listed | S6 (`near-place`) |
| Phone | **+263 775 879 390** | ✅ Verified (published in the listing slug `077-587-9390`) | S6 (`africabizinfo`) |
| WhatsApp | **Not published** | ⛔ **NEEDED** | — |
| Email | **prophetpromise1@gmail.com** | ✅ Supplied directly by VOBI (7 Oct 2026) | Direct from leadership |
| Prayer / direct line | **+263 713 901 112** | ✅ Supplied directly by VOBI (7 Oct 2026) | Direct from leadership |
| Official website | **None exists prior to this project** | ✅ Confirmed by search | — |

**Implementation decision:** the site publishes the phone number and the street address from listing A, both labelled as coming from public listings, and links **Get Directions** to a Google Maps directions URL built from listing A's coordinates. The email address and the prayer line supplied by VOBI on 7 Oct 2026 are published in the contact, prayer, visit, about and footer contact blocks. The contact form remains the primary route for written messages.

---

## 4. Services & gatherings

Nothing about service **times** is published publicly. Only service **types** are verifiable.

| Item | Status | Evidence |
|------|--------|----------|
| Sunday service | ✅ Verified to exist | Recurring titles `SUNDAY LIVE SERVICE | <date> | VOBI MINISTRIES`; description text (S1/S2) |
| Service **time of day** | ✅ **Supplied by VOBI (7 Oct 2026): Sunday 08:30** | Direct from leadership |
| Service **closing** | ✅ **Supplied by VOBI (7 Oct 2026): "end when the Holy Spirit gives a signal"** | Direct from leadership |
| Weekly pattern (how many services, weekday meetings) | ⛔ **NEEDED** | No public source |
| Mass Prayer | ✅ Verified (70 titles contain "MASS PRAYER") | S7 |
| "Pray Along with Prophet Promise" prayer-line service | ✅ Verified (Thursday prayer-line service referenced in a 2019 title) | S7 |
| Crossover / Candle Light Service (31 Dec) | ✅ Verified — recurring annual | `Candle light 2025-2026 Crossover`, `NIGHT OF EXODUS CROSSOVER SERVICE`, `2023 to 2024 CROSSOVER INVITATION`, `MY YEAR OF EXTRAORDINARY GRACE | CROSSOVER` |
| "Night of Exodus" | ✅ Verified (2025/26 crossover naming) | S7 |
| "Living Water" Sunday service | ✅ Verified | `our past Living Water Sunday Service` |
| "Anointing Oil of Growth" service | ✅ Verified | `Prophet's Special Announcement – Anointing Oil of Growth Service` |
| "Healing Big Sunday" mass prayer | ✅ Verified | `There's a Spirit Behind! Healing Big Sunday Mass Prayer` |
| "Mercy Land" / "Holy Ground" | ✅ Verified as place/gathering language used by VOBI | `MERCYLAND SUNDAY SERVICE`, `MERCYLAND`, `A Special invitation for you this Sunday to the Holy Ground!!!` |
| International Visitor's Experience | ✅ Verified (Feb 2019 series) | S7 |
| Night of Refreshment | ✅ Verified (Mar 2018) | S7 |

> **UI rule:** service times are read from `client/config/site.ts` (`site.service`) and rendered through one component, `components/ui/ServiceTime.tsx`, so every page says the same thing. Times are never inferred from stream upload timestamps (upload timestamps are encoding times, not service times). Until 7 Oct 2026 this field rendered `CONTENT NEEDED — VOBI`; leadership has now supplied it.

---

## 5. Ministries / departments

Only these are evidenced by VOBI's own published content:

| Ministry | Status | Evidence |
|----------|--------|----------|
| Sunday worship services | ✅ Verified | S7 |
| Prayer / Mass Prayer / prayer line | ✅ Verified | S7 |
| Testimonies & deliverance ministry | ✅ Verified (103 titles contain "testimon") | S7 |
| Humanitarian programme | ✅ Verified | `HUMANITARIAN PROGRAM`, `SATURDAY 09 FEBRUARY 2019 HUMANITARIAN DOCUMENTARY`, `The power to change a life is in your hands | Humanitarian` |
| Southern-Africa outreach (Botswana, Zambia, Namibia) | ✅ Verified | `Botswana Outreach`, `Zambia KuChalo!`, `BOTSWANA ACTIVATED | CROSSOVER INVITATION`, FB review text "touching lives in Zambia, Botswana, Namibia" |
| Children's Ministry | ⚠️ Single evidence only | `Children's Ministry crossover invitation` — appears **once**. Shown as low-emphasis until confirmed. |
| Youth ministry | ⛔ Not evidenced | 0 titles contain "Youth" |
| Women's / Men's ministry | ⛔ Not evidenced | 0 titles contain "Women" |
| Music / worship team | ⛔ Not separately evidenced | Musicians appear in services but no department is published |

**Decision:** the Ministries section will only render **Prayer**, **Testimonies & Deliverance**, **Humanitarian Outreach** and **Sunday Worship**, all of which are directly evidenced. Youth/Women/Children tiles will **not** be invented.

---

## 6. Social media (only verified accounts)

| Platform | Handle | URL | Why it is believed official |
|----------|--------|-----|-----------------------------|
| Facebook | `VOBI_Ministries` | `https://www.facebook.com/VOBI_Ministries/` | Page name "VOBI Ministries \| Victoria Falls"; OG description literally reads *"Welcome to the official Facebook page of Valley Of Blessings Internat…"*; 9,516 followers; page id `100080156115361`. (S3) |
| YouTube | `@prophetpromiseministries4267` | `https://www.youtube.com/@prophetpromiseministries4267` | Channel name "PROPHET PROMISE MINISTRIES"; 882 uploads are VOBI Sunday services/mass prayers/testimonies titled `… | VOBI MINISTRIES`; 2.13k subscribers; 205,414 views; joined 7 Feb 2019. (S1, S7) |
| Instagram | `@vobiministries` | `https://www.instagram.com/vobiministries/` | Indexed as "Prophet Promise Ministries (@vobiministries)"; handle matches the TikTok handle exactly; posts are titled "Prophet Promise Ministries \| … \| VOBI …". (S4) |
| TikTok | `@vobiministries` | `https://www.tiktok.com/@vobiministries` | Indexed as "VOBI MINISTRIES (@vobiministries)"; identical handle to Instagram. (S5) |

**Rejected accounts:**

- `instagram.com/vobi_ministries_` — different handle, no cross-link to the others, low confidence. **Not published.**
- `facebook.com/p/PP-Ministries-61553635850564/` ("PP Ministries \| Victoria Falls") — possibly related, but no verified link to VOBI. **Not published.**
- Any account not listed above — **not published**, even if the name contains "VOBI".

No empty social icons are rendered: the footer renders only the platforms present in `socialLinks`.

---

## 7. Media

### 7.1 Official YouTube channel

- **Name:** PROPHET PROMISE MINISTRIES
- **URL:** `https://www.youtube.com/@prophetpromiseministries4267`
- **Channel id:** `UCAFcgnT0wjnwlRQarojjuIQ`
- **RSS (machine-readable feed used by the site):** `https://www.youtube.com/feeds/videos.xml?channel_id=UCAFcgnT0wjnwlRQarojjuIQ`
- **Joined:** 7 February 2019
- **Subscribers:** 2.13k · **Views:** 205,414 · **Videos indexed:** 882
- **Earliest content referenced in titles:** `SUNDAY 8 MAY 2016`, `21 MAY 2017 MASS PRAYER`, `SUNDAY 27 JUNE 2017 MASS PRAYER`
- **Live-stream cadence:** near-weekly Sunday live services in 2026 (e.g. 04 Oct, 27 Sep, 20 Sep, 16 Aug, 07 Sep 2026)

### 7.2 Recent verified sermons (real titles, real dates)

| Date | Title | Video |
|------|-------|-------|
| 2026-10-01 | Power In The Mouth | `MIj5Em8soV0` |
| 2026-09-15 | Calmness Brings Victory Over Temptation | `yBesC26mSSA` |
| 2026-09-08 | How to get your prayers answered Part 2 | `VY_YMo1UpGw` |
| 2026-08-26 | How to get your prayers answered | `5hR5RpDJ0GA` |
| 2026-08-19 | Wake up and protect your destiny | `pWvcKKfaXPs` |
| 2026-07-28 | Don't Submit To Your Situation | `sF7fpb43VaM` |
| 2026-07-22 | The Dangers of Familiarity | `78sc4pcwrHA` |
| 2026-07-15 | God expects us to grow through our trials | `i9S_xErFgiM` |
| 2026-07-10 | He Is A Loving God | `eZEP0xzN310` |
| 2026-06-23 | Serve God by His Spirit | `4GDAFRBqwMw` |
| 2026-06-17 | Avoid The Trap Of Looking Back | `5X2ZHrLffyI` |
| 2026-05-21 | If God has said it no one can stop it | `3qBpqouObcY` |
| 2026-05-14 | Power Of Imagination | `6Gvt6NEAeJY` |
| 2026-04-29 | Power of Resurrection | `AeL-g0-o0u8` |
| 2026-03-26 | Fruitful Vine | `bpW3XpLAcok` |
| 2026-03-11 | Ministering Spirits (Angels of God) Part 1 | `sInoJId6apc` |
| 2026-03-04 | Idol worship in the Heart | `ycsBRmf6P6k` |
| 2026-02-11 | Interpreting Times and Seasons | `tfTPnpbrqpk` |
| 2026-02-05 | No Competition in Destiny | `NblpmxogXjM` |
| 2026-01-20 | Learn from those who have made it | `ictNkEfgU3Y` |
| 2026-01-06 | A New Dream | `9iV-U9pxUvs` |
| 2025-12-17 | Be violent in your worship | `9mm2AW8NNr4` |
| 2025-12-02 | Be Content | `q12zGOGLJc8` |
| 2025-11-20 | Speak Faith | `-RzhuM5lPBE` |

All attributed to **Prophet Promise**. Speaker name is taken from the official title convention `Sermon | <Title> | Prophet Promise`.

### 7.3 Recent verified services (real titles, real dates, real durations)

| Date | Title | Video | Duration |
|------|-------|-------|----------|
| 2026-10-04 | Sunday Live Service \| 04 October 2026 \| VOBI Ministries | `zS8NL8NMNlQ` | 6h31m |
| 2026-09-27 | Sunday Live Service \| 27 September 2026 \| VOBI Ministries | `KRoODbK1al8` | 7h24m |
| 2026-09-20 | Mercy Land Sunday Service 09/20/26 \| VOBI Ministries | `MdM0beIv8Ok` | 30m (highlights cut) |
| 2026-09-07 | Sunday Service \| 06 September 2026 \| VOBI Ministries | `RQYNQSq-tFU` | 3h14m |
| 2026-08-16 | Sunday Live Service \| 16 August 2026 \| Vobi Ministries | `7PQllxO7OWQ` | 7h30m |
| 2026-06-18 | There's a Spirit Behind! Healing Big Sunday Mass Prayer | `u-fmfu7Kov0` | 11m |
| 2025-06-01 | Live from Victoria Falls, Zimbabwe – VOBI Sunday Service with Prophet Promise | `GiScarDvZec` | 9h34m |

### 7.4 Testimonies (real, published by VOBI — usable in the Testimonies section)

| Title | Video |
|-------|-------|
| He Almost Walked Out… Until This Happened! \| Testimony \| VOBI Ministries | `RyeE1nU4_Fw` |
| Miraculous Healing From Graves' Disease \| Healing Testimony \| Prophet Promise | `j_v5biVaiXI` |
| From Stagnation to Promotion \| Testimony | `rq5c5VmX_6o` |
| Academic and Job Breakthrough \| Testimony | `wtGVNe2VVkQ` |
| This is how God blessed me with two Cars \| Testimony | `It-rck1txVQ` |
| Tonsillitis Now A Thing Of The Past \| Healing Testimony | `JEPx1WH3scc` |
| A Father's Faith Turns Son's Academic Journey Around | `z9tib6RxGqA` |
| Job Breakthrough Testimony | `VdifUDsVwJk` |

> The brief forbids generating testimonials. These are **VOBI's own published testimony videos**, used by linking to them — no quotations, no names, and no claims are written on the site on behalf of any person.

### 7.5 Media available to the site

Real images retrieved and stored under `research/media/` (official YouTube thumbnails, 1280×720):

`zS8NL8NMNlQ`, `GiScarDvZec`, `MIj5Em8soV0`, `u-fmfu7Kov0`, `MdM0beIv8Ok`, `RQYNQSq-tFU`, `7PQllxO7OWQ`, `KRoODbK1al8`, `yBesC26mSSA`, `i9S_xErFgiM`, `eZEP0xzN310`, `tfTPnpbrqpk`, `9iV-U9pxUvs`, `zE2k51mc1B8`, `rcIBB2umX6M`, `5Wfv7CF5gBA`.

These are VOBI's own published thumbnails and are the primary photographic material for the site. **No stock photography of churches, pastors or congregations is used anywhere.**

The hero background video is VOBI's own livestream, loaded from YouTube (muted, looping) with the real thumbnail as poster. Mobile and `prefers-reduced-motion` get the poster image only.

---

## 8. Visual identity — supplied 7 Oct 2026

| Asset | Status |
|-------|--------|
| Official logo file | ✅ **Supplied by VOBI (7 Oct 2026)** — `images/Logo.jpeg`, 994×1183 |
| Background | ⚠️ Source is gold artwork on a **solid black** field; VOBI instruction: *do not use the black background* |
| Derived site assets | ✅ `client/public/brand/logo.png` (640px) and `client/public/brand/logo-mark.png` (256px, square) — black keyed to transparency, artwork cropped to its bounding box, gold re-matted so edges carry no dark fringe |
| Brand colour | ✅ **Sampled from the mark: gold rgb(230,196,83) ≈ `#e6c453`.** Two token depths in `app/globals.css`: `--color-gold-bright` (#e6c453) for ink surfaces, `--color-gold` (#7d5f12) for paper surfaces (contrast-safe) |
| Brand typeface (wordmark) | ⛔ Not separable from the supplied raster mark; display face remains Fraunces |

**Implemented behaviour:** `components/ui/Logo.tsx` loads `/brand/logo-mark.png` (compact) or `/brand/logo.png` (with lockup) and never draws, generates or substitutes a mark. If a file fails to load it falls back to a typographic `VOBI` lockup. The same transparent artwork is used on light and dark surfaces, so no black plate is ever painted behind it.

Assets already captured from VOBI's public presence (kept for reference, not yet approved as the site mark):

- `research/yt_avatar.jpg` — YouTube channel profile image (1000×1000). Colour analysis shows this is a **group photograph**, not a logo.
- `research/fbbanner.jpg` — Facebook page image (720×900). Colour analysis shows a **poster/flyer with a circular emblem**, not a clean mark.
- `research/yt_banner.jpg` — YouTube channel banner (1060×596), photographic.

None of these are suitable as a scalable logo; the file VOBI supplied on 7 Oct 2026 is used instead.

---

## 9. History

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Ministry content publicly dated to **8 May 2016** | ✅ Verified | Video `SUNDAY 8 MAY 2016` (S7) |
| Mass Prayer recordings from **21 May 2017** and **27 June 2017** | ✅ Verified | S7 |
| YouTube channel created **7 February 2019** | ✅ Verified | S1 |
| "International Visitor's Experience" series, Feb 2019 | ✅ Verified | S7 |
| Humanitarian documentary, 9 Feb 2019 | ✅ Verified | S7 |
| Facebook review noting reach into Zambia, Botswana, Namibia — **21 Apr 2019** | ✅ Verified (as a visitor review, quoted only as a review) | S6 |
| Facebook review "a living Church lead by … Prophet Promise" — **16 Dec 2022** | ✅ Verified (same caveat) | S6 |
| Crossover/Candle Light services 2023→24, 2024→25, 2025→26 | ✅ Verified | S7 |
| "Night of Exodus" crossover naming, 2025→26 | ✅ Verified | S7 |
| 882 videos published; 9,516 Facebook followers | ✅ Verified (Oct 2026) | S1, S3 |

**There is no verified founding date, founder story, or building history.**

> **UI rule:** the homepage does **not** show a fake timeline. It shows a compact, honest "Our Story" block built from the verified dates above, and links to `/about/story` where the full verified chronology is presented. No founding year is displayed.

---

## 10. Data confidence summary

**Publishable now (verified):**
ministry name · short name · leader name/title · city · province · address (listing) · phone (listing) · Facebook · YouTube · Instagram · TikTok · sermon titles + dates · service titles + dates · testimony video titles · humanitarian + outreach activity · crossover/annual gatherings · ministries listed in §5 · verified VOBI phrases in §1.

**Supplied directly by VOBI (7 Oct 2026):**
logo file · brand colour (sampled gold) · service time (Sunday 08:30, closing "when the Holy Spirit gives a signal") · email `prophetpromise1@gmail.com` · prayer line `+263 713 901 112`.

**Blocked, must come from VOBI leadership (rendered as `CONTENT NEEDED — VOBI` in code, never shown to visitors):**
brand type · official tagline · weekly schedule · founder story/founding date · leadership biography · WhatsApp number · giving/banking details · approved photography beyond published thumbnails · approved statements of faith / mission · approved testimonial quotes with names · parking, accessibility and children's information for Plan Your Visit · which ministries are official.

---

## 11. Production (Vercel) — 7 Oct 2026

- **Project** `vobi-ministries` under team `box-arena` (id `prj_8yLhmkSruMBUzufBpEWHdB6eErlv`), GitHub-linked to `goldenboymoyo-gif/VOBI-Ministries`, `rootDirectory: client`, framework nextjs, hobby plan.
- **Live URL:** `https://vobi-ministries-two.vercel.app` (canonical production alias). The plain name `vobi-ministries.vercel.app` is taken in the global Vercel namespace (owned by a third party) — that is why the project's import alias is `-two`.
- **Deployment flow:** `vercel link` is committed at the repo **root** (`.vercel`), and deploys must run from the repo root (Vercel then builds `client/`). Deploy from inside `client/` fails because `rootDirectory: client` is already set.
- **Design rules (user mandate, 7 Oct 2026):** ministries-grade layout modelled on SCOAN *structure only*; real VOBI media; centred nav HOME–ABOUT–MINISTRIES–SERMONS–LIVE–EVENTS–PRAYER with WATCH LIVE + PLAN YOUR VISIT actions; hero is real service video (dark overlay, tagline "Because of Christ, we are saved."); 12-section homepage; two-font system; gold/black/white palette from the logo; cinematic-only animation; no AI-pattern design (no giant overlapping type, no abstract gradients, no fake stats/testimonials).
- **Forms backend (deferred by user):** the Next.js `/api/contact` + `/api/prayer` routes proxy to the Express `server/`, which Vercel does not host — so POSTs return 404 in production. Accepted state. Options on record for later: (a) host `server/` on Render/Railway and set `VOBI_API_URL` env on Vercel; (b) rewrite `/api/*` to Vercel Blob/KV for submission storage; (c) mailto fallback to `prophetpromise1@gmail.com`.
