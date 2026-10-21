'use strict';
/* =====================================================================
   EXTRA INHOUD (najaar 2026): rebussen, droedels, Franse en Engelse teksten.
   De leerkracht kan elk ingebouwd item uitzetten bij Eigen inhoud → Ingebouwde inhoud.
   ===================================================================== */

/* ---------- Rebussen ---------- */
REBUSSEN[1].push(
  RB('SLEUTELBOS', ['🔑', 'sleutel'], '+', ['🌲', 'bos']), RB('VISKOM', ['🐟', 'vis'], '+', ['🥣', 'kom']), RB('REGENJAS', ['🌧️', 'regen'], '+', ['🧥', 'jas']),
  RB('SNEEUWBAL', ['❄️', 'sneeuw'], '+', ['⚽', 'bal']), RB('TIJGERHAAI', ['🐯', 'tijger'], '+', ['🦈', 'haai']), RB('APPELTAART', ['🍎', 'appel'], '+', ['🥧', 'taart']),
  RB('MAANVIS', ['🌙', 'maan'], '+', ['🐟', 'vis']), RB('ZEEMAN', ['🌊', 'zee'], '+', ['👨', 'man']), RB('BOEKWINKEL', ['📖', 'boek'], '+', ['🏪', 'winkel']),
  RB('BLOEMPOT', ['🌸', 'bloem'], '+', ['🍯', 'pot']), RB('HONINGBIJ', ['🍯', 'honing'], '+', ['🐝', 'bij']), RB('SCHOENDOOS', ['👞', 'schoen'], '+', ['📦', 'doos']),
  RB('KLOKTOREN', ['🕰️', 'klok'], '+', ['🗼', 'toren']), RB('KOEBEL', ['🐄', 'koe'], '+', ['🔔', 'bel']), RB('APPELSAP', ['🍎', 'appel'], '+', ['🧃', 'sap']),
);
REBUSSEN[2].push(
  RB('STERRENKIJKER', ['⭐', 'ster'], '+ REN +', ['🔭', 'kijker']), RB('EIERDOOS', ['🥚', 'ei'], '+ ER +', ['📦', 'doos']), RB('KINDERBOEK', ['🧒', 'kind'], '+ ER +', ['📖', 'boek']),
  RB('BLOEMETJE', ['🌸', 'bloem'], '+ ETJE'), RB('HUISJE', ['🏠', 'huis'], '+ JE'), RB('BOOMPJE', ['🌳', 'boom'], '+ PJE'),
  RB('VISSENKOM', ['🐟', 'vis'], '+ SEN +', ['🥣', 'kom']), RB('VOETBALLER', ['🦶', 'voet'], '+', ['⚽', 'bal'], '+ LER'), RB('SCHAATSER', ['⛸️', 'schaats'], '+ ER'),
  RB('KONINGIN', ['🤴', 'koning'], '+ IN'), RB('LEEUWIN', ['🦁', 'leeuw'], '+ IN'),
);
REBUSSEN[3].push(
  RB('BOOT', ['🌳', 'boom'], 'M → T'), RB('KOEK', ['📖', 'boek'], 'B → K'), RB('ZAND', ['✋', 'hand'], 'H → Z'), RB('TAART', ['🗺️', 'kaart'], 'K → T'),
  RB('BEEN', ['🐻', 'beer'], 'R → N'), RB('HOND', ['👄', 'mond'], 'M → H'), RB('ZEEP', ['🌊', 'zee'], '+ P'), RB('BAD', ['🛏️', 'bed'], 'E → A'),
  RB('PAN', ['🐼', 'panda'], '− DA'), RB('VEER', ['🐻', 'beer'], 'B → V'), RB('WOLF', ['☁️', 'wolk'], 'K → F'),
);
REBUSSEN[4].push(
  RB('BOOTHUIS', ['🌳', 'boom'], 'M → T', '+', ['🏠', 'huis']), RB('ZEEPBEL', ['🌊', 'zee'], '+ P +', ['🔔', 'bel']), RB('BADEEND', ['🛏️', 'bed'], 'E → A', '+', ['🦆', 'eend']),
  RB('ROOMBOTER', ['🌳', 'boom'], 'B → R', '+', ['🧈', 'boter']), RB('KOEKENPAN', ['📖', 'boek'], 'B → K', '+ EN +', ['🍳', 'pan']), RB('VEERBOOT', ['🐻', 'beer'], 'B → V', '+', ['🌳', 'boom'], 'M → T'),
);
REBUSSEN[5].push(
  RB('Een vos verliest wel zijn haren, maar niet zijn streken', 'Een', ['🦊', 'vos'], 'verliest wel zijn haren, maar niet zijn streken'),
  RB('De kat de bel aanbinden', 'De', ['🐱', 'kat'], 'de', ['🔔', 'bel'], 'aanbinden'), RB('Met de kippen op stok gaan', 'Met de', ['🐔', 'kippen'], 'op stok gaan'),
  RB('Een wolf in schaapskleren', 'Een', ['🐺', 'wolf'], 'in schaapskleren'), RB('Met de neus in de boter vallen', 'Met de', ['👃', 'neus'], 'in de', ['🧈', 'boter'], 'vallen'),
  RB('Zijn hart op de tong hebben', 'Zijn', ['❤️', 'hart'], 'op de', ['👅', 'tong'], 'hebben'), RB('Een storm in een glas water', 'Een storm in een glas', ['💧', 'water']),
  RB('De boot missen', 'De', ['⛵', 'boot'], 'missen'), RB('Een open deur intrappen', 'Een open', ['🚪', 'deur'], 'intrappen'),
  RB('Iets voor een appel en een ei kopen', 'Iets voor een', ['🍎', 'appel'], 'en een', ['🥚', 'ei'], 'kopen'), RB('Er is niets nieuws onder de zon', 'Er is niets nieuws onder de', ['☀️', 'zon']),
  RB('Hoog van de toren blazen', 'Hoog van de', ['🗼', 'toren'], 'blazen'), RB('Het kind met het badwater weggooien', 'Het', ['🧒', 'kind'], 'met het badwater weggooien'),
);

