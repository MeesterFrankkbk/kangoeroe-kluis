# Kangoeroe-Kluis

Uitdagende oefeningen voor kangoeroes (10-13 jaar): 54 onderdelen in 6 vakken (taal, rekenen, logica, Frans, Engels, toneel), elk met 5 niveaus (brons, zilver, goud, platinum, diamant), toetsen en een leerkrachtomgeving.

Standaard kiezen leerlingen zelf op welk niveau ze beginnen. Wil je dat ze bij brons starten en niveau per niveau vrijspelen, zet dat aan bij **Eigen inhoud → Instellingen**.

- `index.html`: de leerlingenapp (aanmelden met klas → naam → persoonlijke code)
- `leerkracht.html`: de leerkrachtomgeving (overzicht, toetsen, eigen inhoud, leerlingen en codes)
- `netlify/functions/api.mjs`: de server die alles centraal bewaart (Netlify Blobs)

## Online zetten: stap voor stap

Belangrijk: **upload het zip-bestand niet zelf** naar GitHub en gebruik **geen Netlify Drop** (slepen). Dan draait de server niet en krijg je geen resultaten. Werk via GitHub, zoals bij Spreekspiegel.

### A. Op je computer
1. Pak het zip-bestand uit (rechtsklik → *Alles uitpakken*). Je krijgt een map `kangoeroe-kluis`.

### B. Op github.com
2. Meld je aan en klik rechtsboven op **+** → **New repository**.
3. Typ als naam `kangoeroe-kluis`, laat de rest staan en klik **Create repository**.
4. Klik op de lege pagina op de link **uploading an existing file**.
5. Open de map `kangoeroe-kluis` op je computer, selecteer **alles wat erin zit** (ook de map `netlify`) en sleep het naar het uploadvak. Sleep dus de *inhoud* van de map, niet de map zelf. Gebruik Chrome of Edge: die nemen de map `netlify` met submappen mee.
6. Wacht tot alle bestanden in de lijst staan en klik onderaan op **Commit changes**.
7. Controle: in je repository zie je nu onder meer `index.html`, `package.json`, `netlify.toml` en de map `netlify`.

### C. Op app.netlify.com
8. Klik **Add new site** (of *Add new project*) → **Import an existing project** → **GitHub**.
9. Kies de repository `kangoeroe-kluis`. Je hoeft niets in te vullen, alles staat in `netlify.toml`. Klik **Deploy**.
10. Stel je wachtwoord in: **Site configuration → Environment variables → Add a variable**.
    Key: `LEERKRACHT_WACHTWOORD`, value: een eigen wachtwoord. Daarna **Deploys → Trigger deploy → Deploy site**.
11. Kies eventueel een mooie naam: **Site configuration → Change site name** (bv. `kangoeroe-kluis-sta`).

### D. Eerste gebruik
12. Surf naar `https://<jouw-site>.netlify.app/leerkracht.html` en meld je aan.
13. Ga naar **Leerlingen & codes** en plak je leerlingen uit Excel: kolommen *klas, naam, voornaam* en eventueel *code*. Zonder code maakt de app er een. Klik **Bewaar** en druk de aanmeldkaartjes af.
14. Leerlingen surfen naar `https://<jouw-site>.netlify.app`.

### Later iets aanpassen (bv. een nieuwe versie)
Tip vooraf: klik in de leerkrachtomgeving bij **Eigen inhoud → Reservekopie → Download reservekopie**. Zo heb je al je eigen teksten ook op je computer.
Pak de nieuwe zip uit. Open je repository op GitHub → **Add file → Upload files** → sleep opnieuw de volledige inhoud van de map erin (bestaande bestanden worden overschreven, nieuwe toegevoegd) → **Commit changes**. Netlify zet de nieuwe versie zelf online. Leerlingen, resultaten, eigen inhoud en toetsen blijven bewaard.

## Kangoeroe-paspoort
Het paspoort volgt een leerling 3 schooljaren lang:
- **Blad 1 – Dit ben ik** (voor 3 jaar): één kolom per schooljaar.
- **Mijn medailles** (per schooljaar): alle onderdelen van elke kluis. In de app en op het ingevulde blad wordt dit automatisch ingevuld. ✓ = behaald in een vorig jaar, gekleurd = behaald dit jaar.
- **Andere uitdagingen** (per schooljaar): De aarde, Planeten, Ridders … De lijst pas je aan bij **Eigen inhoud → Instellingen**.
- **Reflectie** (per periode).
- **Mijn groei** (voor 3 jaar): per kluis 1 blokje per 5 medailles. Een kluis heeft dus evenveel blokjes als onderdelen.

