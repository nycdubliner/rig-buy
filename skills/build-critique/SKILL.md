---
name: build-critique
description: Use when reviewing a proposed PC or workstation build skeptically to find weak assumptions, hidden costs, bad value, compatibility gaps, upgrade traps, thermals issues, lane-sharing problems, and better alternatives.
---

# Build Critique

Use this skill to review a build as a skeptical engineer, not as a salesperson.

## Review Standard

The default posture is:

- assume the build may contain hidden mistakes
- prefer concrete objections over vague praise
- separate hard incompatibilities from softer value critiques
- challenge expensive foundation choices unless they clearly prevent a future rebuy

## Review Order

1. Hard compatibility risks
2. Physical and thermal risks
3. Upgrade-path traps
4. Power and cooling adequacy
5. Price and value problems
6. Missing parts or hidden costs
7. Better alternatives

## Hard Compatibility Risks

Check for:

- socket and chipset mismatch
- unsupported memory generation
- PCIe lane assumptions that are too optimistic
- storage slots that disable or reduce GPU slots
- PSU connector mismatch
- BIOS generation issues when relevant

Say explicitly whether a problem is:

- confirmed
- likely
- possible but unverified

## Physical And Thermal Risks

Check for:

- GPU thickness and slot count
- GPU length
- RAM height vs cooler clearance
- passive-card airflow assumptions
- board spacing that looks correct electrically but awkward physically

If the case is unknown, say which questions remain blocked by the missing case choice.

## Upgrade-Path Traps

Be suspicious of:

- phase-1 parts that will be replaced in phase 2
- boards that technically work now but fail the final design
- too-small PSUs bought for temporary savings
- RAM kits that will create awkward mixed-memory upgrades later

Reward decisions that avoid rebuying expensive platform parts.

## Power And Cooling

Check whether:

- the PSU is sized for the final intended configuration
- transient headroom is sensible
- included CPU cooling is good enough for the actual CPU choice
- the final thermals depend on unrealistic airflow assumptions

## Price And Value

Critique value, not just compatibility.

Ask:

- Is this part overpriced relative to nearby alternatives?
- Is the premium buying something real?
- Is used clearly better value here?
- Is a temporary part cheap enough to justify itself?

Quantify the criticism where possible.

## Missing Parts Or Hidden Costs

Look for:

- omitted storage
- omitted cooling
- motherboard features that force pricier follow-on parts
- international shipping costs
- taxes or delivery differences
- adapter or cable requirements

## Better Alternatives

When proposing an alternative:

- explain what problem it fixes
- state what it costs in return
- keep the alternative close to the original goal

Do not replace the build with a completely different philosophy unless the original plan is fundamentally unsound.

## Output Format

Start with findings, ordered by severity.

Use:

- `Critical`: build-breaking or clearly wrong
- `Important`: likely regret, upgrade trap, or serious value issue
- `Minor`: optimizations or residual uncertainty

Then provide:

- open questions
- concise verdict

## Example Verdict Language

- `Technically sound, but overpriced in the motherboard and RAM choices.`
- `Works for phase 1, but creates a bad phase-2 upgrade trap.`
- `Correct platform direction; remaining risk is physical GPU fit, not electrical compatibility.`
