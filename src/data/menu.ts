import ig1 from "@/assets/galerie-ig-1.jpg";
import ig2 from "@/assets/galerie-ig-2.jpg";
import ig3 from "@/assets/galerie-ig-3.jpg";
import ig4 from "@/assets/galerie-ig-4.jpg";
import ig5 from "@/assets/galerie-ig-5.jpg";
import ig6 from "@/assets/galerie-ig-6.jpg";
import ig7 from "@/assets/galerie-ig-7.jpg";
import menuPredkrmy from "@/assets/menu/home-predkrmy.png";
import menuHlavniChody from "@/assets/menu/home-hlavni-chody.png";
import menuDezerty from "@/assets/menu/home-dezerty.png";
import menuNapoje from "@/assets/menu/home-napoje.png";
import galleryAntipasti from "@/assets/gallery/antipasti.jpg";
import galleryMorskePlody from "@/assets/gallery/morske-plody.jpg";
import galleryPizza from "@/assets/gallery/pizza.jpg";
import gallerySpecialita from "@/assets/gallery/specialita.jpg";

export type Dish = {
  name: string;
  price: string;
  desc?: string;
  allergens?: number[];
  subgroup?: string;
};
export type MenuSection = {
  id: string;
  title: string;
  image?: string;
  items: Dish[];
  subgroups?: { id: string; title: string }[];
};

export const IMG = {
  chef: "https://www.lapadella.cz/assets/images/chef-pizza.webp",
  kitchen: "https://www.lapadella.cz/assets/images/kitchen-1.webp",
  aboutBg: "https://www.lapadella.cz/assets/images/about-bg-3.webp",
  team: "https://www.lapadella.cz/assets/images/team-1.webp",
  food1: menuPredkrmy,
  food4: menuHlavniChody,
  oblique3: menuDezerty,
  oblique4: menuNapoje,
  contactBg: ig7,
  menuBanner: menuHlavniChody,
};

export const GALLERY = [
  ig7,
  galleryAntipasti,
  galleryMorskePlody,
  galleryPizza,
  gallerySpecialita,
  ig1,
  ig2,
  ig3,
  ig4,
  ig5,
  ig6,
];

export const CONTACT = {
  phone: "+420 723 232 376",
  phoneHref: "tel:+420723232376",
  email: "info@lapadella.cz",
  street: "Smetanova 807",
  city: "Valašské Meziříčí 757 01",
  manager: "Rosario Coppola",
  ico: "11833238",
  mapUrl: "https://mapy.com/en/zakladni?source=firm&id=13442340",
  orderUrl: "https://la-padella.order.app.hd.digital/menus",
  instagram: "https://www.instagram.com/restaurace_lapadella/",
  facebook:
    "https://www.facebook.com/p/La-Padella-italsk%C3%A1-restaurace-pizzerie-100085945641209/",
};

export const HOURS = [
  { day: "Pondělí", time: "11:00 – 22:00" },
  { day: "Úterý", time: "11:00 – 22:00" },
  { day: "Středa", time: "11:00 – 22:00" },
  { day: "Čtvrtek", time: "11:00 – 22:00" },
  { day: "Pátek", time: "11:00 – 23:00" },
  { day: "Sobota", time: "12:00 – 23:00" },
  { day: "Neděle", time: "12:00 – 21:00" },
];

