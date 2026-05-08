# Archived Build Ideas

These are preserved for reference while the active project focuses on the Dual AMD Maverick.

## 1. The "Sane" NVIDIA Powerhouse
*Target: maximum compatibility, easy dual-GPU expansion, and peak inference speed.*

| Part | Item | Price | Link |
| :--- | :--- | :--- | :--- |
| **GPU** | Dell RTX 3090 24GB Blower | €1,199 | [eBay](https://www.ebay.ie/itm/267654444233) |
| **CPU** | AMD Ryzen 9 9950X | €510 | [Amazon](https://www.amazon.de/-/en/AMD-9950X-Processor-Integrated-Frequency/dp/B0D6NNRBGP/) |
| **MB** | ASUS ProArt X870E-Creator | €418 | [Amazon](https://www.amazon.de/-/en/ASUS-PROART-X870E-Creator-Motherboard-Ethernet/dp/B09KB8GGN1/) |
| **PSU** | Corsair HX1500i (2025) | €257 | [Amazon](https://www.amazon.de/-/en/CORSAIR-HX1500i-Modular-Supply-12V-2x6/dp/B0F3JHTL2R/) |
| **RAM** | G.Skill Flare X5 64GB DDR5-6000 | €211 | [Amazon](https://www.amazon.de/-/en/G-skill-Flaxe-F5-6000j3040g32gx2-fx5-2x32gb-6000mhz/dp/B0CGQ3KS8X/) |
| **SSD** | Samsung 990 Pro 2TB | €171 | [Amazon](https://www.amazon.de/-/en/Samsung-7450MB-Internal-Editing-MZ-V9P2T0BW/dp/B0B9C4DKKG/) |
| **Case** | Fractal Meshify 2 XL | €185 | [Amazon](https://www.amazon.de/-/en/Fractal-Design-Meshify-Black-Window/dp/B08232YMV9/) |
| **Cooler** | Arctic Liquid Freezer III 420 | €85 | [Amazon](https://www.amazon.de/dp/B0DPHQ1353/) |
| **Total** | | **~€3,036** | |

## 2. The "AMD AI Maverick"
*Target: best price-to-VRAM ratio for inference-heavy workloads.*

| Part | Item | Price | Link |
| :--- | :--- | :--- | :--- |
| **GPU** | Sapphire Pulse RX 7900 XTX (24GB) | €919 | [Amazon](https://www.amazon.de/s?k=RX+7900+XTX) |
| **CPU** | AMD Ryzen 9 9950X | €510 | [Amazon](https://www.amazon.de/dp/B0D6NNRBGP/) |
| **MB** | ASRock X670E Steel Legend | €285 | [Amazon](https://www.amazon.de/s?k=X670E+Steel+Legend) |
| **Other** | Baseline Components (RAM/SSD/PSU) | ~€866 | - |
| **Total** | | **~€2,580** | |

`ROCm 6.x` would be required, along with `export HSA_OVERRIDE_GFX_VERSION=11.0.0` for broader tool compatibility.

## 3. The "VRAM King"
*Target: massive context windows and low-noise operation.*

| Part | Item | Price | Link |
| :--- | :--- | :--- | :--- |
| **System** | **Mac Studio M1 Ultra (128GB RAM)** | €2,899 | [eBay](https://www.ebay.ie/itm/117159806871) |
| **Memory** | **128GB Unified (LPDDR5)** | Included | - |
| **Storage** | 1TB SSD | Included | - |
| **Total** | | **~€2,899** | |

## Archived Notes
- The NVIDIA build remained the fastest raw option, but at materially higher cost.
- The Mac option remained attractive for giant context windows, but it is no longer the active direction.
- The single-GPU AMD build was better value than NVIDIA, but the dual-7800 XT approach is the current focus because it maximizes VRAM per euro.
