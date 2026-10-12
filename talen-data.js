'use strict';
/* Ingebouwde inhoud Frans en Engels. Leerkrachten voegen eigen lijsten en teksten toe in het leerkrachtoverzicht. */

const maakLijst = (id, naam, tekst) => ({ id, naam, woorden: tekst.trim().split('\n').map(r => r.split(';').map(s => s.trim())) });

INGEBOUWD['fr-woorden'].push(
  maakLijst('fr-familie', 'La famille (familie)', `
de vader;le père
de moeder;la mère
de broer;le frère
de zus;la sœur
de ouders;les parents
de grootvader;le grand-père
de grootmoeder;la grand-mère
de oom;l'oncle
de tante;la tante
de neef;le cousin
de nicht;la cousine
de zoon;le fils
de dochter;la fille
de baby;le bébé
de echtgenoot;le mari
de echtgenote;la femme`),
  maakLijst('fr-school', "L'école (school)", `
het schrift;le cahier
het boek;le livre
de pen;le stylo
het potlood;le crayon
de gom;la gomme
de lat;la règle
de boekentas;le cartable
het bord;le tableau
de klas;la classe
de leerkracht;le professeur
de leerling;l'élève
de speeltijd;la récréation
het huiswerk;les devoirs
de pennenzak;la trousse
de schaar;les ciseaux
het woordenboek;le dictionnaire`),
  maakLijst('fr-dieren', 'Les animaux (dieren)', `
de hond;le chien
de kat;le chat
het paard;le cheval
de koe;la vache
het varken;le cochon
het schaap;le mouton
de kip;la poule
het konijn;le lapin
de vogel;l'oiseau
de vis;le poisson
de muis;la souris
de leeuw;le lion
de olifant;l'éléphant
de aap;le singe
de slang;le serpent
de kikker;la grenouille`),
  maakLijst('fr-eten', 'La nourriture (eten)', `
het brood;le pain
de kaas;le fromage
de boter;le beurre
het vlees;la viande
de appel;la pomme
de peer;la poire
de banaan;la banane
de aardbei;la fraise
de melk;le lait
het water;l'eau
het sinaasappelsap;le jus d'orange
de taart;le gâteau
het ijsje;la glace
de frietjes;les frites
de soep;la soupe
het ei;l'œuf
de confituur;la confiture`),
  maakLijst('fr-kleren', 'Les vêtements (kleren)', `
de broek;le pantalon
de rok;la jupe
het kleed;la robe
het hemd;la chemise
de trui;le pull
het T-shirt;le t-shirt
de vest;la veste
de mantel;le manteau
de schoenen;les chaussures
de kousen;les chaussettes
de hoed;le chapeau
de pet;la casquette
de sjaal;l'écharpe
de handschoenen;les gants
de short;le short
het zwempak;le maillot de bain`),
  maakLijst('fr-huis', 'La maison (huis)', `
het huis;la maison
de keuken;la cuisine
de woonkamer;le salon
de slaapkamer;la chambre
de badkamer;la salle de bains
de tuin;le jardin
de deur;la porte
het raam;la fenêtre
de tafel;la table
de stoel;la chaise
het bed;le lit
de trap;l'escalier
het dak;le toit
de muur;le mur
de zolder;le grenier
de kelder;la cave`),
  maakLijst('fr-lichaam', 'Le corps (lichaam)', `
het hoofd;la tête
het haar;les cheveux
het oog;l'œil
de ogen;les yeux
de neus;le nez
de mond;la bouche
het oor;l'oreille
de tand;la dent
de hals;le cou
de arm;le bras
de hand;la main
de vinger;le doigt
het been;la jambe
de voet;le pied
de buik;le ventre
de rug;le dos`),
  maakLijst('fr-dagen', 'Les jours et les mois (dagen en maanden)', `
maandag;lundi
dinsdag;mardi
woensdag;mercredi
donderdag;jeudi
vrijdag;vendredi
zaterdag;samedi
zondag;dimanche
januari;janvier
februari;février
maart;mars
april;avril
mei;mai
juni;juin
juli;juillet
augustus;août
september;septembre
oktober;octobre
november;novembre
december;décembre`),
  maakLijst('fr-getallen', 'Les nombres (getallen)', `
1 (één);un
2 (twee);deux
3 (drie);trois
4 (vier);quatre
5 (vijf);cinq
6 (zes);six
7 (zeven);sept
8 (acht);huit
9 (negen);neuf
10 (tien);dix
11 (elf);onze
12 (twaalf);douze
13 (dertien);treize
14 (veertien);quatorze
15 (vijftien);quinze
16 (zestien);seize
20 (twintig);vingt
30 (dertig);trente
40 (veertig);quarante
50 (vijftig);cinquante
60 (zestig);soixante
70 (zeventig);septante/soixante-dix
80 (tachtig);quatre-vingts
90 (negentig);nonante/quatre-vingt-dix
100 (honderd);cent`),
);