export const FOOD_MENU: MenuSection[] = [
  {
    id: "predkrmy",
    title: "Předkrmy",
    image: menuPredkrmy,
    items: [
      {
        name: "Bruschette pomodorini e verdure staggionali",
        price: "165 Kč",
        desc: "2 ks bruschett z domácího chleba s rajčátky a sezónní zeleninou",
      },
      {
        name: "Carpaccio di manzo (100 g)",
        price: "295 Kč",
        desc: "carpaccio z pravé svíčkové na lůžku z rukoly, hobliny parmazánu a kapary, domácí opečený chléb",
      },
      {
        name: "Rajčatová italská",
        price: "90 Kč",
        desc: "rajčatová krémová polévka s trhanou burratou posypaná parmazánem",
      },
      {
        name: "Tartare di manzo, pane tostato (100 g)",
        price: "295 Kč",
        desc: "tatarák z pravé svíčkové, topinky, česnek",
      },
      {
        name: "Gamberi pil-pil",
        price: "225 Kč",
        desc: "restované krevety na česneku a brandy s čerstvou pikantní papričkou a sekanou petrželkou",
      },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    image: menuHlavniChody,
    items: [
      { name: "Margherita", price: "209 Kč", desc: "rajčatová omáčka, mozzarella, bazalka" },
      { name: "Cardinale", price: "229 Kč", desc: "rajčatová omáčka, mozzarella, dušená šunka" },
      { name: "Diavola", price: "239 Kč", desc: "rajčatová omáčka, mozzarella, pikantní salám, chilli" },
      { name: "Quattro formaggi", price: "289 Kč", desc: "mozzarella, uzený sýr Provolone, gorgonzola, Grana Padano" },
      { name: "Prosciutto cotto funghi", price: "249 Kč", desc: "rajčatová omáčka, mozzarella, dušená šunka, žampiony" },
      { name: "Tonno cipolla e olive", price: "249 Kč", desc: "rajčatová omáčka, mozzarella, tuňák, černé olivy, cibule" },
      { name: "Bufala", price: "279 Kč", desc: "rajčatová omáčka, buvolí mozzarella, bazalka" },
      {
        name: "Bomba",
        price: "299 Kč",
        desc: "rajčatová omáčka, mozzarella, pikantní salám, gorgonzola, grilované papriky, pikantní paprička",
      },
      {
        name: "La Padella",
        price: "289 Kč",
        desc: "rajčatová omáčka, mozzarella, pancetta, gorgonzola, černé olivy, vejce",
      },
      {
        name: "Italianissima",
        price: "289 Kč",
        desc: "rajčatová omáčka, mozzarella, prosciutto crudo, rukola, Grana Padano",
      },
      {
        name: "Vesuvio",
        price: "349 Kč",
        desc: "rajčatová omáčka, mozzarella, prosciutto crudo, rukola, cherry rajčata, buvolí mozzarella",
      },
      {
        name: "Saverio",
        price: "359 Kč",
        desc: "mozzarella, bazalkové pesto, mortadela, sýr burrata, pistácie",
      },
      {
        name: "Capriciosa",
        price: "279 Kč",
        desc: "rajčatová omáčka, mozzarella, dušená šunka, žampiony, artyčoky, černé olivy",
      },
      { name: "Pizza grissini", price: "119 Kč", desc: "pizza tyčinky s rozmarýnem a česnekem" },
      {
        name: "Rustica",
        price: "319 Kč",
        desc: "mozzarella, bazalkové pesto, grilované papriky, kuřecí maso, karamelizovaná cibulka",
      },
      {
        name: "La Terra",
        price: "269 Kč",
        desc: "rajčatová omáčka, mozzarella, dušená šunka, salám Napoli, pikantní salám",
      },
      { name: "Frutti di mare", price: "469 Kč", desc: "rajčatová omáčka, mořské plody, česnek, oregano" },
      {
        name: "Mafia",
        price: "279 Kč",
        desc: "rajčatová omáčka se smetanou, mozzarella, sušená rajčata, hobliny parmazánu, rajčata cherry",
      },
      {
        name: "Nerano",
        price: "349 Kč",
        desc: "krevety, grilované cukety, mozzarella, rajčata cherry, Grana Padano",
      },
      {
        name: "Inferno",
        price: "259 Kč",
        desc: "rajčatová omáčka, mozzarella, pikantní salám, čerstvé chilli papričky, beraní rohy, Grana Padano",
      },
      {
        name: "Quattro stagioni",
        price: "279 Kč",
        desc: "pizza složená ze čtyř částí (rajčatová omáčka, mozzarella, šunka, olivy, artyčoky, rajčátka, žampiony, bazalka)",
      },
      {
        name: "Calzone – překládaná",
        price: "279 Kč",
        desc: "plněná pizza s rajčatovou omáčkou, ricottou, salámem Napoli a bazalkou",
      },
      { name: "Maradona", price: "289 Kč", desc: "mozzarella, smetana, dušená šunka, bramborové krokety" },
    ],
  },
  {
    id: "testoviny",
    title: "Těstoviny a rizota",
    image: menuHlavniChody,
    items: [
      {
        name: "Tortelloni ricotta spinaci",
        price: "275 Kč",
        desc: "tortelloni plněné ricottou a špenátem v parmazánové krémové omáčce, olivový prach, parmazán",
      },
      { name: "Lasagne al forno", price: "315 Kč", desc: "lasagne s boloňskou omáčkou, bešamelem a parmazánem" },
      {
        name: "Risotto ai funghi porcini con taleggio e olio di tartufo",
        price: "335 Kč",
        desc: "rizoto s pravými hříbky, sýrem taleggio a lanýžovým olejem, posypané parmazánem",
      },
      {
        name: "Spaghetti alla carbonara",
        price: "315 Kč",
        desc: "spaghetti, guanciale, pasterizovaný žloutek, pecorino",
      },
      {
        name: "Tagliatelle con stracetti di manzo",
        price: "395 Kč",
        desc: "tagliatelle s filírovanou hovězí svíčkovou, rukolou, rajčátky, sušenými rajčaty a hoblinami parmazánu",
      },
      {
        name: "Linguine ai frutti di mare",
        price: "435 Kč",
        desc: "linguine s plody moře a rajčátky, dozdobené argentinskou krevetou",
      },
      { name: "Tagliatelle bolognese", price: "255 Kč", desc: "tagliatelle s boloňskou omáčkou, parmazán" },
    ],
  },
  {
    id: "masa-ryby",
    title: "Masa a ryby",
    image: menuHlavniChody,
    items: [
      { name: "Frittura di gamberri e calamari (300 g)", price: "395 Kč", desc: "fritované krevety a kalamáry" },
      { name: "Impepata di cozze (500 g)", price: "325 Kč", desc: "mísa vařených slávek na bílém víně" },
      {
        name: "Tomahawk di maiale alla milanese (300 g)",
        price: "315 Kč",
        desc: "smažený vepřový tomahawk, máslová bramborová kaše s parmazánem, glazované mrkvičky",
      },
      {
        name: "Filetto di manzo ai funghi porcini (220 g)",
        price: "685 Kč",
        desc: "steak z pravé svíčkové s omáčkou z pravých hříbků, bramborový dortík, míchaný fresh salát",
      },
      {
        name: "Salmone in padella con verdura mediterranea (220 g)",
        price: "395 Kč",
        desc: "pečený losos se středozemní zeleninou, salsa z rajčat a bylinek, opékané grenaille, omáčka bearnaise",
      },
      {
        name: "Filetto di tonno sashimi (250 g)",
        price: "655 Kč",
        desc: "steak z tuňáka žlutoploutvého kvality Sashimi, opékané grenaille, blanšírované zelené fazolky s česnekem",
      },
      {
        name: "Polipo alla griglia (170 g)",
        price: "485 Kč",
        desc: "grilovaná chobotnice na pyré z fialových lanýžových brambor, dušené růžičkové kapustičky na másle",
      },
      {
        name: "Filetto di maiale con salsa di pepe verde (220 g)",
        price: "295 Kč",
        desc: "vepřová panenka v pepřové omáčce, příloha dle výběru v ceně",
      },
    ],
  },
  {
    id: "salaty",
    title: "Saláty",
    image: menuPredkrmy,
    items: [
      {
        name: "Insalata Pompei",
        price: "315 Kč",
        desc: "míchaný fresh salát, plátky grilovaného kuřecího prsa, rukola, rajčátka, olivy, červená cibule, mozzarella, pošírované vejce, krutony, vinaigrette",
      },
      {
        name: "Insalata con salmone marinato",
        price: "325 Kč",
        desc: "mix fresh salátů, marinovaný losos, olivy taggiasche, kapary, balzamikový dressing",
      },
    ],
  },
  {
    id: "dezerty",
    title: "Dezerty",
    image: menuDezerty,
    items: [
      { name: "Cannolo siciliano", price: "145 Kč", desc: "tradiční sicilská trubička, krém z ricotty, drcené pistácie" },
      {
        name: "Tiramisu",
        price: "125 Kč",
        desc: "krém ze žloutků, cukrářské piškoty macerované v espressu a amarettu",
      },
      { name: "Panna cotta", price: "125 Kč", desc: "Panna Cotta s ovocem, nebo medem s oříšky" },
    ],
  },
  {
    id: "deti",
    title: "Děti",
    image: menuHlavniChody,
    items: [
      { name: "Spaghetti baby", price: "139 Kč", desc: "špagety s rajčatovou omáčkou, sypané parmazánem" },
      { name: "Pollo baby", price: "159 Kč", desc: "kuřecí řízečky, hranolky, rajčatová salsa" },
      { name: "Pizza baby", price: "139 Kč", desc: "malá pizza se šunkou a mozzarellou" },
    ],
  },
  {
    id: "prilohy",
    title: "Přílohy",
    items: [
      { name: "Caponata siciliana", price: "95 Kč", desc: "pečená středozemní zelenina" },
      { name: "Patate fritte", price: "65 Kč", desc: "hranolky" },
      { name: "Patate al forno", price: "65 Kč", desc: "opékané brambory" },
      { name: "Insalata mista con pomodorini", price: "95 Kč", desc: "míchaný fresh salát s rajčátky" },
      { name: "Crocché di patate", price: "65 Kč", desc: "bramborové krokety" },
    ],
  },
];

export const DRINK_MENU: MenuSection[] = [
  {
    id: "vina",
    title: "Rozlévaná vína",
    items: [
      { name: "Bílé víno – Chardonnay 1 dcl", price: "45 Kč" },
      { name: "Červené víno – Terre Siciliane 1 dcl", price: "45 Kč" },
      { name: "Prosecco Sacchetto 1,5 dcl", price: "89 Kč" },
      { name: "Prosecco Mille Bolle růžové 1,5 dcl", price: "79 Kč" },
    ],
  },
  {
    id: "aperitivy",
    title: "Aperitivy",
    items: [
      { name: "Martini (rosso, bianco, extra dry) 0,04 l", price: "65 Kč" },
      { name: "Campari Bitter 0,04 l", price: "70 Kč" },
      { name: "Crodino 0,175 l", price: "95 Kč" },
    ],
  },
  {
    id: "michane",
    title: "Míchané nápoje",
    items: [
      { name: "Martini Fiero & Tonic", price: "125 Kč" },
      { name: "Mojito", price: "125 Kč" },
      { name: "Mojito Virgin", price: "85 Kč" },
      { name: "Cuba Libre", price: "125 Kč" },
      { name: "Bombay Sunset & Tonic", price: "125 Kč" },
      { name: "Limoncello Spritz", price: "139 Kč" },
      { name: "Hugo Spritz", price: "115 Kč" },
      { name: "Aperol Spritz", price: "139 Kč" },
      { name: "Sarti Spritz", price: "145 Kč" },
      { name: "Crodino Spritz virgin", price: "125 Kč" },
    ],
  },
  {
    id: "whiskey",
    title: "Whiskey",
    items: [
      { name: "Tullamore Dew 0,04 l", price: "75 Kč" },
      { name: "Tullamore Dew 12 YO 0,04 l", price: "130 Kč" },
      { name: "Jameson 0,04 l", price: "85 Kč" },
      { name: "Jameson Black Barrel 0,04 l", price: "115 Kč" },
      { name: "Jack Daniel’s 0,04 l", price: "90 Kč" },
      { name: "Jack Daniel’s Honey 0,04 l", price: "90 Kč" },
      { name: "Woodford Reserve Bourbon 0,04 l", price: "105 Kč" },
    ],
  },
  {
    id: "cognac",
    title: "Cognac & Brandy",
    items: [
      { name: "Vecchia Romagna 0,04 l", price: "85 Kč" },
      { name: "Courvoisier VS 0,04 l", price: "95 Kč" },
      { name: "Grand Marnier 0,04 l", price: "85 Kč" },
    ],
  },
  {
    id: "likery",
    title: "Likéry",
    items: [
      { name: "Baileys 0,04 l", price: "65 Kč" },
      { name: "Fernet Stock / Citrus 0,04 l", price: "62 Kč" },
      { name: "Jägermeister 0,04 l", price: "75 Kč" },
      { name: "Limoncello / Meloncello 0,04 l", price: "75 Kč" },
      { name: "Ramazzotti Amaro 0,04 l", price: "85 Kč" },
      { name: "Disaronno Originale 0,04 l", price: "95 Kč" },
      { name: "Averna 0,04 l", price: "67 Kč" },
    ],
  },
  {
    id: "destilaty",
    title: "Destiláty",
    items: [
      { name: "Bombay Sapphire gin 0,04 l", price: "85 Kč" },
      { name: "Finlandia 0,04 l", price: "65 Kč" },
      { name: "Amundsen 0,04 l", price: "60 Kč" },
      { name: "Beefeater gin 0,04 l", price: "70 Kč" },
      { name: "Beefeater Gin Pink", price: "80 Kč" },
      { name: "Malfy gin Originale 0,04 l", price: "80 Kč" },
      { name: "Malfy gin Limone / Arancia / Rosa 0,04 l", price: "80 Kč" },
      { name: "Grappa 0,04 l", price: "85 Kč" },
      { name: "Metaxa 7 0,04 l", price: "90 Kč" },
    ],
  },
  {
    id: "rumy",
    title: "Rumy",
    items: [
      { name: "Brugal 1888 Gran Reserva 20 YO", price: "125 Kč" },
      { name: "Planteray XO 20 YO", price: "155 Kč" },
      { name: "Diplomático Reserva 12 YO", price: "130 Kč" },
      { name: "Diplomático Mantuano", price: "105 Kč" },
      { name: "Bacardi Carta Blanca", price: "75 Kč" },
      { name: "Bacardi Spiced", price: "75 Kč" },
      { name: "Captain Morgan", price: "60 Kč" },
      { name: "Ron Zacapa Centenario Solera Gran Reserva 23 YO", price: "165 Kč" },
      { name: "Božkov Republica Exclusive", price: "70 Kč" },
      { name: "Legendario Elixir de Cuba 7 YO", price: "80 Kč" },
      { name: "Don Papa Baroko", price: "135 Kč" },
    ],
  },
  {
    id: "pivo",
    title: "Pivo",
    items: [
      { name: "Peroni Nastro Azzurro (láhev)", price: "58 Kč" },
      { name: "Pilsner Urquell 12°, světlý ležák 0,3 l", price: "48 Kč" },
      { name: "Pilsner Urquell 12°, světlý ležák 0,5 l", price: "68 Kč" },
      { name: "Birell světlý 0,3 l", price: "35 Kč" },
      { name: "Birell světlý 0,5 l", price: "45 Kč" },
      { name: "Birell pomelo / grep 0,33 l", price: "35 Kč" },
    ],
  },
  {
    id: "nealko",
    title: "Nealkoholické nápoje",
    items: [
      { name: "Coca Cola / Coca Cola Zero 0,33 l", price: "58 Kč" },
      { name: "Fanta pomeranč 0,33 l", price: "58 Kč" },
      { name: "Sprite 0,33 l", price: "58 Kč" },
      { name: "Kinley Tonic Water / Ginger 0,25 l", price: "55 Kč" },
      { name: "Cappy (jahoda, jablko, pomeranč, hruška) 0,25 l", price: "55 Kč" },
      { name: "Fuzetea (jahoda & aloe vera / broskev & ibišek) 0,25 l", price: "55 Kč" },
      { name: "Römerquelle (perlivá / neperlivá / jemně perlivá) 0,33 l", price: "46 Kč" },
      { name: "Römerquelle Lemongrass 0,33 l", price: "49 Kč" },
      { name: "Römerquelle (perlivá / neperlivá) 0,75 l", price: "75 Kč" },
      { name: "Red Bull", price: "65 Kč" },
      { name: "1 l karafa vody s citronem", price: "55 Kč" },
      { name: "1 l karafa kohoutkové vody", price: "40 Kč" },
    ],
  },
  {
    id: "teple",
    title: "Teplé nápoje",
    items: [
      { name: "Espresso", price: "53 Kč" },
      { name: "Espresso macchiato", price: "58 Kč" },
      { name: "Espresso lungo", price: "53 Kč" },
      { name: "Espresso doppio", price: "75 Kč" },
      { name: "Latte macchiato", price: "72 Kč" },
      { name: "Cappuccino", price: "63 Kč" },
      { name: "Decafeinato / bez kofeinu", price: "63 Kč" },
      { name: "Sypaný čaj", price: "68 Kč" },
      { name: "Čerstvý čaj máta / zázvor", price: "70 Kč" },
    ],
  },
];