/* ---------- Droedels ---------- */
DROEDELS.push(
  ['Een spin die aan een draadje naar beneden zakt', svgD(`<rect width="200" height="200" fill="#fff"/><line x1="100" y1="0" x2="100" y2="122" stroke="#9E9E9E" stroke-width="2"/>${[-1, 1].flatMap(z => [[-6, 18, 26], [-1, 26, 14], [4, 26, 2], [9, 18, -10]].map(([dy, dx, ey]) => `<path d="M${100 + z * 8} ${136 + dy} Q${100 + z * dx} ${126 + dy} ${100 + z * (dx + 8)} ${140 + ey}" stroke="#222" stroke-width="3" fill="none"/>`)).join('')}<ellipse cx="100" cy="138" rx="13" ry="16" fill="#222"/><circle cx="95" cy="146" r="3" fill="#fff"/><circle cx="105" cy="146" r="3" fill="#fff"/>`)],
  ['Een slang die een ballon heeft ingeslikt', svgD(`<rect width="200" height="200" fill="#FFF8E1"/><path d="M10 120 Q40 104 70 114" stroke="#43A047" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="105" cy="108" r="38" fill="#43A047"/><path d="M140 112 Q160 120 178 112" stroke="#43A047" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="180" cy="108" r="3" fill="#111"/><path d="M188 114 L198 112 M188 114 L198 118" stroke="#E53935" stroke-width="2"/>`)],
  ['Een spiegelei in de pan, van bovenaf gezien', svgD(`<rect width="200" height="200" fill="#ECEFF1"/><rect x="150" y="92" width="50" height="16" rx="6" fill="#37474F"/><circle cx="88" cy="100" r="74" fill="#455A64"/><circle cx="88" cy="100" r="66" fill="#263238"/><path d="M50 95 Q48 60 86 62 Q126 58 124 96 Q132 132 92 136 Q52 140 50 95 Z" fill="#fff"/><circle cx="88" cy="98" r="18" fill="#FFB300"/>`)],
  ["Een zebrapad 's nachts", svgD(`<rect width="200" height="200" fill="#111"/>${[18, 52, 86, 120, 154].map(x => `<rect x="${x}" y="40" width="22" height="120" fill="#F5F5F5"/>`).join('')}`)],
  ['Een cowboy die zich achter een rots verstopt', svgD(`<rect width="200" height="200" fill="#FFE0B2"/><g transform="translate(-8 9)"><ellipse cx="148" cy="96" rx="34" ry="7" fill="#795548"/><path d="M128 96 Q128 70 148 70 Q168 70 168 96 Z" fill="#8D6E63"/><rect x="130" y="88" width="36" height="5" fill="#4E342E"/></g><path d="M0 200 L0 150 Q30 96 100 104 Q170 100 200 140 L200 200 Z" fill="#A1887F"/><path d="M60 130 Q90 120 110 135" stroke="#8D6E63" stroke-width="3" fill="none"/>`)],
  ['Een potlood, gezien vanaf de punt', svgD(`<rect width="200" height="200" fill="#fff"/><polygon points="100,20 169,60 169,140 100,180 31,140 31,60" fill="#FDD835" stroke="#F9A825" stroke-width="4"/><circle cx="100" cy="100" r="44" fill="#F3D3A2"/><circle cx="100" cy="100" r="14" fill="#333"/>`)],
  ['Een paraplu, van bovenaf gezien', svgD(`<rect width="200" height="200" fill="#B0BEC5"/>${Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4, b = (k + 1) * Math.PI / 4; return `<path d="M100 100 L${100 + 82 * Math.cos(a)} ${100 + 82 * Math.sin(a)} L${100 + 82 * Math.cos(b)} ${100 + 82 * Math.sin(b)} Z" fill="${k % 2 ? '#E53935' : '#FFFFFF'}"/>`; }).join('')}<circle cx="100" cy="100" r="6" fill="#333"/>`)],
  ['Een sneeuwman na een warme zonnige dag', svgD(`<rect width="200" height="200" fill="#E3F2FD"/><circle cx="170" cy="30" r="20" fill="#FFD54F"/><ellipse cx="100" cy="150" rx="85" ry="26" fill="#90CAF9"/><rect x="74" y="112" width="44" height="30" fill="#212121"/><rect x="62" y="140" width="68" height="7" fill="#212121"/><polygon points="132,158 168,166 132,168" fill="#FB8C00"/><circle cx="60" cy="160" r="5" fill="#212121"/><circle cx="148" cy="146" r="5" fill="#212121"/>`)],
  ['Een ijsje dat op de grond is gevallen', svgD(`<rect width="200" height="200" fill="#F1F8E9"/><rect y="170" width="200" height="30" fill="#BCAAA4"/><path d="M40 172 Q50 150 80 152 Q100 140 125 152 Q160 150 165 172 Z" fill="#F48FB1"/><polygon points="86,154 120,154 103,92" fill="#D7A86E" stroke="#A1887F" stroke-width="3"/><path d="M92 140 L112 126 M95 128 L110 142" stroke="#A1887F" stroke-width="2"/>`)],
  ['Een trap voor een mier', svgD(`<rect width="200" height="200" fill="#FFFDE7"/><path d="M150 190 L150 182 L158 182 L158 174 L166 174 L166 166 L174 166 L174 158 L182 158 L182 190 Z" fill="#8D6E63"/><circle cx="160" cy="171" r="1.6" fill="#111"/><circle cx="163" cy="171" r="2" fill="#111"/><circle cx="167" cy="170" r="2.4" fill="#111"/>`)],
  ['Een tennisbal die net over het net vliegt', svgD(`<rect width="200" height="200" fill="#43A047"/><rect x="0" y="122" width="200" height="6" fill="#fff"/>${Array.from({ length: 21 }, (_, k) => `<line x1="${k * 10}" y1="128" x2="${k * 10}" y2="170" stroke="#E8F5E9" stroke-width="1.5"/>`).join('')}${[140, 150, 160].map(y => `<line x1="0" y1="${y}" x2="200" y2="${y}" stroke="#E8F5E9" stroke-width="1.5"/>`).join('')}<circle cx="120" cy="104" r="12" fill="#DCE775"/><path d="M110 98 Q120 104 130 110" stroke="#fff" stroke-width="2" fill="none"/><path d="M60 118 Q80 100 104 102" stroke="#fff" stroke-width="2" stroke-dasharray="5 5" fill="none"/>`)],
  ['Een vis die uit zijn kom is gesprongen', svgD(`<rect width="200" height="200" fill="#FFFFFF"/><path d="M30 120 Q30 186 90 186 Q150 186 150 120 Q150 92 128 80 L52 80 Q30 92 30 120 Z" fill="none" stroke="#90A4AE" stroke-width="4"/><path d="M34 120 Q34 180 90 180 Q146 180 146 120 Z" fill="#B3E5FC"/><ellipse cx="160" cy="44" rx="18" ry="10" fill="#FF7043" transform="rotate(-30 160 44)"/><polygon points="176,30 192,18 190,40" fill="#FF7043"/><circle cx="150" cy="52" r="2.5" fill="#111"/>${[[140, 70], [132, 80], [170, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#4FC3F7"/>`).join('')}`)],
);
DROEDEL_LOK.push('Een slak die een rondje rond een paddenstoel loopt', 'Een rode ballon in de mist', 'Een muis die een kaas heeft leeggegeten', 'Een vliegtuig van onderaf gezien');

/* ---------- Franse teksten ---------- */
INGEBOUWD['fr-teksten'].push(
  maakTekst('fr-lapin', 'Mon lapin', 1, `
Salut ! Je m'appelle Noah et j'ai dix ans. J'habite à Anvers avec mes parents. Mon animal préféré, c'est le lapin. J'ai un lapin blanc. Il s'appelle Neige. Il a de grandes oreilles et un petit nez rose. Il mange des carottes et de la salade. Le matin, je lui donne à manger avant l'école. Le soir, je joue avec lui dans le jardin. Mon lapin est petit, mais il saute très haut !`, `
Hoe oud is Noah? | *10 jaar | 11 jaar | 12 jaar
Welk dier heeft Noah? | *Een konijn | Een kat | Een hond
Welke kleur heeft Neige? | *Wit | Zwart | Bruin
Wat eet het konijn? | *Wortels en sla | Appels en brood | Gras en hooi
Wanneer speelt Noah met zijn konijn? | *'s Avonds in de tuin | 's Morgens voor school | Op zaterdag in het park`),
  maakTekst('fr-anniversaire', "L'anniversaire de Chloé", 2, `
Samedi, c'est l'anniversaire de Chloé. Elle a douze ans. Elle invite cinq amis à la maison. Sa maman prépare un grand gâteau au chocolat avec douze bougies. À trois heures, les amis arrivent. Ils jouent dans le jardin et ils dansent dans le salon. Ensuite, Chloé ouvre ses cadeaux : un livre, un jeu de société et un t-shirt bleu. Son cadeau préféré, c'est le jeu. À six heures, les parents viennent chercher les enfants. « Merci pour cette belle fête ! » disent les amis.`, `
Hoe oud wordt Chloé? | *12 jaar | 11 jaar | 13 jaar
Hoeveel vrienden nodigt ze uit? | *Vijf | Twaalf | Drie
Wat voor taart maakt mama? | *Een chocoladetaart | Een aardbeientaart | Een appeltaart
Welk cadeau vindt Chloé het leukst? | *Het gezelschapsspel | Het boek | De T-shirt
Wanneer komen de ouders de kinderen halen? | *Om zes uur | Om drie uur | Om vijf uur`),
  maakTekst('fr-tarte', 'Le mystère de la tarte', 3, `
Dimanche matin, Grand-mère prépare une tarte aux pommes. Elle la met sur la fenêtre pour la faire refroidir. Une heure plus tard, la tarte a disparu ! Sur la table, il y a des miettes. Par terre, il y a de petites traces de pattes pleines de boue. « Ce n'est pas moi ! » crie Tom. « Je jouais à la console. » Sa sœur Lina était à la piscine. Grand-mère regarde les traces. Elles vont de la fenêtre au jardin, puis jusqu'à la niche. Dans la niche, Rex, le chien, dort… avec de la tarte sur le museau ! Tout le monde rit. Grand-mère fait une deuxième tarte, mais cette fois, elle ferme la fenêtre.`, `
Wat bakt oma? | *Een appeltaart | Een chocoladetaart | Pannenkoeken
Waarom zet ze de taart aan het raam? | *Om ze te laten afkoelen | Om ze te tonen aan de buren | Om ze te verstoppen
Waar was Lina? | *In het zwembad | In de tuin | Bij een vriendin
Welke sporen ziet oma? | *Kleine modderige pootafdrukken | Voetstappen van schoenen | Fietssporen
Wie heeft de taart opgegeten? | *Rex, de hond | Tom | De buurman`),
  maakTekst('fr-inventions', 'Des inventions belges', 4, `
La Belgique est un petit pays, mais les Belges ont eu beaucoup de bonnes idées. Adolphe Sax est né à Dinant en 1814. Il a inventé le saxophone, un instrument qu'on entend aujourd'hui partout dans le monde. Un autre Belge, Jean Neuhaus, a créé la première praline en 1912 à Bruxelles : un chocolat avec une farce à l'intérieur. Georges Lemaître était prêtre et scientifique. Il a été le premier à dire que l'univers a commencé par une sorte de grande explosion : c'est la théorie du Big Bang. Et savez-vous que les patins à roulettes ont été inventés par John Joseph Merlin, un Belge né à Huy ? Pour montrer son invention, il est entré dans une fête en patinant… et il a cassé un grand miroir !`, `
Waar werd Adolphe Sax geboren? | *In Dinant | In Brussel | In Hoei
Wat is een praline? | *Chocolade met een vulling | Een muziekinstrument | Een soort taart
Wat was Georges Lemaître? | *Priester en wetenschapper | Muzikant | Chocolatier
Waarover gaat de theorie van de oerknal (Big Bang)? | *Over het begin van het heelal | Over hoe planeten draaien | Over hoe chocolade smelt
Wat gebeurde er toen Merlin zijn rolschaatsen toonde? | *Hij brak een grote spiegel | Hij won een prijs | Niemand kwam kijken`),
  maakTekst('fr-abeilles', 'Les abeilles', 5, `
Les abeilles sont de petits insectes, mais elles sont très importantes pour la nature et pour nous. Une ruche peut contenir jusqu'à cinquante mille abeilles. Chaque ruche a une seule reine. Elle pond des œufs toute la journée : jusqu'à deux mille par jour ! Les ouvrières font tout le reste du travail : elles nettoient la ruche, nourrissent les larves et récoltent le nectar des fleurs. Quand une abeille trouve beaucoup de fleurs, elle rentre à la ruche et fait une danse spéciale. Cette danse montre aux autres abeilles la direction et la distance des fleurs. En allant de fleur en fleur, les abeilles transportent le pollen. Ainsi, elles aident les plantes à produire des fruits. Sans abeilles, nous aurions beaucoup moins de pommes, de cerises et de fraises.`, `
Hoeveel bijen kunnen er in één bijenkorf wonen? | *Tot vijftigduizend | Tot tweeduizend | Tot vijfhonderd
Wat doet de koningin? | *Eitjes leggen | Nectar verzamelen | De korf schoonmaken
Wat toont de dans van een bij? | *Waar de bloemen zijn | Dat er gevaar dreigt | Dat de koningin ziek is
Wat dragen bijen van bloem naar bloem? | *Stuifmeel | Water | Eitjes
Waarom zijn bijen belangrijk voor ons? | *Zonder bijen zouden er veel minder vruchten zijn | Ze maken de lucht schoon | Ze eten schadelijke insecten`),
);

/* ---------- Engelse teksten ---------- */
INGEBOUWD['en-teksten'].push(
  maakTekst('en-zoe', 'My best friend', 1, `
This is my best friend, Zoe. She is eleven years old, like me. Zoe has got long brown hair and blue eyes. She is very funny and kind. We are in the same class. Our favourite subject is art, because we love drawing. Zoe has got a horse! It is called Thunder. On Saturdays, we go to the farm and we ride Thunder together. Zoe doesn't like spiders, but I do. I have got a big spider in a box in my bedroom!`, `
Hoe oud is Zoe? | *11 jaar | 12 jaar | 10 jaar
Welke kleur hebben haar ogen? | *Blauw | Bruin | Groen
Wat is hun lievelingsvak? | *Tekenen | Engels | Turnen
Welk dier heeft Zoe? | *Een paard | Een spin | Een hond
Waar houdt Zoe niet van? | *Spinnen | Paarden | Tekenen`),
  maakTekst('en-biscuit', 'The lost dog', 2, `
On Monday afternoon, Ben is walking home from school. Near the bakery, he sees a small dog. The dog is wet and it looks sad. It has got a red collar, but there is no name on it. Ben gives the dog a piece of his sandwich. Then the dog follows him home. Ben's mum takes a photo of the dog and puts it on the internet. On Tuesday evening, the phone rings. It is an old lady. "That's my dog, Biscuit!" she says. She comes to Ben's house and hugs her dog. She is so happy that she gives Ben a big box of chocolates.`, `
Waar ziet Ben de hond? | *Bij de bakkerij | In het park | Op school
Wat draagt de hond? | *Een rode halsband | Een blauwe sjaal | Een naamplaatje
Wat geeft Ben aan de hond? | *Een stukje van zijn boterham | Een kom water | Een bal
Wie belt er op dinsdagavond? | *Een oude dame | De politie | De bakker
Wat krijgt Ben als bedankje? | *Een grote doos chocolaatjes | Een puppy | Geld`),
  maakTekst('en-treasure', 'The treasure hunt', 3, `
Last Saturday, Lily organised a treasure hunt for her cousins. She hid six clues in the house and the garden. The first clue was under the doormat. It said: "I have got four legs, but I can't walk. You sit on me when you eat." The children ran to the kitchen and found the second clue under a chair. The clues took them to the bathtub, the piano, the old apple tree and finally the garden shed. In the shed, there was a wooden box with a lock. The key was hidden in a very cold place: it was frozen in an ice cube in the freezer! When they opened the box, they found sweets, stickers and a note: "You are the best detectives in the world!"`, `
Hoeveel aanwijzingen verstopte Lily? | *Zes | Vier | Tien
Waar lag de eerste aanwijzing? | *Onder de deurmat | In de badkuip | Onder de appelboom
Welk voorwerp wordt bedoeld met het raadsel op de eerste aanwijzing? | *Een stoel | Een paard | Een bed
Waar zat de sleutel? | *In een ijsblokje in de diepvries | Onder de piano | In het tuinhuis
Wat zat er in de doos? | *Snoep, stickers en een briefje | Geld en een kaart | Een boek en een pen`),
  maakTekst('en-machine', "Grandpa's strange machine", 4, `
When Max was ten, he spent the summer at his grandfather's farm. One rainy afternoon, he climbed into the attic and found a strange machine. It looked like an old wardrobe with dozens of buttons and a clock that was running backwards. On a label, someone had written: "Do not press the green button!" Of course, Max pressed the green button. There was a flash of light, and suddenly the attic was full of dust and spider webs. Max went downstairs. The kitchen looked completely different and a young boy was eating porridge at the table. "Who are you?" asked the boy. Max recognised his eyes: it was his grandfather, sixty years younger! Together they spent an amazing day. In the evening, Max pressed the button again and returned home. Grandpa was waiting for him with a smile. "I have been waiting sixty years to see you again," he said.`, `
Waar bracht Max de zomer door? | *Op de boerderij van zijn opa | Aan zee | In een kasteel
Wat was er vreemd aan de klok van de machine? | *Ze liep achteruit | Ze had geen wijzers | Ze sloeg elk uur
Op welke knop mocht niemand drukken? | *De groene | De rode | De blauwe
Wie zat er in de keuken pap te eten? | *Zijn opa, als jonge jongen | Zijn vader | Een robot
Wat zei opa op het einde? | *Dat hij al zestig jaar wachtte om Max terug te zien | Dat Max straf kreeg | Dat de machine kapot was`),
  maakTekst('en-octopus', 'Clever octopuses', 5, `
Octopuses are some of the most intelligent animals in the sea. An octopus has eight arms, three hearts and blue blood. Its arms are covered with suckers that can taste and feel at the same time. Octopuses are masters of disguise: in less than a second, they can change the colour and even the texture of their skin to look like a rock, sand or coral. When an enemy attacks, an octopus can squirt a cloud of dark ink and escape. Scientists have watched octopuses open jars, solve puzzles and even escape from their tanks at night. Some octopuses carry coconut shells and use them as a mobile home. However, most octopuses have a short life: many species live only one or two years.`, `
Hoeveel harten heeft een octopus? | *Drie | Eén | Acht
Wat kunnen de zuignappen van een octopus? | *Proeven en voelen | Zien en horen | Licht maken
Wat doet een octopus als een vijand aanvalt? | *Hij spuit een wolk inkt | Hij blaast zich op | Hij maakt veel lawaai
Waarvoor gebruiken sommige octopussen kokosnootschalen? | *Als huisje dat ze meenemen | Als speelgoed | Om voedsel in te bewaren
Hoe lang leven veel octopussen? | *Eén of twee jaar | Twintig jaar | Honderd jaar`),
);