INGEBOUWD['en-woorden'].push(
  maakLijst('en-family', 'Family (familie)', `
de vader;father
de moeder;mother
de broer;brother
de zus;sister
de ouders;parents
de grootvader;grandfather
de grootmoeder;grandmother
de oom;uncle
de tante;aunt
de neef / de nicht;cousin
de zoon;son
de dochter;daughter
de baby;baby
de echtgenoot;husband
de echtgenote;wife
de kleinkinderen;grandchildren`),
  maakLijst('en-school', 'School (school)', `
het schrift;notebook
het boek;book
de pen;pen
het potlood;pencil
de gom;rubber/eraser
de lat;ruler
de boekentas;schoolbag/school bag
het bord;board/blackboard
het klaslokaal;classroom
de leerkracht;teacher
de leerling;pupil/student
de speeltijd;break/playtime
het huiswerk;homework
de pennenzak;pencil case
de schaar;scissors
het woordenboek;dictionary`),
  maakLijst('en-animals', 'Animals (dieren)', `
de hond;dog
de kat;cat
het paard;horse
de koe;cow
het varken;pig
het schaap;sheep
de kip;chicken/hen
het konijn;rabbit
de vogel;bird
de vis;fish
de muis;mouse
de leeuw;lion
de olifant;elephant
de aap;monkey
de slang;snake
de kikker;frog`),
  maakLijst('en-food', 'Food (eten)', `
het brood;bread
de kaas;cheese
de boter;butter
het vlees;meat
de appel;apple
de peer;pear
de banaan;banana
de aardbei;strawberry
de melk;milk
het water;water
het sinaasappelsap;orange juice
de taart;cake
het ijsje;ice cream
de frietjes;chips/fries
de soep;soup
het ei;egg
de confituur;jam`),
  maakLijst('en-clothes', 'Clothes (kleren)', `
de broek;trousers/pants
de rok;skirt
het kleed;dress
het hemd;shirt
de trui;jumper/sweater
het T-shirt;T-shirt
de vest;jacket
de mantel;coat
de schoenen;shoes
de kousen;socks
de hoed;hat
de pet;cap
de sjaal;scarf
de handschoenen;gloves
de short;shorts
het zwempak;swimsuit`),
  maakLijst('en-house', 'The house (huis)', `
het huis;house
de keuken;kitchen
de woonkamer;living room
de slaapkamer;bedroom
de badkamer;bathroom
de tuin;garden
de deur;door
het raam;window
de tafel;table
de stoel;chair
het bed;bed
de trap;stairs
het dak;roof
de muur;wall
de zolder;attic
de kelder;cellar/basement`),
  maakLijst('en-body', 'The body (lichaam)', `
het hoofd;head
het haar;hair
het oog;eye
de ogen;eyes
de neus;nose
de mond;mouth
het oor;ear
de tand;tooth
de tanden;teeth
de hals;neck
de arm;arm
de hand;hand
de vinger;finger
het been;leg
de voet;foot
de voeten;feet
de buik;stomach/belly
de rug;back`),
  maakLijst('en-days', 'Days and months (dagen en maanden)', `
maandag;Monday
dinsdag;Tuesday
woensdag;Wednesday
donderdag;Thursday
vrijdag;Friday
zaterdag;Saturday
zondag;Sunday
januari;January
februari;February
maart;March
april;April
mei;May
juni;June
juli;July
augustus;August
september;September
oktober;October
november;November
december;December`),
  maakLijst('en-numbers', 'Numbers (getallen)', `
1 (één);one
2 (twee);two
3 (drie);three
4 (vier);four
5 (vijf);five
6 (zes);six
7 (zeven);seven
8 (acht);eight
9 (negen);nine
10 (tien);ten
11 (elf);eleven
12 (twaalf);twelve
13 (dertien);thirteen
14 (veertien);fourteen
15 (vijftien);fifteen
20 (twintig);twenty
30 (dertig);thirty
40 (veertig);forty
50 (vijftig);fifty
100 (honderd);a hundred/one hundred`),
);

