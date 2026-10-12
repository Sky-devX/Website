# SkyDev

Website für Programme, Tools und Webseiten. Sie läuft ohne eigenen Server direkt über GitHub Pages.

Auf der Startseite wechseln große Plakate mit den Neuigkeiten. Oben gibt es ein Dropdown „Bereiche“ (Programme, Projekte, Tools, Webseiten, Aktualisierungen, Startseite), einen Kalender mit allen geplanten Neuheiten und ein Dropdown „Kontakt“.

## Wo steht was

| Datei | Wofür |
| --- | --- |
| `data.js` | **Alle Inhalte**: Plakate der Startseite, Programme, Aktualisierungen, Kalender-Termine |
| `config.js` | Deine Einstellungen: E-Mail für Benachrichtigungen, Text „Der Erfinder“, Impressum, Wechselzeit der Plakate |
| `index.html`, `assets/` | Aufbau und Aussehen. Hier musst du normalerweise nichts ändern |

Alles, was du im Alltag brauchst, steht in `data.js`.

## 1. Einmal einrichten

1. Öffne `config.js` und trage ein:
   - `email`: Hierhin kommen alle Nachrichten, Bewerbungen und Feedback-Einträge (siehe Abschnitt „E-Mail-Benachrichtigungen“). Prüfe die Schreibweise genau, sonst landen die Mails im Nichts
   - `founder`: dein Name und Text für „Der Erfinder“
   - `impressum`: deine Angaben (in Österreich Pflicht für öffentliche Webseiten)
   - `posterSeconds`: nach wie vielen Sekunden die Plakate wechseln (Standard 6)
2. Auf github.com ein neues **öffentliches** Repository anlegen, z. B. `skydev`.
3. Alle Dateien aus dem ZIP hochladen: **Add file → Upload files**, den Ordner `assets` mit hineinziehen, dann **Commit changes**.
4. Im Repository **Settings → Pages**: Bei **Source** „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`, speichern.
5. Nach ein bis zwei Minuten ist die Seite erreichbar unter `https://DEIN-GITHUB-NAME.github.io/skydev/`.

Nennst du das Repository `DEIN-GITHUB-NAME.github.io`, liegt die Seite direkt unter `https://DEIN-GITHUB-NAME.github.io/`.

## 2. Dateien bearbeiten (gilt für alles Folgende)

1. Im Repository die Datei anklicken, z. B. `data.js`.
2. Oben rechts auf das **Stift-Symbol** (Edit) klicken.
3. Ändern und oben rechts **Commit changes** klicken, dann nochmal **Commit changes** im Fenster.
4. Nach ein bis zwei Minuten ist die Änderung online. Zeigt die Seite noch das Alte, hilft **Strg + F5** (am Handy: Seite neu laden).

Regeln in `data.js`:
- Zwischen zwei Einträgen steht ein **Komma**, nach dem letzten Eintrag keins.
- Texte stehen in **"Anführungszeichen"**. Kommt ein Anführungszeichen im Text vor, schreibe `\"`.
- Datum immer als **JJJJ-MM-TT**, z. B. `2026-11-03`.
- Bleibt die Seite nach einer Änderung leer, fehlt fast immer ein Komma oder ein Anführungszeichen. Im Repository unter **History** kannst du die letzte Änderung ansehen und rückgängig machen.

## 3. Ein neues Programm hochladen

Die Datei selbst liegt als **Release** auf GitHub (bis 2 GB pro Datei), die Seite verlinkt nur darauf.

1. Im Repository rechts auf **Releases → Create a new release**.
2. Bei **Choose a tag** z. B. `log-viewer-1.0` eintippen und **Create new tag** wählen. Titel eintragen.
3. Die Datei (zip, exe, apk …) in das Feld **Attach binaries** ziehen und **Publish release** klicken.
4. Beim fertigen Release mit rechts auf die Datei klicken und den **Link kopieren** (Rechtsklick → Link-Adresse kopieren).
5. In `data.js` unter `items` einen Eintrag kopieren und anpassen:

```js
{ cat: "tools", name: "Log Viewer", desc: "Öffnet große Logdateien schnell.", tags: ["Windows", "Python"], version: "1.0", size: "14 MB", os: "Windows", date: "2026-10-08", kind: "download", url: "https://github.com/DEIN-NAME/skydev/releases/download/log-viewer-1.0/LogViewer.zip" },
```

- `cat`: `"projekte"`, `"tools"` oder `"webseiten"` (bestimmt, wo der Eintrag erscheint)
- `kind`: `"download"` (Knopf „Herunterladen“) oder `"link"` (Knopf „Ansehen“, z. B. für eine Webseite)
- `url` leer lassen: Der Eintrag zeigt „Bald verfügbar“
- Die Beispiel-Einträge kannst du löschen oder überschreiben. Bei echten Einträgen die Angabe `example: true` weglassen

Der Eintrag erscheint danach unter **Programme**, in seinem Bereich und, wenn er neu ist, auch auf der Startseite bei „Neueste Programme“.

## 4. Die Startseite bearbeiten (Plakate)

Die Plakate stehen oben in `data.js` unter `posters`. Ein Plakat sieht so aus:

```js
{ tag: "Neu", title: "Log Viewer 1.1", text: "Dunkles Design und schnellere Suche.", button: "Zu den Tools", link: "#/tools", look: "blue" },
```

