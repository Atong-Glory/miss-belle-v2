/* ================================================================
   WHISPERING INK — Whisper Database
   Poem fragments & Kom proverbs mapped to emotional categories.
   Each entry has EN + FR variants and a "source" attribution.
   ================================================================ */

export type WhisperEmotion =
  | "love" | "grief" | "hope" | "faith" | "rage"
  | "identity" | "longing" | "freedom" | "joy" | "loss"
  | "courage" | "silence" | "home" | "ancestors";

export interface WhisperEntry {
  id: string;
  en: string;
  fr: string;
  emotion: WhisperEmotion;
  source: string; // poem title or "Kom Proverb"
}

export const WHISPER_DB: WhisperEntry[] = [
  /* ---- LOVE ---- */
  { id: "w01", en: "Love does not ask for directions — it already knows the way home.", fr: "L'amour ne demande pas son chemin — il connaît déjà le chemin de la maison.", emotion: "love", source: "The Canvas Speaks" },
  { id: "w02", en: "I carried your name in my mouth like a prayer I was afraid to finish.", fr: "Je portais ton nom dans ma bouche comme une prière que j'avais peur de finir.", emotion: "love", source: "Tu Es Lumière" },
  { id: "w03", en: "Love is the only language that sounds louder in silence.", fr: "L'amour est la seule langue qui résonne plus fort dans le silence.", emotion: "love", source: "Amour Sans Frontières" },
  { id: "w04", en: "A Kom proverb says: The heart that loves is never homeless.", fr: "Un proverbe Kom dit : Le cœur qui aime n'est jamais sans abri.", emotion: "love", source: "Kom Proverb" },

  /* ---- GRIEF ---- */
  { id: "w05", en: "Grief is love with nowhere to go. So it walks the corridors of your chest.", fr: "Le chagrin est un amour qui ne sait où aller. Alors il marche dans les couloirs de votre poitrine.", emotion: "grief", source: "The Weight of Words" },
  { id: "w06", en: "I buried my grandmother's songs in the soil and they grew into my voice.", fr: "J'ai enterré les chansons de ma grand-mère dans la terre et elles sont devenues ma voix.", emotion: "grief", source: "Daughter of the Soil" },
  { id: "w07", en: "The mountains of Kom taught me that silence has weight.", fr: "Les montagnes de Kom m'ont appris que le silence a un poids.", emotion: "grief", source: "About Miss Belle" },

  /* ---- HOPE ---- */
  { id: "w08", en: "Hope is not a destination — it is the walking itself.", fr: "L'espoir n'est pas une destination — c'est la marche elle-même.", emotion: "hope", source: "The Canvas Speaks" },
  { id: "w09", en: "Even the smallest seed can split stone. That is what my grandmother taught me.", fr: "Même la plus petite graine peut fendre la pierre. C'est ce que ma grand-mère m'a enseigné.", emotion: "hope", source: "Daughter of the Soil" },
  { id: "w10", en: "I painted my prayers on walls no one could see, and God turned them into galleries of grace.", fr: "J'ai peint mes prières sur des murs que personne ne pouvait voir, et Dieu les a transformées en galeries de grâce.", emotion: "hope", source: "The Canvas Speaks" },

  /* ---- FAITH ---- */
  { id: "w11", en: "Lord, make me an instrument of your rhythm.", fr: "Seigneur, fais de moi un instrument de ton rythme.", emotion: "faith", source: "Psalm of the Mic" },
  { id: "w12", en: "Even in silence, God hears the whisper of a searching heart.", fr: "Même dans le silence, Dieu entend le murmure d'un cœur qui cherche.", emotion: "faith", source: "Le Cri Silencieux" },
  { id: "w13", en: "Its roots plunge into the sky — an upside-down tree whose leaves are prayers.", fr: "Ses racines plongent dans le ciel — un arbre à l'envers dont les feuilles sont des prières.", emotion: "faith", source: "Les Racines du Ciel" },
  { id: "w14", en: "A Kom elder says: Faith is the drum that keeps beating after the dancer falls.", fr: "Un ancien de Kom dit : La foi est le tambour qui continue de battre après que le danseur est tombé.", emotion: "faith", source: "Kom Proverb" },

  /* ---- RAGE ---- */
  { id: "w15", en: "They said silence was golden, but I've seen what gold does to the hands that hold it.", fr: "Ils disaient que le silence était doré, mais j'ai vu ce que l'or fait aux mains qui le tiennent.", emotion: "rage", source: "Threads of Iron" },
  { id: "w16", en: "They told me words are cheap, so I made mine expensive.", fr: "Ils m'ont dit que les mots ne coûtent rien, alors j'ai rendu les miens précieux.", emotion: "rage", source: "The Weight of Words" },
  { id: "w17", en: "Silence has a price that only the poor pay.", fr: "Le silence a un prix que seuls les pauvres paient.", emotion: "rage", source: "Le Prix du Silence" },

  /* ---- IDENTITY ---- */
  { id: "w18", en: "My grandmother's name is written in the lines of my palms.", fr: "Le nom de ma grand-mère est écrit dans les lignes de mes paumes.", emotion: "identity", source: "Daughter of the Soil" },
  { id: "w19", en: "I stand on a stage built by people whose names I cannot pronounce, and I speak their language fluently.", fr: "Je me tiens sur une scène construite par des gens dont je ne peux pas prononcer les noms, et je parle leur langue couramment.", emotion: "identity", source: "Stage of Ancestors" },
  { id: "w20", en: "The earth holds memory in its cracks, and I am the daughter who reads them.", fr: "La terre garde la mémoire dans ses fissures, et je suis la fille qui les lit.", emotion: "identity", source: "When the Soil Remembers" },
  { id: "w21", en: "A Kom proverb says: A child who does not know the village will not know the road.", fr: "Un proverbe Kom dit : L'enfant qui ne connaît pas le village ne connaîtra pas la route.", emotion: "identity", source: "Kom Proverb" },

  /* ---- LONGING ---- */
  { id: "w22", en: "My heart beats to the rhythm of village drums, a beat that crosses oceans.", fr: "Mon cœur bat au rythme des tambours de mon village, un battement qui traverse les océans.", emotion: "longing", source: "L'Écho du Terroir" },
  { id: "w23", en: "From the highlands to the coast, every mile is a stanza.", fr: "Des hautes terres à la côte, chaque kilomètre est une stance.", emotion: "longing", source: "Bamenda to Buea" },
  { id: "w24", en: "Home is not a place. It is a frequency your body remembers.", fr: "La maison n'est pas un lieu. C'est une fréquence que votre corps se souvient.", emotion: "longing", source: "Cœur de Kom" },

  /* ---- FREEDOM ---- */
  { id: "w25", en: "My words don't just echo — they linger, like the last note of a song that refuses to fade.", fr: "Mes mots ne font pas qu'écho — ils persistent, comme la dernière note d'une chanson qui refuse de s'éteindre.", emotion: "freedom", source: "About Miss Belle" },
  { id: "w26", en: "A Kom proverb says: The bird that refuses to leave the cage has forgotten it has wings.", fr: "Un proverbe Kom dit : L'oiseau qui refuse de quitter la cage a oublié qu'il a des ailes.", emotion: "freedom", source: "Kom Proverb" },
  { id: "w27", en: "She transforms language into light.", fr: "Elle transforme le langage en lumière.", emotion: "freedom", source: "About Miss Belle" },

  /* ---- JOY ---- */
  { id: "w28", en: "Her words are not merely spoken — they are breathed, lived, and offered as a gift.", fr: "Ses mots ne sont pas simplement prononcés — ils sont respirés, vécus et offerts en cadeau.", emotion: "joy", source: "About Miss Belle" },
  { id: "w29", en: "In the heart of Kom, the drums speak a language that words cannot translate.", fr: "Au cœur de Kom, les tambours parlent une langue que les mots ne peuvent pas traduire.", emotion: "joy", source: "Cœur de Kom" },
  { id: "w30", en: "A Kom proverb says: Joy shared is a fire that cannot be extinguished.", fr: "Un proverbe Kom dit : La joie partagée est un feu qui ne peut être éteint.", emotion: "joy", source: "Kom Proverb" },

  /* ---- LOSS ---- */
  { id: "w31", en: "The last note of a song that refuses to fade — that is what loss sounds like.", fr: "La dernière note d'une chanson qui refuse de s'éteindre — c'est ce que la perte résonne.", emotion: "loss", source: "About Miss Belle" },
  { id: "w32", en: "I am the daughter who reads the earth's cracks like scripture.", fr: "Je suis la fille qui lit les fissures de la terre comme les écritures.", emotion: "loss", source: "When the Soil Remembers" },

  /* ---- COURAGE ---- */
  { id: "w33", en: "A Kom proverb says: The spear that fears the war has no business in the warrior's hand.", fr: "Un proverbe Kom dit : La lance qui craint la guerre n'a rien à faire dans la main du guerrier.", emotion: "courage", source: "Kom Proverb" },
  { id: "w34", en: "Every poem costs me a piece of my peace. I pay it gladly.", fr: "Chaque poème me coûte un morceau de ma paix. Je le paie avec joie.", emotion: "courage", source: "The Weight of Words" },

  /* ---- SILENCE ---- */
  { id: "w35", en: "Silence has weight. I learned to give that weight a voice.", fr: "Le silence a un poids. J'ai appris à donner à ce poids une voix.", emotion: "silence", source: "About Miss Belle" },
  { id: "w36", en: "Even the walls listen when she speaks.", fr: "Même les murs écoutent quand elle parle.", emotion: "silence", source: "Voices from the Crowd" },

  /* ---- HOME ---- */
  { id: "w37", en: "In Kom, the mountains teach you to listen before you speak.", fr: "À Kom, les montagnes vous apprennent à écouter avant de parler.", emotion: "home", source: "About Miss Belle" },
  { id: "w38", en: "Every town a verse in the poem of home.", fr: "Chaque ville un vers dans le poème de la maison.", emotion: "home", source: "Bamenda to Buea" },

  /* ---- ANCESTORS ---- */
  { id: "w39", en: "I stand on a stage built by ancestors whose names the wind still carries.", fr: "Je me tiens sur une scène construite par des ancêtres dont les noms sont encore portés par le vent.", emotion: "ancestors", source: "Stage of Ancestors" },
  { id: "w40", en: "A Kom elder says: When you speak, your ancestors lean in to listen.", fr: "Un ancien de Kom dit : Quand tu parles, tes ancêtres se penchent pour écouter.", emotion: "ancestors", source: "Kom Proverb" },
];

