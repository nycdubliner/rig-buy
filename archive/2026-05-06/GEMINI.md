# Project: Dual AMD Maverick

## Goal
Order the best version of the Dual AMD Maverick build with a focus on:

- 32GB total GPU VRAM for local inference
- strong dual-slot compatibility
- stable power delivery for two Radeon cards
- parts that can be sourced from `ebay.ie`, `amazon.ie`, and selected German PC parts stores that ship to Ireland
- a staged path that works well with `1 GPU` now and a second matching GPU later

## Buy Now: Phase 1
*Target: buy the final platform once, run on one GPU for now, use a temporary `32GB` EXPO kit, and add the second GPU later.*

| Part | Buy target | Current price | Store |
| :--- | :--- | :--- | :--- |
| **CPU** | [AMD Ryzen 9 7900](https://www.amazon.ie/AMD-Desktop-Processor-12-core-24-thread/dp/B0BMQK718H) | €346.68 | Amazon.ie |
| **MB** | [ASUS ProArt X870E-CREATOR WIFI search](https://www.amazon.ie/s?k=ASUS+ProArt+X870E-CREATOR+WIFI) | €548.62 | Amazon.ie |
| **PSU** | [Corsair RM1000e 1000W](https://www.amazon.ie/Corsair-RM1000e-Modular-Silent-Supply/dp/B0BVKZ9GCB) | €194.46 | Amazon.ie |
| **RAM** | [G.Skill Flare X5 32GB DDR5-6000 CL32 EXPO](https://www.caseking.de/en/g.skill-flare-x5-ddr5-6000-ram-cl32-expo-32-gb-dual-kit-black/MEGS-270.html) | €419.90 | Caseking |
| **GPU option A** | [ACER Nitro RX 7800 XT 16GB OC search](https://www.ebay.ie/sch/i.html?_nkw=ACER+Nitro+RX+7800+XT+16GB+OC) | €465.00 | eBay |
| **GPU option B** | [ASRock Phantom Gaming OC RX 7800 XT 16GB search](https://www.ebay.ie/sch/i.html?_nkw=ASRock+Phantom+Gaming+OC+RX+7800+XT+16GB) | €484.91 | eBay |
| **SSD** | Reuse existing `1TB NVMe` | Owned | Reused |
| **Case** | Deferred by design | - | - |

## Buy Now Outcome
- Cheapest clean phase-1 path is CPU + board + PSU + `32GB` RAM + `1x RX 7800 XT`.
- With the earlier in-session `ACER Nitro` GPU price, that phase-1 total is **~€1,974.66** before Caseking shipping.
- With the earlier in-session `ASRock Phantom Gaming` GPU price, that phase-1 total is **~€1,994.57** before Caseking shipping.
- The second GPU is the only major part intentionally deferred.
- This is the right staging path if the end goal is still dual AMD. It avoids rebuying the motherboard or PSU later.
- Reuse the existing `1TB NVMe` and do not buy storage now.

## PCPartPicker Validation
- Validated on `PCPartPicker Ireland` after clearing Cloudflare in-browser.
- The staged compatibility check used:
  - `AMD Ryzen 9 7900`
  - `Asus ProArt X870E-CREATOR WIFI`
  - `G.Skill Flare X5 32GB (2x16GB) DDR5-6000 CL36`
  - `PowerColor RX7800XT 16G-P Radeon RX 7800 XT 16GB`
  - `Corsair RM1000e (2025) 1000W`
- `PCPartPicker` reported **no hard compatibility errors** for that phase-1 build.
- Reported estimated wattage was **427W**.
- Reported Irish-index total for the validated list was **€910.83** including listed shipping, but that figure is not the shopping plan because `PCPartPicker` had no live prices for the chosen RAM or GPU.
- The only note shown was the standard disclaimer: physical constraints such as RAM clearance with some CPU coolers are not fully checked.

## Current Working Build
*Target: final-state dual-GPU AMD build after phase 1 is already running.*

| Part | Item | Price | Cart |
| :--- | :--- | :--- | :--- |
| **GPU 1** | [ACER Nitro RX 7800 XT 16GB OC search](https://www.ebay.ie/sch/i.html?_nkw=ACER+Nitro+RX+7800+XT+16GB+OC) | €465.00 | eBay |
| **GPU 2** | [ASRock Phantom Gaming OC RX 7800 XT 16GB search](https://www.ebay.ie/sch/i.html?_nkw=ASRock+Phantom+Gaming+OC+RX+7800+XT+16GB) | €484.91 | eBay |
| **CPU** | [AMD Ryzen 9 7900](https://www.amazon.ie/AMD-Desktop-Processor-12-core-24-thread/dp/B0BMQK718H) | €346.68 | Amazon.ie |
| **MB** | [ASUS ProArt X870E-CREATOR WIFI search](https://www.amazon.ie/s?k=ASUS+ProArt+X870E-CREATOR+WIFI) | €548.62 | Amazon.ie |
| **PSU** | [Corsair RM1000e 1000W](https://www.amazon.ie/Corsair-RM1000e-Modular-Silent-Supply/dp/B0BVKZ9GCB) | €194.46 | Amazon.ie |
| **RAM** | [Kingston Fury Beast 64GB DDR5-6000 EXPO datasheet](https://www.kingston.com/datasheets/KF560C36BBE2K2-64.pdf) or [G.Skill Flare X5 family at Caseking](https://www.caseking.de/en/brands/g.skill) | Not bought yet | Source later |
| **SSD** | Reuse existing 1TB NVMe | Owned | Reused |
| **Case** | Deferred by design | - | - |
| **Final-state total** | | **~€2,040 to €2,060 plus final RAM shipping** | |

## Cart Split
- `eBay` is now the GPU cart only.
- `Amazon.ie` is the easiest place to land the CPU, motherboard, and PSU in one go.
- `Caseking` is currently the cleaner clickable target for temporary EXPO RAM than the Irish storefronts.
- `RAM` is a required part again, but the Irish storefront pricing is still inflated enough that a German vendor makes more sense.
- `SSD` is no longer part of the buying list because there is already a reusable `1TB NVMe` on hand.

## Why This Version
- The `Ryzen 9 7900` remains the right CPU for this build: enough cores for local work without pushing power draw up like the `7900X`.
- The motherboard choice is driven by the second GPU. The `ASUS ProArt X870E-CREATOR WIFI` is expensive, but it is the correct AM5 board in this workflow because it supports a proper dual-slot `x8/x8` layout.
- A `1000W` PSU is the sensible floor for the final two-GPU plan, so it is worth buying once rather than stepping through a smaller unit first.
- The local RAM market is still distorted enough that it makes more sense to pick the right EXPO kit family now and wait for sane pricing than to force a bad buy.

## Bandwidth Reality
- Mainstream AM5 does **not** give true `x16/x16` for two GPUs with a `Ryzen 9 7900`.
- The CPU exposes `24` usable PCIe lanes, so the realistic high-end dual-GPU AM5 target is `x8/x8`, not `x16/x16`.
- The `ASUS ProArt X870E-CREATOR WIFI` is therefore the **best available AM5 answer**, not a magic `x16/x16` answer.
- If literal full-bandwidth dual `x16` is mandatory, the platform has to move up to `Threadripper` / workstation-class territory and this stops being a reasonable-value AM5 build.

## Important Board Note
- The `ASUS ProArt X870E-CREATOR WIFI` has `2 x PCIe 5.0 x16` physical slots and supports `x16` or `x8/x8` modes with Ryzen `7000/9000`.
- For these `RX 7800 XT` cards, that means both GPUs can sit on direct CPU lanes in the correct dual-GPU layout, instead of pushing one card down onto a chipset-fed `x4` slot.
- To preserve that `x8/x8` layout, do **not** use the board's `M.2_2` slot. ASUS documents that `M.2_2` shares bandwidth with `PCIEX16(G5)_2`.
- This is the right motherboard correction for the current brief, even though it costs materially more than the earlier ASRock option.

## Memory Recommendation
- Buy `64GB (2x32GB) DDR5-6000` with `AMD EXPO`, ideally `CL30` or `CL32`.
- The current preferred alternative vendor is `Kingston Fury Beast`, specifically the low-profile `KF560C36BBE2K2-64` family: `64GB (2x32GB)`, `DDR5-6000`, `AMD EXPO`, `34.9mm` tall.
- If a better-priced low-profile kit appears first, `G.Skill Flare X5` remains the next-best vendor family for this board and platform.
- For the temporary phase-1 build, the best current clickable target is [G.Skill Flare X5 32GB DDR5-6000 CL32 EXPO at Caseking](https://www.caseking.de/en/g.skill-flare-x5-ddr5-6000-ram-cl32-expo-32-gb-dual-kit-black/MEGS-270.html) at `€419.90` plus shipping.
- The CL30 version exists, but at the last check it was more expensive at `€478.44`, which makes the CL32 kit the more rational temporary buy.

## Validation Status
- `PCPartPicker` is now partially validated for the staged `1 GPU` build after clearing Cloudflare in-browser.
- The key motherboard constraint is validated two ways: `PCPartPicker` accepts the staged platform, and ASUS's own documentation confirms dual main slots at `x8/x8` with a `Ryzen 7000/9000` CPU.
- ASUS also documents that `M.2_2` shares bandwidth with the second GPU slot, so the build remains valid only if that slot is left unused.
- RAM choice was cross-checked against official vendor documentation rather than current storefront noise: Kingston documents `AMD EXPO` support, `64GB` kits, `6000MT/s` support, and a low-profile `34.9mm` heatsink design for the `Fury Beast DDR5` line.

## Storage Note
- Reuse the existing `1TB NVMe` for now.
- When a second NVMe is eventually added, avoid the motherboard's `M.2_2` slot so the second GPU keeps full `x8` bandwidth.

## Open Buying Questions
- Are the two current `RX 7800 XT` cards physically slim enough to coexist cleanly once a final case is chosen?
- Which live RAM listing becomes acceptable first: the target `64GB` kit, or the temporary `32GB` kit at a lower price than the current Caseking option?
- Does the motherboard price settle, or is there a later point where a different dual-GPU-capable AM5 board appears at better value?
