/* ============================================================
   SkyDev – Inhalte
   Hier änderst du, was auf der Seite steht. Einen Eintrag kopieren,
   anpassen, speichern (Commit). Mehr dazu in der README.md.
   Wichtig: Zwischen zwei Einträgen steht ein Komma, Texte stehen in "Anführungszeichen".
   ============================================================ */
window.SKYDEV_DATA = {

  /* ---------- Plakate auf der Startseite (wechseln automatisch) ----------
     tag:    kleines Schild oben, z. B. "Neu", "Update", "Bald"
     title:  große Überschrift
     text:   ein bis zwei Sätze
     button: Text auf dem Knopf
     link:   Ziel des Knopfs. Interne Seiten: "#/tools", "#/programme", "#/updates", "#/kalender", "#/mitmachen"
             Eigene Links: "https://github.com/DEIN-NAME/skydev/releases/latest"
             Leer lassen = kein Knopf
     look:   Farbe des Plakats: "blue", "night", "teal" oder "violet"
     Die Reihenfolge hier ist die Reihenfolge auf der Seite. */
  posters: [
    { tag: "Neu", title: "CopyLine", text: "Erste Tool veröffentlichung.", button: "Zu den Tools", link: "#/tools", look: "blue" },
    { tag: "Update", title: "Neue Seite, neues Menü", text: "Programme, Aktualisierungen und ein Kalender mit allen geplanten Neuheiten.", button: "Aktualisierungen", link: "#/updates", look: "night" },
//  { tag: "Bald", title: "CopyLine", text: "Dieses Tool Kommt voraussichtlich am 18.10.2026 heraus.(Kalender)", button: "Zum Kalender", link: "#/kalender", look: "teal" },
    { tag: "Mitmachen", title: "Bau mit an SkyDev", text: "Entwickler, Gestalter und Tester sind willkommen. Bewirb dich mit deiner Idee.", button: "Jetzt bewerben", link: "#/mitmachen", look: "violet" }
  ],

  /* ---------- Programme ----------
     cat:  "projekte", "tools" oder "webseiten"
     url:  Link zum Download (z. B. GitHub Release) oder zur Seite. Leer = "Bald verfügbar"
     kind: "download" oder "link"
     date: JJJJ-MM-TT, das neueste steht oben
     example: true markiert ein Beispiel. Bei echten Einträgen die Zeile weglassen. */
  items: [
    { cat: "projekte", name: "Wetter-Dashboard", desc: "Zeigt Prognose, Wind und Niederschlag für mehrere Orte auf einer Seite.", tags: ["Web", "JavaScript"], version: "0.4", size: "2,1 MB", os: "Browser", date: "2026-10-01", kind: "link", url: "", example: true },
    { cat: "projekte", name: "Aufgaben-App", desc: "Listen, Fristen und Erinnerungen, die zwischen Handy und PC abgeglichen werden.", tags: ["Android", "Kotlin"], version: "1.2", size: "8,4 MB", os: "Android", date: "2026-09-20", kind: "download", url: "", example: true },
    { cat: "tools", name: "CopyLine", desc: "CopyLine ist wie eine Zwischenablage aber Moderner.", tags: ["Windows 11/10"], version: "1.8", size: "68 KB", os: "Windows", date: "2026-10-15", kind: "download", url: "https://github.com/Sky-devX/Website/releases/download/CopyLine.1.8/SkyDev.CL.1.8.exe", example: true },
    { cat: "tools", name: "Passwort-Generator", desc: "Erzeugt starke Passwörter lokal auf dem Gerät, ohne Netzwerkzugriff.", tags: ["CLI", "Rust"], version: "2.3", size: "1,2 MB", os: "Win / Linux", date: "2026-09-12", kind: "download", url: "", example: true },
    { cat: "tools", name: "JSON Formatter", desc: "Prüft und formatiert JSON direkt aus der Zwischenablage.", tags: ["Windows", "C#"], version: "0.9", size: "3,6 MB", os: "Windows", date: "2026-08-30", kind: "download", url: "", example: true },
    { cat: "webseiten", name: "Portfolio-Vorlage", desc: "Einseitige Präsentation für Entwickler mit Projektliste und Kontaktbereich.", tags: ["HTML", "CSS"], version: "1.1", size: "480 KB", os: "Vorlage", date: "2026-09-05", kind: "link", url: "", example: true },
    { cat: "webseiten", name: "Landingpage-Kit", desc: "Sektionen für Hero, Preise und FAQ, die sich beliebig kombinieren lassen.", tags: ["React", "Tailwind"], version: "0.6", size: "1,9 MB", os: "Vorlage", date: "2026-08-14", kind: "download", url: "", example: true }
  ],

  /* ---------- Aktualisierungen ----------
     changes: Liste mit Stichpunkten. Die Seite sortiert nach Datum, neueste zuerst. */
  updates: [
    { date: "2026-10-12", version: "SkyDev 1.0", title: "Neue Seite mit Dropdown-Menü", changes: ["Startseite mit wechselnden Plakaten", "Kalender mit geplanten Neuheiten", "Bereit für GitHub Pages"] },
    { date: "2026-10-08", version: "Log Viewer 1.0", title: "Erste Version veröffentlicht", changes: ["Große Dateien öffnen ohne Wartezeit", "Filter nach Zeitraum und Stichwort"], example: true },
    { date: "2026-09-12", version: "Passwort-Generator 2.3", title: "Kleine Verbesserungen", changes: ["Längere Passwörter möglich", "Fehler beim Kopieren behoben"], example: true }
  ],

  /* ---------- Veröffentlichte Kommentare (Seite Feedback) ----------
     Neues Feedback kommt per E-Mail bei dir an. Was du öffentlich zeigen willst, kopierst du hierher.
     Löschen kannst nur du: einfach die Zeile entfernen.
     type: "Verbesserung", "Kommentar", "Fehler" oder "Wunsch" */
  feedback: [
    { type: "Verbesserung", name: "Beispiel-Besucher", text: "Beim Log Viewer wäre eine Suche mit regulären Ausdrücken super.", date: "2026-10-10", example: true },
    { type: "Kommentar", name: "Anonym", text: "Tolle Seite, der Passwort-Generator läuft bei mir ohne Probleme.", date: "2026-10-09", example: true }
  ],

  /* ---------- Kalender ----------
     Hier trägst nur du ein, wann etwas Neues kommt. Alle Besucher sehen die Termine und Infos.
     date: JJJJ-MM-TT
     type: "Neu", "Update", "Beta" oder "Termin" (frei wählbar)
     time: optional, z. B. "18:00"
     info: was an dem Tag passiert */
  events: [
    { date: "2026-10-15", type: "Neu", title: "CopyLine", info: "1.Tool veröffentlichung", example: true },
    { date: "2026-10-27", type: "Neu", title: "Neue Webseiten-Vorlage", info: "Eine Vorlage für Projektseiten mit Download-Bereich.", example: true },
    { date: "2026-11-03", type: "Update", title: "Aufgaben-App 1.3", info: "Wiederkehrende Aufgaben und ein Widget für den Startbildschirm.", time: "18:00", example: true },
    { date: "2026-11-15", type: "Termin", title: "Offene Runde zum Mitmachen", info: "Wer im Team mitarbeiten will, stellt sich vor. Ort und Link folgen hier.", example: true }
  ]
};
