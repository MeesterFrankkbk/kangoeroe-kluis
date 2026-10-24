'use strict';
/* =====================================================================
   WOORDHULP EN VERTALING bij de ingebouwde Franse en Engelse teksten.
   woorden: één per regel → woordenboekvorm ; Nederlands ; vorm(en) zoals in de tekst (niet verplicht)
   vertaling: één zin per regel, in dezelfde volgorde als de zinnen van de tekst.
   Dezelfde woorden vormen ook een woordenlijst bij Woordenschat ("📖 titel van de tekst").
   ===================================================================== */
const TEKSTHULP = {
  'fr-lea': {
    woorden: `bonjour ; hallo, goeiedag
s'appeler ; heten ; m'appelle, s'appelle
onze ; elf
un an ; een jaar ; ans
habiter ; wonen ; habite
la Belgique ; België ; belgique
avoir ; hebben ; ai, avons
le frère ; de broer ; frère
la sœur ; de zus ; sœur
huit ; acht
quatorze ; veertien
le chien ; de hond ; chien
très ; heel, zeer
drôle ; grappig
l'école ; de school ; école
aimer ; graag hebben, houden van ; aime
le français ; het Frans (vak) ; français
la gymnastique ; de turnles ; gymnastique
mais ; maar
les mathématiques ; de wiskunde ; mathématiques
le mercredi ; woensdag ; mercredi
l'après-midi ; de namiddag ; après-midi
jouer ; spelen ; joue
avec ; met
l'amie ; de vriendin ; amie`,
    vertaling: `Hallo!
Ik heet Léa.
Ik ben elf jaar en ik woon in Gent, in België.
Ik heb een broer en een zus.
Mijn broer heet Tom.
Hij is acht jaar.
Mijn zus heet Julie.
Ze is veertien jaar.
We hebben een hond.
Hij heet Max en hij is heel grappig.
Op school vind ik Frans en turnen leuk, maar wiskunde vind ik niet leuk.
Op woensdagnamiddag speel ik tennis met mijn vriendin Sarah.`,
  },
  'fr-marche': {
    woorden: `le samedi ; zaterdag ; samedi
le matin ; de ochtend ; matin
aller ; gaan ; va
le marché ; de markt ; marché
il fait beau ; het is mooi weer ; il fait beau
il y a ; er is, er zijn ; il y a
beaucoup de monde ; veel volk ; beaucoup de monde
madame ; mevrouw
je voudrais ; ik zou graag (hebben) ; je voudrais
le kilo ; de kilo ; kilo
la pomme ; de appel ; pommes
s'il vous plaît ; alstublieft ; s'il vous plaît
voilà ; alstublieft (als je iets geeft), kijk
aussi ; ook
la fraise ; de aardbei ; fraises, fraise
bon ; goed, lekker ; bonnes
aujourd'hui ; vandaag
la barquette ; het bakje ; barquette
coûter ; kosten ; coûte
alors ; dan
ça fait combien ; hoeveel is het? ; ça fait combien
ça fait ; dat is (samen) ; ça fait
donner ; geven ; donne
le billet ; het (bank)briefje ; billet
la marchande ; de verkoopster ; marchande
rendre ; teruggeven ; rend
le chemin du retour ; de terugweg ; chemin du retour
manger ; eten ; mange
déjà ; al`,
    vertaling: `Op zaterdagochtend gaat Paul met zijn mama naar de markt.
Het is mooi weer en er is veel volk.
"Goeiedag, mevrouw!
Ik zou graag een kilo appels hebben, alstublieft."
"Alstublieft.
Dat is drie euro."
"Hebt u ook aardbeien?"
"Ja, ze zijn heel lekker vandaag.
Een bakje kost vier euro."
"Dan ook een bakje aardbeien.
Hoeveel is het?"
"Dat is zeven euro, alstublieft."
Paul geeft een briefje van tien euro.
De verkoopster geeft hem drie euro terug.
Op de terugweg eet Paul al een aardbei!`,
  },
  'fr-mer': {
    woorden: `l'été ; de zomer ; été
la famille ; het gezin ; famille
passer la journée ; de dag doorbrengen ; passe la journée
la mer ; de zee ; mer
porter ; dragen ; porte
grand ; groot ; grand
le panier ; de mand ; panier
le sandwich ; de boterham ; sandwichs, sandwich
les enfants ; de kinderen ; enfants
courir ; rennen ; courent
vers ; naar
l'eau ; het water ; eau
froid ; koud ; froide
nager ; zwemmen ; nagent
quand même ; toch ; quand même
ensuite ; daarna
construire ; bouwen ; construisent
énorme ; reusachtig
le château de sable ; het zandkasteel ; château de sable
la tour ; de toren ; tours
midi ; twaalf uur 's middags ; midi
la plage ; het strand ; plage
tout à coup ; plots ; tout à coup
la mouette ; de meeuw ; mouette
voler ; vliegen ; vole
au-dessus de ; boven ; au-dessus
prendre ; nemen ; prend
tout le monde ; iedereen ; tout le monde
rire ; lachen ; rit
sauf ; behalve
heureusement ; gelukkig
encore ; nog
la gaufre ; de wafel ; gaufre
le soir ; de avond ; soir
rentrer ; naar huis gaan ; rentrent
fatigué ; moe ; fatigués
content ; tevreden ; contents`,
    vertaling: `Het is zomer.
Het gezin Dubois brengt de dag door aan zee, in Oostende.
Papa draagt de grote parasol en mama draagt de mand met de boterhammen.
De kinderen, Emma en Lucas, rennen naar het water.
Het water is koud, maar ze zwemmen toch.
Daarna bouwen ze een reusachtig zandkasteel met torens.
Om twaalf uur eet het hele gezin op het strand.
Plots vliegt er een meeuw boven hen en neemt hij de boterham van Lucas!
Iedereen lacht, behalve Lucas.
Gelukkig heeft mama nog een wafel voor hem.
's Avonds gaan ze moe maar tevreden naar huis.`,
  },
  'fr-chevalier': {
    woorden: `il était une fois ; er was eens ; il était une fois
jeune ; jong
le chevalier ; de ridder ; chevalier
habiter ; wonen ; habitait
petit ; klein ; petit
le château ; het kasteel ; château
près de ; dicht bij ; près
grand ; groot ; grande
la forêt ; het bos ; forêt
un jour ; op een dag ; un jour
le jour ; de dag ; jour, jours
le roi ; de koning ; roi
dire ; zeggen ; dit
le dragon ; de draak ; dragon
terrible ; verschrikkelijk
vivre ; leven, wonen ; vit
la montagne ; de berg ; montagne
voler ; stelen ; vole
le mouton ; het schaap ; moutons
faire peur ; bang maken ; fait peur
le villageois ; de dorpeling ; villageois
chercher ; zoeken ; chercher
l'épée ; het zwaard ; épée
le bouclier ; het schild ; bouclier
le cheval ; het paard ; cheval
partir ; vertrekken ; part
après ; na
arriver ; aankomen ; arrive
devant ; voor
la grotte ; de grot ; grotte
sombre ; donker
entendre ; horen ; entend
le bruit ; het geluid ; bruit
étrange ; vreemd
pleurer ; huilen ; pleure, pleures
pourquoi ; waarom
demander ; vragen ; demande
tout seul ; helemaal alleen ; tout seul
personne ; niemand
vouloir ; willen ; veut
l'ami ; de vriend ; ami
répondre ; antwoorden ; répond
ranger ; wegsteken, opbergen ; range
inviter ; uitnodigen ; invite
depuis ; sinds
protéger ; beschermen ; protège
le village ; het dorp ; village
plus jamais ; nooit meer ; plus jamais`,
    vertaling: `Er was eens een jonge ridder die Arthur heette.
Hij woonde in een klein kasteel dicht bij een groot bos.
Op een dag zegt de koning tegen hem: "Er woont een verschrikkelijke draak in de berg.
Hij steelt onze schapen en hij maakt de dorpelingen bang.
Ga hem zoeken!"
Arthur neemt zijn zwaard, zijn schild en zijn paard, en hij vertrekt.
Na drie dagen komt hij aan bij een donkere grot.
Hij hoort een vreemd geluid: de draak huilt!
"Waarom huil je?" vraagt Arthur.
"Ik ben helemaal alleen en niemand wil mijn vriend zijn", antwoordt de draak.
Arthur steekt zijn zwaard weg.
Hij nodigt de draak uit in het kasteel.
Sinds die dag beschermt de draak het dorp en steelt hij nooit meer schapen.`,
  },
  'fr-systeme': {
    woorden: `le système solaire ; het zonnestelsel ; système solaire
être composé de ; bestaan uit ; est composé
le Soleil ; de zon ; soleil
huit ; acht
la planète ; de planeet ; planètes, planète
l'étoile ; de ster ; étoile
énorme ; reusachtig
la boule ; de bol ; boule
le gaz ; het gas ; gaz
chaud ; heet ; chaude
proche ; dichtbij ; proches
la Terre ; de aarde ; terre, terres
petit ; klein ; petites
rocheux ; rotsachtig ; rocheuses
ensuite ; daarna
venir ; komen ; viennent
la géante gazeuse ; de gasreus ; géantes gazeuses
la plus grande ; de grootste ; la plus grande
tellement ; zo
mille ; duizend
pourraient ; zouden kunnen
entrer dedans ; erin passen ; entrer dedans
célèbre ; beroemd
magnifique ; prachtig ; magnifiques
l'anneau ; de ring ; anneaux
la glace ; het ijs ; glace
la poussière ; het stof ; poussière
la plus chaude ; de heetste ; la plus chaude
parce que ; omdat ; parce que
l'atmosphère ; de atmosfeer ; atmosphère
garder ; houden ; garde
la chaleur ; de warmte ; chaleur
comme ; zoals
la couverture ; de deken ; couverture
seul ; enig ; seule
connaître ; kennen ; connaissons
la vie ; het leven ; vie`,
    vertaling: `Ons zonnestelsel bestaat uit de zon en acht planeten.
De zon is een ster: het is een reusachtige bol heel heet gas.
De vier planeten die het dichtst bij de zon staan, zijn Mercurius, Venus, de aarde en Mars.
Ze zijn klein en rotsachtig.
Daarna komen de gasreuzen: Jupiter, Saturnus, Uranus en Neptunus.
Jupiter is de grootste planeet.
Ze is zo groot dat er meer dan duizend aardes in zouden passen!
Saturnus is beroemd om zijn prachtige ringen, gemaakt van ijs en stof.
Venus is de heetste planeet, omdat haar atmosfeer de warmte vasthoudt zoals een deken.
De aarde is de enige planeet waar we leven kennen.`,
  },
  'fr-lapin': {
    woorden: `salut ; hoi
s'appeler ; heten ; m'appelle, s'appelle
dix ; tien
habiter ; wonen ; habite
les parents ; de ouders ; parents
l'animal préféré ; het lievelingsdier ; animal préféré
le lapin ; het konijn ; lapin
blanc ; wit
la neige ; de sneeuw ; neige
grand ; groot ; grandes
l'oreille ; het oor ; oreilles
petit ; klein ; petit
le nez ; de neus ; nez
rose ; roze
manger ; eten ; mange
la carotte ; de wortel ; carottes
la salade ; de sla ; salade
le matin ; de ochtend ; matin
donner à manger ; eten geven ; donne à manger
avant ; voor (in de tijd)
l'école ; de school ; école
le soir ; de avond ; soir
jouer ; spelen ; joue
avec ; met
le jardin ; de tuin ; jardin
mais ; maar
sauter ; springen ; saute
très haut ; heel hoog ; très haut`,
    vertaling: `Hoi!
Ik heet Noah en ik ben tien jaar.
Ik woon in Antwerpen met mijn ouders.
Mijn lievelingsdier is het konijn.
Ik heb een wit konijn.
Het heet Neige (Sneeuw).
Het heeft grote oren en een klein roze neusje.
Het eet wortels en sla.
's Morgens geef ik het eten voor ik naar school ga.
's Avonds speel ik ermee in de tuin.
Mijn konijn is klein, maar het springt heel hoog!`,
  },
  'fr-anniversaire': {
    woorden: `le samedi ; zaterdag ; samedi
l'anniversaire ; de verjaardag ; anniversaire
douze ; twaalf
inviter ; uitnodigen ; invite
cinq ; vijf
l'ami ; de vriend ; amis
la maison ; het huis ; maison
préparer ; klaarmaken ; prépare
le gâteau au chocolat ; de chocoladetaart ; gâteau au chocolat
la bougie ; de kaars ; bougies
trois heures ; drie uur ; trois heures
arriver ; aankomen ; arrivent
jouer ; spelen ; jouent
le jardin ; de tuin ; jardin
danser ; dansen ; dansent
le salon ; de woonkamer ; salon
ensuite ; daarna
ouvrir ; openen ; ouvre
le cadeau ; het cadeau ; cadeaux, cadeau
le livre ; het boek ; livre
le jeu de société ; het gezelschapsspel ; jeu de société
bleu ; blauw
préféré ; lievelings- ; préféré
le jeu ; het spel ; jeu
six heures ; zes uur ; six heures
venir chercher ; komen halen ; viennent chercher
les enfants ; de kinderen ; enfants
merci ; bedankt
beau ; mooi ; belle
la fête ; het feest ; fête
dire ; zeggen ; disent`,
    vertaling: `Zaterdag is Chloé jarig.
Ze wordt twaalf jaar.
Ze nodigt vijf vrienden uit bij haar thuis.
Haar mama maakt een grote chocoladetaart met twaalf kaarsjes.
Om drie uur komen de vrienden aan.
Ze spelen in de tuin en ze dansen in de woonkamer.
Daarna opent Chloé haar cadeaus: een boek, een gezelschapsspel en een blauwe T-shirt.
Haar lievelingscadeau is het spel.
Om zes uur komen de ouders de kinderen halen.
"Bedankt voor dit mooie feest!" zeggen de vrienden.`,
  },
  'fr-tarte': {
    woorden: `le dimanche ; zondag ; dimanche
le matin ; de ochtend ; matin
la grand-mère ; de oma ; grand-mère
préparer ; klaarmaken, bakken ; prépare
la tarte aux pommes ; de appeltaart ; tarte aux pommes
la tarte ; de taart ; tarte
mettre ; zetten ; met
la fenêtre ; het raam ; fenêtre
refroidir ; afkoelen
une heure plus tard ; een uur later ; une heure plus tard
disparaître ; verdwijnen ; disparu
la table ; de tafel ; table
il y a ; er is, er zijn ; il y a
la miette ; de kruimel ; miettes
par terre ; op de grond ; par terre
la trace ; het spoor ; traces
la patte ; de poot ; pattes
plein de ; vol met ; pleines
la boue ; de modder ; boue
ce n'est pas moi ; ik was het niet ; ce n'est pas moi
crier ; roepen ; crie
jouer ; spelen ; jouais
la piscine ; het zwembad ; piscine
regarder ; bekijken ; regarde
aller ; gaan ; vont
le jardin ; de tuin ; jardin
puis ; daarna
jusqu'à ; tot (aan) ; jusqu'à
la niche ; het hondenhok ; niche
le chien ; de hond ; chien
dormir ; slapen ; dort
le museau ; de snuit ; museau
tout le monde ; iedereen ; tout le monde
rire ; lachen ; rit
deuxième ; tweede
cette fois ; deze keer ; cette fois
fermer ; sluiten ; ferme`,
    vertaling: `Zondagochtend bakt oma een appeltaart.
Ze zet hem op de vensterbank om af te koelen.
Een uur later is de taart verdwenen!
Op de tafel liggen kruimels.
Op de grond staan kleine pootafdrukken vol modder.
"Ik was het niet!" roept Tom.
"Ik was met de spelconsole aan het spelen."
Zijn zus Lina was in het zwembad.
Oma bekijkt de sporen.
Ze lopen van het raam naar de tuin, en dan tot aan het hondenhok.
In het hondenhok slaapt Rex, de hond… met taart op zijn snuit!
Iedereen lacht.
Oma bakt een tweede taart, maar deze keer doet ze het raam dicht.`,
  },
  'fr-inventions': {
    woorden: `la Belgique ; België ; belgique
petit ; klein ; petit
le pays ; het land ; pays
le Belge ; de Belg ; belges, belge
l'idée ; het idee ; idées
être né ; geboren zijn ; est né, né
inventer ; uitvinden ; inventé, inventés
l'instrument ; het (muziek)instrument ; instrument
entendre ; horen ; entend
aujourd'hui ; vandaag
partout dans le monde ; overal ter wereld ; partout dans le monde
autre ; ander
créer ; maken, bedenken ; créé
premier ; eerste ; première, premier
la praline ; de praline ; praline
le chocolat ; de chocolade ; chocolat
la farce ; de vulling ; farce
à l'intérieur ; vanbinnen ; intérieur
le prêtre ; de priester ; prêtre
le scientifique ; de wetenschapper ; scientifique
l'univers ; het heelal ; univers
commencer ; beginnen ; commencé
une sorte de ; een soort ; sorte
l'explosion ; de ontploffing ; explosion
la théorie ; de theorie ; théorie
savoir ; weten ; savez-vous
les patins à roulettes ; de rolschaatsen ; patins à roulettes
montrer ; tonen ; montrer
l'invention ; de uitvinding ; invention
entrer ; binnengaan ; entré
la fête ; het feest ; fête
patiner ; schaatsen ; patinant
casser ; breken ; cassé
le miroir ; de spiegel ; miroir`,
    vertaling: `België is een klein land, maar de Belgen hebben veel goede ideeën gehad.
Adolphe Sax werd in 1814 geboren in Dinant.
Hij vond de saxofoon uit, een instrument dat je vandaag overal ter wereld hoort.
Een andere Belg, Jean Neuhaus, maakte in 1912 in Brussel de eerste praline: een chocolaatje met een vulling vanbinnen.
Georges Lemaître was priester en wetenschapper.
Hij was de eerste die zei dat het heelal begonnen is met een soort grote ontploffing: dat is de theorie van de oerknal (de Big Bang).
En wist je dat de rolschaatsen uitgevonden werden door John Joseph Merlin, een Belg die in Hoei geboren werd?
Om zijn uitvinding te tonen, kwam hij schaatsend een feest binnen… en brak hij een grote spiegel!`,
  },
  'fr-abeilles': {
    woorden: `l'abeille ; de bij ; abeilles, abeille
petit ; klein ; petits
l'insecte ; het insect ; insectes
important ; belangrijk ; importantes
la nature ; de natuur ; nature
la ruche ; de bijenkorf ; ruche
contenir ; bevatten ; contenir
jusqu'à ; tot ; jusqu'à
cinquante mille ; vijftigduizend ; cinquante mille
chaque ; elke
seul ; enkel ; seule
la reine ; de koningin ; reine
pondre ; (eieren) leggen ; pond
l'œuf ; het ei ; œufs
toute la journée ; de hele dag ; toute la journée
deux mille ; tweeduizend ; deux mille
par jour ; per dag ; par jour
l'ouvrière ; de werkbij ; ouvrières
le travail ; het werk ; travail
nettoyer ; schoonmaken ; nettoient
nourrir ; voeden ; nourrissent
la larve ; de larve ; larves
récolter ; verzamelen ; récoltent
la fleur ; de bloem ; fleurs, fleur
trouver ; vinden ; trouve
rentrer ; terugkeren ; rentre
la danse ; de dans ; danse
spécial ; speciaal ; spéciale
montrer ; tonen ; montre
la direction ; de richting ; direction
la distance ; de afstand ; distance
transporter ; vervoeren ; transportent
le pollen ; het stuifmeel ; pollen
aider ; helpen ; aident
la plante ; de plant ; plantes
produire ; voortbrengen, maken ; produire
le fruit ; de vrucht ; fruits
sans ; zonder
beaucoup moins ; veel minder ; beaucoup moins
la pomme ; de appel ; pommes
la cerise ; de kers ; cerises
la fraise ; de aardbei ; fraises`,
    vertaling: `Bijen zijn kleine insecten, maar ze zijn heel belangrijk voor de natuur en voor ons.
In een bijenkorf kunnen tot vijftigduizend bijen wonen.
Elke bijenkorf heeft maar één koningin.
Ze legt de hele dag eitjes: tot tweeduizend per dag!
De werkbijen doen al het andere werk: ze maken de korf schoon, voeden de larven en verzamelen nectar van de bloemen.
Als een bij veel bloemen vindt, keert ze terug naar de korf en doet ze een speciale dans.
Die dans toont de andere bijen de richting en de afstand van de bloemen.
Door van bloem naar bloem te gaan, vervoeren de bijen stuifmeel.
Zo helpen ze de planten om vruchten te maken.
Zonder bijen zouden we veel minder appels, kersen en aardbeien hebben.`,
  },

  'en-sam': {
    woorden: `hi ; hoi
name ; naam
twelve ; twaalf
years old ; jaar (oud) ; years old
live ; wonen
mum ; mama
dad ; papa
little ; klein
sister ; zus
six ; zes
have got ; hebben ; have got
cat ; kat ; cats
favourite ; lievelings-
colour ; kleur
green ; groen
food ; eten
go ; gaan
school ; school
by bike ; met de fiets ; by bike
after school ; na school ; after school
play ; spelen
football ; voetbal
friend ; vriend ; friends
park ; park
on Sundays ; op zondag ; on sundays
visit ; bezoeken
grandparents ; grootouders
grandma ; oma
make ; maken ; makes
the best ; de beste, de lekkerste ; the best
pancake ; pannenkoek ; pancakes
world ; wereld`,
    vertaling: `Hoi!
Mijn naam is Sam.
Ik ben twaalf jaar en ik woon in Brugge met mijn mama, mijn papa en mijn zusje, Mia.
Mia is zes.
We hebben twee katten, Tiger en Smokey.
Mijn lievelingskleur is groen en mijn lievelingseten is pizza.
Ik ga met de fiets naar school.
Na school speel ik voetbal met mijn vrienden in het park.
Op zondag bezoek ik mijn grootouders.
Mijn oma maakt de lekkerste pannenkoeken van de wereld!`,
  },
  'en-zoo': {
    woorden: `today ; vandaag
class ; klas
zoo ; dierentuin
take the bus ; de bus nemen ; take the bus
nine o'clock ; negen uur ; nine o'clock
first ; eerst
visit ; bezoeken
elephant ; olifant ; elephants
big ; groot
eat ; eten ; eating, eat
hay ; hooi
then ; dan
see ; zien
monkey ; aap ; monkeys, monkey
steal ; stelen ; steals
cap ; pet
teacher ; leerkracht
everybody ; iedereen
laugh ; lachen ; laughs
twelve o'clock ; twaalf uur ; twelve o'clock
lunch ; middageten
near ; bij
lake ; meer
in the afternoon ; in de namiddag ; in the afternoon
watch ; kijken naar
penguin ; pinguïn ; penguins
zookeeper ; dierenverzorger
give ; geven ; gives
fish ; vis
animal ; dier ; animals
giraffe ; giraf ; giraffes
because ; omdat
tall ; groot, lang
elegant ; sierlijk
four o'clock ; vier uur ; four o'clock
back ; terug
great ; geweldig
day ; dag`,
    vertaling: `Vandaag gaat onze klas naar de dierentuin.
We nemen de bus om negen uur.
Eerst bezoeken we de olifanten.
Ze zijn heel groot en ze eten hooi.
Dan zien we de apen.
Een aap steelt de pet van onze leerkracht, meneer Brown!
Iedereen lacht.
Om twaalf uur eten we onze lunch bij het meer.
In de namiddag kijken we naar de pinguïns.
Een dierenverzorger geeft hun vis.
Mijn lievelingsdieren zijn de giraffen, omdat ze zo groot en sierlijk zijn.
Om vier uur nemen we de bus terug naar school.
Wat een geweldige dag!`,
  },
  'en-rain': {
    woorden: `Saturday ; zaterdag
rain ; regenen, de regen ; raining, rain
brother ; broer
bored ; verveeld
can't ; kunnen niet ; can't
play ; spelen
outside ; buiten
let's ; laten we ; let's
build ; bouwen
fort ; fort
say ; zeggen ; says
take ; nemen
cushion ; kussen ; cushions
sofa ; zetel
blanket ; deken ; blankets
bedroom ; slaapkamer
big enough ; groot genoeg ; big enough
children ; kinderen
dog ; hond
inside ; binnen in
read ; lezen
comic ; strip ; comics
torch ; zaklamp
call ; roepen ; calls
hot chocolate ; warme chocolademelk ; hot chocolate
run ; lopen
kitchen ; keuken
later ; later
stop ; stoppen ; stops
beautiful ; mooi
rainbow ; regenboog
appear ; verschijnen ; appears
sky ; lucht
look ; kijk
shout ; roepen ; shouts
go outside ; naar buiten gaan ; go outside
jump ; springen
puddle ; plas ; puddles
put on ; aantrekken ; put on
boots ; laarzen
garden ; tuin`,
    vertaling: `Het is zaterdag en het regent.
Emma en haar broer Jack vervelen zich.
Ze kunnen niet buiten spelen.
"Laten we een fort bouwen!" zegt Jack.
Ze nemen alle kussens van de zetel en een paar dekens uit de slaapkamer.
Hun fort is groot genoeg voor twee kinderen en de hond.
In het fort lezen ze strips met een zaklamp.
Dan roept mama hen: "Wie wil er warme chocolademelk?"
De kinderen lopen naar de keuken.
Later stopt de regen en verschijnt er een mooie regenboog in de lucht.
"Kijk!" roept Emma.
"Laten we naar buiten gaan en in de plassen springen!"
Ze trekken hun laarzen aan en lopen de tuin in.`,
  },
  'en-knight': {
    woorden: `the bravest ; de dapperste ; the bravest
knight ; ridder
kingdom ; koninkrijk
afraid of ; bang van ; afraid of
dragon ; draak ; dragons
wolf ; wolf ; wolves
giant ; reus ; giants
secret ; geheim
dark ; donker
every night ; elke nacht ; every night
sleep ; slapen ; slept
candle ; kaars ; candles, candle
next to ; naast ; next to
bed ; bed
one evening ; op een avond ; one evening
king ; koning
ask ; vragen ; asked
find ; vinden
lost ; verloren
princess ; prinses
cave ; grot
knee ; knie ; knees
shake ; beven ; shaking
deep ; diep
lit ; stak aan ; lit
torch ; fakkel
walk ; stappen ; walked
slowly ; langzaam
suddenly ; plots
wind ; wind
blow out ; uitblazen ; blew out
want ; willen ; wanted
run away ; weglopen ; run away
hear ; horen ; heard
someone ; iemand
cry ; huilen ; crying
scared ; bang
too ; ook
hand ; hand
together ; samen
the way ; de weg ; the way
holding hands ; hand in hand ; holding hands
towards ; naar … toe
tiny ; piepklein
light ; licht
end ; einde
come out ; naar buiten komen ; came out
cheer ; juichen ; cheered
from that day on ; vanaf die dag ; from that day on
only ; maar, alleen
need ; nodig hebben ; needed`,
    vertaling: `Sir Henry was de dapperste ridder van het koninkrijk.
Hij was niet bang van draken, wolven of reuzen.
Maar Sir Henry had een geheim: hij was bang in het donker.
Elke nacht sliep hij met zeven kaarsen naast zijn bed.
Op een avond vroeg de koning hem om een verloren prinses te zoeken in de Zwarte Grot.
De knieën van Sir Henry beefden.
De grot was heel donker en heel diep.
Hij stak een fakkel aan en stapte langzaam naar binnen.
Plots blies de wind zijn fakkel uit.
Sir Henry wilde weglopen, maar toen hoorde hij iemand huilen.
Het was de prinses!
Zij was ook bang.
"Neem mijn hand," zei Sir Henry.
"We zullen samen de weg vinden."
Hand in hand stapten ze naar een piepklein lichtje aan het einde van de grot.
Toen ze naar buiten kwamen, juichte iedereen.
Vanaf die dag had Sir Henry nog maar één kaars nodig.`,
  },
  'en-solar': {
    woorden: `solar system ; zonnestelsel ; solar system
consist of ; bestaan uit ; consists of
Sun ; zon ; sun
eight ; acht
planet ; planeet ; planets
travel around ; rond iets draaien ; travel around
star ; ster
gigantic ; reusachtig
ball ; bol
hot ; heet
gas ; gas
about ; ongeveer
one million ; een miljoen ; one million
Earth ; aarde ; earths, earth
fit ; passen
inside ; in, binnenin
inner ; binnenste
small ; klein
rocky ; rotsachtig
outer ; buitenste
much bigger ; veel groter ; much bigger
made mostly of ; vooral gemaakt van ; made mostly of
ice ; ijs
light ; licht
need ; nodig hebben ; needs
minute ; minuut ; minutes
reach ; bereiken
far away ; ver weg ; far away
year ; jaar ; year, years
last ; duren ; lasts
scientist ; wetenschapper ; scientists
keep exploring ; blijven onderzoeken ; keep exploring
space ; ruimte
telescope ; telescoop ; telescopes
still ; nog
many ; veel
mystery ; raadsel ; mysteries
solve ; oplossen`,
    vertaling: `Ons zonnestelsel bestaat uit de zon en acht planeten die eromheen draaien.
De zon is een ster, een reusachtige bol heet gas.
Ze is zo groot dat er ongeveer een miljoen aardes in zouden passen.
De vier binnenste planeten, Mercurius, Venus, de aarde en Mars, zijn klein en rotsachtig.
De vier buitenste planeten, Jupiter, Saturnus, Uranus en Neptunus, zijn veel groter en vooral gemaakt van gas en ijs.
Het licht van de zon doet ongeveer acht minuten over de reis naar de aarde.
Neptunus staat zo ver weg dat een jaar daar ongeveer 165 aardse jaren duurt!
Wetenschappers blijven de ruimte onderzoeken met telescopen en robots, omdat er nog veel raadsels op te lossen zijn.`,
  },
  'en-zoe': {
    woorden: `best friend ; beste vriend(in) ; best friend
eleven ; elf
like me ; net als ik ; like me
long ; lang
brown ; bruin
hair ; haar
blue ; blauw
eye ; oog ; eyes
funny ; grappig
kind ; lief, vriendelijk
the same ; dezelfde ; the same
class ; klas
subject ; vak
art ; tekenen (vak)
love ; heel graag doen ; love
draw ; tekenen ; drawing
horse ; paard
be called ; heten ; is called
on Saturdays ; op zaterdag ; on saturdays
farm ; boerderij
ride ; rijden (op een paard)
together ; samen
like ; graag hebben, houden van ; like
spider ; spin ; spiders, spider
box ; doos
bedroom ; slaapkamer`,
    vertaling: `Dit is mijn beste vriendin, Zoe.
Ze is elf jaar, net als ik.
Zoe heeft lang bruin haar en blauwe ogen.
Ze is heel grappig en lief.
We zitten in dezelfde klas.
Ons lievelingsvak is tekenen, omdat we heel graag tekenen.
Zoe heeft een paard!
Het heet Thunder.
Op zaterdag gaan we naar de boerderij en rijden we samen op Thunder.
Zoe houdt niet van spinnen, maar ik wel.
Ik heb een grote spin in een doos in mijn slaapkamer!`,
  },
  'en-biscuit': {
    woorden: `Monday afternoon ; maandagnamiddag ; monday afternoon
walk home ; naar huis wandelen ; walking home
near ; bij
bakery ; bakkerij
see ; zien ; sees
small ; klein
dog ; hond
wet ; nat
look sad ; er verdrietig uitzien ; looks sad
red ; rood
collar ; halsband
name ; naam
give ; geven ; gives
piece ; stuk
sandwich ; boterham
follow ; volgen ; follows
take a photo ; een foto nemen ; takes a photo
put ; zetten ; puts
Tuesday evening ; dinsdagavond ; tuesday evening
phone ; telefoon
ring ; rinkelen ; rings
old lady ; oude dame ; old lady
come ; komen ; comes
house ; huis
hug ; knuffelen ; hugs
so happy ; zo blij ; so happy
a box of chocolates ; een doos chocolaatjes ; box of chocolates`,
    vertaling: `Op maandagnamiddag wandelt Ben van school naar huis.
Bij de bakkerij ziet hij een kleine hond.
De hond is nat en hij ziet er verdrietig uit.
Hij heeft een rode halsband, maar er staat geen naam op.
Ben geeft de hond een stukje van zijn boterham.
Dan volgt de hond hem naar huis.
Bens mama neemt een foto van de hond en zet die op het internet.
Op dinsdagavond rinkelt de telefoon.
Het is een oude dame.
"Dat is mijn hond, Biscuit!" zegt ze.
Ze komt naar Bens huis en knuffelt haar hond.
Ze is zo blij dat ze Ben een grote doos chocolaatjes geeft.`,
  },
  'en-treasure': {
    woorden: `last Saturday ; vorige zaterdag ; last saturday
organise ; organiseren ; organised
treasure hunt ; schattenjacht ; treasure hunt
cousin ; neef, nicht ; cousins
hide ; verstoppen ; hid, hidden
clue ; aanwijzing ; clues, clue
first ; eerste
doormat ; deurmat
say ; zeggen ; said
leg ; poot ; legs
walk ; stappen
sit ; zitten
eat ; eten
run ; lopen ; ran
kitchen ; keuken
find ; vinden ; found
second ; tweede
under ; onder
chair ; stoel
take ; brengen ; took
bathtub ; badkuip
old ; oud
apple tree ; appelboom ; apple tree
finally ; ten slotte
garden shed ; tuinhuis ; garden shed, shed
wooden ; houten
box ; kist, doos
lock ; slot
key ; sleutel
cold ; koud
place ; plaats
frozen ; ingevroren
ice cube ; ijsblokje ; ice cube
freezer ; diepvries
open ; openen ; opened
sweets ; snoep
note ; briefje
world ; wereld`,
    vertaling: `Vorige zaterdag organiseerde Lily een schattenjacht voor haar neven en nichten.
Ze verstopte zes aanwijzingen in het huis en in de tuin.
De eerste aanwijzing lag onder de deurmat.
Er stond: "Ik heb vier poten, maar ik kan niet stappen.
Je zit op mij als je eet."
De kinderen liepen naar de keuken en vonden de tweede aanwijzing onder een stoel.
De aanwijzingen brachten hen naar de badkuip, de piano, de oude appelboom en ten slotte het tuinhuis.
In het tuinhuis stond een houten kist met een slot.
De sleutel was verstopt op een heel koude plaats: hij was ingevroren in een ijsblokje in de diepvries!
Toen ze de kist openden, vonden ze snoep, stickers en een briefje: "Jullie zijn de beste detectives van de wereld!"`,
  },
  'en-machine': {
    woorden: `spend ; doorbrengen ; spent
summer ; zomer
grandfather ; opa, grootvader ; grandfather's, grandfather
farm ; boerderij
rainy ; regenachtig
afternoon ; namiddag
climb ; klimmen ; climbed
attic ; zolder
strange ; vreemd
look like ; lijken op ; looked like
old ; oud
wardrobe ; kleerkast
dozens of ; tientallen ; dozens of
button ; knop ; buttons, button
clock ; klok
run backwards ; achteruitlopen ; running backwards
label ; etiket
someone ; iemand
write ; schrijven ; written
do not press ; druk niet op ; do not press
green ; groen
of course ; natuurlijk ; of course
press ; drukken ; pressed
flash of light ; lichtflits ; flash of light
suddenly ; plots
full of ; vol met ; full of
dust ; stof
spider web ; spinnenweb ; spider webs
go downstairs ; naar beneden gaan ; went downstairs
kitchen ; keuken
completely ; helemaal
different ; anders
young ; jong
boy ; jongen
porridge ; pap
table ; tafel
ask ; vragen ; asked
recognise ; herkennen ; recognised
eye ; oog ; eyes
sixty ; zestig
younger ; jonger
together ; samen
amazing ; fantastisch
in the evening ; 's avonds ; in the evening
again ; opnieuw
return home ; naar huis terugkeren ; returned home
wait ; wachten ; waiting
smile ; glimlach
see you again ; je terugzien ; see you again`,
    vertaling: `Toen Max tien was, bracht hij de zomer door op de boerderij van zijn opa.
Op een regenachtige namiddag klom hij naar de zolder en vond hij een vreemde machine.
Ze leek op een oude kleerkast met tientallen knoppen en een klok die achteruit liep.
Op een etiket had iemand geschreven: "Druk niet op de groene knop!"
Natuurlijk drukte Max op de groene knop.
Er was een lichtflits, en plots was de zolder vol stof en spinnenwebben.
Max ging naar beneden.
De keuken zag er helemaal anders uit en een jonge jongen zat aan tafel pap te eten.
"Wie ben jij?" vroeg de jongen.
Max herkende zijn ogen: het was zijn opa, zestig jaar jonger!
Samen beleefden ze een fantastische dag.
's Avonds drukte Max opnieuw op de knop en keerde hij terug naar huis.
Opa wachtte op hem met een glimlach.
"Ik wacht al zestig jaar om je terug te zien," zei hij.`,
  },
  'en-octopus': {
    woorden: `octopus ; octopus ; octopuses, octopus
intelligent ; slim
animal ; dier ; animals
sea ; zee
arm ; arm ; arms
heart ; hart ; hearts
blood ; bloed
be covered with ; bedekt zijn met ; are covered with
sucker ; zuignap ; suckers
taste ; proeven
feel ; voelen
at the same time ; tegelijk ; at the same time
master of disguise ; meester in vermommen ; masters of disguise
less than ; minder dan ; less than
second ; seconde
change ; veranderen
colour ; kleur
texture ; structuur (van het oppervlak)
skin ; huid
look like ; lijken op ; look like
rock ; rots
sand ; zand
coral ; koraal
enemy ; vijand
attack ; aanvallen ; attacks
squirt ; spuiten
cloud ; wolk
dark ; donker
ink ; inkt
escape ; ontsnappen
scientist ; wetenschapper ; scientists
watch ; observeren ; watched
jar ; pot, bokaal ; jars
solve ; oplossen
puzzle ; puzzel ; puzzles
tank ; aquarium ; tanks
at night ; 's nachts ; at night
carry ; (mee)dragen
coconut shell ; kokosnootschaal ; coconut shells
mobile home ; verplaatsbaar huisje ; mobile home
however ; toch
short ; kort
life ; leven
species ; soort
live ; leven`,
    vertaling: `Octopussen behoren tot de slimste dieren in de zee.
Een octopus heeft acht armen, drie harten en blauw bloed.
Zijn armen zijn bedekt met zuignappen die tegelijk kunnen proeven en voelen.
Octopussen zijn meesters in vermommen: in minder dan een seconde kunnen ze de kleur en zelfs de structuur van hun huid veranderen, zodat ze op een rots, zand of koraal lijken.
Als een vijand aanvalt, kan een octopus een wolk donkere inkt spuiten en ontsnappen.
Wetenschappers hebben gezien hoe octopussen potten openen, puzzels oplossen en 's nachts zelfs uit hun aquarium ontsnappen.
Sommige octopussen dragen kokosnootschalen mee en gebruiken ze als verplaatsbaar huisje.
Toch leven de meeste octopussen niet lang: veel soorten worden maar één of twee jaar oud.`,
  },
};
