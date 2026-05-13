# MOCKUPS

## Product Feel

Signal Brief Mobile should feel calm, compact, and professional. This is not a social feed and not a flashy consumer news app. The right tone is closer to a high-signal research brief: clean typography, restrained color, strong hierarchy, and fast scanning.

## Visual Direction

- Primary mood: editorial, focused, technical
- Density: medium, optimized for quick scanning rather than large card-heavy layouts
- Theme: light-first for the first prototype
- Accent color: muted teal or deep blue, used for topic chips, actionable links, and the active state
- Typography direction: clean sans for interface chrome, stronger weight contrast for paper titles and section headers
- Card style: subtle borders, low-radius corners, not oversized shadows
- Motion: minimal; mostly screen transitions and lightweight loading placeholders

## App Structure

- Stack flow for onboarding and paper detail screens
- Bottom tabs after onboarding:
  - Brief
  - Saved
  - Settings

## Screen 1: Splash And Bootstrap

Purpose: quick app start, session bootstrap, fetch local preferences, then route to onboarding or the daily brief.

Wireframe:

```text
+--------------------------------------------------+
|                                                  |
|                 SIGNAL BRIEF                     |
|          Daily AI paper briefing                 |
|                                                  |
|                [loading indicator]               |
|                                                  |
|       Checking preferences and today's brief     |
|                                                  |
+--------------------------------------------------+
```

Notes:

- Keep this screen brief; it should normally disappear quickly.
- If digest fetch fails, route into the brief screen with an empty or retry state rather than trapping the user here.

## Screen 2: Topic Onboarding

Purpose: choose a few AI topics to shape the digest.

Wireframe:

```text
+--------------------------------------------------+
| Skip                                             |
|                                                  |
|  Build your brief                                |
|  Pick a few topics to shape today's papers       |
|                                                  |
|  [LLMs] [Agents] [RAG]                           |
|  [Vision] [Evaluation] [Optimization]            |
|  [Reasoning] [Robotics] [Multimodal]             |
|  [Safety] [Inference] [Fine-tuning]              |
|                                                  |
|  Selected: 3                                     |
|                                                  |
|                          [Continue button]       |
+--------------------------------------------------+
```

Notes:

- Require at least three topics unless user explicitly skips.
- Selected chips should be visibly distinct but still restrained.
- Copy should promise a short brief, not a personalized research platform.

## Screen 3: Daily Brief

Purpose: the core product screen. Show today's top five papers in ranked order with enough summary detail to decide what to open.

Wireframe:

```text
+--------------------------------------------------+
| Brief                         bell   refresh     |
| Today, May 13                                     |
| Topics: LLMs, Evaluation, Inference               |
|                                                  |
|  1. Paper title goes here                        |
|     Topic tags                                   |
|     - Bullet summary line one                    |
|     - Bullet summary line two                    |
|     - Bullet summary line three                  |
|     Save                     Open                |
|                                                  |
|  2. Paper title goes here                        |
|     Topic tags                                   |
|     - Bullet summary line one                    |
|     - Bullet summary line two                    |
|     Save                     Open                |
|                                                  |
|  ...                                             |
|                                                  |
| Tabs:   Brief        Saved        Settings       |
+--------------------------------------------------+
```

Notes:

- Each card should expose the rank, title, topic tags, source date, and 2-3 bullets.
- Open should route to paper detail first, not directly out of the app.
- Refresh is helpful in prototype mode, but its behavior should be explicit to avoid confusion with scheduled digests.

## Screen 4: Paper Detail

Purpose: provide a little more depth before the user leaves for arXiv.

Wireframe:

```text
+--------------------------------------------------+
| Back                                             |
|                                                  |
|  Full paper title                                |
|  Authors                                         |
|  Published date                                  |
|  Tags: LLMs, Evaluation                          |
|                                                  |
|  Why it matters                                  |
|  - Bullet one                                    |
|  - Bullet two                                    |
|  - Bullet three                                  |
|                                                  |
|  Abstract snapshot                               |
|  Short excerpt of normalized abstract text...    |
|                                                  |
|  [Save]                  [Open on arXiv]         |
+--------------------------------------------------+
```

Notes:

- Keep this screen concise; it is a decision point, not a reader view.
- Opening arXiv should use the platform browser.

## Screen 5: Saved Items

Purpose: let the user revisit papers they marked as worth deeper reading.

Wireframe:

```text
+--------------------------------------------------+
| Saved                                            |
| Papers worth revisiting                          |
|                                                  |
|  Saved paper title                               |
|  Tags                  Saved 2h ago              |
|                                                  |
|  Saved paper title                               |
|  Tags                  Saved yesterday           |
|                                                  |
|  [empty state if none]                           |
|  Save papers from the brief to collect           |
|  a short reading list.                           |
|                                                  |
| Tabs:   Brief        Saved        Settings       |
+--------------------------------------------------+
```

Notes:

- Saved items are local-only in the first prototype.
- The empty state matters because many early testers will not save anything on first run.

## Screen 6: Settings

Purpose: manage preferences, notifications, and prototype transparency.

Wireframe:

```text
+--------------------------------------------------+
| Settings                                         |
|                                                  |
|  Topics                                          |
|  LLMs, Evaluation, Inference         [Edit]      |
|                                                  |
|  Notifications                                   |
|  Daily brief ready                     [toggle]  |
|                                                  |
|  Digest info                                     |
|  Source set: arXiv AI categories                 |
|  Daily count: 5 papers                           |
|                                                  |
|  About this prototype                            |
|  Built as a narrow daily AI paper briefing app   |
|                                                  |
| Tabs:   Brief        Saved        Settings       |
+--------------------------------------------------+
```

Notes:

- The prototype note helps set the right expectations for testers.
- Topic editing can reuse the onboarding chip selector.

## Critical Empty And Error States

### No Digest Yet

- Message: "Today's brief is still being prepared. Check back shortly."
- Actions: retry, review saved items

### Digest Fetch Failed

- Message: "We couldn't load today's brief."
- Actions: retry, open settings

### No Saved Items

- Message: "Save papers from the brief to build a short reading list."

## Design Constraints For Frontend Phase

- Keep the first frontend implementation static and mock-data driven.
- Do not add screens beyond the six listed here without reopening scope.
- Avoid a card-heavy social-feed style.
- Avoid dark mode in the first frontend pass unless it comes nearly for free.
- Preserve a serious, professional tone in labels and copy.