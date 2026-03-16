# Football Archive — Functional Requirements

This document describes the functional requirements of the Football Archive module.

---

## Table of Contents

1. [Data Model](#data-model)
2. [Competition Management](#competition-management)
3. [Edition Management](#edition-management)
4. [Phase Management](#phase-management)
5. [Group Management](#group-management)
6. [Team Management](#team-management)
7. [Match Management](#match-management)
8. [Standings](#standings)
9. [Roles & Permissions](#roles--permissions)
10. [Audit Trail](#audit-trail)

---

## Data Model

The football archive is structured as a hierarchy:

```
Competition
└── Edition (season)
    ├── Teams
    ├── Phase (optional; ordered)
    │   └── Group (optional; within GROUP-type phases)
    │       └── Matches
    └── Matches (when no phase assigned)
```

**Core entities:**

| Entity | Description |
|---|---|
| **Competition** | A tournament or league (e.g., "Serie A") |
| **Edition** | A specific season or instance of a competition (e.g., "2023/24") |
| **Phase** | An optional stage within an edition (e.g., Group Stage, Quarter-Finals) |
| **Group** | A subdivision within a GROUP-type phase (e.g., "Group A") |
| **Team** | A football team; global and reusable across competitions |
| **Match** | A single match between two teams, with optional score, round, date, and stadium |

---

## Competition Management

- Competitions have a **name**, **country**, and **type** (`LEAGUE`, `CUP`, or `FRIENDLY`)
- Any authenticated user can create or update a competition
- Competitions cannot be deleted

---

## Edition Management

An **edition** represents a specific season or instance of a competition.

- Editions have a **name** and optional configuration: `maxParticipants` and `competitionFormat` (`LEAGUE` or `COMPOSTA`)
- Any authenticated user can create or update an edition
- Deleting an edition permanently removes all associated teams, phases, groups, and matches; the user is warned before confirming

---

## Phase Management

A **phase** is an optional, ordered stage within an edition.

**Phase types:**
- **GROUP** — Round-robin group stage
- **KNOCKOUT** — Elimination bracket

**Rules:**
- Phases have a name, a type, and an explicit order within the edition
- GROUP phases may define a `participantsCount`; the expected total number of matches is derived automatically (`participantsCount × 2 − 2`, round-robin formula)
- Deleting a phase permanently removes all groups and matches within it
- Only **ADMIN or EDITOR** users can create, update, or delete phases

---

## Group Management

A **group** is a named subdivision within a GROUP-type phase.

- Groups can only exist inside GROUP-type phases
- Deleting a group permanently removes all matches assigned to it
- Only **ADMIN or EDITOR** users can create, update, or delete groups

---

## Team Management

Teams are **global** — they exist independently of any competition and can participate in multiple editions.

- Teams have a **name** and a **city**
- When creating a team, it can optionally be linked to an edition immediately
- Teams can be viewed as a global list or filtered to those participating in a specific edition
- Deleting a team permanently removes all matches in which it participated; the user is warned before confirming
- Only **ADMIN or EDITOR** users can update or delete teams; any authenticated user can create a team

---

## Match Management

### Creating matches

- A match requires: two teams (home and away), a round identifier, a date, and an edition
- Phase and group assignment are optional
- Stadium is optional
- Scores (home goals, away goals) are optional at creation time — a match can be recorded before it is played
- Matches can be created **one at a time** or **in bulk** for an entire matchday: the bulk builder allows pairing teams interactively and submitting all matches at once

### Editing matches

- Scores, round, date, and phase/group assignment can be updated after creation
- Any authenticated user can create, update, or delete matches

### Constraints

- Within a single round, a team cannot appear in more than one match
- If a phase defines a maximum number of matches per round, no further matches can be added to that round once the limit is reached

### Filtering and sorting

- Matches can be filtered by edition, phase, group, round, or team
- Matches can be sorted by round or by date

---

## Standings

- Standings are computed from recorded match results for a given edition
- Only matches with **both scores recorded** are included
- Scoring: **Win = 3 pts**, **Draw = 1 pt each**, **Loss = 0 pts**
- Standings can be filtered by a **round interval** (e.g., rounds 3–10 only)
- Standings can be scoped to a specific **phase** and/or **group**

**Tiebreaker order:**
1. Points (descending)
2. Goal Difference (descending)
3. Goals For (descending)
4. Team Name (ascending, alphabetical)

**Displayed columns:** Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points.

---

## Roles & Permissions

| Operation | Any Authenticated User | ADMIN / EDITOR |
|---|:---:|:---:|
| Read all data | ✓ | ✓ |
| Create / update competitions | ✓ | ✓ |
| Create / update editions | ✓ | ✓ |
| Create team | ✓ | ✓ |
| Create / update / delete matches | ✓ | ✓ |
| Update / delete teams | — | ✓ |
| Create / update / delete phases | — | ✓ |
| Create / update / delete groups | — | ✓ |

Unauthenticated users cannot access the football archive.

---

## Audit Trail

All write operations (create, update, delete) on every entity are recorded in an audit log, capturing the action type and the user who performed it.