Leerlingen vullen dit in via het tabblad **🛂 Mijn paspoort**. Jij ziet het paspoort onderaan bij elke leerling in het overzicht en schrijft daar feedback bij de reflecties.
Afdrukken doe je via **Leerlingen & codes → Kangoeroe-paspoorten afdrukken**. De afdruk is gemaakt voor zwart-wit: dikke lijnen, behaalde medailles met een dikke rand. Kies in het afdrukvenster: A4, marges Standaard, schaal 100 %, koptekst en voettekst uit. Het medailleblad schaalt zichzelf naar één A4, ook als er onderdelen bijkomen. Vink *alleen de jaarbladen* aan om bij de start van een nieuw schooljaar enkel de jaarbladen bij te drukken.

## Korte reflectie na een spel
Verlaat een leerling een spel waarin hij echt geoefend heeft (standaard minstens 3 opgaven), dan blikt hij kort terug. Dat gebeurt bij **← Kluizen**, **Mijn resultaten** of **Afmelden**, en niet na elk niveau. Sloot hij de computer gewoon af? Dan volgt de reflectie bij de volgende aanmelding.
1. **Hoe ging het?** 😴 te makkelijk · 🙂 goed · 🧗 moeilijk
2. **Wat vond ik moeilijk?**, of bij te makkelijk: *Wat maakte het te makkelijk?*
3. **Wat deed ik toen?** Klikbare aanpakken (stap voor stap, een schets, een patroon zoeken, een hint …) en eigen woorden. Bij te makkelijk: *Hoe daag ik mezelf volgende keer uit?*
4. **Wat heb ik (bij)geleerd?**
5. **Wat neem ik mee naar de volgende stap?** Dit voornemen ziet de leerling terug wanneer hij dat spel opnieuw opent.

Een keuze bij vraag 1 en minstens één korte zin zijn verplicht. De leerling ziet zijn reflecties en jouw reacties in zijn paspoort bij 💭 Reflectie.

**Leerkracht → 💭 Reflecties**
- Kies een periode, een klas of een leerling.
- De tabel per leerling toont hoe vaak het te makkelijk, goed of moeilijk was. Oranje bij 😴 betekent dat de leerling het vaak te makkelijk vindt: stel een hoger niveau of de meesterproef voor.
- Bij elke reflectie schrijf je een korte reactie en vink je *besproken in een gesprek* aan. Met *alleen nog niet besproken* bereid je een coachgesprek voor.
- **🖨 Terugblik** drukt per leerling één blad af voor de gekozen periode. Daarop staan de reflecties, een korte samenvatting (gevoel, aanpakken, oefentijd, nieuwe medailles), naar keuze de paspoortreflecties en jouw reacties, en ruimte voor een opmerking en de handtekening van de ouders.

Instellen doe je bij **Eigen inhoud → 💭 Korte reflectie na een spel**:
- aan of uit
- hoe vaak: hoogstens 1 keer per spel per dag (standaard), per week, of telkens
- vanaf hoeveel opgaven
- of de leerling "Nu niet" mag kiezen

De reflecties worden apart bewaard. "Oefenresultaten wissen" wist ze niet.

## Wiskunde-uitdagingen
Bij **Rekenen → Wiskunde-uitdagingen** maken de leerlingen meerkeuzevragen (A–E). Elke vraag is een prent, met per vraag hulp in stapjes.
- Brons, zilver en goud: telkens een derde van de reeks.
- Platinum: 8 vragen door elkaar.
- Diamant: de hele reeks, zonder hulp.

Een nieuwe reeks voeg je zelf toe bij **Eigen inhoud → Wiskunde-uitdagingen → + Nieuw**. Upload de prenten (meerdere tegelijk), vul de sleutel in (bv. `BDDDADCC…`) en schrijf eventueel tips per vraag. Wil je een ingebouwde reeks aanpassen? Kies dan *Kopiëren*.