/* ================================================================
   WORD → EMOTION MAPPING
   Maps specific words to emotional categories for auto-tagging.
   ================================================================ */

export const WORD_EMOTION_MAP: Record<string, WhisperEmotion> = {
  // Love
  love: "love", heart: "love", prayer: "love",
  // French love words
  "cœur": "love", amour: "love",
  // Grief
  grief: "grief", tears: "grief", buried: "grief", chagrin: "grief",
  // Hope
  hope: "hope", seed: "hope", grace: "hope", espoir: "hope",
  // Faith
  god: "faith", faith: "faith", prayers: "faith", rhythm: "faith",
  dieu: "faith", foi: "faith", prières: "faith",
  // Rage
  silence: "rage", golden: "rage", gold: "rage", rage: "rage",
  colère: "rage", prix: "rage",
  // Identity
  grandmother: "identity", name: "identity", daughter: "identity", soil: "identity",
  fille: "identity", terre: "identity", identité: "identity",
  // Longing
  home: "longing", ocean: "longing", village: "longing", drums: "longing",
  maison: "longing", océan: "longing", tambours: "longing", désir: "longing",
  // Freedom
  free: "freedom", wings: "freedom", light: "freedom", liberté: "freedom",
  // Joy
  joy: "joy", gift: "joy", breathe: "joy", joie: "joy", cadeau: "joy",
  // Loss
  loss: "loss", fade: "loss", perte: "loss",
  // Courage
  courage: "courage", warrior: "courage", spear: "courage",
  // Silence
  whisper: "silence", listen: "silence", murmure: "silence", écouter: "silence",
  // Home
  mountains: "home", highlands: "home", coast: "home", montagnes: "home",
  // Ancestors
  ancestors: "ancestors", stage: "ancestors", ancêtres: "ancestors", scène: "ancestors",
  // Words/Poetry
  words: "freedom", poem: "freedom", voice: "freedom", spoken: "freedom",
  mots: "freedom", poème: "freedom", voix: "freedom",
};

/**
 * Find a random whisper for a given emotion (and language).
 * Falls back to a random whisper if no match found.
 */
export function findWhisper(emotion: WhisperEmotion, lang: "en" | "fr"): WhisperEntry {
  const pool = WHISPER_DB.filter((w) => w.emotion === emotion);
  const source = pool.length > 0 ? pool : WHISPER_DB;
  return source[Math.floor(Math.random() * source.length)];
}