/* Franse werkwoorden in de présent: inf;betekenis;je;tu;il/elle;nous;vous;ils/elles;aanvulling voor een zin */
const maakFww = (id, naam, tekst) => ({ id, naam, ww: tekst.trim().split('\n').map(r => { const p = r.split(';').map(s => s.trim()); return { inf: p[0], nl: p[1], vormen: p.slice(2, 8), zin: p[8] || '' }; }) });
INGEBOUWD['fr-ww'].push(
  maakFww('fr-etre-avoir', 'être en avoir', `
être;zijn;suis;es;est;sommes;êtes;sont;à la maison
avoir;hebben;ai;as;a;avons;avez;ont;un chien`),
  maakFww('fr-er', 'Werkwoorden op -er', `
parler;spreken;parle;parles;parle;parlons;parlez;parlent;français
aimer;graag hebben;aime;aimes;aime;aimons;aimez;aiment;le chocolat
jouer;spelen;joue;joues;joue;jouons;jouez;jouent;au foot
regarder;kijken;regarde;regardes;regarde;regardons;regardez;regardent;la télé
manger;eten;mange;manges;mange;mangeons;mangez;mangent;une pomme
habiter;wonen;habite;habites;habite;habitons;habitez;habitent;à Bruxelles
écouter;luisteren;écoute;écoutes;écoute;écoutons;écoutez;écoutent;de la musique
travailler;werken;travaille;travailles;travaille;travaillons;travaillez;travaillent;beaucoup`),
  maakFww('fr-onr', 'Onregelmatige werkwoorden', `
aller;gaan;vais;vas;va;allons;allez;vont;à l'école
faire;doen;fais;fais;fait;faisons;faites;font;les devoirs
prendre;nemen;prends;prends;prend;prenons;prenez;prennent;le bus
venir;komen;viens;viens;vient;venons;venez;viennent;de Gand
vouloir;willen;veux;veux;veut;voulons;voulez;veulent;une glace
pouvoir;kunnen;peux;peux;peut;pouvons;pouvez;peuvent;nager
dire;zeggen;dis;dis;dit;disons;dites;disent;bonjour
voir;zien;vois;vois;voit;voyons;voyez;voient;la mer
mettre;aantrekken;mets;mets;met;mettons;mettez;mettent;un pull
lire;lezen;lis;lis;lit;lisons;lisez;lisent;un livre
savoir;weten;sais;sais;sait;savons;savez;savent;la réponse
boire;drinken;bois;bois;boit;buvons;buvez;boivent;de l'eau
écrire;schrijven;écris;écris;écrit;écrivons;écrivez;écrivent;une lettre`),
  maakFww('fr-ir-re', 'Werkwoorden op -ir en -re', `
finir;afmaken;finis;finis;finit;finissons;finissez;finissent;le travail
choisir;kiezen;choisis;choisis;choisit;choisissons;choisissez;choisissent;un dessert
dormir;slapen;dors;dors;dort;dormons;dormez;dorment;bien
partir;vertrekken;pars;pars;part;partons;partez;partent;demain
vendre;verkopen;vends;vends;vend;vendons;vendez;vendent;des fleurs
attendre;wachten op;attends;attends;attend;attendons;attendez;attendent;le train`),
);

