---
name: rig-shopping
description: Use when comparing, sourcing, and staging parts for a PC or workstation build across mixed retailers, especially when balancing new vs used parts, future upgrades, slot layout, power budget, delivery constraints, and real current pricing.
---

# Rig Shopping

Use this skill when the task is to shop for a build, not merely explain hardware in the abstract.

If the shopping region includes Ireland or other smaller EU destinations, read `references/eu-retailers-to-ireland.md` before recommending cross-border sources.

## Goals

- Build a buyable parts plan from live listings, not idealized MSRP.
- Separate `buy now` parts from `defer` parts when staged buying is smarter.
- Prefer platform decisions that avoid rebuying expensive foundation parts later.
- Validate electrical, physical, and platform constraints before optimizing price.

## Workflow

1. Restate the build goal in concrete terms.
2. Lock the platform constraints first.
3. Find current buyable parts and current prices.
4. Split the plan into `buy now`, `reuse`, and `buy later`.
5. Validate the full path, not just the immediate cart.
6. Summarize tradeoffs and unresolved risks.

## Step 1: Restate The Goal

Translate vague intent into explicit constraints such as:

- target workload
- GPU count now vs later
- VRAM target
- CPU platform
- power/noise tolerance
- country and shipping constraints
- preference for new vs used
- hard budget vs soft budget

If the user is clearly staging purchases, treat that as a first-class design constraint.

## Step 2: Lock Platform Constraints First

Before comparing deals, determine:

- required PCIe slot layout
- realistic lane layout on the target CPU platform
- PSU floor for the final intended build, not just phase 1
- cooler and RAM height interactions
- storage slot conflicts with GPU lanes
- likely case clearance issues

Do not recommend a cheaper motherboard or PSU if it will obviously be replaced later.

## Step 3: Source Live Parts

Use live retailer data when available. Treat prices, availability, shipping, and seller quality as time-sensitive.

For each part, capture:

- exact model
- condition: new, used, refurbished
- delivered price if possible
- seller quality or retailer trust level
- key fit details that matter for the build

When used parts are in scope, compare them directly to current new-market pricing and quantify the savings.

For cross-border EU shopping:

- do not assume a retailer ships to Ireland just because it is in the EU
- prefer official shipping/help pages over forum answers or affiliate blogs
- distinguish between:
  - direct shipping to Ireland
  - international shipping with item-level restrictions
  - store pickup only / freight-forwarder required
  - unclear status requiring checkout simulation

## Step 4: Split The Plan

Organize the build into:

- `Buy now`: parts that should be purchased immediately
- `Reuse`: parts already owned
- `Buy later`: parts intentionally deferred

For staged builds, produce both:

- a phase-1 working build
- a final-state build

If a temporary part is being used, say whether it is a harmless bridge or a likely regret purchase.

## Step 5: Validate

Validate from multiple angles:

- official vendor specs for lane layout, slot sharing, power, and memory support
- a build tool such as PCPartPicker when reachable
- physical caveats that automated tools do not fully catch

Important:

- A successful parts-list check is not the same as a full physical-fit guarantee.
- Call out any slot-sharing rules explicitly.
- Distinguish between `no known hard incompatibility` and `fully validated`.

## Step 6: Report

Prefer a shopping-oriented report:

- recommended path
- exact buy-now list
- exact buy-later list
- current totals
- what is validated
- what still needs human judgment

## Heuristics

- Buy the final motherboard once if the second GPU is already part of the plan.
- Buy the final PSU once if the future GPU count is known.
- Avoid paying a premium for RAM or SSDs during obvious price spikes unless the build is blocked without them.
- Low-profile RAM is usually better than tall RGB RAM in dense builds.
- Used GPUs can be excellent value, but only if seller quality and delivery terms are acceptable.
- Search links are acceptable fallback targets when direct retailer product pages are unstable or misleading.
- For Ireland, treat `Germany`, `France`, `Czechia`, and `Poland` as separate sourcing lanes with different shipping behavior; do not lump them together as generic `EU`.

## Output Template

Use this structure when useful:

### Recommendation

One short paragraph with the best current path.

### Buy Now

- part
- model
- price
- source
- why now

### Reuse

- part
- reason

### Buy Later

- part
- target spec
- trigger for buying later

### Validation

- what is confirmed
- what is inferred
- what remains uncertain

### Risks

- physical fit
- lane sharing
- software stack
- seller quality
