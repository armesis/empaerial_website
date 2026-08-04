# Atmospheric Project Detail Implementation

## Goal

Implement the atmospheric project detail experience on `/projects/[slug]` using the existing data-driven project model, while extending that model only where needed for dossier metadata, curated hero media, navigation labels, and cinematic media intervals.

This breakdown follows tracer-bullet vertical slices so separate agents can ship each piece end-to-end.

## Phase Plan

### Phase 1: Authoring and data foundation

1. Add structured project metadata and atmospheric authoring fields
2. Add admin support for dossier labels, curated hero media, and media-interval sections

### Phase 2: Atmospheric renderer foundation

3. Replace the current detail-page hero with the atmospheric dossier hero
4. Add dossier rail navigation with active-section tracking

### Phase 3: Cinematic media and section behavior

5. Add atmospheric section renderers and media-interval transitions

### Phase 4: Responsive adaptation and polish

6. Adapt dossier, overlays, and media intervals for mobile
7. Polish fallback states, translations, and final contact flow

## Proposed Issues

### 1. Add structured project metadata and atmospheric authoring fields

- Type: `AFK`
- Blocked by: None
- Why this is a slice:
  The project editor, project API, and stored project records gain the new authoring surface needed for the redesign without yet changing the public route layout.

Summary:
- Extend project records with optional top-level metadata fields: `status`, `year`, `purpose`
- Extend section authoring with explicit `navLabel`
- Add curated hero media selection support
- Define `media-interval` as a valid section type with media and caption fields

Acceptance criteria:
- Admin can edit `status`, `year`, and `purpose`
- Admin can set a `navLabel` for every rendered section
- Admin can choose a curated hero asset independent of ordinary section ordering
- API persists and returns the new fields without breaking existing projects

### 2. Add admin support for dossier labels, curated hero media, and media-interval sections

- Type: `AFK`
- Blocked by: #1
- Why this is a slice:
  The new authoring model becomes usable for real projects, including the exact fields needed for the redesigned page and future project setup.

Summary:
- Update the project editor UI to expose the new metadata fields clearly
- Add authoring controls for `media-interval` sections
- Add label/subline fields for interval captions
- Keep current section ordering workflow intact

Acceptance criteria:
- Admin can create, edit, reorder, and remove `media-interval` sections
- Admin can set distinct rail labels and body headings
- Admin flow remains understandable for the current two projects without manual JSON edits
- Existing section types still work after the editor changes

### 3. Replace the current detail-page hero with the atmospheric dossier hero

- Type: `AFK`
- Blocked by: #1
- Why this is a slice:
  The public route visibly shifts into the new atmospheric language through the hero alone, while still using live project data and preserving header/footer.

Summary:
- Rebuild the detail-page hero to use the curated hero asset
- Support both image and video heroes
- Integrate dossier metadata, translated status display, and atmospheric back navigation
- Preserve existing `name` and `summary` as the hero title/subtitle source

Acceptance criteria:
- `/projects/[slug]` renders the existing site header and footer with a redesigned atmospheric hero between them
- Hero can display either image or muted autoplay video
- Dossier metadata rows render `-` for missing values
- Back navigation is integrated into the atmospheric design rather than using the current generic button

### 4. Add dossier rail navigation with active-section tracking

- Type: `AFK`
- Blocked by: #2, #3
- Why this is a slice:
  The page gains its core navigational behavior and dossier identity without depending on later cinematic interval work.

Summary:
- Generate stable section anchors from rendered sections plus final contact block
- Render a sticky left dossier rail on desktop
- Make every rail item clickable
- Track and highlight the active section using browser APIs

Acceptance criteria:
- Rail includes all rendered sections in order plus the final contact block
- Section labels use explicit `navLabel` when present and sensible fallback otherwise
- Active section highlight updates while scrolling
- Page remains usable when projects have incomplete content

### 5. Add atmospheric section renderers and media-interval transitions

- Type: `AFK`
- Blocked by: #2, #4
- Why this is a slice:
  This is the first full atmospheric body pass: ordinary content sections render in the new visual system and cinematic video intervals can appear between them.

Summary:
- Replace current block-card rendering with prototype-faithful atmospheric section treatments
- Keep admin-controlled order
- Add `media-interval` rendering with muted autoplay on desktop
- Support optional label + short subline overlays for interval captions
- Keep ordinary `videos` sections available as explicit content sections

Acceptance criteria:
- Existing section types render in the new atmospheric body style
- `media-interval` sections render between content sections and appear in the rail
- Interval videos autoplay muted on desktop with graceful fallback
- Missing-content states use designed in-tone placeholders instead of generic copy

### 6. Adapt dossier, overlays, and media intervals for mobile

- Type: `AFK`
- Blocked by: #4, #5
- Why this is a slice:
  The redesigned route becomes intentionally usable on mobile rather than being a compressed desktop artifact.

Summary:
- Convert desktop dossier rail into a compact mobile navigation system
- Replace desktop overlay interactions with cleaner mobile presentations
- Adapt interval media into simpler inline cinematic blocks on mobile

Acceptance criteria:
- Mobile uses compact horizontal indicators or equivalent compact dossier navigation
- Callout overlays degrade into readable non-overlay mobile presentations
- Media intervals remain atmospheric on mobile without relying on desktop-style background autoplay behavior
- The route is usable and visually coherent on narrow screens

### 7. Polish fallback states, translations, and final contact flow

- Type: `AFK`
- Blocked by: #3, #4, #5, #6
- Why this is a slice:
  This closes the route as a production-ready experience by addressing tone, localization, and end-of-page behavior.

Summary:
- Translate fixed atmospheric UI strings and controlled status labels
- Ensure the final contact block is fixed as the page terminus and appears in the rail
- Refine placeholder copy, empty states, and section simplifications
- Verify compatibility with incomplete project data

Acceptance criteria:
- Fixed UI strings continue to respect the existing language selection behavior
- Final contact block always renders last and is navigable from the rail
- Empty or partial projects degrade gracefully without breaking page rhythm
- The route is ready for manual content entry on the current two projects