/* Engelse onregelmatige werkwoorden: infinitive;past simple;past participle;betekenis */
const maakEww = (id, naam, tekst) => ({ id, naam, ww: tekst.trim().split('\n').map(r => { const p = r.split(';').map(s => s.trim()); return { inf: p[0], past: p[1], pp: p[2], nl: p[3] }; }) });
INGEBOUWD['en-ww'].push(
  maakEww('en-irr-1', 'Irregular verbs 1 (de bekendste)', `
be;was/were;been;zijn
have;had;had;hebben
do;did;done;doen
go;went;gone;gaan
come;came;come;komen
see;saw;seen;zien
get;got;got/gotten;krijgen
make;made;made;maken
take;took;taken;nemen
give;gave;given;geven
eat;ate;eaten;eten
drink;drank;drunk;drinken
say;said;said;zeggen
know;knew;known;weten
think;thought;thought;denken
buy;bought;bought;kopen
run;ran;run;rennen
swim;swam;swum;zwemmen
write;wrote;written;schrijven
read;read;read;lezen
sleep;slept;slept;slapen
sit;sat;sat;zitten
find;found;found;vinden
tell;told;told;vertellen
put;put;put;leggen`),
  maakEww('en-irr-2', 'Irregular verbs 2', `
begin;began;begun;beginnen
break;broke;broken;breken
bring;brought;brought;brengen
build;built;built;bouwen
catch;caught;caught;vangen
choose;chose;chosen;kiezen
draw;drew;drawn;tekenen
drive;drove;driven;(met de auto) rijden
fall;fell;fallen;vallen
feel;felt;felt;voelen
fly;flew;flown;vliegen
forget;forgot;forgotten;vergeten
grow;grew;grown;groeien
hear;heard;heard;horen
keep;kept;kept;houden
leave;left;left;vertrekken
lose;lost;lost;verliezen
meet;met;met;ontmoeten
pay;paid;paid;betalen
ride;rode;ridden;(fiets, paard) rijden
sell;sold;sold;verkopen
send;sent;sent;sturen
sing;sang;sung;zingen
speak;spoke;spoken;spreken
teach;taught;taught;lesgeven
throw;threw;thrown;gooien
understand;understood;understood;begrijpen
wake;woke;woken;wakker worden
wear;wore;worn;dragen (kleren)
win;won;won;winnen`),
);

/* Teksten. Vragen: "vraag | *juist | fout | fout" (het juiste antwoord met een sterretje) */
const maakTekst = (id, titel, niveau, inhoud, vragen) => ({
  id, titel, niveau, tekst: inhoud.trim().replace(/\n\s*/g, '\n'),
  vragen: vragen.trim().split('\n').map(r => { const d = r.split('|').map(s => s.trim()); const opties = d.slice(1).map(o => o.replace(/^\*/, '')); return { v: d[0], opties, juist: d.slice(1).findIndex(o => o.startsWith('*')) }; }),
});

