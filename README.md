# Madam Matematik

Matematiği en basit hâliyle anlatan, etkileşimli grafik araçlı web uygulaması (PWA).
Şu an **Matematik 1 (Mustafa Balcı)** kitabından **Bölüm 0: Önbilgiler** (0.1–0.6, 18 ders), **Bölüm 1: Fonksiyonlar** (1.1–1.7, 29 ders) ve **Bölüm 2: Limit ve Süreklilik** (2.1–2.5, 12 ders) hazır; her bölümün testleri ve kitap problemlerinin çözümleri dahil.

Kurulum veya derleme adımı yoktur; saf HTML/CSS/JS'dir.

## Yerelde çalıştırma

```bash
python -m http.server 8000
# tarayıcıda: http://localhost:8000
```

(Service worker `file://` üzerinden çalışmaz; bir sunucuyla aç.)

## GitHub Pages'te yayınlama

1. Bu klasörü bir GitHub deposuna yükle (`index.html` depo kökünde olmalı).
2. Depo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch: `main`, klasör: `/ (root)`.
3. Birkaç dakika sonra `https://<kullanıcı-adı>.github.io/<depo-adı>/` adresinde açılır.

## Telefona / tablete ekleme

- **Android (Chrome):** menü ⋮ → *Uygulamayı yükle* / *Ana ekrana ekle*
- **iPhone / iPad (Safari):** Paylaş → *Ana Ekrana Ekle*

Bir kez açılan sayfalar internetsiz de çalışır (`sw.js`).

## Dosya yapısı

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulama kabuğu (sol menü, mobil üst/alt menü) |
| `css/style.css` | Tasarım (açık/koyu tema) |
| `js/parser.js` | İfade ayrıştırıcı: `2x^2 - sin x`, `|x|`, `[x]`, `log(2, x)`, `f(x)=…` |
| `js/plot.js` | Canvas grafik motoru (kaydırma, yakınlaştırma, iz sürme) |
| `js/widgets.js` | Derslerdeki etkileşimli araçlar |
| `js/content/onbilgiler.js`, `onbilgiler-testler.js` | Bölüm 0 dersleri; testler + problem çözümleri |
| `js/content/fonksiyonlar.js` | Bölüm 1 ders içerikleri |
| `js/content/fonksiyonlar-testler.js` | Bölüm 1 çoktan seçmeli testler + kitap problemlerinin çözümleri |
| `js/content/limit.js`, `limit-testler.js` | Bölüm 2 dersleri; testler + problem çözümleri |
| `js/app.js` | Yönlendirme, sayfalar, ilerleme, grafik çizici |
| `sw.js`, `manifest.json`, `icons/` | PWA |

## Yeni bölüm eklemek

1. `js/content/` altına `fonksiyonlar.js` ile aynı yapıda yeni bir dosya ekle (`CHAPTERS.<id>`).
2. `index.html`'e `<script defer>` satırını, `sw.js` içindeki `APP_SHELL` listesine dosya yolunu ekle.
3. `COURSE.chapters` içinde ilgili bölüme `id` ver.
4. Dosyaları değiştirdikten sonra `sw.js` içindeki `CACHE_NAME` sürümünü artır.

Matematik gösterimi için [KaTeX](https://katex.org) (CDN) kullanılır.
