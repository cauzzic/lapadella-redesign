# Týdenní menu: platnost, příprava dopředu, kopírování dnů a archiv

## Cíl
Týdenní menu (Po–Pá) bude jeden celek s jedním obdobím OD–DO a přepínačem Zveřejnit. Půjde připravit dopředu, kopírovat jídla mezi dny a vracet se ke starým menu. Veřejný web, ostatní sekce, rezervace, přihlášení a role zůstanou beze změny.

## Ověření současných dat (před migrací)
- Teď existuje jen textový popis období: „ÚTERY OD 13.10.2026 - DO PÁTKU 16.10.2026“. Žádná skutečná data v databázi nejsou.
- 45 jídel (`sekce = 'tydenni'`, všechna aktivní) zatím k žádnému menu nepatří.
- **Před migrací potřebuju tvoje potvrzení skutečné platnosti.** Text tvrdí 13.–16. 10. 2026, ale v pondělním sloupci jsou také jídla. Navrhuju buď:
  - a) OD 12. 10. 2026, DO 16. 10. 2026 (celý týden), nebo
  - b) OD 13. 10. 2026, DO 16. 10. 2026 (podle textu).
- Dokud data nepotvrdíš, nic se nezapíše. Po potvrzení dostane první menu tato data a stav „zveřejněno“, aby web dál ukazoval to, co teď.

## Databázová migrace (jen přidání, nic se nemaže ani nepřejmenovává)

```text
weekly_menus (nová tabulka)       menu_polozky (stávající)
  id                       <----   menu_id  (nové, nepovinné)
  nazev (volitelný)
  plati_od  (date)
  plati_do  (date)
  poznamka
  zverejneno (true/false)
```

1. Nová tabulka `tydenni_menu`: `id`, `nazev`, `plati_od date`, `plati_do date`, `poznamka`, `zverejneno boolean default false`, `created_at`, `updated_at`.
   - Kontrola, že `plati_do >= plati_od`.
   - Oprávnění stejná jako u položek menu: číst může každý, ale jen zveřejněná menu; personál (owner/admin) vidí a upravuje vše.
2. Do `menu_polozky` přibude nepovinný sloupec `menu_id` s odkazem na nové menu.
   - Ostatní sekce (Menu, Nápoje, Speciální) ho mít nebudou a nic se pro ně nezmění.
   - Při smazání menu se jídla nesmažou (`ON DELETE SET NULL`). Mazání menu ale v administraci stejně nenabídnu.
3. Po potvrzení dat: založí se první menu a všech 45 jídel se k němu přiřadí. Jde jen o doplnění `menu_id`, žádná jiná hodnota se nemění.
4. Stávající text `tydenni_obdobi` zůstane uložený a na webu se dál ukazuje nad seznamem. Přejde z něj do poznámky / názvu prvního menu jen se souhlasem.

## Platnost a časové pásmo
- Data se ukládají jako čisté kalendářní dny (bez času), takže se při ukládání neposunou.
- „Dnešek“ se počítá v pásmu Europe/Prague (`Intl.DateTimeFormat` s `timeZone: 'Europe/Prague'`), ne podle času v zařízení návštěvníka.
- Menu je platné, když je zveřejněné a zároveň platí `plati_od <= dnes <= plati_do`. První i poslední den se tak zobrazuje celý, od půlnoci do půlnoci pražského času.
- Budoucí zveřejněné menu se začne ukazovat samo v den OD. Není k tomu potřeba žádná naplánovaná úloha.
- Když žádné platné menu není, web zobrazí: „Týdenní menu momentálně není dostupné. Nové menu pro vás právě připravujeme.“ Jídla zapsaná přímo v kódu se jako náhrada už nezobrazí.

