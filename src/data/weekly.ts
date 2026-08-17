export type WeeklyDay = {
  day: string;
  soup: { name: string; price: string };
  mains: { name: string; desc?: string; price: string }[];
};

export const WEEKLY_NOTE =
  "Denní menu podáváme od pondělí do pátku, 11:00 – 14:00. Polévka je součástí nabídky, k hlavním jídlům nabízíme přílohu dle popisu.";

export const WEEKLY_MENU: WeeklyDay[] = [
  {
    day: "Pondělí",
    soup: { name: "Minestrone se sezónní zeleninou", price: "55 Kč" },
    mains: [
      { name: "Spaghetti aglio, olio e peperoncino", desc: "česnek, olivový olej, chilli, petrželka, pecorino", price: "165 Kč" },
      { name: "Pizza Margherita", desc: "rajčatová omáčka, mozzarella, bazalka", price: "175 Kč" },
      { name: "Pollo alla griglia", desc: "grilované kuřecí prso, opékané brambory, salsa z rajčat", price: "189 Kč" },
    ],
  },
  {
    day: "Úterý",
    soup: { name: "Rajčatová krémová s bazalkou", price: "55 Kč" },
    mains: [
      { name: "Tagliatelle bolognese", desc: "domácí boloňská omáčka, Grana Padano", price: "179 Kč" },
      { name: "Risotto ai funghi", desc: "rizoto s žampiony a parmazánem", price: "175 Kč" },
      { name: "Pizza Cardinale", desc: "rajčatová omáčka, mozzarella, dušená šunka", price: "179 Kč" },
    ],
  },
  {
    day: "Středa",
    soup: { name: "Kuřecí vývar s domácími nudlemi", price: "55 Kč" },
    mains: [
      { name: "Lasagne al forno", desc: "boloňská omáčka, bešamel, parmazán", price: "195 Kč" },
      { name: "Penne al pesto e pollo", desc: "bazalkové pesto, kuřecí maso, cherry rajčata", price: "185 Kč" },
      { name: "Vepřová panenka na pepři", desc: "pepřová omáčka, máslová bramborová kaše", price: "199 Kč" },
    ],
  },
  {
    day: "Čtvrtek",
    soup: { name: "Krémová dýňová s pistáciemi", price: "55 Kč" },
    mains: [
      { name: "Gnocchi ai quattro formaggi", desc: "čtyři druhy sýra, vlašské ořechy", price: "185 Kč" },
      { name: "Pizza Diavola", desc: "rajčatová omáčka, mozzarella, pikantní salám, chilli", price: "189 Kč" },
      { name: "Milánský řízek", desc: "vepřový řízek v parmazánové strouhance, opékané brambory", price: "195 Kč" },
    ],
  },
  {
    day: "Pátek",
    soup: { name: "Rybí polévka s krutony", price: "65 Kč" },
    mains: [
      { name: "Linguine ai gamberi", desc: "krevety, česnek, cherry rajčata, bílé víno", price: "215 Kč" },
      { name: "Pečený losos", desc: "středozemní zelenina, grenaille brambory", price: "225 Kč" },
      { name: "Pizza Tonno cipolla", desc: "rajčatová omáčka, mozzarella, tuňák, cibule, olivy", price: "189 Kč" },
    ],
  },
];
