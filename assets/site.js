/* ==========================================================================
   Vrtić Diznilend — ponašanje sajta
   Bez zavisnosti. Ruter radi preko hash adrese (#/upis), pa sajt radi i kada
   se otvori kao običan fajl sa diska i na hostingu bez rewrite pravila.
   ========================================================================== */
(function () {
  'use strict';

  /* 1. Naslovi i opisi po stranici (SEO) --------------------------------- */
  var STRANICE = {
    'pocetna':          ['Privatni vrtić Diznilend, Vračar i Zemun | Jaslice i predškolsko', 'Privatni vrtić i jaslice na Vračaru i u Zemunu. Uz subvenciju Grada Beograda 5.590 din mesečno. Pozovite 011 344 62 92.'],
    'o-nama':           ['O nama | Vrtić Diznilend Beograd', 'Akreditovana privatna predškolska ustanova sa pet vaspitnih grupa na dve lokacije, Vračar i Zemun.'],
    'tim':              ['Naš tim vaspitača | Vrtić Diznilend', 'Upoznajte vaspitače i medicinske sestre vaspitače koji rade sa decom u vrtiću Diznilend.'],
    'plan-rada':        ['Plan rada i dnevni ritam | Vrtić Diznilend', 'Dnevni raspored za jaslice, vrtićku grupu i predškolsko, od 07:00 do 18:00. Rad po Osnovama programa.'],
    'kuhinja':          ['Kuhinja i jelovnik | Vrtić Diznilend', 'Četiri obroka dnevno, primer nedeljnog jelovnika, alergije i posebna ishrana u vrtiću Diznilend.'],
    'upis':             ['Upis u vrtić | Diznilend Vračar i Zemun', 'Upis u privatni vrtić u Beogradu u tri koraka. Dokumenta, rokovi i zakazivanje posete.'],
    'subvencija':       ['Subvencija za privatni vrtić u Beogradu | Diznilend', 'Ko ima pravo na subvenciju Grada Beograda, koja dokumenta trebaju i kako se isplaćuje.'],
    'galerija':         ['Galerija | Vrtić Diznilend Vračar i Zemun', 'Fotografije prostora, dvorišta, aktivnosti i proslava u vrtiću Diznilend.'],
    'blog':             ['Aktivnosti i saveti | Vrtić Diznilend', 'Tekstovi iz našeg vrtića i saveti za roditelje o upisu, adaptaciji i subvenciji.'],
    'blog-subvencija':  ['Kako se ostvaruje subvencija za privatni vrtić u Beogradu', 'Korak po korak: odbijenica, ugovor, zahtev Gradskom sekretarijatu i mesečna isplata subvencije.'],
    'blog-adaptacija':  ['Adaptacija u jaslicama: kako da prve dve nedelje prođu lakše', 'Šta je normalno tokom adaptacije, koliko traje i šta roditelj može da uradi da detetu bude lakše.'],
    'blog-pakovanje':   ['Šta spakovati detetu za prvi dan u vrtiću', 'Spisak stvari za prvi dan u jaslicama i vrtiću, sa checklistom za štampu.'],
    'kontakt':          ['Kontakt i zakazivanje posete | Vrtić Diznilend', 'Telefoni obe lokacije, mape, radno vreme i forma za zakazivanje posete vrtiću.'],
    'vracar':           ['Privatni vrtić i jaslice na Vračaru | Diznilend 1', 'Niška 35, Vračar. Jaslice i vrtićke grupe, radno vreme 07:00 do 18:00. Pozovite 011 344 62 92.'],
    'zemun':            ['Privatni vrtić i jaslice u Zemunu | Diznilend 2', 'Dragana Rakića 10C, Zemun. Jaslice i vrtićke grupe. Pozovite 065 90 60 304.'],
    'pitanja':          ['Česta pitanja roditelja | Vrtić Diznilend', 'Adaptacija, ishrana, bolest, preuzimanje deteta, cena i subvencija. Konkretni odgovori.'],
    'privatnost':       ['Politika privatnosti | Vrtić Diznilend', 'Politika privatnosti vrtića Diznilend.'],
    'uslovi':           ['Uslovi korišćenja | Vrtić Diznilend', 'Uslovi korišćenja sajta vrtića Diznilend.'],
    'logo':             ['Predlog logotipa | Vrtić Diznilend', 'Predlog novog vizuelnog identiteta vrtića Diznilend.']
  };

  var SAJT = 'https://diznilend.rs/';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* 2. Ruter -------------------------------------------------------------- */
  function trenutnaRuta() {
    var raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
    return STRANICE[raw] ? raw : 'pocetna';
  }

  function postaviMeta(ruta) {
    var t = STRANICE[ruta];
    document.title = t[0];
    postaviTag('meta[name="description"]', 'content', t[1]);
    postaviTag('meta[property="og:title"]', 'content', t[0]);
    postaviTag('meta[property="og:description"]', 'content', t[1]);
    postaviTag('meta[property="og:url"]', 'content', SAJT + '#/' + ruta);
    postaviTag('link[rel="canonical"]', 'href', SAJT + (ruta === 'pocetna' ? '' : '#/' + ruta));
  }

  function postaviTag(sel, attr, vrednost) {
    var el = $(sel);
    if (el) el.setAttribute(attr, vrednost);
  }

  function prikaziStranicu(ruta, skrolujNaVrh) {
    $$('.page').forEach(function (p) { p.hidden = p.dataset.page !== ruta; });
    $$('[data-m="nav"] a').forEach(function (a) {
      var aktivan = a.getAttribute('href') === '#/' + ruta;
      a.setAttribute('aria-current', aktivan ? 'page' : 'false');
      a.style.background = aktivan ? '#EEF1F6' : '';
      a.style.color = aktivan ? '#171A1F' : '';
    });
    postaviMeta(ruta);
    zatvoriLightbox();
    postaviMeni(false);
    if (skrolujNaVrh) window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () { prikaziStranicu(trenutnaRuta(), true); });

  /* 3. Galerija: filteri i lightbox ---------------------------------------- */
  var filter = { loc: 'Sve', tema: 'Sve' };

  function osveziGaleriju() {
    $$('[data-src][data-loc]').forEach(function (btn) {
      var vidi = (filter.loc === 'Sve' || btn.dataset.loc === filter.loc) &&
                 (filter.tema === 'Sve' || btn.dataset.tema === filter.tema);
      btn.style.display = vidi ? 'block' : 'none';
    });
    obeleziAktivne('filter-loc', filter.loc);
    obeleziAktivne('filter-tema', filter.tema);
  }

  function obeleziAktivne(akcija, vrednost) {
    $$('[data-action="' + akcija + '"]').forEach(function (b) {
      var aktivan = b.dataset.v === vrednost;
      b.style.background = aktivan ? '#171A1F' : '#FFFFFF';
      b.style.color = aktivan ? '#FFFFFF' : '#171A1F';
      b.style.borderColor = aktivan ? '#171A1F' : '#DDE2EA';
      b.setAttribute('aria-pressed', aktivan ? 'true' : 'false');
    });
  }

  function otvoriLightbox(btn) {
    var box = $('#lightbox');
    if (!box) return;
    $('#lightbox-img').src = btn.dataset.src;
    $('#lightbox-img').alt = btn.dataset.alt || '';
    $('#lightbox-alt').textContent = btn.dataset.alt || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function zatvoriLightbox() {
    var box = $('#lightbox');
    if (!box || box.hidden) return;
    box.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zatvoriLightbox(); });

  /* 4. Plan rada: tabovi ---------------------------------------------------- */
  function prikaziTab(tab) {
    $$('.tab-panel').forEach(function (p) { p.hidden = p.dataset.tab !== tab; });
    $$('[data-action="tab"]').forEach(function (b) {
      var aktivan = b.dataset.v === tab;
      b.style.background = aktivan ? '#171A1F' : 'transparent';
      b.style.color = aktivan ? '#FFFFFF' : '#171A1F';
      b.setAttribute('aria-pressed', aktivan ? 'true' : 'false');
    });
  }

  /* 5. Recenzije: slajder --------------------------------------------------- */
  function pomeriRecenzije(smer) {
    var traka = $('#recenzije-traka');
    if (!traka) return;
    var korak = Math.max(280, traka.clientWidth * 0.7);
    traka.scrollBy({ left: smer * korak, behavior: 'smooth' });
  }

  /* 6. Jedan slušalac za sve akcije ---------------------------------------- */
  document.addEventListener('click', function (e) {
    var cilj = e.target.closest('[data-action]');
    if (!cilj) return;
    var akcija = cilj.dataset.action;

    if (akcija === 'lightbox')        { otvoriLightbox(cilj); }
    else if (akcija === 'close-lightbox') { zatvoriLightbox(); }
    else if (akcija === 'rec-prev')   { pomeriRecenzije(-1); }
    else if (akcija === 'rec-next')   { pomeriRecenzije(1); }
    else if (akcija === 'filter-loc') { filter.loc = cilj.dataset.v; osveziGaleriju(); }
    else if (akcija === 'filter-tema'){ filter.tema = cilj.dataset.v; osveziGaleriju(); }
    else if (akcija === 'tab')        { prikaziTab(cilj.dataset.v); }
    else if (akcija === 'print')      { window.print(); }
    else if (akcija === 'meni')       { postaviMeni($('[data-m="hdr"]').dataset.open !== 'true'); }
  });

  /* Klik na stavku menija zatvara meni na telefonu */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-m="nav"] a')) postaviMeni(false);
  });

  /* 7. Forma za zakazivanje posete ------------------------------------------
     Demo: nema servera. Kada se sajt pusti u rad, zameniti telo funkcije
     pravim slanjem (fetch na endpoint ili action="mailto:" / form servis).   */
  var forma = $('#forma-poseta');
  if (forma) {
    forma.addEventListener('submit', function (e) {
      e.preventDefault();
      var omot = $('#forma-omot');
      var hvala = $('#forma-hvala');
      if (omot) omot.hidden = true;
      if (hvala) { hvala.hidden = false; hvala.scrollIntoView ? null : null; }
    });
  }

  /* 8. Start ---------------------------------------------------------------- */
  prikaziStranicu(trenutnaRuta(), false);
  prikaziTab('jaslice');
  osveziGaleriju();
})();
