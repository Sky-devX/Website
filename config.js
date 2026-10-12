/* ============================================================
   SkyDev – Einstellungen
   Hier trägst du einmal deine eigenen Daten ein.
   ============================================================ */
window.SKYDEV_CONFIG = {
  name: "SkyDev",

  /* Sekunden, nach denen die Plakate auf der Startseite wechseln */
  posterSeconds: 6,

  /* Hierhin werden Nachrichten, Bewerbungen und Feedback geschickt (über den Dienst FormSubmit).
     Achtung: Die Adresse steht dadurch im Quelltext der Seite. Mehr dazu in der README (Abschnitt "E-Mail-Benachrichtigungen"). */
  email: "Skydev.buissnes@gmail.com",

  /* Optional: die geheime Adresse von FormSubmit, siehe README. Wenn gefüllt, wird sie statt der E-Mail benutzt.
     Beispiel: "https://formsubmit.co/ajax/abc123def456" */
  formEndpoint: "",

  /* Bereich "Der Erfinder" */
  founder: {
    name: "Dein Name",
    role: "Gründer & Entwickler",
    text: "Hier steht, wer hinter SkyDev steckt, warum die Tools entstanden sind und woran gerade gearbeitet wird.",
    focus: "Entwicklung & IT",
    place: "Österreich",
    since: "2026"
  },

  /* Impressum (in Österreich Pflicht für öffentliche Webseiten, Zeilen anpassen) */
  impressum: [
    "Dein vollständiger Name",
    "Deine Straße und Hausnummer",
    "PLZ Ort, Österreich",
    "E-Mail: deine@adresse.at"
  ]
};
