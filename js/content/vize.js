/*
 * Geçmiş sınavlar: Matematik I arasınavı (2025-2026 Güz) çözümleri + aynı tarzda prova testi.
 */
(function (global) {
    "use strict";

    const R = String.raw;
    const mc = (q, options, correct, why) => ({ q, options, correct, why });
    const lesson = (id, title) => `<a href="#/ders/${id}">📘 ${title}</a>`;

    const tests = [
        {
            id: "test-vize-prova", title: "Vize Provası · Arasınav Tarzı", sections: [], exam: true,
            desc: "Vizedeki dört soru tipinden (dik doğru, tanım kümesi, süreklilik, türev) ikişer-üçer benzer soru.",
            questions: [
                mc(R`$A(2, 3)$'ten geçen ve $x - 2y + 4 = 0$ doğrusuna dik olan doğru hangisidir?`, [R`$2x + y - 7 = 0$`, R`$x - 2y + 4 = 0$`, R`$2x - y - 1 = 0$`, R`$x + 2y - 8 = 0$`], 0, R`Verilen eğim $\frac12$, dik eğim $-2$: $y - 3 = -2(x - 2)$.`),
                mc(R`$A(-1, 2)$'den geçen ve $4x + 3y - 1 = 0$'a dik olan doğrunun eğimi?`, [R`$\frac34$`, R`$-\frac43$`, R`$\frac43$`, R`$-\frac34$`], 0, R`Doğrunun eğimi $-\frac43$; dik eğim $\frac34$.`),
                mc(R`$f(x) = \ln\left(\dfrac{x - 1}{x + 3}\right)$'ün tanım kümesi?`, [R`$(-\infty, -3)\cup(1, \infty)$`, R`$(-3, 1)$`, R`$(1, \infty)$`, R`$\mathbb{R}\setminus\{-3\}$`], 0, R`$\frac{x - 1}{x + 3} > 0$: işaret tablosu, kökler $1$ ve $-3$.`),
                mc(R`$f(x) = \ln(9 - x^2)$'nin tanım kümesi?`, [R`$(-3, 3)$`, R`$[-3, 3]$`, R`$(-\infty, 3)$`, R`$(3, \infty)$`], 0, R`$9 - x^2 > 0$.`),
                mc(R`$f(x) = \sqrt{\dfrac{x}{4 - x}}$'in tanım kümesi?`, [R`$[0, 4)$`, R`$(0, 4)$`, R`$[0, 4]$`, R`$(-\infty, 0]\cup(4, \infty)$`], 0, R`$\frac{x}{4 - x} \ge 0$; $x = 4$ paydayı sıfırlar.`),
                mc(R`$f(x) = 2 - \dfrac{x^2}{|x|}$ için hangisi doğrudur?`, [R`$x = 0$'da kaldırılabilir süreksiz`, "Her yerde sürekli", R`$x = 0$'da sıçrama süreksizliği`, R`$x = 0$'da sonsuz süreksizlik`], 0, R`$x \ne 0$ için $f = 2 - |x|$, $\lim\limits_{x\to0} f = 2$ ama $f(0)$ tanımsız.`),
                mc(R`$f(x) = \dfrac{x^2 - 4}{x - 2}$ ($x \ne 2$), $f(2) = k$; $f$'nin sürekli olması için $k$?`, ["4", "0", "2", "Hiçbir k için"], 0, R`$\lim\limits_{x\to2}(x + 2) = 4$.`),
                mc(R`$f(x) = \dfrac{x}{|x|}$ fonksiyonunun $x = 0$'daki süreksizliği hangi türdendir?`, ["Sıçrama", "Kaldırılabilir", "Sonsuz", "Sürekli"], 0, R`Soldan $-1$, sağdan $1$.`),
                mc(R`$f(x) = x^2e^{-x}$ ise $f'(x)$ nedir?`, [R`$e^{-x}(2x - x^2)$`, R`$-2xe^{-x}$`, R`$e^{-x}(2x + x^2)$`, R`$2xe^{-x}$`], 0, R`Çarpım kuralı: $2xe^{-x} - x^2e^{-x}$.`),
                mc(R`$f(x) = \dfrac{\sin3x}{e^{x}}$ ise $f'(0)$ kaçtır?`, ["3", "0", "1", "−3"], 0, R`$f = e^{-x}\sin3x$, $f' = e^{-x}(3\cos3x - \sin3x)$ → $3$.`),
            ],
        },
    ];

    const problemSets = [
        {
            id: "vize-2025-guz", title: "Arasınav · 2025–2026 Güz", exam: true, sections: [],
            source: "KMÜ Mühendislik Fakültesi, Bilgisayar Mühendisliği · Matematik I arasınavı (1312110) · 11.11.2025 · 75 dakika · sorular eşit puanlı",
            problems: [
                { no: 1, q: R`$A(4, -1)$ noktasından geçen ve $3x - 2y + 5 = 0$ doğrusuna dik olan doğrunun denklemini yazınız.`, a: R`$2x + 3y - 5 = 0$ $\left(y = -\frac23x + \frac53\right)$`, s: [
                    R`Verilen doğru: $2y = 3x + 5 \Rightarrow y = \frac32x + \frac52$, eğimi $m_1 = \frac32$.`,
                    R`Dik doğrular için $m_1\cdot m_2 = -1 \Rightarrow m_2 = -\frac23$.`,
                    R`Nokta-eğim formu: $y - (-1) = -\frac23(x - 4) \Rightarrow 3y + 3 = -2x + 8$.`,
                    R`Kontrol: $2\cdot4 + 3\cdot(-1) - 5 = 0$ ✓. İlgili ders: ${lesson("egim", "Eğim; Paralel ve Dik Doğrular")}`,
                ], graph: ["3x/2+5/2", "-2x/3+5/3"] },
                { no: 2, q: R`$f(x) = \ln\left(\dfrac{x}{16 - x^2}\right)$ fonksiyonunun tanım kümesini bulunuz.`, a: R`$T = (-\infty, -4)\cup(0, 4)$`, s: [
                    R`Logaritmanın içi pozitif olmalı: $\dfrac{x}{16 - x^2} > 0$, yani $\dfrac{x}{(4 - x)(4 + x)} > 0$.`,
                    R`Kritik noktalar: pay için $x = 0$, payda için $x = \pm4$ (paydayı sıfırlayanlar asla dahil edilmez).`,
                    R`İşaret tablosu: $x < -4$: $\frac{-}{-} = +$ ✓; $-4 < x < 0$: $\frac{-}{+} = -$; $0 < x < 4$: $\frac{+}{+} = +$ ✓; $x > 4$: $\frac{+}{-} = -$.`,
                    R`$x = 0$'da ifade 0 olur, $\ln0$ tanımsız → 0 da dahil değil. İlgili ders: ${lesson("tanim-kumesi", "Tanım Kümesi Nasıl Bulunur?")}`,
                ], graph: ["ln(x/(16-x^2))"] },
                { no: 3, q: R`$f(x) = 1 + \dfrac{x^2}{|x|}$ fonksiyonu veriliyor. $f$ fonksiyonunun süreklilik durumunu inceleyiniz.`, a: R`$f$, $\mathbb{R}\setminus\{0\}$'da süreklidir; $x = 0$'da tanımsız olduğundan süreksizdir ve bu süreksizlik <b>kaldırılabilir</b> türdendir ($\lim\limits_{x\to0}f(x) = 1$).`, s: [
                    R`$x = 0$'da payda $|x| = 0$: $f(0)$ <b>tanımsız</b>. $x \ne 0$ için $x^2 = |x|^2$ olduğundan $f(x) = 1 + |x|$.`,
                    R`$x \ne 0$ iken $f(x) = 1 + |x|$ sürekli fonksiyonların toplamı → $\mathbb{R}\setminus\{0\}$'da sürekli.`,
                    R`Sağ limit: $\lim\limits_{x\to0^+}\left(1 + \frac{x^2}{x}\right) = \lim(1 + x) = 1$. Sol limit: $\lim\limits_{x\to0^-}\left(1 + \frac{x^2}{-x}\right) = \lim(1 - x) = 1$.`,
                    R`Limit var (1) ama $f(0)$ yok → süreklilik şartı ($\lim f = f(0)$) sağlanmaz. $f(0) = 1$ tanımlansaydı $f$ her yerde sürekli olurdu: kaldırılabilir süreksizlik. İlgili dersler: ${lesson("sureklilik-tanim", "Süreklilik Nedir?")} · ${lesson("sureksizlik-turleri", "Süreksizlik Türleri")}`,
                ], graph: ["1+x^2/abs(x)"] },
                { no: 4, q: R`$f(x) = \dfrac{x}{e^x}\cdot\sin(2x)$ fonksiyonunun türevini bulunuz.`, a: R`$f'(x) = e^{-x}\left[(1 - x)\sin2x + 2x\cos2x\right]$`, s: [
                    R`Önce sadeleştir: $f(x) = x\,e^{-x}\sin2x$ (üç çarpanlı çarpım).`,
                    R`Çarpım kuralı $(uvw)' = u'vw + uv'w + uvw'$: $u = x$, $v = e^{-x}$, $w = \sin2x$; $u' = 1$, $v' = -e^{-x}$, $w' = 2\cos2x$ (zincir kuralı).`,
                    R`$f'(x) = e^{-x}\sin2x - xe^{-x}\sin2x + 2xe^{-x}\cos2x$.`,
                    R`$e^{-x}$ ortak paranteze: $f'(x) = e^{-x}[(1 - x)\sin2x + 2x\cos2x] = \dfrac{(1 - x)\sin2x + 2x\cos2x}{e^x}$. (Bölüm kuralıyla da aynı sonuç çıkar.) İlgili dersler: ${lesson("carpim-bolum", "Çarpım ve Bölüm Kuralı")} · ${lesson("ustel-turev", "eˣ ve aˣ'in Türevi")}`,
                ], graph: ["x*exp(-x)*sin(2x)"] },
            ],
        },
    ];

    global.PRACTICE = global.PRACTICE || { tests: [], problemSets: [] };
    global.PRACTICE.tests.push(...tests);
    global.PRACTICE.problemSets.push(...problemSets);
})(window);
