import type { MenuSection } from "@/data/menu";

export const SPECIAL_NOTE =
  "Sezónní speciality našeho šéfkuchaře – omezená nabídka, dostupná do vyprodání zásob. Suroviny vybíráme podle sezóny a dovážíme přímo z Itálie.";

export const SPECIAL_MENU: MenuSection[] = [
  {
    id: "sefkuchar",
    title: "Speciality šéfkuchaře",
    items: [
      {
        name: "Tagliatelle al tartufo nero",
        desc: "domácí tagliatelle, černý lanýž, smetana, Grana Padano",
        price: "365 Kč",
      },
      {
        name: "Bistecca alla fiorentina (600 g)",
        desc: "steak na kosti, rozmarýn, pečený česnek, grilovaná zelenina",
        price: "690 Kč",
      },
      {
        name: "Branzino al sale",
        desc: "morčák pečený v solné krustě, citron, olivový olej, brambory",
        price: "445 Kč",
      },
    ],
  },
  {
    id: "sezonni",
    title: "Sezónní nabídka",
    items: [
      {
        name: "Risotto ai porcini",
        desc: "rizoto s hříbky, pecorino, petrželová emulze",
        price: "295 Kč",
      },
      {
        name: "Pizza Tartufo e burrata",
        desc: "smetanový základ, lanýžová pasta, burrata, rukola",
        price: "329 Kč",
      },
      {
        name: "Carpaccio di manzo",
        desc: "tenké plátky svíčkové, rukola, hoblinky parmazánu, kapary",
        price: "265 Kč",
      },
    ],
  },
  {
    id: "degustace",
    title: "Degustační menu",
    items: [
      {
        name: "Menu Napoli – 4 chody",
        desc: "předkrm, pasta, hlavní chod z ryby nebo masa, dezert",
        price: "890 Kč / os.",
      },
      {
        name: "Menu Napoli s vínem",
        desc: "4 chody + párované italské vína (4 × 0,1 l)",
        price: "1 290 Kč / os.",
      },
      {
        name: "Vegetariánské degustační menu",
        desc: "3 chody ze sezónní zeleniny, sýrů a těstovin",
        price: "690 Kč / os.",
      },
    ],
  },
  {
    id: "dezerty-special",
    title: "Speciální dezerty",
    items: [
      { name: "Tiramisu al pistacchio", desc: "pistáciový krém, mascarpone, savoiardi", price: "155 Kč" },
      { name: "Cannoli siciliani", desc: "ricotta, kandované ovoce, hořká čokoláda", price: "145 Kč" },
      { name: "Semifreddo al limone", desc: "citronový polozmrzlý krém, bazalka", price: "139 Kč" },
    ],
  },
];
