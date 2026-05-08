# EU Retailers To Ireland

Checked on `2026-05-06`.

Use this file when the user is sourcing PC parts for delivery to Ireland from EU retailers.

## Interpretation Rules

- `Direct`: retailer explicitly says it ships to Ireland.
- `Conditional`: retailer ships broadly, but Ireland may be blocked for some items or need item-level checking.
- `Indirect`: retailer does not directly ship to Ireland for normal checkout, but may allow store pickup or freight-forwarder collection.
- `Unclear`: public help pages were not explicit enough; do not claim more than the source supports.

## Germany

### Caseking

- Status: `Direct`
- Why: official shipping table explicitly lists Ireland delivery options.
- Use for: GPUs, cases, PSUs, enthusiast components, niche parts.

Sources:

- https://www.caseking.de/en/ckShippingcosts
- https://help.caseking.de/hc/en-gb/articles/360020052197-Shipping-Costs-for-Deliveries-Abroad

### ALTERNATE Germany

- Status: `Direct, but quote-oriented`
- Why: official Europe-wide ordering page lists `Irland` and asks foreign customers to contact them for shipping / VAT handling.
- Use for: boards, memory, storage, mainstream components when pricing is strong.

Source:

- https://www.alternate.de/HILFE/Bestellm%C3%B6glichkeiten/Europaweit-bestellen

### notebooksbilliger.de

- Status: `Direct`
- Why: shipping info places Ireland in EU `Zone 3`.
- Use for: laptops, monitors, mainstream components when available.

Sources:

- https://service.notebooksbilliger.de/help/de-de/3-versand-lieferung/51-welche-versandoptionen-gibt-es
- https://www.notebooksbilliger.de/infocenter/versandkosten

### JACOB.de

- Status: `Direct`
- Why: official shipping page explicitly lists `Ireland`.
- Use for: business-style components, storage, peripherals, occasionally boards or RAM.

Source:

- https://www.jacob.de/versandkosten.html

## France

### LDLC

- Status: `Direct`
- Why: official help pages state they deliver throughout Europe; the main site also exposes an international storefront.
- Use for: boards, RAM, storage, cases, complete parts baskets when pricing is competitive.

Sources:

- https://www.ldlc.com/en/help/23-international-delivery/
- https://www.ldlc.com/aide/23-livraison-a-l-international/
- https://www.ldlc.com/en/help/21-shipping-costs/

### Materiel.net

- Status: `Unclear / not preferred for Ireland`
- Why: public help strongly documents France, Belgium, and broader world shipping via Chronopost, but the indexed support pages did not explicitly confirm standard Ireland checkout.
- Use for: only after checkout simulation or direct confirmation.

Sources:

- https://www.materiel.net/faq-informations/r65-acheter-chez-materiel-net/
- https://www.materiel.net/faq-informations/q123-chronopost/

## Czechia

### Alza

- Status: `Promising / checkout-test required`
- Why: Alza is one of the strongest PC and electronics retailers in the region with a broad EU footprint, but the public delivery pages I checked were not as explicit about standard Ireland checkout as German and French sources.
- Use for: boards, GPUs, RAM, storage, and general price comparison when Germany and France are weak.

Sources:

- https://www.alza.cz/en/default.aspx
- https://www.alza.cz/help/delivery/
- https://cdn.alza.cz/Foto/LegendFoto/EN/pdf/alza-2021/vyrocni_brozura_alza_2021_en.pdf

### CZC

- Status: `Not preferred`
- Why: public material was much more Czech-domestic and did not provide convincing Ireland-shipping evidence.
- Use for: generally skip unless a very specific item makes it worth manual checking.

Sources:

- https://czc.cz/sluzby-en-us/clanek
- https://czc.cz/

## Poland

### x-kom

- Status: `Promising / checkout-test required`
- Why: strong enthusiast reputation and strong local PC culture, but I did not get a clean public shipping-to-Ireland confirmation from the sources checked.
- Use for: RAM, GPUs, and boards when pricing is unusually strong.

Sources:

- https://www.x-kom.pl/
- https://lp.x-kom.pl/a/static/regulaminy/regulamin_x-kom_2025_03_01.pdf

### Morele

- Status: `Promising / checkout-test required`
- Why: strong local PC-builder ecosystem, but public shipping evidence for Ireland was weak in the sources checked.
- Use for: price comparison and occasional opportunistic buys only after verifying Ireland delivery.

Source:

- https://www.morele.net/

## Practical Ranking For Ireland

When building a real buying plan for Ireland, prefer this order unless current pricing or stock strongly disagrees:

1. `Germany`: Caseking, ALTERNATE, notebooksbilliger, JACOB
2. `France`: LDLC
3. `Czechia`: Alza
4. `Poland`: x-kom, Morele

## Reporting Guidance

When recommending these retailers:

- say whether the shipping status is `Direct`, `Conditional`, or `Indirect`
- mention if the claim comes from a general shipping page or a specific product page
- call out when the user would need a freight forwarder or store pickup workaround