INGEBOUWD['fr-teksten'].push(
  maakTekst('fr-lea', "Je m'appelle Léa", 1, `
Bonjour ! Je m'appelle Léa. J'ai onze ans et j'habite à Gand, en Belgique. J'ai un frère et une sœur. Mon frère s'appelle Tom. Il a huit ans. Ma sœur s'appelle Julie. Elle a quatorze ans. Nous avons un chien. Il s'appelle Max et il est très drôle. À l'école, j'aime le français et la gymnastique, mais je n'aime pas les mathématiques. Le mercredi après-midi, je joue au tennis avec mon amie Sarah.`, `
Hoe oud is Léa? | *11 jaar | 8 jaar | 14 jaar
Waar woont Léa? | *In Gent | In Brussel | In Parijs
Hoe heet de hond? | *Max | Tom | Sarah
Wat vindt Léa niet leuk? | *Wiskunde | Frans | Turnen
Wat doet Léa op woensdagnamiddag? | *Ze speelt tennis | Ze gaat zwemmen | Ze leest een boek`),
  maakTekst('fr-marche', 'Au marché', 2, `
Le samedi matin, Paul va au marché avec sa maman. Il fait beau et il y a beaucoup de monde.
« Bonjour madame ! Je voudrais un kilo de pommes, s'il vous plaît. »
« Voilà. C'est trois euros. »
« Vous avez aussi des fraises ? »
« Oui, elles sont très bonnes aujourd'hui. Une barquette coûte quatre euros. »
« Alors, une barquette de fraises aussi. Ça fait combien ? »
« Ça fait sept euros, s'il vous plaît. »
Paul donne un billet de dix euros. La marchande lui rend trois euros. Sur le chemin du retour, Paul mange déjà une fraise !`, `
Wanneer gaat Paul naar de markt? | *Op zaterdagochtend | Op zondag | Op woensdagnamiddag
Hoeveel kosten de appels? | *3 euro | 4 euro | 7 euro
Wat koopt Paul nog meer? | *Aardbeien | Peren | Bananen
Hoeveel geld krijgt Paul terug? | *3 euro | 7 euro | 10 euro
Wat doet Paul op de terugweg? | *Hij eet een aardbei | Hij koopt een ijsje | Hij speelt met een vriend`),
  maakTekst('fr-mer', 'Une journée à la mer', 3, `
C'est l'été. La famille Dubois passe la journée à la mer, à Ostende. Papa porte le grand parasol et maman porte le panier avec les sandwichs. Les enfants, Emma et Lucas, courent vers l'eau. L'eau est froide, mais ils nagent quand même. Ensuite, ils construisent un énorme château de sable avec des tours. À midi, toute la famille mange sur la plage. Tout à coup, une mouette vole au-dessus d'eux et prend le sandwich de Lucas ! Tout le monde rit, sauf Lucas. Heureusement, maman a encore une gaufre pour lui. Le soir, ils rentrent fatigués mais contents.`, `
Waar brengt de familie de dag door? | *Aan zee, in Oostende | In de bergen | In het zwembad
Wat draagt mama? | *De mand met boterhammen | De grote parasol | De handdoeken
Wat bouwen Emma en Lucas? | *Een zandkasteel | Een boot | Een hut
Wat gebeurt er met de boterham van Lucas? | *Een meeuw neemt hem mee | Hij valt in het zand | Emma eet hem op
Wat krijgt Lucas daarna van mama? | *Een wafel | Een ijsje | Een appel`),
  maakTekst('fr-chevalier', 'Le chevalier et le dragon', 4, `
Il était une fois un jeune chevalier qui s'appelait Arthur. Il habitait dans un petit château près d'une grande forêt. Un jour, le roi lui dit : « Un dragon terrible vit dans la montagne. Il vole nos moutons et il fait peur aux villageois. Va le chercher ! » Arthur prend son épée, son bouclier et son cheval, et il part. Après trois jours, il arrive devant une grotte sombre. Il entend un bruit étrange : le dragon pleure ! « Pourquoi est-ce que tu pleures ? » demande Arthur. « Je suis tout seul et personne ne veut être mon ami », répond le dragon. Arthur range son épée. Il invite le dragon au château. Depuis ce jour, le dragon protège le village et il ne vole plus jamais de moutons.`, `
Waar woont Arthur? | *In een klein kasteel bij een bos | In een grot | In een dorp aan zee
Waarom moet Arthur de draak zoeken? | *De draak steelt schapen | De draak heeft een prinses ontvoerd | De draak wil het kasteel
Hoe lang reist Arthur? | *Drie dagen | Een week | Eén dag
Wat doet de draak als Arthur aankomt? | *Hij huilt | Hij spuwt vuur | Hij slaapt
Hoe loopt het verhaal af? | *De draak beschermt het dorp | Arthur verslaat de draak | De draak vliegt weg`),
  maakTekst('fr-systeme', 'Le système solaire', 5, `
Notre système solaire est composé du Soleil et de huit planètes. Le Soleil est une étoile : c'est une énorme boule de gaz très chaude. Les quatre planètes les plus proches du Soleil sont Mercure, Vénus, la Terre et Mars. Elles sont petites et rocheuses. Ensuite viennent les géantes gazeuses : Jupiter, Saturne, Uranus et Neptune. Jupiter est la plus grande planète. Elle est tellement grande que plus de mille Terres pourraient entrer dedans ! Saturne est célèbre pour ses magnifiques anneaux, faits de glace et de poussière. Vénus est la planète la plus chaude, parce que son atmosphère garde la chaleur comme une couverture. La Terre est la seule planète où nous connaissons la vie.`, `
Uit hoeveel planeten bestaat ons zonnestelsel? | *Acht | Negen | Zeven
Wat is de zon? | *Een ster | Een planeet | Een maan
Welke planeet is de grootste? | *Jupiter | Saturnus | Neptunus
Waarvan zijn de ringen van Saturnus gemaakt? | *Van ijs en stof | Van gas en vuur | Van steen en ijzer
Waarom is Venus de heetste planeet? | *Haar atmosfeer houdt de warmte vast | Ze staat het dichtst bij de zon | Ze heeft vulkanen die altijd branden`),
);

