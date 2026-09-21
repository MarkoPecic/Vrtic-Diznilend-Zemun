# Vrtić Diznilend — sajt

Statički sajt, bez build koraka i bez zavisnosti. Otvara se duplim klikom na
`index.html` ili se okači na bilo koji hosting (Netlify, Vercel, cPanel, GitHub Pages).

## Struktura

```
export/
├── index.html          jedan fajl sa svih 19 stranica (svaka je <div class="page" data-page="...">)
├── assets/
│   ├── site.css        reset, fontovi, hover stanja, responsive, štampa
│   └── site.js         ruter, galerija, lightbox, tabovi, slajder recenzija, forma
├── slike/              fotografije (11)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Kako radi

Ruter je hash-baziran: `index.html#/upis`, `#/subvencija`, `#/galerija`…
Zbog toga sajt radi i sa fajl sistema i na hostingu bez rewrite pravila.
`site.js` pri promeni hash adrese prikazuje odgovarajući `.page` div i menja
`<title>`, `meta[name=description]`, `og:` tagove i `link[rel=canonical]`.

Spisak ruta i njihovih naslova/opisa je na vrhu `assets/site.js`, u objektu `STRANICE`.

## Interakcije

| Šta | Kako je označeno u HTML-u |
|---|---|
| Otvaranje slike u galeriji | `data-action="lightbox"` + `data-src` / `data-alt` |
| Filteri galerije | `data-action="filter-loc"` / `filter-tema"` + `data-v` |
| Tabovi na strani Plan rada | `data-action="tab"` + `data-v`, paneli su `.tab-panel[data-tab]` |
| Strelice slajdera recenzija | `data-action="rec-prev"` / `rec-next"` |
| Štampanje spiska | `data-action="print"` |
| Responsive izmene | `data-m="nav｜hdr｜hero｜sticker｜deco｜grid2｜fgrid｜pad｜chip"` (pravila su u `site.css`, sekcija 4) |

## Stilovi

Raspored i boje pojedinačnih elemenata stoje kao `style="..."` na samom elementu,
da bi svaki blok bio čitljiv bez skakanja između fajlova. U `site.css` je samo ono
što inline ne može: reset, `@font-face` linkovi, hover/focus stanja (klase `hv1`…`hv104`),
media upiti i pravila za štampu.

## Pre puštanja u rad

1. **Forma za zakazivanje** je demo, ne šalje ništa. U `site.js`, sekcija 7, zameniti
   telo `submit` slušaoca pravim slanjem (fetch na endpoint ili form servis).
2. **Domen** je svuda upisan kao `https://diznilend.rs/` — zameniti ako je drugi
   (u `index.html`: canonical, `og:url`, `og:image`; u `site.js`: konstanta `SAJT`;
   u `robots.txt` i `sitemap.xml`).
3. **Oznake `[PROVERITI]`** u tekstu označavaju podatke koje vrtić treba da potvrdi
   (cene, broj dece po grupi, ko priprema hranu). Pretraga po `PROVERITI`.
4. **Google recenzije** su prepisane sa profila vrtića; ocena i broj recenzija u
   hero sekciji su privremeni, zameniti stvarnim brojevima.
5. **Mape na strani Kontakt** su placeholderi, ubaciti Google Maps embed.
6. **Logo** je nov predlog (papirni zmaj), opisan na strani `#/logo`.
   Stari znak je koristio zaštićenu franšizu i nije prenet.

## Pristupačnost i SEO

- jezik `sr-Latn-RS`, semantični `header` / `main` / `footer`, „Preskočite na sadržaj" link
- svaka slika ima `alt`, dugmad imaju `aria-label` / `aria-pressed`, aktivna stavka menija `aria-current="page"`
- strukturirani podaci: `Preschool` × 2 lokacije, `WebSite`, `FAQPage`, tri `BlogPosting`
- `sitemap.xml` sa 18 ruta, `robots.txt`
- tap targeti na telefonu ≥ 44px, nema horizontalnog skrolovanja na 390px
