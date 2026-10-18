# Kangoeroe-Kluis

Uitdagende oefeningen voor kangoeroes (10-13 jaar): 51 onderdelen in 6 vakken (taal, rekenen, logica, Frans, Engels, toneel), elk met 5 niveaus (brons, zilver, goud, platinum, diamant), toetsen en een leerkrachtomgeving.

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
Pak de nieuwe zip uit. Open je repository op GitHub → **Add file → Upload files** → sleep opnieuw de volledige inhoud van de map erin (bestaande bestanden worden overschreven, nieuwe toegevoegd) → **Commit changes**. Netlify zet de nieuwe versie zelf online. Leerlingen, resultaten, eigen inhoud en toetsen blijven bewaard.

## Kangoeroe-paspoort
Het paspoort volgt een leerling 3 schooljaren lang:
- **Blad 1 – Dit ben ik** (voor 3 jaar): één kolom per schooljaar.
- **Mijn medailles** (per schooljaar): alle onderdelen van elke kluis. In de app en op het ingevulde blad wordt dit automatisch ingevuld. ✓ = behaald in een vorig jaar, gekleurd = behaald dit jaar.
- **Andere uitdagingen** (per schooljaar): De aarde, Planeten, Ridders … De lijst pas je aan bij **Eigen inhoud → Instellingen**.
- **Reflectie** (per periode).
- **Mijn groei** (voor 3 jaar): per kluis 1 blokje per 5 medailles. Een kluis heeft dus evenveel blokjes als onderdelen.

Leerlingen vullen dit in via het tabblad **🛂 Mijn paspoort**. Jij ziet het paspoort onderaan bij elke leerling in het overzicht en schrijft daar feedback bij de reflecties.
Afdrukken doe je via **Leerlingen & codes → Kangoeroe-paspoorten afdrukken**. Vink *alleen de jaarbladen* aan om bij de start van een nieuw schooljaar enkel de jaarbladen bij te drukken.

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
- **Uitdaging van de week**: bovenaan het startscherm. Elke maandag kiest de app zelf een spel en een niveau, telkens uit een ander vak. Jij hoeft niets te doen. Wie de uitdaging die week haalt, krijgt een groen vinkje.

## Goed om te weten
- Een leerling die van klas verandert, pas je aan in *Leerlingen & codes*. De resultaten blijven bij die leerling, ook over meerdere schooljaren.
- Eigen inhoud (woordenlijsten, zinnen, Franse en Engelse lijsten, werkwoorden, teksten) maak je bij **Eigen inhoud**. Leerlingen zien die met een ★ bovenaan de keuzelijst.
- Toetsen: kies *open van … tot …* en eventueel een tijdslimiet per leerling. Antwoorden worden tussendoor bewaard. Valt de tijd weg, dan wordt de toets automatisch ingeleverd. Met **Opnieuw** mag een leerling de toets opnieuw maken.
- Voorlezen gebeurt met de stemmen van de browser zelf. In Chrome en Edge zijn de Franse en Engelse stemmen het best.
- Zonder server (het bestand gewoon openen) draait de app in oefenmodus: alles werkt, maar resultaten blijven op die computer.