- `tag`: kleines Schild oben, z. B. „Neu“, „Update“, „Bald“
- `title` und `text`: Überschrift und ein bis zwei Sätze
- `button` und `link`: Text und Ziel des Knopfs. Ziele auf der Seite: `"#/programme"`, `"#/tools"`, `"#/projekte"`, `"#/webseiten"`, `"#/updates"`, `"#/kalender"`, `"#/mitmachen"`. Eigener Link: `"https://…"`. Leeres `link: ""` blendet den Knopf aus
- `look`: Farbe, eine von `"blue"`, `"night"`, `"teal"`, `"violet"`

Neues Plakat: Zeile kopieren, anpassen, einfügen. Altes Plakat: Zeile löschen. Die **Reihenfolge** in der Datei ist die Reihenfolge auf der Seite. Vier bis sechs Plakate sind ein guter Wert.

Die Plakate wechseln automatisch, stoppen beim Darüberfahren mit der Maus und lassen sich mit Pfeilen, Punkten, Wischen am Handy und dem Pausenknopf steuern.

Alles andere auf der Startseite füllt sich von selbst: „Neueste Programme“ aus deinen Programmen, „Nächste Termine“ aus dem Kalender und „Letzte Aktualisierungen“ aus den Aktualisierungen.

## 5. Aktualisierungen eintragen

In `data.js` unter `updates` einen Eintrag ergänzen:

```js
{ date: "2026-10-20", version: "Log Viewer 1.1", title: "Dunkles Design", changes: ["Dunkles Design", "Suche ist doppelt so schnell"] },
```

Sie erscheinen unter **Aktualisierungen**, neueste zuerst. Tipp: Lege dazu gleich ein passendes Plakat an.

## 6. Kalender (nur du trägst ein)

Oben in der Leiste steht **Kalender**. Alle Besucher sehen darin, wann etwas Neues kommt, und können einen Tag antippen, um deine Infos zu lesen. Eintragen kannst nur du: Der Inhalt liegt in `data.js`, und nur wer Schreibrechte auf dein Repository hat, kann sie ändern. Gib deshalb niemandem Schreibrechte, dem du das nicht erlauben willst.

Termine stehen in `data.js` unter `events`:

```js
{ date: "2026-11-03", type: "Update", title: "Aufgaben-App 1.3", info: "Wiederkehrende Aufgaben und ein Widget.", time: "18:00" },
```

- `date`: Tag des Termins
- `type`: z. B. `"Neu"`, `"Update"`, `"Beta"`, `"Termin"` (frei wählbar)
- `title` und `info`: Name und die Infos, die Besucher beim Antippen sehen
- `time`: optional, die Uhrzeit

Vergangene Termine bleiben im Kalender sichtbar, auf der Startseite und in „Nächste Termine“ erscheinen nur kommende. Löschen musst du also nichts.

## 7. E-Mail-Benachrichtigungen

Die drei Formulare **Nachricht schreiben**, **Mitmachen** (Bewerbung) und **Feedback** schicken ihren Inhalt als E-Mail an die Adresse aus `config.js`. Besucher brauchen dafür weder E-Mail-Programm noch Konto. Die Mails kommen über den kostenlosen Dienst [FormSubmit](https://formsubmit.co). Der Betreff zeigt, worum es geht, z. B. „SkyDev Bewerbung als Entwickler“. Bei Nachrichten und Bewerbungen kannst du direkt auf „Antworten“ klicken.

**Einmal aktivieren:**
1. Veröffentliche die Seite (Abschnitt 1).
2. Öffne die Seite und sende dir über **Kontakt → Nachricht schreiben** selbst eine Testnachricht.
3. In deinem Postfach kommt eine Mail von FormSubmit mit einem Bestätigungslink. Darauf klicken und bestätigen. Schau auch im Spam-Ordner nach.
4. Sende noch eine Testnachricht. Sie sollte jetzt direkt ankommen. Erst danach funktionieren die Formulare für alle.

**Adresse verstecken (empfohlen):** Die Adresse aus `config.js` kann jeder im Quelltext der Seite lesen und bekommt dann leichter Spam. In der Bestätigungsmail oder auf formsubmit.co bekommst du nach der Aktivierung eine zufällige Adresse wie `https://formsubmit.co/ajax/abc123def456`. Trage sie in `config.js` bei `formEndpoint` ein. Danach steht deine E-Mail-Adresse nur noch in `config.js` und wird nicht mehr benutzt. Lösche sie dort, wenn sie gar nicht mehr im Quelltext stehen soll (`email: ""`).

**Datenschutz:** Über die Formulare gehen persönliche Daten (Name, E-Mail, Text) an FormSubmit und dann an dich. Weise im Impressum oder in einer Datenschutzerklärung darauf hin. Vorlagen gibt es bei datenschutz-generator.de oder auf der Seite der österreichischen Datenschutzbehörde.

## 8. Feedback-Liste auf der Seite

Neues Feedback kommt per E-Mail bei dir an. Auf der Seite **Feedback** steht eine scrollbare Liste mit Auswahl nach Art (Verbesserungen, Kommentare, Fehler, Wünsche). Darin erscheint nur, was du in `data.js` unter `feedback` einträgst:

```js
{ type: "Verbesserung", name: "Max", text: "Eine Suche mit regulären Ausdrücken wäre super.", date: "2026-10-12" },
```

So bestimmst du selbst, was öffentlich steht. Löschen kannst nur du, indem du die Zeile entfernst. Die Einträge bleiben gespeichert, bis du das tust.