INGEBOUWD['en-teksten'].push(
  maakTekst('en-sam', "Hi, I'm Sam", 1, `
Hi! My name is Sam. I am twelve years old and I live in Bruges with my mum, my dad and my little sister, Mia. Mia is six. We have got two cats, Tiger and Smokey. My favourite colour is green and my favourite food is pizza. I go to school by bike. After school, I play football with my friends in the park. On Sundays, I visit my grandparents. My grandma makes the best pancakes in the world!`, `
Hoe oud is Sam? | *12 jaar | 6 jaar | 10 jaar
Waar woont Sam? | *In Brugge | In Londen | In Gent
Hoeveel katten heeft het gezin? | *Twee | Eén | Drie
Hoe gaat Sam naar school? | *Met de fiets | Met de bus | Te voet
Wat maakt oma? | *Pannenkoeken | Pizza | Taart`),
  maakTekst('en-zoo', 'At the zoo', 2, `
Today our class is going to the zoo. We take the bus at nine o'clock. First, we visit the elephants. They are very big and they are eating hay. Then we see the monkeys. One monkey steals the cap of our teacher, Mr Brown! Everybody laughs. At twelve o'clock, we eat our lunch near the lake. In the afternoon, we watch the penguins. A zookeeper gives them fish. My favourite animals are the giraffes, because they are so tall and elegant. At four o'clock, we take the bus back to school. What a great day!`, `
Hoe gaat de klas naar de zoo? | *Met de bus | Met de trein | Met de fiets
Wat eten de olifanten? | *Hooi | Vis | Bananen
Wat doet een aap? | *Hij steelt de pet van de leerkracht | Hij eet een banaan | Hij springt in het meer
Wat krijgen de pinguïns van de dierenverzorger? | *Vis | Hooi | Brood
Waarom vindt de verteller giraffen het leukst? | *Ze zijn groot en sierlijk | Ze zijn grappig | Ze kunnen zwemmen`),
  maakTekst('en-rain', 'A rainy Saturday', 3, `
It is Saturday and it is raining. Emma and her brother Jack are bored. They can't play outside. "Let's build a fort!" says Jack. They take all the cushions from the sofa and some blankets from the bedroom. Their fort is big enough for two children and the dog. Inside the fort, they read comics with a torch. Then Mum calls them: "Who wants hot chocolate?" The children run to the kitchen. Later, the rain stops and a beautiful rainbow appears in the sky. "Look!" shouts Emma. "Let's go outside and jump in the puddles!" They put on their boots and run into the garden.`, `
Waarom vervelen Emma en Jack zich? | *Het regent en ze kunnen niet buiten spelen | Ze zijn ziek | Hun vrienden zijn op reis
Waarmee bouwen ze hun fort? | *Met kussens en dekens | Met dozen en papier | Met stoelen en tafels
Wat doen ze in het fort? | *Strips lezen met een zaklamp | Een film kijken | Een spelletje spelen
Wat biedt mama aan? | *Warme chocolademelk | Pannenkoeken | Een koekje
Wat doen de kinderen op het einde? | *In de plassen springen | Een tekening maken | Gaan slapen`),
  maakTekst('en-knight', 'The knight who was afraid of the dark', 4, `
Sir Henry was the bravest knight in the kingdom. He was not afraid of dragons, wolves or giants. But Sir Henry had a secret: he was afraid of the dark. Every night, he slept with seven candles next to his bed. One evening, the king asked him to find a lost princess in the Black Cave. Sir Henry's knees were shaking. The cave was very dark and very deep. He lit a torch and walked in slowly. Suddenly, the wind blew out his torch. Sir Henry wanted to run away, but then he heard someone crying. It was the princess! She was scared too. "Take my hand," said Sir Henry. "We will find the way together." Holding hands, they walked towards a tiny light at the end of the cave. When they came out, everybody cheered. From that day on, Sir Henry only needed one candle.`, `
Wat was het geheim van Sir Henry? | *Hij was bang in het donker | Hij kon niet zwemmen | Hij was bang van draken
Hoeveel kaarsen stonden er elke nacht naast zijn bed? | *Zeven | Eén | Drie
Waar moest hij de prinses zoeken? | *In de Zwarte Grot | In het bos | In de toren
Wat gebeurde er met zijn fakkel? | *De wind blies ze uit | Hij liet ze vallen | De prinses nam ze mee
Wat veranderde er op het einde? | *Hij had nog maar één kaars nodig | Hij werd koning | Hij trouwde met de prinses`),
  maakTekst('en-solar', 'Our solar system', 5, `
Our solar system consists of the Sun and eight planets that travel around it. The Sun is a star, a gigantic ball of hot gas. It is so big that about one million Earths could fit inside it. The four inner planets, Mercury, Venus, Earth and Mars, are small and rocky. The four outer planets, Jupiter, Saturn, Uranus and Neptune, are much bigger and are made mostly of gas and ice. Light from the Sun needs about eight minutes to reach the Earth. Neptune is so far away that one year there lasts about 165 Earth years! Scientists keep exploring space with telescopes and robots, because there are still many mysteries to solve.`, `
Hoeveel aardes passen er ongeveer in de zon? | *Een miljoen | Duizend | Honderd
Hoe zijn de vier binnenste planeten? | *Klein en rotsachtig | Groot en gemaakt van gas | Bedekt met water
Hoe lang doet zonlicht over de reis naar de aarde? | *Ongeveer acht minuten | Eén seconde | Een uur
Hoe lang duurt een jaar op Neptunus? | *Ongeveer 165 aardse jaren | Een maand | Twaalf jaar
Waarom onderzoeken wetenschappers de ruimte? | *Er zijn nog veel raadsels | Ze willen er gaan wonen | Om nieuwe sterren te maken`),
);
