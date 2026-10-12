/* SkyDev – Seitenlogik. Inhalte stehen in data.js, Einstellungen in config.js. */
(function () {
  "use strict";
  var CFG = window.SKYDEV_CONFIG || {};
  var DATA = window.SKYDEV_DATA || { items: [], updates: [], posters: [], events: [] };
  var view = document.getElementById("view");
  var toastEl = document.getElementById("toast");
  var toastTimer;
  var cleanup = null;

  var LISTS = {
    programme: { label: "Programme", kicker: "Alles auf einen Blick", desc: "Projekte, Tools und Webseiten in einer Liste. Kostenlos und ohne Anmeldung.", cat: null },
    projekte: { label: "Projekte", kicker: "Was ich baue", desc: "Größere Vorhaben mit eigenem Zweck, von der App bis zum Dashboard.", cat: "projekte" },
    tools: { label: "Tools", kicker: "Zum Herunterladen", desc: "Kleine Programme, die eine Sache gut erledigen.", cat: "tools" },
    webseiten: { label: "Webseiten", kicker: "Vorlagen und Seiten", desc: "Fertige Webseiten und Bausätze zum Ansehen oder als Grundlage.", cat: "webseiten" }
  };
  var MENU = [
    ["programme", "Programme", "Projekte, Tools und Webseiten"],
    ["projekte", "Projekte", ""],
    ["tools", "Tools", ""],
    ["webseiten", "Webseiten", ""],
    ["updates", "Aktualisierungen", "Neuigkeiten und Versionen"],
    ["start", "Startseite", "Das Neueste auf einen Blick", "sep"]
  ];
  var CONTACT = [
    ["erfinder", "Der Erfinder", "Wer hinter SkyDev steckt"],
    ["nachricht", "Nachricht schreiben", "Direkt per E-Mail"],
    ["feedback", "Feedback", "Verbesserungen und Kommentare"],
    ["mitmachen", "Mitmachen", "Bewirb dich fürs Team"]
  ];
  var FB_TYPES = [["Verbesserung", "Verbesserungen"], ["Kommentar", "Kommentare"], ["Fehler", "Fehler"], ["Wunsch", "Wünsche"]];
  var WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  /* ---------- Helfer ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
  }
  function fmtDate(s) {
    var d = parseDate(s);
    return isNaN(d) ? "" : d.toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });
  }
  function fmtLong(s) {
    var d = parseDate(s);
    return isNaN(d) ? "" : d.toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function keyOf(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
  function todayKey() { var t = new Date(); return keyOf(t.getFullYear(), t.getMonth(), t.getDate()); }
  function byDateDesc(a, b) { return String(b.date || "").localeCompare(String(a.date || "")); }
  function byDateAsc(a, b) { return String(a.date || "").localeCompare(String(b.date || "")); }
  function upcomingEvents() { var t = todayKey(); return (DATA.events || []).filter(function (e) { return e.date >= t; }).sort(byDateAsc); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function section(eyebrow, title, desc, countText) {
    var s = el("section", "sec");
    var head = el("div", "sec-head");
    var left = el("div");
    if (eyebrow) left.appendChild(el("p", "eyebrow", eyebrow));
    left.appendChild(el("h2", "", title));
    if (desc) left.appendChild(el("p", "", desc));
    head.appendChild(left);
    if (countText) head.appendChild(el("span", "count", countText));
    s.appendChild(head);
    return s;
  }
  function moreLink(parent, text, href) {
    var m = el("div", "more"); var a = el("a", "btn", text); a.href = href; m.appendChild(a); parent.appendChild(m);
  }
  function field(label, node) { var l = el("label"); l.appendChild(document.createTextNode(label)); l.appendChild(node); return l; }
  function input(id, type, max, req, ph) {
    var i = el("input"); i.id = id; i.type = type; if (max) i.maxLength = max; if (req) i.required = true; if (ph) i.placeholder = ph;
    if (type === "email") i.autocomplete = "email";
    return i;
  }
  function area(id, max, req, ph) {
    var t = el("textarea"); t.id = id; t.maxLength = max; if (req) t.required = true; if (ph) t.placeholder = ph; return t;
  }
  function select(id, opts) {
    var s = el("select"); s.id = id;
    opts.forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; s.appendChild(op); });
    return s;
  }
  /* Alle Formulare (Nachricht, Bewerbung, Feedback) landen per E-Mail bei SkyDev, über den Dienst FormSubmit. */
  var MAIL_NOTICE = "Beim Absenden wird dein Text über den Dienst FormSubmit als E-Mail an SkyDev weitergeleitet.";
  function mailEndpoint() {
    if (CFG.formEndpoint) return CFG.formEndpoint;
    return CFG.email ? "https://formsubmit.co/ajax/" + encodeURIComponent(CFG.email) : "";
  }
  function honey() {
    var h = el("input", "hp"); h.type = "text"; h.name = "_honey"; h.tabIndex = -1; h.autocomplete = "off"; h.setAttribute("aria-hidden", "true");
    return h;
  }
  function sendForm(subject, fields, btn, done) {
    var url = mailEndpoint();
    if (!url) { toast("Trage zuerst die E-Mail-Adresse in config.js ein."); return; }
    var body = { _subject: subject, _template: "table", _captcha: "false" };
    Object.keys(fields).forEach(function (k) { body[k] = fields[k]; });
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = "Wird gesendet …";
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok || j.success === false || j.success === "false") throw new Error("send");
          done();
        });
      })
      .catch(function () { toast("Senden hat nicht geklappt. Bitte versuche es später noch einmal."); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  }
  function iconBtn(label, path) {
    var b = el("button", "pbtn"); b.type = "button"; b.setAttribute("aria-label", label);
    setIcon(b, path);
    return b;
  }
  function setIcon(b, path) {
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  /* ---------- Dropdowns ---------- */
  var dropdowns = [];
  function makeDropdown(root, idPrefix, items) {
    var btn = el("button", "dd-btn"); btn.type = "button";
    btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", idPrefix + "-menu");
    var label = el("span", "", "");
    btn.appendChild(label);
    btn.insertAdjacentHTML("beforeend", '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>');
    var menu = el("div", "dd-menu"); menu.id = idPrefix + "-menu"; menu.hidden = true;
    items.forEach(function (it) {
      if (it[3] === "sep") menu.appendChild(el("div", "dd-sep"));
      var a = el("a", "", it[1]); a.href = "#/" + it[0]; a.dataset.id = it[0];
      if (it[2]) a.appendChild(el("small", "", it[2]));
      a.addEventListener("click", close);
      menu.appendChild(a);
    });
    root.appendChild(btn); root.appendChild(menu);
    function open() { closeAll(); menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
    function close() { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden ? open() : close(); });
    menu.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); btn.focus(); } });
    var d = { btn: btn, label: label, menu: menu, close: close };
    dropdowns.push(d);
    return d;
  }
  function closeAll() { dropdowns.forEach(function (d) { d.close(); }); }
  document.addEventListener("click", function (e) { if (!e.target.closest || !e.target.closest(".dd")) closeAll(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  var ddMenu = makeDropdown(document.getElementById("ddMenu"), "m", MENU);
  var ddContact = makeDropdown(document.getElementById("ddContact"), "c", CONTACT);
  var navCal = document.getElementById("navCal");

  function syncMenus(route) {
    var inMenu = MENU.filter(function (m) { return m[0] === route; })[0];
    var inContact = CONTACT.filter(function (m) { return m[0] === route; })[0];
    ddMenu.label.textContent = inMenu && route !== "start" ? inMenu[1] : "Bereiche";
    ddContact.label.textContent = inContact ? inContact[1] : "Kontakt";
    ddMenu.btn.classList.toggle("active", !!inMenu && route !== "start");
    ddContact.btn.classList.toggle("active", !!inContact);
    navCal.classList.toggle("active", route === "kalender");
    if (route === "kalender") navCal.setAttribute("aria-current", "page"); else navCal.removeAttribute("aria-current");
    [ddMenu, ddContact].forEach(function (d) {
      d.menu.querySelectorAll("a").forEach(function (a) {
        if (a.dataset.id === route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
    });
  }

  /* ---------- Karten ---------- */
  function card(it) {
    var c = el("article", "card");
    var tags = el("div", "tags");
    (it.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    if (it.example) tags.appendChild(el("span", "tag ex", "Beispiel"));
    c.appendChild(tags);
    c.appendChild(el("h3", "", it.name));
    c.appendChild(el("p", "", it.desc));
    var m = el("div", "meta");
    [it.version ? "v" + it.version : "", it.size, it.os].forEach(function (t) { if (t) m.appendChild(el("span", "", t)); });
    c.appendChild(m);
    var url = safeUrl(it.url);
    var label = it.kind === "download" ? "Herunterladen" : "Ansehen";
    var b;
    if (url) { b = el("a", "btn" + (it.kind === "download" ? " primary" : ""), label); b.href = url; b.target = "_blank"; b.rel = "noopener"; }
    else { b = el("span", "btn", "Bald verfügbar"); b.setAttribute("aria-disabled", "true"); }
    c.appendChild(b);
    return c;
  }
  function updateCard(u) {
    var c = el("article", "upd");
    var top = el("div", "upd-top");
    top.appendChild(el("span", "tag", u.version || "Update"));
    top.appendChild(el("span", "meta", fmtDate(u.date)));
    if (u.example) top.appendChild(el("span", "tag ex", "Beispiel"));
    c.appendChild(top);
    c.appendChild(el("h3", "", u.title));
    if (u.changes && u.changes.length) {
      var ul = el("ul");
      u.changes.forEach(function (t) { ul.appendChild(el("li", "", t)); });
      c.appendChild(ul);
    }
    return c;
  }
  function eventCard(e, showDate) {
    var c = el("article", "ev");
    var top = el("div", "ev-top");
    top.appendChild(el("span", "tag", e.type || "Termin"));
    if (showDate) top.appendChild(el("span", "meta", fmtDate(e.date) + (e.time ? " · " + e.time + " Uhr" : "")));
    else if (e.time) top.appendChild(el("span", "meta", e.time + " Uhr"));
    if (e.example) top.appendChild(el("span", "tag ex", "Beispiel"));
    c.appendChild(top);
    c.appendChild(el("h3", "", e.title));
    if (e.info) c.appendChild(el("p", "", e.info));
    return c;
  }

  /* ---------- Plakate ---------- */
  function renderPosters(parent) {
    var posters = DATA.posters || [];
    var n = posters.length;
    if (!n) return;
    var secs = Number(CFG.posterSeconds) || 6;
    var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var box = el("section", "posters");
    box.setAttribute("aria-roledescription", "Karussell"); box.setAttribute("aria-label", "Neuigkeiten");
    var stack = el("div", "pstack");
    var slides = [], dots = [];
    posters.forEach(function (p, i) {
      var s = el("article", "poster look-" + (p.look || "blue"));
      s.setAttribute("aria-roledescription", "Folie"); s.setAttribute("aria-label", (i + 1) + " von " + n);
      var inner = el("div", "poster-in");
      inner.appendChild(el("span", "ptag", p.tag || "Neu"));
      inner.appendChild(el("h2", "", p.title));
      if (p.text) inner.appendChild(el("p", "", p.text));
      var link = p.link || "", href = link.charAt(0) === "#" ? link : safeUrl(link);
      if (href) {
        var a = el("a", "btn light", p.button || "Mehr"); a.href = href;
        if (href.charAt(0) !== "#") { a.target = "_blank"; a.rel = "noopener"; }
        inner.appendChild(a);
      }
      s.appendChild(inner); stack.appendChild(s); slides.push(s);
    });
    box.appendChild(stack);

    var ctl = el("div", "pctl");
    var dotsBox = el("div", "pdots");
    posters.forEach(function (p, i) {
      var d = el("button", "pdot"); d.type = "button"; d.setAttribute("aria-label", "Plakat " + (i + 1) + ": " + p.title);
      d.appendChild(el("i"));
      d.addEventListener("click", function () { show(i); });
      dotsBox.appendChild(d); dots.push(d);
    });
    ctl.appendChild(dotsBox);
    var prev = iconBtn("Vorheriges Plakat", "M15 6l-6 6 6 6");
    var toggle = iconBtn("Automatisches Wechseln anhalten", "M8 5v14M16 5v14");
    var next = iconBtn("Nächstes Plakat", "M9 6l6 6-6 6");
    if (n > 1) { ctl.appendChild(prev); ctl.appendChild(toggle); ctl.appendChild(next); }
    box.appendChild(ctl);
    parent.appendChild(box);

    var idx = 0, paused = reduce, hover = false, timer = null;
    function refresh() {
      clearTimeout(timer);
      var running = !paused && !hover && !document.hidden && n > 1;
      dots.forEach(function (d, i) { d.firstChild.style.animation = "none"; d.classList.toggle("on", i === idx); });
      stack.setAttribute("aria-live", running ? "off" : "polite");
      if (running) {
        var f = dots[idx].firstChild;
        void f.offsetWidth;
        f.style.animation = "pfill " + secs + "s linear forwards";
        timer = setTimeout(function () { show(idx + 1); }, secs * 1000);
      }
    }
    function show(i) {
      idx = (i + n) % n;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === idx); s.setAttribute("aria-hidden", k === idx ? "false" : "true"); });
      refresh();
    }
    function syncToggle() {
      toggle.setAttribute("aria-label", paused ? "Automatisches Wechseln starten" : "Automatisches Wechseln anhalten");
      setIcon(toggle, paused ? "M7 5l12 7-12 7z" : "M8 5v14M16 5v14");
    }
    prev.addEventListener("click", function () { show(idx - 1); });
    next.addEventListener("click", function () { show(idx + 1); });
    toggle.addEventListener("click", function () { paused = !paused; syncToggle(); refresh(); });
    box.addEventListener("mouseenter", function () { hover = true; refresh(); });
    box.addEventListener("mouseleave", function () { hover = false; refresh(); });
    box.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches(":focus-visible")) { hover = true; refresh(); } });
    box.addEventListener("focusout", function () { if (hover) { hover = false; refresh(); } });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(idx - 1); } else if (e.key === "ArrowRight") { show(idx + 1); }
    });
    var x0 = null;
    stack.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stack.addEventListener("touchend", function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    cleanup = function () { clearTimeout(timer); document.removeEventListener("visibilitychange", refresh); };
    syncToggle();
    show(0);
  }

  /* ---------- Ansichten ---------- */
  function renderStart() {
    renderPosters(view);

    var items = DATA.items.slice().sort(byDateDesc);
    var s1 = section("Frisch hochgeladen", "Neueste Programme", "", "");
    var g = el("div", "grid");
    items.slice(0, 3).forEach(function (it) { g.appendChild(card(it)); });
    if (!items.length) g.appendChild(el("div", "empty", "Hier ist noch nichts."));
    s1.appendChild(g);
    moreLink(s1, "Alle Programme", "#/programme");
    view.appendChild(s1);

    var soon = upcomingEvents().slice(0, 3);
    var s2 = section("Was kommt", "Nächste Termine", "", "");
    var g2 = el("div", "grid");
    soon.forEach(function (e) { g2.appendChild(eventCard(e, true)); });
    if (!soon.length) g2.appendChild(el("div", "empty", "Gerade ist nichts geplant."));
    s2.appendChild(g2);
    moreLink(s2, "Zum Kalender", "#/kalender");
    view.appendChild(s2);

    var ups = (DATA.updates || []).slice().sort(byDateDesc).slice(0, 2);
    if (ups.length) {
      var s3 = section("Was ist neu", "Letzte Aktualisierungen", "", "");
      var tl = el("div", "timeline");
      ups.forEach(function (u) { tl.appendChild(updateCard(u)); });
      s3.appendChild(tl);
      moreLink(s3, "Alle Aktualisierungen", "#/updates");
      view.appendChild(s3);
    }
  }

  function renderList(id) {
    var L = LISTS[id];
    var all = DATA.items.filter(function (i) { return !L.cat || i.cat === L.cat; }).sort(byDateDesc);
    var s = section(L.kicker, L.label, L.desc, plural(all.length, "Eintrag", "Einträge"));
    var row = el("div", "tools-row");
    var search = el("div", "search");
    search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    var q = el("input"); q.type = "search"; q.placeholder = "Suchen"; q.setAttribute("aria-label", "Suchen"); q.autocomplete = "off";
    search.appendChild(q); row.appendChild(search);
    var filter = "alle";
    var chips = el("div", "chips");
    if (!L.cat) {
      [["alle", "Alle"], ["projekte", "Projekte"], ["tools", "Tools"], ["webseiten", "Webseiten"]].forEach(function (c) {
        var b = el("button", "chip", c[1]); b.type = "button"; b.dataset.id = c[0];
        b.addEventListener("click", function () { filter = c[0]; draw(); });
        chips.appendChild(b);
      });
      row.appendChild(chips);
    }
    s.appendChild(row);
    var g = el("div", "grid"); s.appendChild(g);
    function draw() {
      var term = q.value.trim().toLowerCase();
      chips.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.id === filter ? "true" : "false"); });
      g.textContent = "";
      var shown = all.filter(function (it) {
        if (filter !== "alle" && it.cat !== filter) return false;
        return !term || (it.name + " " + it.desc + " " + (it.tags || []).join(" ")).toLowerCase().indexOf(term) > -1;
      });
      if (!shown.length) g.appendChild(el("div", "empty", term ? "Nichts gefunden für „" + q.value.trim() + "“." : "Hier ist noch nichts."));
      shown.forEach(function (it) { g.appendChild(card(it)); });
    }
    q.addEventListener("input", draw);
    draw();
    view.appendChild(s);
  }

  function renderUpdates() {
    var ups = (DATA.updates || []).slice().sort(byDateDesc);
    var s = section("Neuigkeiten", "Aktualisierungen", "Neue Versionen, Verbesserungen und Fehlerbehebungen, neueste zuerst.", plural(ups.length, "Eintrag", "Einträge"));
    var tl = el("div", "timeline");
    ups.forEach(function (u) { tl.appendChild(updateCard(u)); });
    if (!ups.length) tl.appendChild(el("div", "empty", "Noch keine Aktualisierungen."));
    s.appendChild(tl);
    view.appendChild(s);
  }

  /* Kalender: Besucher sehen alles, eingetragen wird in data.js (nur wer das Repository besitzt, kann das ändern). */
  function renderCalendar() {
    var events = DATA.events || [];
    var up = upcomingEvents();
    var s = section("Was kommt", "Kalender", "Hier steht, wann neue Programme und Updates erscheinen. Eingetragen wird nur von SkyDev. Tippe einen Tag an, um die Infos zu sehen.", plural(up.length, "Termin", "Termine") + " geplant");
    var wrap = el("div", "cal-wrap");
    var cal = el("div", "cal");
    var head = el("div", "cal-head");
    var prev = iconBtn("Voriger Monat", "M15 6l-6 6 6 6");
    var title = el("h3", "", "");
    title.setAttribute("aria-live", "polite");
    var todayBtn = el("button", "chip", "Heute"); todayBtn.type = "button";
    var next = iconBtn("Nächster Monat", "M9 6l6 6-6 6");
    head.appendChild(prev); head.appendChild(title); head.appendChild(todayBtn); head.appendChild(next);
    cal.appendChild(head);
    var grid = el("div", "cal-grid");
    cal.appendChild(grid);
    var panel = el("div", "stack");
    wrap.appendChild(cal); wrap.appendChild(panel);
    s.appendChild(wrap);
    view.appendChild(s);

    var now = new Date(), y = now.getFullYear(), m = now.getMonth(), sel = null;
    var tk = todayKey();

    function drawPanel() {
      panel.textContent = "";
      if (sel) {
        panel.appendChild(el("h3", "cal-ptitle", fmtLong(sel)));
        var on = events.filter(function (e) { return e.date === sel; });
        on.forEach(function (e) { panel.appendChild(eventCard(e, false)); });
        if (!on.length) panel.appendChild(el("div", "empty", "An diesem Tag ist nichts geplant."));
        var all = el("button", "btn", "Alle kommenden Termine"); all.type = "button";
        all.addEventListener("click", function () { sel = null; draw(); });
        panel.appendChild(all);
      } else {
        panel.appendChild(el("h3", "cal-ptitle", "Nächste Termine"));
        up.slice(0, 8).forEach(function (e) { panel.appendChild(eventCard(e, true)); });
        if (!up.length) panel.appendChild(el("div", "empty", "Gerade ist nichts geplant. Schau bald wieder vorbei."));
      }
    }
    function draw() {
      title.textContent = new Date(y, m, 1).toLocaleDateString("de-AT", { month: "long", year: "numeric" });
      grid.textContent = "";
      WEEKDAYS.forEach(function (w) { grid.appendChild(el("div", "cal-wd", w)); });
      var offset = (new Date(y, m, 1).getDay() + 6) % 7;
      for (var i = 0; i < 42; i++) {
        (function () {
          var d = new Date(y, m, 1 - offset + i);
          var key = keyOf(d.getFullYear(), d.getMonth(), d.getDate());
          var n = events.filter(function (e) { return e.date === key; }).length;
          var b = el("button", "cal-day"); b.type = "button";
          if (d.getMonth() !== m) b.classList.add("out");
          if (key === tk) b.classList.add("today");
          if (key === sel) b.classList.add("sel");
          b.setAttribute("aria-pressed", key === sel ? "true" : "false");
          b.setAttribute("aria-label", fmtLong(key) + (n ? ", " + plural(n, "Termin", "Termine") : ""));
          b.appendChild(el("span", "", String(d.getDate())));
          if (n) b.appendChild(el("span", "cal-dot"));
          b.addEventListener("click", function () {
            sel = key;
            if (d.getMonth() !== m) { y = d.getFullYear(); m = d.getMonth(); }
            draw();
          });
          grid.appendChild(b);
        })();
      }
      drawPanel();
    }
    function go(delta) { var d = new Date(y, m + delta, 1); y = d.getFullYear(); m = d.getMonth(); draw(); }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    todayBtn.addEventListener("click", function () { var t = new Date(); y = t.getFullYear(); m = t.getMonth(); sel = null; draw(); });
    draw();
  }

  function renderFounder() {
    var F = CFG.founder || {};
    var s = section("Hinter SkyDev", "Der Erfinder", "Wer die Tools erfunden und gebaut hat.", "");
    var box = el("div", "founder");
    box.appendChild(el("div", "avatar", (F.name || "SD").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase()));
    var r = el("div");
    r.appendChild(el("p", "role", F.role || ""));
    r.appendChild(el("h3", "", F.name || ""));
    r.appendChild(el("p", "", F.text || ""));
    var facts = el("div", "facts");
    [["Fokus", F.focus], ["Ort", F.place], ["Seit", F.since]].forEach(function (f) {
      if (!f[1]) return; var sp = el("span", "", f[0] + " "); sp.appendChild(el("b", "", f[1])); facts.appendChild(sp);
    });
    r.appendChild(facts);
    box.appendChild(r);
    s.appendChild(box);
    view.appendChild(s);
  }

  function renderMessage() {
    var s = section("Schreib mir", "Nachricht schreiben", "Deine Nachricht kommt direkt bei SkyDev an. Antworten bekommst du per E-Mail.", "");
    var f = el("form", "f narrow");
    var n = input("cname", "text", 60, true), m = input("cmail", "email", 80, true), t = area("cmsg", 800, true), hp = honey();
    f.appendChild(field("Name", n)); f.appendChild(field("Deine E-Mail", m)); f.appendChild(field("Nachricht", t)); f.appendChild(hp);
    var b = el("button", "btn primary", "Nachricht senden"); b.type = "submit"; f.appendChild(b);
    f.appendChild(el("p", "note", MAIL_NOTICE));
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (hp.value) { toast("Danke, deine Nachricht ist angekommen."); return; }
      sendForm("SkyDev Nachricht von " + n.value.trim(), { name: n.value.trim(), email: m.value.trim(), Nachricht: t.value.trim() }, b, function () {
        f.reset(); toast("Danke, deine Nachricht ist angekommen.");
      });
    });
    s.appendChild(f);
    view.appendChild(s);
  }

  function renderJoin() {
    var s = section("Werde ein Teil von SkyDev", "Mitmachen", "Du willst Tools mitentwickeln, Seiten gestalten oder eigene Ideen umsetzen? Bewirb dich und erzähl, was du erstellen möchtest.", "");
    var g = el("div", "grid");
    [["Code", "Entwickler", "Programme, Tools und Webseiten mitbauen und weiterentwickeln."],
     ["Design", "Gestalter", "Oberflächen, Logos und Icons entwerfen, die zu SkyDev passen."],
     ["Ideen", "Tester & Ideengeber", "Neues ausprobieren, Fehler finden und Wünsche für die Zukunft äußern."]].forEach(function (c) {
      var a = el("article", "card"); var tg = el("div", "tags"); tg.appendChild(el("span", "tag", c[0])); a.appendChild(tg);
      a.appendChild(el("h3", "", c[1])); a.appendChild(el("p", "", c[2])); g.appendChild(a);
    });
    s.appendChild(g);
    var f = el("form", "f narrow"); f.style.marginTop = "20px";
    var n = input("jname", "text", 60, true), m = input("jmail", "email", 80, true);
    var r = select("jrole", [["Entwickler", "Entwickler"], ["Gestalter", "Gestalter"], ["Tester & Ideengeber", "Tester & Ideengeber"]]);
    var l = input("jlink", "text", 120, false, "GitHub, Portfolio oder Webseite");
    var t = area("jtext", 600, true, "Erzähl kurz von dir und deiner Idee.");
    var hp = honey();
    f.appendChild(field("Name", n)); f.appendChild(field("Deine E-Mail", m)); f.appendChild(field("Ich möchte mitmachen als", r));
    f.appendChild(field("Link zu deiner Arbeit (optional)", l)); f.appendChild(field("Was möchtest du erstellen?", t)); f.appendChild(hp);
    var b = el("button", "btn primary", "Bewerbung abschicken"); b.type = "submit"; f.appendChild(b);
    f.appendChild(el("p", "note", "Deine Bewerbung kommt direkt bei SkyDev an. " + MAIL_NOTICE));
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (hp.value) { toast("Danke, deine Bewerbung ist angekommen."); return; }
      sendForm("SkyDev Bewerbung als " + r.value, { name: n.value.trim(), email: m.value.trim(), Rolle: r.value, Link: l.value.trim() || "-", Idee: t.value.trim() }, b, function () {
        f.reset(); toast("Danke, deine Bewerbung ist angekommen.");
      });
    });
    s.appendChild(f);
    view.appendChild(s);
  }

  /* Feedback: Das Formular schickt eine E-Mail. Die öffentliche Liste pflegst du selbst in data.js (feedback). */
  function renderFeedback() {
    var all = (DATA.feedback || []).slice().sort(byDateDesc);
    var s = section("Deine Meinung", "Feedback", "Verbesserungsvorschläge, Fehler oder einfach ein Kommentar: Hier ist Platz dafür.", plural(all.length, "Kommentar", "Kommentare"));
    var wrap = el("div", "up");
    var f = el("form", "f");
    var ty = select("fbtype", [["Verbesserung", "Verbesserungsvorschlag"], ["Kommentar", "Kommentar"], ["Fehler", "Fehler melden"], ["Wunsch", "Wunsch für ein neues Tool"]]);
    var nm = input("fbname", "text", 40, false, "Anonym");
    var ml = input("fbmail", "email", 80, false, "Nur wenn du eine Antwort möchtest");
    var tx = area("fbtext", 500, true, "Was soll besser werden?");
    var hp = honey();
    f.appendChild(field("Art", ty)); f.appendChild(field("Name (optional)", nm)); f.appendChild(field("E-Mail (optional)", ml)); f.appendChild(field("Dein Text", tx)); f.appendChild(hp);
    var b = el("button", "btn primary", "Absenden"); b.type = "submit"; f.appendChild(b);
    f.appendChild(el("p", "note", "Dein Feedback kommt per E-Mail bei SkyDev an. " + MAIL_NOTICE + " In der Liste erscheinen Einträge, die der Besitzer freigibt und jederzeit wieder löschen kann."));
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (hp.value) { toast("Danke, dein Feedback ist angekommen."); return; }
      var fields = { Art: ty.value, Name: nm.value.trim() || "Anonym", Text: tx.value.trim() };
      if (ml.value.trim()) fields.email = ml.value.trim();
      sendForm("SkyDev Feedback: " + ty.value, fields, b, function () { f.reset(); toast("Danke, dein Feedback ist angekommen."); });
    });
    wrap.appendChild(f);

    var right = el("div", "stack");
    var chips = el("div", "chips"); right.appendChild(chips);
    var list = el("div", "scroll"); right.appendChild(list);
    wrap.appendChild(right);
    s.appendChild(wrap);
    view.appendChild(s);

    var filter = "Alle";
    function draw() {
      chips.textContent = "";
      [["Alle", "Alle"]].concat(FB_TYPES).forEach(function (t) {
        var n = t[0] === "Alle" ? all.length : all.filter(function (x) { return x.type === t[0]; }).length;
        var c = el("button", "chip", t[1] + " " + n); c.type = "button";
        c.setAttribute("aria-pressed", filter === t[0] ? "true" : "false");
        c.addEventListener("click", function () { filter = t[0]; draw(); });
        chips.appendChild(c);
      });
      list.textContent = "";
      var shown = all.filter(function (x) { return filter === "Alle" || x.type === filter; });
      if (!shown.length) list.appendChild(el("div", "empty", all.length ? "In dieser Auswahl ist noch nichts." : "Noch keine veröffentlichten Kommentare."));
      shown.forEach(function (x) {
        var c = el("div", "cm");
        var top = el("div", "cm-top");
        top.appendChild(el("b", "", x.name || "Anonym"));
        var tg = el("div", "tags"); tg.appendChild(el("span", "tag", x.type || "Kommentar"));
        if (x.example) tg.appendChild(el("span", "tag ex", "Beispiel"));
        top.appendChild(tg);
        c.appendChild(top);
        if (x.date) c.appendChild(el("div", "meta", fmtDate(x.date)));
        c.appendChild(el("p", "", x.text));
        list.appendChild(c);
      });
    }
    draw();
  }

  function renderLegal() {
    var s = section("Rechtliches", "Impressum", "", "");
    var box = el("div", "legal");
    (CFG.impressum || []).forEach(function (l) { box.appendChild(el("p", "", l)); });
    s.appendChild(box);
    view.appendChild(s);
  }

  /* ---------- Routing ---------- */
  var VIEWS = {
    start: renderStart, updates: renderUpdates, kalender: renderCalendar, erfinder: renderFounder, nachricht: renderMessage,
    feedback: renderFeedback, mitmachen: renderJoin, impressum: renderLegal
  };
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    var id = (location.hash || "").replace(/^#\/?/, "") || "start";
    if (!VIEWS[id] && !LISTS[id]) id = "start";
    view.textContent = "";
    if (LISTS[id]) renderList(id); else VIEWS[id]();
    syncMenus(id);
    closeAll();
    var names = { kalender: "Kalender", impressum: "Impressum" };
    MENU.concat(CONTACT).forEach(function (m) { names[m[0]] = m[1]; });
    document.title = (id === "start" ? "" : (names[id] || "") + " · ") + (CFG.name || "SkyDev");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  try { var saved = localStorage.getItem("skydev-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) { /* ohne Speicher */ }
  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark" || (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    var nextTheme = dark ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    try { localStorage.setItem("skydev-theme", nextTheme); } catch (e) { /* ohne Speicher */ }
  });

  document.getElementById("copy").textContent = "© " + new Date().getFullYear() + " " + (CFG.name || "SkyDev");
  route();
})();