## Nieuwe onderdelen
- **Rekenen → Oefenwedstrijd**: een Kangoeroe-reeks onder tijdsdruk, met de echte puntentelling (5 punten juist, 1 punt blanco, 0 punten fout). Brons: vragen 1–8 in 15 minuten. Zilver: 1–16 in 30 minuten. Goud: 9–24 in 30 minuten. Platinum: de hele reeks in 50 minuten. Diamant: idem, maar je hebt 80 % nodig.
- **Rekenen → Ruimtelijk inzicht**: blokjes tellen, aanzichten, kubusnetten en kubussen draaien.
- **Logica → Logigrammen**: kruistabellen met aanwijzingen. Elke opgave heeft precies één oplossing.
- **Logica → Strategiespellen**: Nim tegen de computer (één stapel, het laatste fiche verliest, twee en drie stapels). Er is telkens een winnende strategie. Laat de leerlingen die in hun paspoort uitschrijven.
- **Logica → Raadsels van klasgenoten**: leerlingen maken zelf een tekstraadsel of tekenraadsel. Jij keurt het eerst goed bij **Eigen inhoud → 🧩 Raadsels van klasgenoten**. Daar kun je het antwoord aanpassen, extra goede antwoorden toevoegen en een opmerking voor de leerling schrijven. Daarna kunnen klasgenoten het raadsel oplossen (brons = 1 raadsel, diamant = 5 na elkaar). Leerlingen zien bij hun eigen raadsels de status en hoe vaak het al werd opgelost. Dit werkt alleen online, niet in oefenmodus.
- **Toneel → Tekst uit het hoofd**: voor een gedicht, versje of tekst die één leerling alleen moet kennen. De tekst verdwijnt strofe per strofe: brons = om de drie woorden een woord weg, zilver = om de twee, goud = alleen beginletters, platinum = om beurten (de computer zegt een regel, de leerling de volgende), diamant = alles uit het hoofd (typen of inspreken). Met "Eerst oefenen in je eigen tempo" laat de leerling de tekst zelf stap voor stap verdwijnen en drukt hij een spiekbriefje met beginletters af. Eigen teksten voeg je toe bij **Eigen inhoud → Teksten om uit het hoofd te leren** (een lege regel tussen de strofen; ook in het Frans of Engels).
- **Voordracht** (bij Tekst uit het hoofd → "Eerst oefenen in je eigen tempo" → tabblad 🎙 Voordracht): de leerling neemt zichzelf op, met of zonder tekst in beeld, en luistert terug. De app toont het tempo en (in Chrome/Edge) welke woorden hij niet verstond. Daarna beoordeelt de leerling zichzelf. Opnames blijven op de computer van de leerling; met "Bewaar je opname" kan hij ze als bestand bewaren.
- **Teksten afdrukken**: bij de Toneelrepetitor (eventueel met één rol gemarkeerd) en bij Tekst uit het hoofd (eventueel met een spiekbriefje met beginletters). De knop staat op het startscherm van het onderdeel en bij Eigen inhoud (🖨).
- **Logica → Slimme robot**: één programma moet de robot in drie verschillende doolhoven naar de vlag brengen. De robot moet dus zelf kijken: met "herhaal tot 🏁" en "als vooruit/links/rechts vrij … anders …". Op platinum en diamant ontdekken de leerlingen de rechterhandregel, waarmee je uit elk doolhof raakt.
- **Logica → Foutenjager**: een robotprogramma dat zou moeten werken, maar fouten bevat. De leerling herstelt het met zo weinig mogelijk wijzigingen: 1 fout op brons en zilver, 2 vanaf goud (ook in functie A of in het programma van een slimme robot). Vanaf goud zijn er maar een paar testritten: eerst nadenken, dan testen.
- **Meesterproef 👑**: na diamant verschijnt bij elk onderdeel de meesterproef. Dat zijn drie diamant-opgaven na elkaar, zonder één hint. Wie slaagt, krijgt de kroon: op de kaart van het onderdeel, in het paspoort (♛ naast de medailles) en bij jou in het overzicht. De kroon telt niet mee in de medailles, dus de groeitelling blijft kloppen. Bij de wiskunde-uitdagingen, de oefenwedstrijd en de raadsels van klasgenoten is er geen meesterproef: daar zou de leerling drie keer dezelfde opgave krijgen.
- **Frans en Engels: woordhulp, vertaling en woorden per tekst**
  - **Woordhulp:** bij Lezen en luisteren klikt de leerling op een onderstreept woord. Hij hoort het en ziet wat het betekent (bv. *habite → habiter: wonen*). Dat kan in "Eerst leren" en op brons.
  - **Vertaling:** bij "Eerst leren" kan de leerling de Nederlandse vertaling onder elke zin tonen. Lees eerst zelf en gebruik de vertaling om te controleren. Tijdens de vragen is er geen vertaling, anders zouden de vragen niets meer zeggen.
  - **Woorden per tekst:** bij Woordenschat staat voor elke tekst een eigen woordenlijst ("📖 Woorden uit de tekst: …"), met alle niveaus. Vanuit de tekst springt de leerling er met één klik naartoe.
  - **Leren en oefenen bij Woordenschat:** een woordenlijst met uitspraak (ook traag), waarbij de leerling een kolom kan verbergen om zichzelf te testen. Daarnaast woordkaarten en memory. Op de niveaus oefent hij daarna in beide richtingen: kiezen, typen en luisteren en typen.
  - **Eigen teksten:** vul bij Eigen inhoud ook de woorden bij de tekst in (`le chien ; de hond ; chien`) en eventueel een vertaling (één zin per regel). "Aanpassen" van een ingebouwde tekst neemt de woordhulp en de vertaling mee.
