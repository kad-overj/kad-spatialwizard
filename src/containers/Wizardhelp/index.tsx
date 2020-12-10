import React from "react";
import * as styles from "./style.scss";
import homepageImage from "./instruction_images/homepagina_geodatawizard.png";
import { Container, Paper, Typography } from "@material-ui/core";

interface Props {}

export const link = "/help";

const Wizardhelp: React.FC<Props> = () => {
  return (
    <Container className={styles.manualContainer} maxWidth="md">
      <h1 className={styles.header}>Handleiding GeoDataWizard</h1>
      <p>
        Deze handleiding is bedoeld als intstructie voor GeoDataWizard en tevens als een hulpmiddel bij
        onduidelijkheden.
      </p>

      <h1 className={styles.header}>Doelstelling GeoDataWizard</h1>
      <p>
        De GeoDataWizard is een uitbreiding op de eerste versie van de LD Wizard. LD Wizard is een open source project,
        geinitieerd door het Netwerk Digitaal Erfgoed, waarmee kleine tabulaire datasets (CSV bestanden) kunnen worden
        getransformeerd tot Linked Data. De uitbreiding, door Kadaster geinitieerd, zorgt ervoor dat geografisch
        gerelateerde elementen in de dataset, zoals een coordinaat of een adres ook als correcte Geo Linked Data wordt
        getransformeerd. Deze uitbreiding is ook als open source software beschikbaar, en wordt op termijn ook terug
        gebracht naar de broncode van de LD Wizard.
      </p>

      <p>
        De GeodataWizard is een data transformatie tool, en geen data cleaning tool. Het is dan ook verstandig om de
        data eerst te cleanen (denk aan hoofdletter gebruik, lege waardes, etc) en vervolgens op te slaan als een CSV
        bestand. Hiervoor kunnen standaard tools zoals Microsoft Excel, Google Spreadsheets of Libre Office worden
        gebruikt.
      </p>

      <p>
        Linked data is een digitale methode voor het publiceren van gestructureerde gegevens, zodanig dat deze
        beschikbaar gemaakt kunnen worden op het internet en daardoor ook beter bruikbaar zijn (bron:{" "}
        <a href="https://nl.wikipedia.org/wiki/Linked_data" target="blank">
          https://nl.wikipedia.org/wiki/Linked_data
        </a>
        ). Hiermee wordt de data “live” bevraagbaar, en kunnen talloze toepassingen gebruik maken van de data.{" "}
      </p>

      <p>
        Een unieke feature in de GeoDataWizard is dat naast het downloaden van de getransformeerde Linked Data, ook de
        data direct kan publiceren in de “store” van het Platform Linked Data Nederland. Hiermee wordt de data direct
        voor iedereen bruikbaar, bijvoorbeeld met het maken van zogenoemde SPARQL Queries. Voorbeelden van SPARQL
        queries worden door het Kadaster Data Science Team gepubliceerd op labs.kadaster.nl. Een mooi voorbeeld op basis
        van een CSV bestand met de Stolpersteine in de Gemeente Zutphen is hier te vinden:{" "}
        <a href="https://labs.kadaster.nl/stories/hack-a-lod-2019/index.html" target="blank">
          https://labs.kadaster.nl/stories/hack-a-lod-2019/index.html
        </a>
      </p>

      <h1 className={styles.header}>Uploaden van de dataset</h1>
      <p>
        De eerste stap voor het gebruik van de wizard is het uploaden van de dataset. De GeoDataWizard accepteert enkel
        csv bestanden. Dit zijn bestanden, meestal gemaakt met Excel, waarin de waarde met een komma gescheiden zijn. Om
        een bestand te uploaden klikt u in de hoofdpagina op de knop Load your csv file (afbeelding 1). Vervolgens
        verschijnt er een pop up waarin gevraag wordt het bestand te kiezen die u wilt uploaden naar de GeoDataWizard
        (afbeelding 2).
      </p>

      <div className={styles.imagesblock}>
        <img src={homepageImage} />
        <p>Afbeelding 1 - Begin pagina met mogelijkheid tot uploaden van een CSV</p>
      </div>

      <p>Afbeelding 2 - Uploaden van het csv bestand</p>
      <p>
        Vervolgens selecteert u het csv bestand van uw dataset en klikt op openen. Het venster verdwijnt en u wordt
        automatisch doorgestuurd naar de configuratie stap (Stap 2). Als de csv is ingeladen dan verschijnen de eerste
        10 regels van uw dataset in een tabel (afbeelding 3)
      </p>

      <p>Afbeelding 3 - Dataset ingeladen voor configuratie</p>

      <h1 className={styles.header}>Configuratie</h1>

      <p>
        In de configuratie stap heeft u een aantal mogelijkheden voor het configureren van de data. Er zijn met deze
        GeoDataWizard twee verschillen configuraties mogelijk. Configuratie als de <strong>key column </strong>en{" "}
        <strong>resource class IRI </strong>gelden voor de gehele tabel. Verder zijn er nog aparte configuraties te doen
        per kolom, deze zijn zichtbaar zodra er op een kolomkop wordt geklikt (afbeelding 4).
      </p>

      <p>
        Bij de optie <strong>key column </strong>kunt u de sleutelkolom instellen. Deze kolomwaarden waarden worden aan
        de resource class IRI toegevoegd met een id/.&nbsp; Dit moet echter wel een kolom zijn met unieke waarde zoals
        een serienummer. Bij <strong>resource class IRI</strong>, kunt u de resource IRI instellen die geldt als
        resource voor de in te stellen properties. Als u de <strong>key column </strong>en{" "}
        <strong>resource class </strong>leeg laat dan gaan de standaardwaarden gelden. Dit is voor mensen die niet
        bekend zijn met linked data zijn de standaardwaarde de beste optie.
      </p>

      <h2 className={styles.header}>Kolom configuratie</h2>

      <p>
        Per kolom kan er een aparte configuratie worden uitgevoerd met een aantal instellingen.&nbsp; Deze instellingen
        zijn van belang om goede linked data te kunnen maken van uw dataset.
      </p>

      <p>Afbeelding 4 - Kolom configuratie met de verschillende opties</p>

      <h3 className={styles.header}>Datatype instellen</h3>

      <p>
        Stel u hebt een kolom met een aantal onderdelen van een historisch item.&nbsp; En deze wilt u graag niet als
        tekst configureren omdat er later nog een bepaalde berekening mee wilt doen.&nbsp; Dan kunt u ervoor kiezen om
        deze kolom als datatype int of float in stellen bij de instelling <strong>Datatype. </strong>Voor deze
        instelling zijn er verschillende mogelijkheden:
      </p>

      <ul>
        <li>String, dit is voornamelijk voor tekst. Dit is ook de standaardwaarde als datatype leeg gelaten is</li>
        <li>Integer (int), gebruik bij gehele getallen</li>
        <li>Float, gebruik bij decimalen getallen, zoals een co&ouml;rdinaatpunt</li>
        <li>
          WKLiteral, dit is een speciaal datatype die u kunt gebruiken als er eventueel co&ouml;rdinaten worden gebruikt
          in een aparte kolom. Let op: Deze waarden moeten als POINT(lat, long) zijn aangegeven in uw dataset. Zie
          voorbeeld in afbeelding 3.
        </li>
      </ul>

      <h3 className={styles.header}>Property instellen</h3>

      <p>
        Elk kolomwaarde heeft in de link datastructuur een eigen property, of wel eigenschap. Het geeft het type aan van
        de waarde.&nbsp; Op die manier kan er specifiek per kolom een type toegewezen worden. &nbsp;
      </p>

      <p>
        <strong>
          <em>Voorbeeld:&nbsp;</em>
        </strong>
        <span>
          Stel u hebt de dataset geupload zoals deze is te zien in afbeelding 3 en u wilt een geometrisch type (of
          property) toewijzen aan de kolom Latitude woonplaats. Dan klikt u op de kolom Latitude woonplaats dan
          verschijnt er een pop-up zoals in afbeelding 4 te zien is.&nbsp; Dan bij{" "}
          <strong>Property configuration </strong>typt u <em>latitude</em>, de GeoDataWizard zal dit dan herkennen als
          sdo:latitude en een suggestie geven.(afbeelding 5)
        </span>
      </p>

      <p>Afbeelding 5 - Zoek suggestie resultaten op basis ingevoerde zoektermen</p>

      <p>
        Klik op de optie sdo:latitude en er zal{" "}
        <strong>
          <em>schema.org/latitude </em>
        </strong>
        verschijnen als property URI (afbeelding 6)
      </p>

      <p>Afbeelding 6 - Property URI verschijnt op basis van geselecteerde suggestie</p>

      <p>
        Zodra je dan op<strong>confirm</strong> klikt dan zal deze property verschijnen onder de kolom naam (afbeelding
        7)
      </p>

      <p>Afbeelding 7 - Ingestelde property verschijnt onder de kolomnaam</p>

      <p>Dit kan voor de andere kolommen ook op dezelfde manier ingesteld worden.</p>

      <h3 className={styles.header}>Value configuration instellen</h3>

      <p>
        Met deze optie heeft u een aantal mogelijkheden, en wordt voornamelijk gebruikt om de kolomwaardes te
        transformeren naar IRI&rsquo;s waarmee de linked data wordt gevormd. Dit is eigenlijk de belangrijkste optie in
        deze stap. (afbeelding 8)
      </p>

      <p>Afbeelding 8 - Selecteren van de value configuratie</p>

      <p>De mogelijkheden zijn:</p>

      <ul>
        <li>
          Value to IRI, deze optie zet de kolomwaardes om naar een IRI zoals deze is ingesteld is in de resource class
          in combinatie met de property. Dit is mogelijk voor alle kolommen
        </li>
        <li>
          Link Woonplaats Geboorteplaats or Sterfteplaats to BAG, Deze optie is alleen mogelijk voor kolommen die
          waardes bevatten met een stad of dorp. Dit geeft de applicatie ook aan als u de optie selecteert.
        </li>
        <li>
          Link Geopoint, Deze optie is alleen mogelijk als de kolom co&ouml;rdinaatpunten bevat met een POINT(.. ..)
          waarde. Een voorbeeld van zo een kolom is de kolom{" "}
          <strong>
            <em>Co&ouml;rdinaten </em>
          </strong>
          in afbeelding 7 of 3. Deze optie zal de punten linken met een BRTgebied in de BRT door middel van een
          identificatie nummertje.
        </li>
        <li>
          Link Adres with BAG, deze optie is mogelijk als u een adres kolom hebt met straatnaam en huisnummer en
          daarnaast een woonplaatsen, sterfteplaatsen of geboorteplaatsen heeft staan in de dataset. Als u deze optie
          aanklikt zal er een nieuwe select box komen met keuze uit kolomnamen waaraan u het adres wilt koppelen.&nbsp;
          (afbeelding 9)
        </li>
      </ul>

      <p>Afbeelding 9 - Adres koppelen aan de BAG</p>

      <p>
        Zodra de gewenste configuratie is ingesteld kunt op <strong>confirm</strong> drukken om de instellingen te
        bevestigen.
      </p>

      <p>
        Vervolgens klikt u op <strong>Next </strong>om door te gaan naar het publicatie scherm. De GeoDataWizard zal uw
        configuratie dan meenemen en uw dataset gereed maken voor publicatie. Bij een succesvolle afhandeling komt er
        bovenin in het groen een melding te staan dat de conversie succesvol is. (afbeelding 10)
      </p>

      <p>Afbeelding 10 - Publicatie scherm als de configuratie met succes is uitgevoerd</p>

      <h2 className={styles.header}>Publicatie</h2>

      <p>
        In deze stap kunt u er zelf voor kiezen om de geconfigureerde data te downloaden of the publiceren naar Kadaster
        of naar Platform Linked Data Nederland (PLDN). Voor de publicatie heeft u wel een account nodig bij Kadaster of
        PLDN om het token te kunnen aanvragen.&nbsp; Deze kunt u aanvragen via (contactpersoon / website /
        contactformulier) van Triply.
      </p>

      <h3 className={styles.header}>Het downloaden van de resultaten</h3>

      <p>Voor het downloaden van de resultaten zijn er 3 mogelijkheden:</p>

      <ul>
        <li>
          Resultaten downloaden als <strong>CSV</strong>, deze optie downloadt de originele data terug als <em>csv</em>.
        </li>
        <li>
          Resultaten downloaden als <strong>RDF</strong>, deze optie downloadt de output van de configuratie als
          RDFscript.
        </li>
        <li>
          Resultaten downloaden als <strong>Script</strong>, met deze scripts kan de transformatie handmatig worden
          gedraaid. Deze optie vereist enige kennis van linked data en het uitvoeren van transformaties.
        </li>
      </ul>

      <h3 className={styles.header}>Het publiceren van de data</h3>

      <p>
        U kunt ook uw dataset publiceren naar de Kadaster en PLDN-dataplatformen. Onder <strong>Token account </strong>
        kunt u het account selecteren waarna u de dataset wilt publiceren. PLDN is een algemeen dataplatform die ook
        publiekelijk toegankelijk is. Het kadaster platform is meer gericht op geodata, deze bevat ook datasets van de
        BAG en BRT.
      </p>

      <p>
        De eerste stap naar online publiceren van de data is het selecteren van het account. Als u op de selectbox klikt
        verschijnen twee keuzes, Kadaster en PLDN. (afbeelding 11)
      </p>

      <p>Afbeelding 11 - Kiezen van het account</p>

      <p>
        Voor deze voorbeeld stappen kiezen we voor Kadaster. Onder de selectbox verschijnt er dan een link om een token
        op te halen. (afbeelding 12)
      </p>

      <p>Afbeelding 12 - Gekozen account met onderstaande link om een token te verkrijgen</p>

      <p>
        Als u op de link klikt wordt u doorverwezen naar een inlogpagina van het Kadaster dataplatform. Er zal gevraagd
        worden om een gebruikersnaam en wachtwoord. (afbeelding 13) Voor het voorbeeld wordt gebruik gemaakt van een
        voorbeeld account. U zal zelf een account moeten aanvragen.
      </p>

      <p>Afbeelding 13 - Inlogscherm om het token op te halen</p>

      <p>
        Log in met uw gebruikersnaam en wachtwoord en het volgende scherm verschijnt om een token aan te maken.
        (afbeelding 14)
      </p>

      <p>Afbeelding 14 - Het aanmaken van een token, beginscherm</p>

      <p>
        Een token werkt op 3 toegangsniveaus. Hiermee kunt u restricties leggen op uw gepubliceerde data voor andere
        gebruikers.&nbsp; Standaard zit er een{" "}
        <strong>
          <em>Read access</em>
        </strong>{" "}
        restrictie op, hiermee kan uw data alleen gelezen worden maar niet bewerkt door externe gebruikers. De{" "}
        <strong>management access</strong> houdt in dat organisaties en gebruikers kunnen worden aangepast, ook kan de
        data worden veranderd en gelezen.&nbsp; <strong>Write access </strong>wil zeggen dat de data kan worden
        aangepast en gelezen.
      </p>

      <p>
        Klik op <strong>+Create token </strong>om een nieuwe token aan te maken.&nbsp; Het volgende verschijnt:
      </p>

      <p>Afbeelding 15 - Aanmaken van een token, formulier met restrictie keuze en token naam</p>

      <p>
        Onder <strong>Token name </strong>kan er een unieke naam worden gegeven aan de nieuwe token. Vervolgens kiest u
        welke access level uw wilt toekennen aan dit token.&nbsp; Als u dit niet doet is de access level standaard{" "}
        <strong>Read access. </strong>(afbeelding 15)
      </p>

      <p>Afbeelding 16 - Ingevuld token formulier</p>

      <p>
        In dit voorbeeld kiezen voor management access. Later in de publicatie stap is er nog een mogelijkheid om een
        nieuwe lege dataset aan te maken om uw dataset naar te publiceren. Om dit te laten zien is er voor management
        access gekozen in dit voorbeeld. (afbeelding 16)
      </p>

      <p>
        Klik vervolgens op <strong>Create </strong>en uw nieuwe token verschijn als pop in beeld. Kopieer dit token en
        bewaar deze goed. Dit token wordt eenmalig verstrekt. (afbeelding 17)
      </p>

      <p>Afbeelding 17 - Aangemaakt token</p>

      <p>
        Na kopi&euml;ren klik vervolgens op <strong>Close. </strong>En keer terug naar de GeoDataGeoDataWizard en plak
        deze in het <strong>Token </strong>veld. &nbsp;(afbeelding 18)
      </p>

      <p>Afbeelding 18 - Volledig ingevuld publicatie formulier om het account op het halen</p>

      <p>
        En klik op <strong>LOAD TOKEN </strong>om de token te laden. De GeoDataWizard zal, als het token juist is, uw
        account weergeven waar de dataset naar gepubliceerd wordt. (afbeelding 19)
      </p>

      <p>Afbeelding 19 - Keuze van account en dataset op basis van token</p>

      <p>
        Druk op <strong>PUBLISH</strong> om uw dataset te publiceren op kadaster. Als dat gedaan is het kunt u via de
        link <strong>Click here to view your results</strong> de resultaten bekijken op de kadaster dataplatform.
        (afbeelding 20)
      </p>

      <p>Afbeelding 20 - Succesvolle publicatie</p>

      <p>
        <strong>Optioneel: </strong>Vervolgens is er nog een mogelijkheid om een nieuwe lege dataset aan te maken, klik
        op het plusje naast <strong>Dataset </strong>om een nieuwe dataset aan te maken. Dan verschijnt er een klein
        formuliertje. (afbeelding 21)
      </p>

      <p>Afbeelding 21 - Aanmaken van een nieuwe dataset</p>

      <p>
        Daarin geeft u een naam op voor de nieuwe dataset en klikt vervolgens op <strong>CREATE DATASET</strong>. Deze
        nieuwe dataset zal dan verschijnen in de <strong>Dataset </strong>selectbox. (afbeelding 22)
      </p>

      <p>Afbeelding 22 - Nieuwe dataset toegevoegd die gebruikt kan worden om naar te publiceren</p>

      <h1 className={styles.header}>Wat ziet er nog niet in?</h1>

      <p>
        De huidige versie van de GeoDataWizard kent, net als elk ander programma, een aantal dingen die (nog) niet
        kunnen.&nbsp; Voor deze wizard zijn dat de volgende punten:
      </p>

      <ul>
        <li>
          Bestanden met een indeling anders dan <em>csv</em> kunnen niet worden geüpload.
        </li>
        <li>
          Correcties aan naamgevingen van adressen en woonplaatsen zult u zelf moeten doen in uw dataset. De wizard zal
          enkel aangeven bij welk adres of plaats het fout gaat, door middel van een melding tijdens het omzetten naar
          linked data.
        </li>
      </ul>
    </Container>
  );
};
export default Wizardhelp;
