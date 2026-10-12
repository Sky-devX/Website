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
    name: "Luca",
    role: "Gründer & Entwickler",
    text: "Hinter der Website steckt ein 15 jähriger Teenager der das Projekt gestartet hat und jetzt Tool for free erstellen will die jedem im Altag helfen sollen.",
    focus: "Entwicklung & IT",
    place: "Österreich",
    since: "2026"
  },

  /* Impressum (in Österreich Pflicht für öffentliche Webseiten, Zeilen anpassen) */
  impressum: [
    "Poschacher Luca",
    "Deine Straße und Hausnummer",
    "Steiermark, Österreich",
    "E-Mail: Skydev.buissnes@gmail.com"
  ]
};