- **Uitdaging van de week**: bovenaan het startscherm. Elke maandag kiest de app zelf een spel en een niveau, telkens uit een ander vak. Jij hoeft niets te doen. Wie de uitdaging die week haalt, krijgt een groen vinkje.

## Ingebouwde inhoud aanpassen
- **Eigen inhoud → 📦 Ingebouwde inhoud**: bekijk alle rebussen, droedels en letterdroedels die in de app zitten. Zet met het vinkje uit wat je niet wilt gebruiken, bijvoorbeeld omdat je het in de klas al gebruikt.
- **Eigen rebussen**: kies het niveau, typ de prentjes en bewerkingen (bv. `🐌 slak | + KEN + | 🏠 huis`) en de oplossing. De app rekent je rebus meteen na en waarschuwt als de oplossing niet klopt. Emoji's kies je met de Windows-toets + punt.
- **Eigen droedels**: teken op papier, neem een foto en voeg hem toe met een titel.
- **Lijsten en teksten** (woordenlijsten, zinnen, Franse en Engelse teksten, toneel …): bij elke ingebouwde lijst kun je kiezen tussen **👁 zichtbaar / 🙈 verborgen** en **Aanpassen**. Aanpassen maakt een eigen versie die je kunt wijzigen; het origineel wordt dan verborgen.
- In het najaar van 2026 kwam er extra inhoud bij: 56 rebussen, 12 droedels en 5 Franse en 5 Engelse teksten (elk niveau één).

## Drie jaar lang uitdagend
- De meeste rekenen- en logica-onderdelen maken elke keer een nieuwe opgave.
- Onderdelen met een vaste lijst (rebussen, droedels, letterdroedels, spreekwoordrebus, de zinnenspellen) geven een leerling eerst alles wat hij nog nooit kreeg. Pas als alles gezien is, komt het oudste terug. Dat wordt per leerling op de server bijgehouden, dus ook op een andere computer.
- In de keuzelijst van een onderdeel (bv. de wiskunde-uitdagingen) staat bij elke reeks een ✓ met de hoogste medaille die de leerling er al haalde.
- Persoonlijk record: per niveau onthoudt de app de snelste tijd zonder hints. Ook na diamant kan een leerling dus nog zijn eigen record proberen te breken.
- Resultaten blijven bewaard over de schooljaren heen. Wordt het ooit te veel, dan verdwijnen eerst de oudste niet-gelukte pogingen. Behaalde medailles blijven altijd bewaard.

## Goed om te weten
- Een leerling die van klas verandert, pas je aan in *Leerlingen & codes*. De resultaten blijven bij die leerling, ook over meerdere schooljaren.
- Eigen inhoud (woordenlijsten, zinnen, Franse en Engelse lijsten, werkwoorden, teksten) maak je bij **Eigen inhoud**. Leerlingen zien die met een ★ bovenaan de keuzelijst.
- Toetsen: kies *open van … tot …* en eventueel een tijdslimiet per leerling. Antwoorden worden tussendoor bewaard. Valt de tijd weg, dan wordt de toets automatisch ingeleverd. Met **Opnieuw** mag een leerling de toets opnieuw maken.
- Voorlezen gebeurt met de stemmen van de browser zelf. In Chrome en Edge zijn de Franse en Engelse stemmen het best.
- Zonder server (het bestand gewoon openen) draait de app in oefenmodus: alles werkt, maar resultaten blijven op die computer.