## Překrývání více zveřejněných menu (riziko)
- Kdyby dvě zveřejněná menu platila ve stejný den, nebylo by jasné, které ukázat.
- Ochrana v databázi: kontrola při ukládání nedovolí zveřejnit menu, jehož období se překrývá s jiným zveřejněným menu. Administrace zobrazí srozumitelnou hlášku, které menu koliduje.
- Nezveřejněná menu (koncepty, archiv) se překrývat smí.
- Pojistka i na webu: kdyby přesto vznikl konflikt, zobrazí se menu s nejpozdějším datem OD.

## Administrace (záložka Týdenní menu, ve stávajícím stylu)
- **Seznam menu** se stavem: Aktuální / Naplánované / Koncept / Archiv (prošlé), s daty a počtem jídel. Tlačítko „+ Nové menu“.
- **Detail menu**: karta s polem Název (volitelný), Platí od *, Platí do *, Poznámka a přepínačem Zveřejnit. Pod ní karty Po–Pá, každá s částmi Polévka / Hlavní jídla, tlačítky „+ Polévka“, „+ Hlavní jídlo“ a „Kopírovat den…“.
- Úprava jednotlivého jídla zůstane ve stávajícím formuláři (název, popis, cena, alergeny, pořadí, aktivní).
- **Kopírovat den**: vybereš zdrojový den a cílové dny (zaškrtávací políčka, rychlá volba „Út–Pá“).
  - Když cíl už obsahuje aktivní jídla, ukáže se potvrzení se seznamem dotčených dnů a tlačítky „Nahradit“ a „Zrušit“.
  - Při nahrazení se stávající jídla cíle **deaktivují** (`aktivni = false`, nic se nemaže) a vloží se nové nezávislé kopie: název, popis, cena, alergeny, obrázek, pořadí a typ (polévka / hlavní).
  - Opakované kopírování vytvoří vždy jen jednu aktivní sadu, takže nevzniknou duplicity. Zdrojový den se nemění.
- **Archiv / znovupoužití**: u starého menu tlačítko „Použít jako nové“. Vytvoří nový koncept (nezveřejněný, bez dat) s kopií jeho aktivních jídel. Původní menu zůstane beze změny.
- Deaktivovaná jídla se v detailu dají zobrazit přepínačem „Zobrazit neaktivní“.

## Veřejná stránka /tydenni-menu
- Stejný vzhled. Data se berou jen z aktuálně platného menu (jeho aktivní jídla), rozdělená po dnech na Polévku a Hlavní jídla jako teď.
- Poznámka menu (pokud je vyplněná) se ukáže na místě dnešního textu období.
- Ostatní stránky, navigace, rezervace a mobilní zobrazení se nemění.

## Technické detaily
- Soubory: `src/routes/admin.tsx` (záložka tydenni → nové komponenty `WeeklyMenuAdmin`, `WeeklyMenuEditor`, `CopyDayDialog` v `src/components/site/`), `src/hooks/useSectionGroups.ts` (`useWeeklyDayGroups` filtruje podle `menu_id` platného menu), nový `src/hooks/useCurrentWeeklyMenu.ts`, `src/lib/pragueDate.ts` (dnešní datum v Praze), `src/routes/tydenni-menu.tsx`, `src/data/weekly.ts` (záložní jídla se přestanou používat).
- Migrace: CREATE TABLE + GRANT (SELECT pro anon/authenticated, zápis pro authenticated přes RLS `is_staff`), RLS, trigger `updated_at`, validační trigger proti překryvu zveřejněných menu, `ALTER TABLE menu_polozky ADD COLUMN menu_id uuid NULL REFERENCES ... ON DELETE SET NULL`, index na `menu_id`.
- Přiřazení 45 jídel proběhne samostatnou datovou úpravou až po potvrzení dat.
- Testy: Pražské datum (hranice půlnoci, první a poslední den platnosti zahrnuty, den po DO vyloučen) a výběr menu při překryvu.

## Potřebuji od tebe
1. Potvrdit platnost prvního menu: 12.–16. 10. nebo 13.–16. 10. 2026 (nebo jiná data).
2. Souhlas s tím, že veřejná stránka po zavedení přestane zobrazovat záložní jídla z kódu a místo nich ukáže informační text.
