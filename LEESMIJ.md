# Kangoeroe-Kluis

Uitdagende oefeningen voor kangoeroes (10-13 jaar): 35 spellen in 5 vakken, elk met 5 niveaus (brons, zilver, goud, platinum, diamant), toetsen en een leerkrachtomgeving.

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

### Later iets aanpassen
Open je repository op GitHub → **Add file → Upload files** → sleep de gewijzigde bestanden erin → **Commit changes**. Netlify zet de nieuwe versie zelf online. Leerlingen, resultaten, eigen inhoud en toetsen blijven bewaard.

## Goed om te weten
- Een leerling die van klas verandert, pas je aan in *Leerlingen & codes*. De resultaten blijven bij die leerling, ook over meerdere schooljaren.
- Eigen inhoud (woordenlijsten, zinnen, Franse en Engelse lijsten, werkwoorden, teksten) maak je bij **Eigen inhoud**. Leerlingen zien die met een ★ bovenaan de keuzelijst.
- Toetsen: kies *open van … tot …* en eventueel een tijdslimiet per leerling. Antwoorden worden tussendoor bewaard. Valt de tijd weg, dan wordt de toets automatisch ingeleverd. Met **Opnieuw** mag een leerling de toets opnieuw maken.
- Voorlezen gebeurt met de stemmen van de browser zelf. In Chrome en Edge zijn de Franse en Engelse stemmen het best.
- Zonder server (het bestand gewoon openen) draait de app in oefenmodus: alles werkt, maar resultaten blijven op die computer.
