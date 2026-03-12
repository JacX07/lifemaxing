export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Universe = "onepiece" | "naruto" | "dragonball" | "aot" | "rickmorty";

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  universe: Universe;
  imageUrl: string | null; // null = placeholder CSS coloré, string = vraie image
  description: string;
}

export const CHARACTERS: Character[] = [
  // ── ONE PIECE ──────────────────────────────────────────────────────────────
  {
    id: "luffy",
    name: "Luffy",
    rarity: "epic",
    universe: "onepiece",
    imageUrl: null,
    description: "Le futur Roi des Pirates. Sa volonté est indestructible.",
  },
  {
    id: "zoro",
    name: "Zoro",
    rarity: "rare",
    universe: "onepiece",
    imageUrl: null,
    description: "Le plus grand épéiste du monde — s'il ne se perd pas en chemin.",
  },
  {
    id: "nami",
    name: "Nami",
    rarity: "common",
    universe: "onepiece",
    imageUrl: null,
    description: "La navigatrice de l'équipage. L'argent avant tout.",
  },
  {
    id: "usopp",
    name: "Usopp",
    rarity: "common",
    universe: "onepiece",
    imageUrl: null,
    description: "Le sniper aux dix mille disciples. Brave en théorie.",
  },
  {
    id: "sanji",
    name: "Sanji",
    rarity: "rare",
    universe: "onepiece",
    imageUrl: null,
    description: "Le cuisinier de rêve. Ses jambes valent mille épées.",
  },
  {
    id: "shanks",
    name: "Shanks",
    rarity: "legendary",
    universe: "onepiece",
    imageUrl: null,
    description: "L'Empereur aux cheveux rouges. Une présence qui stoppe les guerres.",
  },

  // ── NARUTO ─────────────────────────────────────────────────────────────────
  {
    id: "naruto",
    name: "Naruto",
    rarity: "rare",
    universe: "naruto",
    imageUrl: null,
    description: "Celui qui voulait devenir Hokage. Il y est arrivé.",
  },
  {
    id: "sasuke",
    name: "Sasuke",
    rarity: "rare",
    universe: "naruto",
    imageUrl: null,
    description: "L'avenger du clan Uchiha. La solitude comme force.",
  },
  {
    id: "sakura",
    name: "Sakura",
    rarity: "common",
    universe: "naruto",
    imageUrl: null,
    description: "La meilleure médecin ninja. Plus forte qu'elle en a l'air.",
  },
  {
    id: "kakashi",
    name: "Kakashi",
    rarity: "epic",
    universe: "naruto",
    imageUrl: null,
    description: "Le Ninja Copieur. A lu la fin du livre avant vous.",
  },
  {
    id: "itachi",
    name: "Itachi",
    rarity: "legendary",
    universe: "naruto",
    imageUrl: null,
    description: "Le sacrifice silencieux du clan Uchiha. Un héros incompris.",
  },
  {
    id: "rock-lee",
    name: "Rock Lee",
    rarity: "common",
    universe: "naruto",
    imageUrl: null,
    description: "Zéro talent, cent pour cent de travail. L'incarnation de la persévérance.",
  },

  // ── DRAGON BALL ────────────────────────────────────────────────────────────
  {
    id: "goku",
    name: "Goku",
    rarity: "legendary",
    universe: "dragonball",
    imageUrl: null,
    description: "Le Saiyan le plus puissant. Toujours prêt à dépasser ses limites.",
  },
  {
    id: "vegeta",
    name: "Vegeta",
    rarity: "epic",
    universe: "dragonball",
    imageUrl: null,
    description: "Le Prince des Saiyans. L'orgueil comme moteur.",
  },
  {
    id: "bulma",
    name: "Bulma",
    rarity: "common",
    universe: "dragonball",
    imageUrl: null,
    description: "Le génie scientifique qui a tout lancé avec un radar.",
  },
  {
    id: "piccolo",
    name: "Piccolo",
    rarity: "rare",
    universe: "dragonball",
    imageUrl: null,
    description: "Le Namek stoïque. Le meilleur sensei de Gohan.",
  },
  {
    id: "gohan",
    name: "Gohan",
    rarity: "rare",
    universe: "dragonball",
    imageUrl: null,
    description: "Le demi-Saiyan au potentiel infini. Préfère étudier.",
  },

  // ── ATTACK ON TITAN ────────────────────────────────────────────────────────
  {
    id: "eren",
    name: "Eren",
    rarity: "rare",
    universe: "aot",
    imageUrl: null,
    description: "Le Titan Fondateur. La liberté à n'importe quel prix.",
  },
  {
    id: "mikasa",
    name: "Mikasa",
    rarity: "epic",
    universe: "aot",
    imageUrl: null,
    description: "La meilleure soldate de sa génération. Loyauté absolue.",
  },
  {
    id: "armin",
    name: "Armin",
    rarity: "common",
    universe: "aot",
    imageUrl: null,
    description: "Le stratège brillant. La vraie force est dans l'intelligence.",
  },
  {
    id: "levi",
    name: "Levi",
    rarity: "legendary",
    universe: "aot",
    imageUrl: null,
    description: "Le soldat le plus fort de l'humanité. Court mais dévastateur.",
  },
  {
    id: "hange",
    name: "Hange",
    rarity: "common",
    universe: "aot",
    imageUrl: null,
    description: "La scientifique passionnée par les Titans. Trop enthousiaste.",
  },

  // ── RICK & MORTY ───────────────────────────────────────────────────────────
  {
    id: "rick",
    name: "Rick Sanchez",
    rarity: "epic",
    universe: "rickmorty",
    imageUrl: null,
    description: "Le scientifique le plus intelligent de l'univers. Wubba lubba dub dub.",
  },
  {
    id: "morty",
    name: "Morty Smith",
    rarity: "common",
    universe: "rickmorty",
    imageUrl: null,
    description: "Le petit-fils aventurier malgré lui. Plus courageux qu'il ne le croit.",
  },
  {
    id: "summer",
    name: "Summer Smith",
    rarity: "common",
    universe: "rickmorty",
    imageUrl: null,
    description: "La grande sœur débrouillarde. Souvent la plus sensée du groupe.",
  },
  {
    id: "mr-meeseeks",
    name: "Mr. Meeseeks",
    rarity: "rare",
    universe: "rickmorty",
    imageUrl: null,
    description: "Existence is pain. Mais il accomplit sa mission avant de disparaître.",
  },
];

export const CHARACTERS_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
);
