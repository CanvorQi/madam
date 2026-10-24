/*
 * Bölüm 3 - Türev (Matematik 1, Mustafa Balcı, s. 113-149)
 */
(function (global) {
    "use strict";

    const R = String.raw;
    const T = (s) => Widgets._helpers.tex(s);
    const F = (v, d) => MathParser.fmt(v, d);
    const Cl = Plot.COLORS;

    const p = (html) => ({ t: "p", html });
    const simple = (html) => ({ t: "simple", html });
    const def = (title, html) => ({ t: "def", title, html });
    const formula = (title, html) => ({ t: "formula", title, html });
    const tip = (html, title) => ({ t: "tip", html, title });
    const warn = (html, title) => ({ t: "warn", html, title });
    const ex = (q, steps, answer) => ({ t: "example", q, steps, answer });
    const quiz = (q, options, correct, why) => ({ t: "quiz", q, options, correct, why });
    const widget = (name, title, desc, opts) => ({ t: "widget", name, title, desc, opts: opts || {} });
    const table = (html) => ({ t: "table", html });

    const sections = [
        /* =========================== 3.1 =========================== */
        {
            no: "3.1", title: "Türev Kavramı", page: 113,
            lessons: [
                {
                    id: "turev-nedir", title: "Değişim Oranı ve Türev",
                    summary: "Kirişin eğimi, h → 0 iken teğetin eğimine dönüşür.",
                    blocks: [
                        simple(R`Bir arabanın 2 saatte 120 km gittiğini düşün: <b>ortalama</b> hızı saatte 60 km'dir. Peki tam 1. dakikadaki hızı? Zaman aralığını küçülte küçülte ortalama hızın neye yaklaştığına bakarız. İşte bu <b>anlık değişim hızı</b> türevdir. Grafikte bu, eğriye o noktada teğet olan doğrunun <b>eğimidir</b>.`),
                        p(R`$y = f(x)$ fonksiyonunda $x$'e $\Delta x = h$ artması verilirse $f$'deki değişme $\Delta y = f(x + h) - f(x)$ olur. Bu iki değişmenin oranına <b>değişim oranı</b> denir:
                            $$\frac{\Delta y}{\Delta x} = \frac{f(x + h) - f(x)}{h}.$$
                            Bu oran, grafikte $(x, f(x))$ ile $(x + h, f(x + h))$ noktalarını birleştiren <b>kirişin eğimidir</b>.`),
                        ex(R`$f(x) = 2x + 3$ ve $g(x) = x^2$ fonksiyonları için değişim oranlarını hesaplayınız.`, [
                            R`$f(x + h) - f(x) = 2(x + h) + 3 - 2x - 3 = 2h$ → oran $\frac{2h}{h} = 2$. Doğrunun eğimi her yerde aynıdır.`,
                            R`$g(x + h) - g(x) = (x + h)^2 - x^2 = 2hx + h^2$ → oran $\frac{2hx + h^2}{h} = 2x + h$.`,
                        ], R`$f$ için oran sabit ($2$); $g$ için oran $2x + h$, yani hem $x$'e hem $h$'ye bağlı. $h \to 0$ iken $2x$'e yaklaşır.`),
                        def("Tanım 3.1 — Türev", R`$A \subset \mathbb{R}$, $a \in A$ ve $f$, $A$'da tanımlı olsun.
                            $$f'(a) = \lim_{x\to a}\frac{f(x) - f(a)}{x - a} = \lim_{h\to 0}\frac{f(a + h) - f(a)}{h}$$
                            limiti varsa $f$, $a$ noktasında <b>türevlenebilirdir</b> (diferansiyellenebilirdir). Türev $f'(a)$, $\frac{df}{dx}$ ya da $Df(a)$ ile gösterilir.`),
                        widget("secant", "Kirişten teğete", "h'yi küçült: P noktası A'ya kayar, pembe kirişin eğimi yeşil teğetin eğimine yaklaşır. a'yı değiştirerek başka noktalara da bak.", {
                            presets: [
                                { tex: "x^2", expr: "x^2", a: 1, amin: -2, amax: 2, view: { xmin: -2.5, xmax: 3.5, ymin: -1.5, ymax: 7 } },
                                { tex: "x^3+2x", expr: "x^3+2x", a: 1, amin: -1.5, amax: 1.5, view: { xmin: -2, xmax: 3.2, ymin: -6, ymax: 14 } },
                                { tex: "\\sqrt{x}", expr: "sqrt(x)", a: 1, amin: 0.2, amax: 4, view: { xmin: -0.5, xmax: 6.5, ymin: -0.5, ymax: 3 } },
                                { tex: "\\sin x", expr: "sin(x)", a: 0, amin: -3, amax: 3, view: { xmin: -4, xmax: 4.5, ymin: -2, ymax: 2 } },
                            ],
                        }),
                        ex(R`$f(x) = x^3 + 2x$ fonksiyonunun $a = 1$ noktasındaki türevini bulunuz.`, [
                            R`$f'(1) = \lim\limits_{x\to1}\dfrac{f(x) - f(1)}{x - 1} = \lim\limits_{x\to1}\dfrac{x^3 + 2x - 3}{x - 1}$ → $\frac00$ belirsizliği.`,
                            R`Pay $(x - 1)(x^2 + x + 3)$ diye çarpanlarına ayrılır: $\lim\limits_{x\to1}(x^2 + x + 3)$.`,
                        ], R`$f'(1) = 1 + 1 + 3 = 5$.`),
                        tip(R`Tanımla türev almak = <b>limit hesaplamak</b>. Hemen her zaman $\frac00$ çıkar; Bölüm 2'deki sadeleştirme yöntemleri burada da kullanılır.`, "Bağlantı"),
                        quiz(R`$f(x) = x^2$ için $f'(3)$ kaçtır? (Tanımdan: $\lim\limits_{h\to0}\frac{(3 + h)^2 - 9}{h}$)`, ["6", "9", "3", "0"], 0, R`$\frac{6h + h^2}{h} = 6 + h \to 6$.`),
                        quiz(R`$\dfrac{f(a + h) - f(a)}{h}$ ifadesi grafikte neyi gösterir?`, ["Kirişin eğimini", "Teğetin eğimini", "Eğrinin altındaki alanı", "f(a)'yı"], 0, R`$h \ne 0$ iken iki farklı noktadan geçen doğrunun (kirişin) eğimidir; limiti teğetin eğimidir.`),
                    ],
                },
                {
                    id: "sag-sol-turev", title: "Sağ-Sol Türev ve Süreklilik",
                    summary: "|x| köşesinde türev yok; türevli ise süreklidir.",
                    blocks: [
                        simple(R`Limitte olduğu gibi türevde de iki taraf vardır: $h$ yalnız pozitif değerlerden 0'a giderse <b>sağ türev</b>, yalnız negatiflerden giderse <b>sol türev</b> bulunur. İkisi eşitse türev vardır. Grafikte <b>sivri köşe</b> olan yerde iki taraf farklı eğim verir, türev yoktur.`),
                        def("Tanım — Sağ ve sol türev", R`$f'(a^+) = \lim\limits_{h\to0^+}\dfrac{f(a + h) - f(a)}{h}$ (sağ türev), $\quad f'(a^-) = \lim\limits_{h\to0^-}\dfrac{f(a + h) - f(a)}{h}$ (sol türev).`),
                        def("Teorem 3.1", R`$a$ noktasındaki türevin var olması için gerek ve yeter şart, sağ ve sol türevlerin var ve birbirine eşit olmasıdır.`),
                        ex(R`$f(x) = |x|$ fonksiyonunun $x = 0$ noktasındaki türevini hesaplayınız.`, [
                            R`$f'(0) = \lim\limits_{x\to0}\dfrac{|x| - 0}{x - 0} = \lim\limits_{x\to0}\dfrac{|x|}{x}$.`,
                            R`Sağdan: $\lim\limits_{x\to0^+}\frac{x}{x} = 1$. Soldan: $\lim\limits_{x\to0^-}\frac{-x}{x} = -1$.`,
                        ], R`Sağ türev 1, sol türev −1: eşit değil, $f'(0)$ <b>yoktur</b>. Oysa $|x|$, 0'da süreklidir.`),
                        widget("graph", "Köşede iki farklı eğim", "Sağdaki (yeşil) ve soldaki (pembe) teğet adayları farklı: tek bir teğet çizilemez.", {
                            presets: [
                                { label: "y = |x|", fns: [{ expr: "abs(x)", label: "y = |x|" }], view: { xmin: -3, xmax: 3, ymin: -1, ymax: 3 } },
                                { label: "y = |x − 1| + 1", fns: [{ expr: "abs(x-1)+1", label: "y = |x − 1| + 1" }], view: { xmin: -2, xmax: 4, ymin: -0.5, ymax: 4 } },
                                { label: "y = ∛x² (sivri uç)", fns: [{ expr: "cbrt(x^2)", label: "y = x^(2/3)" }], view: { xmin: -3, xmax: 3, ymin: -0.8, ymax: 2.5 } },
                            ],
                            extras: (pr, c, pi) => {
                                if (pi === 2) return [{ type: "vline", x: 0, color: Cl.orange, width: 2, label: "düşey teğet" }, { type: "point", x: 0, y: 0, color: Cl.orange }];
                                const a = pi === 0 ? 0 : 1, b = pi === 0 ? 0 : 1;
                                return [
                                    { type: "fn", f: (x) => b + (x - a), color: Cl.green, dash: true, width: 2, xmin: a, label: "sağ eğim 1" },
                                    { type: "fn", f: (x) => b - (x - a), color: Cl.pink, dash: true, width: 2, xmax: a, label: "sol eğim −1" },
                                    { type: "point", x: a, y: b, color: Cl.orange },
                                ];
                            },
                        }),
                        def("Teorem 3.2", R`$f$, $a$ noktasında türevli ise aynı noktada <b>süreklidir</b>.<br>
                            <i>İspat:</i> $f(x) = f(a) + (x - a)\dfrac{f(x) - f(a)}{x - a}$ yazılırsa $\lim\limits_{x\to a}f(x) = f(a) + 0\cdot f'(a) = f(a)$.`),
                        def("Sonuç 3.1", R`Bir fonksiyon bir noktada sürekli değilse türevli de değildir.`),
                        warn(R`Tersi doğru değil: <b>sürekli olmak türevli olmayı gerektirmez</b>. $|x|$ örneği bunu gösterir. Türevsizlik genelde üç yerde çıkar: <b>köşe</b>, <b>sivri uç</b> ve <b>düşey teğet</b> (ya da süreksizlik).`),
                        quiz(R`$f$, $x = 2$'de sürekli değilse $f'(2)$ için ne söylenir?`, ["Yoktur", "0'dır", "Var olabilir", "Sonsuzdur"], 0, R`Türevli ⇒ sürekli; karşıt tersine göre sürekli değil ⇒ türevli değil.`),
                        quiz(R`$f(x) = |x - 3|$ için $f'(3^+)$ kaçtır?`, ["1", "−1", "0", "Yoktur"], 0, R`$x > 3$ iken $f(x) = x - 3$, eğim 1. Sol türev −1 olduğundan $f'(3)$ yoktur.`),
                    ],
                },
            ],
        },

        /* =========================== 3.2 =========================== */
        {
            no: "3.2", title: "Türev Almada Genel Kurallar", page: 116,
            lessons: [
                {
                    id: "temel-kurallar", title: "Sabit, Kuvvet ve Toplam Kuralı",
                    summary: "(c)' = 0, (xⁿ)' = nxⁿ⁻¹, toplamın türevi.",
                    blocks: [
                        simple(R`Her seferinde limit hesaplamak yorucudur. Bu yüzden limitle bir kere ispatlanan <b>kurallar</b> kullanılır. En sık kullanılanı kuvvet kuralı: <b>üs öne iner, üs bir azalır</b>: $(x^5)' = 5x^4$.`),
                        def("Teorem 3.3 — Sabit", R`$c$ bir sabitse $(c)' = 0$. (Yatay doğrunun eğimi sıfırdır.)`),
                        def("Teorem 3.4 — Kuvvet", R`$n \in \mathbb{N}$ için $(x^n)' = nx^{n-1}$.<br>
                            <i>İspat:</i> $(x + h)^n - x^n = h\left[(x + h)^{n-1} + (x + h)^{n-2}x + \cdots + x^{n-1}\right]$; $h$ ile bölüp $h \to 0$ alınca $n$ tane $x^{n-1}$ kalır.`),
                        def("Teorem 3.5 ve 3.6 — Sabitle çarpım, toplam", R`$[c\,f(x)]' = c\,f'(x)$, $\quad [f(x) + g(x)]' = f'(x) + g'(x)$.<br>
                            <b>Sonuç 3.2:</b> $[a\,f(x) + b\,g(x)]' = a\,f'(x) + b\,g'(x)$. Buradan polinomlar için
                            $$(a_nx^n + a_{n-1}x^{n-1} + \cdots + a_1x + a_0)' = na_nx^{n-1} + (n - 1)a_{n-1}x^{n-2} + \cdots + a_1.$$`),
                        ex(R`$P(x) = 3x^5 + 4x^4 + 2x^3 - 8x^2 - x + 1$ polinomunun türevini alınız.`, [
                            R`Her terime kuvvet kuralı: $5\cdot3x^4 + 4\cdot4x^3 + 3\cdot2x^2 - 2\cdot8x - 1 + 0$.`,
                        ], R`$P'(x) = 15x^4 + 16x^3 + 6x^2 - 16x - 1$.`),
                        widget("derivative", "Fonksiyon ve türevi", "Noktayı kaydır: üstte teğet, altta o teğetin eğimi (f′) çizilir. f artarken f′ > 0, azalırken f′ < 0.", {
                            presets: [
                                { tex: "x^2", expr: "x^2", dexpr: "2x", x0: 1, view: { xmin: -3, xmax: 3, ymin: -1, ymax: 7 }, dview: { xmin: -3, xmax: 3, ymin: -6, ymax: 6 } },
                                { tex: "x^3-3x", expr: "x^3-3x", dexpr: "3x^2-3", x0: 0, view: { xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 4 }, dview: { xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 10 } },
                                { tex: "\\frac{x^4}{4}-x^2", expr: "x^4/4-x^2", dexpr: "x^3-2x", x0: 1, view: { xmin: -2.5, xmax: 2.5, ymin: -1.5, ymax: 2 }, dview: { xmin: -2.5, xmax: 2.5, ymin: -5, ymax: 5 } },
                            ],
                        }),
                        tip(R`Kuvvet kuralı yalnız doğal sayılar için değil, her reel üs için geçerlidir (ispatı 3.8'de logaritmik türevle yapılır): $(\sqrt x)' = (x^{1/2})' = \frac12x^{-1/2} = \frac{1}{2\sqrt x}$, $\left(\frac1x\right)' = (x^{-1})' = -\frac{1}{x^2}$.`, "Kök ve kesirli üs"),
                        quiz(R`$f(x) = 4x^3 - 5x + 7$ ise $f'(x)$ nedir?`, [R`$12x^2 - 5$`, R`$12x^2 - 5 + 7$`, R`$4x^2 - 5$`, R`$12x^3 - 5$`], 0, R`$4\cdot3x^2 - 5 + 0$.`),
                        quiz(R`$f(x) = \sqrt x$ ise $f'(4)$ kaçtır?`, [R`$\frac14$`, R`$\frac12$`, "2", "4"], 0, R`$f'(x) = \frac{1}{2\sqrt x}$ → $\frac{1}{2\cdot2}$.`),
                    ],
                },
                {
                    id: "carpim-bolum", title: "Çarpım ve Bölüm Kuralı",
                    summary: "(fg)' = f'g + fg', (f/g)' = (f'g − fg')/g².",
                    blocks: [
                        simple(R`Çarpımın türevi türevlerin çarpımı <b>değildir</b>! Kural: “birincinin türevi × ikinci + birinci × ikincinin türevi”. Bölümde ise “payın türevi × payda − pay × paydanın türevi, bölü paydanın karesi”.`),
                        def("Teorem 3.7 — Çarpım", R`$f$ ve $g$, $x$'te türevli ise $[f(x)\,g(x)]' = f'(x)\,g(x) + f(x)\,g'(x)$.<br>
                            <i>İspat fikri:</i> Paya $-f(x)g(x + h) + f(x)g(x + h)$ eklenir; $g$ türevli olduğundan sürekli, $g(x + h) \to g(x)$.`),
                        ex(R`$f(x) = (x^2 + 1)(x^5 + 4x^2 + 2x + 1)$ fonksiyonunun türevini hesaplayınız.`, [
                            R`$f'(x) = (x^2 + 1)'(x^5 + 4x^2 + 2x + 1) + (x^2 + 1)(x^5 + 4x^2 + 2x + 1)'$`,
                            R`$= 2x(x^5 + 4x^2 + 2x + 1) + (x^2 + 1)(5x^4 + 8x + 2)$`,
                            R`$= 2x^6 + 8x^3 + 4x^2 + 2x + 5x^6 + 8x^3 + 2x^2 + 5x^4 + 8x + 2$.`,
                        ], R`$f'(x) = 7x^6 + 5x^4 + 16x^3 + 6x^2 + 10x + 2$.`),
                        def("Teorem 3.9 — Bölüm", R`$f$ ve $g$, $x$'te türevli ve $g(x) \ne 0$ ise
                            $$\left[\frac{f(x)}{g(x)}\right]' = \frac{f'(x)\,g(x) - f(x)\,g'(x)}{[g(x)]^2}.$$`),
                        ex(R`$n \in \mathbb{N}$ için $f(x) = x^{-n}$ fonksiyonunun türevini bulunuz.`, [
                            R`$f(x) = \frac{1}{x^n}$: $f'(x) = \dfrac{0\cdot x^n - 1\cdot nx^{n-1}}{x^{2n}} = -nx^{-n-1}$.`,
                        ], R`Demek ki her $k \in \mathbb{Z}$ için $(x^k)' = kx^{k-1}$.`),
                        ex(R`$f(x) = \dfrac{x^2 + 1}{x + 2}$ fonksiyonunun türevini bulunuz. $f'(0)$ nedir?`, [
                            R`$f'(x) = \dfrac{2x(x + 2) - 1\cdot(x^2 + 1)}{(x + 2)^2} = \dfrac{x^2 + 4x - 1}{(x + 2)^2}$.`,
                            R`$x = 0$: $\frac{-1}{4}$.`,
                        ], R`$f'(0) = -\frac14$.`),
                        warn(R`Bölüm kuralında paydaki çıkarmanın <b>sırası önemlidir</b>: önce payın türevi gelir. Sırayı değiştirirsen işaret ters çıkar.`),
                        quiz(R`$(x^2\cdot x^3)'$ hangisidir?`, [R`$5x^4$`, R`$6x^3$`, R`$2x\cdot3x^2$`, R`$x^5$`], 0, R`$x^2\cdot x^3 = x^5$ → $5x^4$. Çarpım kuralıyla: $2x\cdot x^3 + x^2\cdot3x^2 = 5x^4$. (Türevlerin çarpımı $6x^3$ yanlış!)`),
                        quiz(R`$\left(\dfrac{1}{x^2 + 1}\right)'$ hangisidir?`, [R`$-\dfrac{2x}{(x^2 + 1)^2}$`, R`$\dfrac{2x}{(x^2 + 1)^2}$`, R`$\dfrac{1}{2x}$`, R`$-\dfrac{1}{(x^2 + 1)^2}$`], 0, R`$\frac{0 - 1\cdot2x}{(x^2 + 1)^2}$.`),
                    ],
                },
                {
                    id: "zincir-kurali", title: "Zincir Kuralı",
                    summary: "(g∘f)'(x) = g'(f(x))·f'(x): dıştan içe türev.",
                    blocks: [
                        simple(R`İç içe fonksiyonlarda türev, <b>soğan soyar gibi</b> dıştan içe alınır: önce dış fonksiyonun türevi (içi aynen kalır), sonra içteki fonksiyonun türeviyle çarpılır. $[(x^2 + 1)^{10}]' = 10(x^2 + 1)^9\cdot 2x$.`),
                        ex(R`$y = [f(x)]^2$ ve $y = [f(x)]^3$ fonksiyonlarının türevlerini bulunuz; $y = [f(x)]^n$ için bir formül elde ediniz.`, [
                            R`Çarpım kuralı: $\{[f(x)]^2\}' = f'f + ff' = 2f(x)f'(x)$.`,
                            R`$\{[f(x)]^3\}' = \{[f(x)]^2 f(x)\}' = 2ff'\cdot f + f^2f' = 3[f(x)]^2f'(x)$.`,
                            R`Tümevarımla $\{[f(x)]^n\}' = n[f(x)]^{n-1}f'(x)$. $u = f(x)$ dersek $y = u^n$, $\frac{dy}{du} = nu^{n-1}$, $\frac{du}{dx} = f'(x)$.`,
                        ], R`$\dfrac{dy}{dx} = \dfrac{dy}{du}\cdot\dfrac{du}{dx}$: bu yönteme <b>zincir kuralı</b> denir.`),
                        def("Teorem 3.8 — Zincir kuralı", R`$f$, $x$'te; $g$, $f(x)$'te türevli ise $g\circ f$, $x$'te türevlidir ve
                            $$(g\circ f)'(x) = [g(f(x))]' = g'(f(x))\cdot f'(x).$$
                            Daha uzun zincirlerde: $y = f(u(v(w(x))))$ ise $\dfrac{dy}{dx} = \dfrac{dy}{du}\cdot\dfrac{du}{dv}\cdot\dfrac{dv}{dw}\cdot\dfrac{dw}{dx}$.`),
                        tip(R`İspattaki ince nokta: $k = f(x + h) - f(x)$ bazı $h$'ler için 0 olabilir, o zaman “$k$ ile çarpıp bölmek” hatalı olur. Kitap bunu $\lambda(t) = \frac{g(y_0 + t) - g(y_0)}{t} - g'(y_0)$, $\lambda(0) = 0$ yardımcı fonksiyonuyla aşar.`, "İspat notu"),
                        ex(R`Küre şeklindeki bir balonun $r$ yarıçapının artma oranı, $r = 4$ cm iken $0{,}3$ cm/s'dir. Bu anda hacminin artma oranı nedir?`, [
                            R`$V = \frac43\pi r^3$ → $\frac{dV}{dr} = 4\pi r^2 = 64\pi$ ($r = 4$).`,
                            R`Zincir kuralı: $\dfrac{dV}{dt} = \dfrac{dV}{dr}\cdot\dfrac{dr}{dt} = 64\pi\cdot0{,}3 = 19{,}2\pi$.`,
                        ], R`$\dfrac{dV}{dt} = 19{,}2\pi \approx 60{,}32$ cm³/s. (Kitapta $\approx 60{,}544$ yazıyor; $\pi \approx 3{,}1416$ ile doğru değer $60{,}32$'dir.)`),
                        widget("graph", "Balon: hacim hızı yarıçapla artar", "r kaydırıcısıyla yarıçapı değiştir. dr/dt = 0,3 cm/s sabitken dV/dt = 4πr²·0,3 büyür.", {
                            fns: [{ expr: "4*pi*x^2*0.3", label: "dV/dt = 1,2πr²" }],
                            params: { r: { min: 0.5, max: 6, step: 0.5, value: 4, label: "r (cm)" } },
                            view: { xmin: -0.5, xmax: 7, ymin: -10, ymax: 140 }, height: 240,
                            extras: (pr) => [{ type: "point", x: pr.r, y: 1.2 * Math.PI * pr.r * pr.r, color: Cl.pink, label: `r = ${F(pr.r)}` }],
                            readout: (pr) => `r = ${F(pr.r)} cm iken ${T(`\\frac{dV}{dt} = 4\\pi r^2\\cdot0{,}3 \\approx ${F(1.2 * Math.PI * pr.r * pr.r, 2).replace("−", "-")}`)} cm³/s.`,
                        }),
                        quiz(R`$[(3x + 1)^4]'$ hangisidir?`, [R`$12(3x + 1)^3$`, R`$4(3x + 1)^3$`, R`$(3x + 1)^3$`, R`$12x^3$`], 0, R`$4(3x + 1)^3\cdot3$.`),
                        quiz(R`$\left(\sqrt{x^2 + 9}\right)'$ hangisidir?`, [R`$\dfrac{x}{\sqrt{x^2 + 9}}$`, R`$\dfrac{1}{2\sqrt{x^2 + 9}}$`, R`$\dfrac{2x}{\sqrt{x^2 + 9}}$`, R`$2x\sqrt{x^2 + 9}$`], 0, R`$\frac{1}{2\sqrt{x^2 + 9}}\cdot2x$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.3 =========================== */
        {
            no: "3.3", title: "Ters Fonksiyonun Türevi", page: 123,
            lessons: [
                {
                    id: "ters-fonksiyon-turevi", title: "Ters Fonksiyonun Türevi",
                    summary: "(f⁻¹)'(y₀) = 1 / f'(x₀).",
                    blocks: [
                        simple(R`$f^{-1}$'in grafiği, $f$'nin grafiğinin $y = x$ doğrusuna göre aynasıdır. Aynada $x$ ile $y$ yer değiştirdiğinden eğim de <b>ters çevrilir</b>: $f$'nin eğimi 6 ise tersinin karşı noktadaki eğimi $\frac16$'dır.`),
                        def("Teorem 3.10", R`$f: A \to B$ birebir örten, $x_0 \in A$'da türevlenebilir ve $f'(x_0) \ne 0$ ise $f^{-1}: B \to A$, $y_0 = f(x_0)$'da türevlenebilirdir ve
                            $$(f^{-1})'(y_0) = \frac{1}{f'(x_0)}.$$`),
                        p(R`<i>İspat:</i> $\dfrac{f^{-1}(y) - f^{-1}(y_0)}{y - y_0} = \dfrac{x - x_0}{f(x) - f(x_0)} = \dfrac{1}{\frac{f(x) - f(x_0)}{x - x_0}}$. $f$ sürekli olduğundan $f^{-1}$ de süreklidir; $y \to y_0$ iken $x \to x_0$.`),
                        ex(R`$f(x) = x^5 + x$ ile tanımlanan $f: \mathbb{R} \to \mathbb{R}$ veriliyor. $(f^{-1})'(2)$ türevini hesaplayınız.`, [
                            R`$y_0 = 2$: $x^5 + x = 2 \Rightarrow x_0 = 1$.`,
                            R`$f'(x) = 5x^4 + 1 \Rightarrow f'(1) = 6$.`,
                        ], R`$(f^{-1})'(2) = \dfrac{1}{f'(1)} = \dfrac16$.`),
                        widget("graph", "Ayna görüntüsünde eğimler", "f(x) = x⁵ + x (mavi) ve tersi (pembe). (1, 2)'deki teğet eğimi 6, aynadaki (2, 1) noktasında eğim 1/6.", {
                            fns: [{ expr: "x^5+x", label: "f" }, { expr: "x", color: Cl.gray, dash: true, width: 1.4, noExport: true }],
                            view: { xmin: -3, xmax: 4, ymin: -3, ymax: 4 }, height: 290, equal: true,
                            extras: () => [
                                { type: "param", x: (t) => t ** 5 + t, y: (t) => t, t0: -1.4, t1: 1.4, color: Cl.pink, width: 2.8 },
                                { type: "fn", f: (x) => 2 + 6 * (x - 1), color: Cl.green, dash: true, width: 2, xmin: 0.6, xmax: 1.4 },
                                { type: "fn", f: (x) => 1 + (x - 2) / 6, color: Cl.orange, dash: true, width: 2, xmin: 0, xmax: 4 },
                                { type: "point", x: 1, y: 2, color: Cl.green, label: "(1, 2): eğim 6", labelPos: "nw" },
                                { type: "point", x: 2, y: 1, color: Cl.orange, label: "(2, 1): eğim 1/6", labelPos: "se" },
                            ],
                        }),
                        tip(R`Pratik yol: önce $f(x_0) = y_0$ denkleminden $x_0$'ı bul (genelde deneme ile: $0, \pm1, \pm2$), sonra $f'(x_0)$'ın tersini al. $f^{-1}$'i açıkça bulmak gerekmez.`),
                        quiz(R`$f(x) = x^3 + 4x$ için $(f^{-1})'(5)$ kaçtır?`, [R`$\frac17$`, "7", R`$\frac15$`, R`$\frac14$`], 0, R`$x^3 + 4x = 5 \Rightarrow x_0 = 1$; $f'(1) = 3 + 4 = 7$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.4 =========================== */
        {
            no: "3.4", title: "Trigonometrik Fonksiyonların Türevi", page: 126,
            lessons: [
                {
                    id: "trig-turev", title: "sin, cos, tan, cot, sec, csc",
                    summary: "(sin x)' = cos x, (tan x)' = 1 + tan²x = sec²x …",
                    blocks: [
                        simple(R`Sinüs eğrisinin her noktadaki eğimini çizersen <b>kosinüs eğrisi</b> çıkar: tepede eğim 0, sıfırdan geçerken eğim 1. Diğer kurallar bundan ve bölüm kuralından türetilir.`),
                        ex(R`$(\sin x)' = \cos x$ olduğunu tanımdan gösteriniz.`, [
                            R`$\dfrac{\sin(x + h) - \sin x}{h} = \dfrac{\cos h - 1}{h}\sin x + \dfrac{\sin h}{h}\cos x$.`,
                            R`$\dfrac{\cos h - 1}{h} = \dfrac{-2\sin^2\frac h2}{h} = -\dfrac{\sin\frac h2}{\frac h2}\cdot\sin\frac h2 \to -1\cdot0 = 0$ ve $\dfrac{\sin h}{h} \to 1$.`,
                        ], R`$(\sin x)' = 0\cdot\sin x + 1\cdot\cos x = \cos x$.`),
                        ex(R`$(\tan x)'$ türevini bulunuz.`, [
                            R`$\left(\dfrac{\sin x}{\cos x}\right)' = \dfrac{\cos x\cos x - (-\sin x)\sin x}{\cos^2x} = \dfrac{\cos^2x + \sin^2x}{\cos^2x}$.`,
                        ], R`$(\tan x)' = 1 + \tan^2x = \sec^2x$ ($x \ne (2k + 1)\frac\pi2$).`),
                        ex(R`$(\sec x)'$ türevini bulunuz.`, [
                            R`$\left(\dfrac{1}{\cos x}\right)' = \dfrac{0 - (-\sin x)}{\cos^2x} = \dfrac{\sin x}{\cos x}\cdot\dfrac{1}{\cos x}$.`,
                        ], R`$(\sec x)' = \sec x\tan x$ ($x \ne (2k + 1)\frac\pi2$).`),
                        formula("Trigonometrik türevler ($u = u(x)$)", R`<table class="mtable">
                            <tr><td>$(\sin u)' = u'\cos u$</td><td>$(\cos u)' = -u'\sin u$</td></tr>
                            <tr><td>$(\tan u)' = u'(1 + \tan^2u) = u'\sec^2u$</td><td>$(\cot u)' = -u'(1 + \cot^2u) = -u'\csc^2u$</td></tr>
                            <tr><td>$(\sec u)' = u'\sec u\tan u$</td><td>$(\csc u)' = -u'\csc u\cot u$</td></tr></table>
                            <span class="muted">“co” ile başlayanların (cos, cot, csc) türevi eksi işaretlidir.</span>`),
                        widget("derivative", "sin x'in türevi cos x", "Noktayı kaydır: alttaki mor eğri her noktadaki eğimi çizer ve tam bir kosinüs eğrisi oluşur.", {
                            presets: [
                                { tex: "\\sin x", expr: "sin(x)", dexpr: "cos(x)", x0: 0, view: { xmin: -6.3, xmax: 6.3, ymin: -1.6, ymax: 1.6 }, dview: { xmin: -6.3, xmax: 6.3, ymin: -1.6, ymax: 1.6 } },
                                { tex: "\\cos x", expr: "cos(x)", dexpr: "-sin(x)", x0: 1, view: { xmin: -6.3, xmax: 6.3, ymin: -1.6, ymax: 1.6 }, dview: { xmin: -6.3, xmax: 6.3, ymin: -1.6, ymax: 1.6 } },
                                { tex: "\\tan x", expr: "tan(x)", dexpr: "sec(x)^2", x0: 0, view: { xmin: -4.5, xmax: 4.5, ymin: -4, ymax: 4 }, dview: { xmin: -4.5, xmax: 4.5, ymin: -1, ymax: 8 } },
                            ],
                        }),
                        ex(R`$y = \sin3x + \cos(x^2 + 1)$ fonksiyonunun türevini bulunuz.`, [
                            R`$y' = \cos3x\cdot(3x)' - \sin(x^2 + 1)\cdot(x^2 + 1)'$.`,
                        ], R`$y' = 3\cos3x - 2x\sin(x^2 + 1)$.`),
                        ex(R`$y = (\tan\sqrt x)^5$ fonksiyonunun türevini bulunuz.`, [
                            R`Dıştan içe: $5(\tan\sqrt x)^4\cdot(\tan\sqrt x)'$.`,
                            R`$(\tan\sqrt x)' = (1 + \tan^2\sqrt x)\cdot\frac{1}{2\sqrt x}$.`,
                        ], R`$y' = 5(\tan\sqrt x)^4(1 + \tan^2\sqrt x)\dfrac{1}{2\sqrt x}$.`),
                        ex(R`$f(x) = (\sec6x)^{3/2}$ için $f'(\pi)$ türevini hesaplayınız.`, [
                            R`$f'(x) = \frac32(\sec6x)^{1/2}\cdot\sec6x\tan6x\cdot6 = 9(\sec6x)^{3/2}\tan6x$.`,
                        ], R`$f'(\pi) = 9(\sec6\pi)^{3/2}\tan6\pi = 0$.`),
                        quiz(R`$(\sin^2x)'$ hangisidir?`, [R`$2\sin x\cos x$`, R`$\cos^2x$`, R`$2\cos x$`, R`$-2\sin x\cos x$`], 0, R`$2\sin x\cdot(\sin x)'$. Bu, $\sin2x$'e eşittir.`),
                        quiz(R`$(\cos5x)'$ hangisidir?`, [R`$-5\sin5x$`, R`$5\sin5x$`, R`$-\sin5x$`, R`$-5\cos5x$`], 0, R`$-\sin5x\cdot5$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.5 =========================== */
        {
            no: "3.5", title: "Ters Trigonometrik Fonksiyonların Türevi", page: 128,
            lessons: [
                {
                    id: "ters-trig-turev", title: "arcsin, arccos, arctan …",
                    summary: "(arcsin x)' = 1/√(1 − x²), (arctan x)' = 1/(1 + x²).",
                    blocks: [
                        simple(R`Ters trigonometrik fonksiyonların türevi 3.3'teki kuralla bulunur: $y = \arcsin x \iff \sin y = x$, sonra $(\arcsin x)' = \frac{1}{(\sin y)'}$. Sonuçta trigonometri kaybolur, <b>cebirsel</b> ifadeler kalır.`),
                        ex(R`$f(x) = \arcsin x$, $f: [-1, 1] \to \left[-\frac\pi2, \frac\pi2\right]$ fonksiyonunun türevini bulunuz.`, [
                            R`$y = \arcsin x \iff \sin y = x$: $(\arcsin x)' = \dfrac{1}{(\sin y)'} = \dfrac{1}{\cos y}$.`,
                            R`$y \in \left[-\frac\pi2, \frac\pi2\right]$ iken $\cos y \ge 0$: $\cos y = \sqrt{1 - \sin^2y} = \sqrt{1 - x^2}$.`,
                        ], R`$(\arcsin x)' = \dfrac{1}{\sqrt{1 - x^2}}$, $(|x| < 1)$.`),
                        ex(R`$(\arctan x)'$ türevini bulunuz.`, [
                            R`$y = \arctan x \iff \tan y = x$: $\dfrac{1}{(\tan y)'} = \dfrac{1}{1 + \tan^2y}$.`,
                        ], R`$(\arctan x)' = \dfrac{1}{1 + x^2}$, her $x$ için.`),
                        ex(R`$(\operatorname{arcsec}x)'$ türevini bulunuz.`, [
                            R`$(\operatorname{arcsec}x)' = \dfrac{1}{\sec y\tan y}$, $\tan y = \pm\sqrt{x^2 - 1}$.`,
                            R`$x > 1$ için $0 < y < \frac\pi2$, $\tan y > 0$; $x < -1$ için $\frac\pi2 < y < \pi$, $\tan y < 0$. İki durum $|x|$ ile birleşir.`,
                        ], R`$(\operatorname{arcsec}x)' = \dfrac{1}{|x|\sqrt{x^2 - 1}}$, $(|x| > 1)$.`),
                        formula("Ters trigonometrik türevler ($u = u(x)$)", R`<table class="mtable">
                            <tr><td>$(\arcsin u)' = \dfrac{u'}{\sqrt{1 - u^2}}$</td><td>$(\arccos u)' = -\dfrac{u'}{\sqrt{1 - u^2}}$</td></tr>
                            <tr><td>$(\arctan u)' = \dfrac{u'}{1 + u^2}$</td><td>$(\operatorname{arccot}u)' = -\dfrac{u'}{1 + u^2}$</td></tr>
                            <tr><td>$(\operatorname{arcsec}u)' = \dfrac{u'}{|u|\sqrt{u^2 - 1}}$</td><td>$(\operatorname{arccsc}u)' = -\dfrac{u'}{|u|\sqrt{u^2 - 1}}$</td></tr></table>`),
                        widget("derivative", "arctan ve arcsin'in eğimleri", "arctan'ın eğimi hep pozitif ve en fazla 1 (x = 0'da). arcsin'in eğimi uçlarda (±1) sonsuza gider.", {
                            presets: [
                                { tex: "\\arctan x", expr: "arctan(x)", dexpr: "1/(1+x^2)", x0: 0, view: { xmin: -5, xmax: 5, ymin: -2, ymax: 2 }, dview: { xmin: -5, xmax: 5, ymin: -0.3, ymax: 1.3 } },
                                { tex: "\\arcsin x", expr: "arcsin(x)", dexpr: "1/sqrt(1-x^2)", x0: 0, view: { xmin: -1.2, xmax: 1.2, ymin: -1.8, ymax: 1.8 }, dview: { xmin: -1.2, xmax: 1.2, ymin: 0, ymax: 5 } },
                            ],
                        }),
                        ex(R`$f(x) = \arctan\frac1x$ için $f'(1)$ türevini hesaplayınız.`, [
                            R`$f'(x) = \dfrac{1}{1 + \frac{1}{x^2}}\cdot\left(-\dfrac{1}{x^2}\right) = -\dfrac{1}{x^2 + 1}$.`,
                        ], R`$f'(1) = -\frac12$.`),
                        ex(R`$f(x) = x\arccos x - \sqrt{1 - x^2}$ fonksiyonunun türevini bulunuz.`, [
                            R`$f'(x) = \arccos x + x\cdot\dfrac{-1}{\sqrt{1 - x^2}} - \dfrac{-2x}{2\sqrt{1 - x^2}}$.`,
                        ], R`$f'(x) = \arccos x$.`),
                        ex(R`$y = x\sqrt{a^2 - x^2} + a^2\arcsin\frac xa$ ($a > 0$ sabit) fonksiyonunun türevini bulunuz.`, [
                            R`$y' = \sqrt{a^2 - x^2} - \dfrac{x^2}{\sqrt{a^2 - x^2}} + a^2\cdot\dfrac{\frac1a}{\sqrt{1 - \frac{x^2}{a^2}}} = \sqrt{a^2 - x^2} - \dfrac{x^2}{\sqrt{a^2 - x^2}} + \dfrac{a^2}{\sqrt{a^2 - x^2}}$.`,
                        ], R`$y' = \dfrac{2(a^2 - x^2)}{\sqrt{a^2 - x^2}} = 2\sqrt{a^2 - x^2}$.`),
                        ex(R`$f(x) = \sqrt{x^2 - 1} - \operatorname{arcsec}x$ için $f'(\sqrt2)$ ve $f'(-\sqrt2)$ türevlerini hesaplayınız.`, [
                            R`$f'(x) = \dfrac{x}{\sqrt{x^2 - 1}} - \dfrac{1}{|x|\sqrt{x^2 - 1}}$.`,
                            R`$f'(\sqrt2) = \sqrt2 - \frac{1}{\sqrt2} = \frac{1}{\sqrt2}$; $f'(-\sqrt2) = -\sqrt2 - \frac{1}{\sqrt2} = -\frac{3}{\sqrt2}$.`,
                        ], R`$f'(\sqrt2) = \frac{1}{\sqrt2}$, $f'(-\sqrt2) = -\frac{3}{\sqrt2}$.`),
                        quiz(R`$(\arctan2x)'$ hangisidir?`, [R`$\dfrac{2}{1 + 4x^2}$`, R`$\dfrac{1}{1 + 4x^2}$`, R`$\dfrac{2}{1 + 2x^2}$`, R`$\dfrac{2x}{1 + 4x^2}$`], 0, R`$\frac{u'}{1 + u^2}$, $u = 2x$.`),
                        quiz(R`$(\arcsin x + \arccos x)'$ kaçtır?`, ["0", "1", R`$\frac{2}{\sqrt{1 - x^2}}$`, R`$\frac\pi2$`], 0, R`Türevler zıt işaretli; zaten $\arcsin x + \arccos x = \frac\pi2$ sabittir.`),
                    ],
                },
            ],
        },

        /* =========================== 3.6 =========================== */
        {
            no: "3.6", title: "Logaritma Fonksiyonunun Türevi", page: 133,
            lessons: [
                {
                    id: "log-turev", title: "ln x ve logₐx'in Türevi",
                    summary: "(ln x)' = 1/x, (logₐu)' = (u'/u)·logₐe.",
                    blocks: [
                        simple(R`$\ln x$'in grafiği $x$ büyüdükçe yavaş yavaş düzleşir: eğimi $\frac1x$'tir. $x = 1$'de eğim 1, $x = 10$'da sadece $0{,}1$.`),
                        ex(R`$f(x) = \log_ax$ fonksiyonunun türevini bulunuz.`, [
                            R`$\dfrac{\log_a(x + h) - \log_ax}{h} = \dfrac1x\cdot\dfrac{\log_a\left(1 + \frac hx\right)}{\frac hx}$. $k = \frac hx$ dersek $= \frac1x\log_a(1 + k)^{1/k}$.`,
                            R`$k = \frac1r$: $\lim\limits_{r\to\infty}\left(1 + \frac1r\right)^r = e$ olduğundan limit $\frac1x\log_ae$.`,
                        ], R`$(\log_ax)' = \dfrac1x\log_ae = \dfrac{1}{x\ln a}$; özel olarak $(\ln x)' = \dfrac1x$.`),
                        formula("Logaritma türevi ($u = u(x) > 0$)", R`$$(\ln u)' = \frac{u'}{u}, \qquad (\log_au)' = \frac{u'}{u}\log_ae = \frac{u'}{u\ln a}.$$`),
                        widget("derivative", "ln x'in eğimi 1/x", "x büyüdükçe teğet yataylaşır; alttaki eğri 1/x hiperbolüdür.", {
                            presets: [
                                { tex: "\\ln x", expr: "ln(x)", dexpr: "1/x", x0: 1, view: { xmin: -0.5, xmax: 8, ymin: -3, ymax: 2.5 }, dview: { xmin: -0.5, xmax: 8, ymin: -0.5, ymax: 4 } },
                                { tex: "\\ln(\\cos x)", expr: "ln(cos(x))", dexpr: "-tan(x)", x0: 0.785, view: { xmin: -1.6, xmax: 1.6, ymin: -3, ymax: 0.6 }, dview: { xmin: -1.6, xmax: 1.6, ymin: -6, ymax: 6 } },
                            ],
                        }),
                        ex(R`$f(x) = \log_3(5x^2 + 1)$ fonksiyonunun türevini bulunuz.`, [
                            R`$t = 5x^2 + 1$: $f'(x) = \dfrac{df}{dt}\cdot\dfrac{dt}{dx} = \dfrac1t\log_3e\cdot10x$.`,
                        ], R`$f'(x) = \dfrac{10x}{5x^2 + 1}\log_3e$.`),
                        ex(R`$f(x) = \ln(\cos x)$ için $f'\left(\frac\pi4\right)$ türevini hesaplayınız.`, [
                            R`$f'(x) = \dfrac{(\cos x)'}{\cos x} = \dfrac{-\sin x}{\cos x} = -\tan x$.`,
                        ], R`$f'\left(\frac\pi4\right) = -\tan\frac\pi4 = -1$.`),
                        tip(R`Türev almadan önce logaritma kurallarıyla ifadeyi <b>parçala</b>: $\ln\dfrac{(x + 1)^3}{\sqrt{x^2 + 4}} = 3\ln(x + 1) - \frac12\ln(x^2 + 4)$; türevi $\dfrac{3}{x + 1} - \dfrac{x}{x^2 + 4}$. Bölüm kuralından çok daha kolay!`, "Önce sadeleştir"),
                        quiz(R`$[\ln(x^2 + 1)]'$ hangisidir?`, [R`$\dfrac{2x}{x^2 + 1}$`, R`$\dfrac{1}{x^2 + 1}$`, R`$\dfrac{2}{x}$`, R`$2x\ln(x^2 + 1)$`], 0, R`$\frac{u'}{u}$.`),
                        quiz(R`$(\log_{10}x)'$ hangisidir?`, [R`$\dfrac{1}{x\ln10}$`, R`$\dfrac{1}{x}$`, R`$\dfrac{\ln10}{x}$`, R`$\dfrac{10}{x}$`], 0, R`$\frac1x\log_{10}e = \frac{1}{x\ln10}$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.7 =========================== */
        {
            no: "3.7", title: "Üstel Fonksiyonun Türevi", page: 134,
            lessons: [
                {
                    id: "ustel-turev", title: "eˣ ve aˣ'in Türevi",
                    summary: "(eˣ)' = eˣ, (aᵘ)' = aᵘ·u'·ln a.",
                    blocks: [
                        simple(R`$e^x$ matematiğin en özel fonksiyonudur: türevi <b>kendisidir</b>. Grafiğin her noktasında eğim, o noktanın yüksekliğine eşittir.`),
                        ex(R`$f(x) = a^x$ ($a > 0$, $a \ne 1$) fonksiyonunun türevini bulunuz.`, [
                            R`$y = a^x \iff x = \log_ay$. Ters fonksiyon kuralı: $(a^x)' = \dfrac{1}{(\log_ay)'} = \dfrac{1}{\frac1y\log_ae} = y\ln a$.`,
                        ], R`$(a^x)' = a^x\ln a$; özel olarak $(e^x)' = e^x$.`),
                        formula("Üstel türev ($u = u(x)$)", R`$$(e^u)' = e^u\,u', \qquad (a^u)' = a^u\,u'\ln a.$$`),
                        widget("derivative", "Türevi kendisine eşit fonksiyon", "eˣ için üst ve alt grafik aynı! 2ˣ'te ise eğim, yüksekliğin ln 2 ≈ 0,69 katıdır.", {
                            presets: [
                                { tex: "e^x", expr: "exp(x)", dexpr: "exp(x)", x0: 0, view: { xmin: -4, xmax: 2.5, ymin: -1, ymax: 8 }, dview: { xmin: -4, xmax: 2.5, ymin: -1, ymax: 8 } },
                                { tex: "2^x", expr: "2^x", dexpr: "2^x*ln(2)", x0: 0, view: { xmin: -4, xmax: 3, ymin: -1, ymax: 8 }, dview: { xmin: -4, xmax: 3, ymin: -1, ymax: 8 } },
                                { tex: "e^{-x^2}", expr: "exp(-x^2)", dexpr: "-2x*exp(-x^2)", x0: -1, view: { xmin: -3, xmax: 3, ymin: -0.3, ymax: 1.3 }, dview: { xmin: -3, xmax: 3, ymin: -1, ymax: 1 } },
                            ],
                        }),
                        ex(R`$y = e^{3x^2 + 6x}$ için $y'$ türevini hesaplayınız.`, [
                            R`$u = 3x^2 + 6x$, $y = e^u$: $y' = e^u\cdot u'$.`,
                        ], R`$y' = e^{3x^2 + 6x}(6x + 6)$.`),
                        ex(R`$f(x) = 2^{\cos5x}$ için $f'(0)$ türevini hesaplayınız.`, [
                            R`$f'(x) = 2^{\cos5x}\cdot(\cos5x)'\cdot\ln2 = 2^{\cos5x}(-5\sin5x)\ln2$.`,
                        ], R`$f'(0) = -5\cdot2^1\cdot\sin0\cdot\ln2 = 0$.`),
                        quiz(R`$(e^{5x})'$ hangisidir?`, [R`$5e^{5x}$`, R`$e^{5x}$`, R`$5xe^{5x - 1}$`, R`$e^5$`], 0, R`$e^u\cdot u'$.`),
                        quiz(R`$(3^x)'$ hangisidir?`, [R`$3^x\ln3$`, R`$x3^{x - 1}$`, R`$3^x$`, R`$\dfrac{3^x}{\ln3}$`], 0, R`$a^x\ln a$. Dikkat: $x3^{x-1}$ kuvvet kuralıdır, burada değişken üstte!`),
                    ],
                },
            ],
        },

        /* =========================== 3.8 =========================== */
        {
            no: "3.8", title: "Logaritmik Türev Alma", page: 135,
            lessons: [
                {
                    id: "logaritmik-turev", title: "Logaritmik Türev",
                    summary: "y = f(x)^g(x): önce ln al, sonra türev.",
                    blocks: [
                        simple(R`$x^x$ gibi hem tabanı hem üssü değişken olan ifadelerde ne kuvvet kuralı ($x^n$) ne de üstel kural ($a^x$) işe yarar. Çözüm: iki tarafın <b>logaritmasını al</b>, üs aşağı insin, sonra türev al.`),
                        def("Yöntem", R`$y = [f(x)]^{g(x)}$ ise $\ln y = g(x)\ln f(x)$. Türev alınırsa
                            $$\frac{y'}{y} = g'(x)\ln f(x) + \frac{f'(x)}{f(x)}g(x) \;\Rightarrow\; y' = [f(x)]^{g(x)}\left[g'(x)\ln f(x) + \frac{f'(x)}{f(x)}g(x)\right].$$`),
                        ex(R`$y = (1 + x^2)^x$ fonksiyonunun türevini bulunuz.`, [
                            R`$\ln y = x\ln(1 + x^2)$.`,
                            R`$\dfrac{y'}{y} = \ln(1 + x^2) + x\cdot\dfrac{2x}{1 + x^2}$.`,
                        ], R`$y' = (1 + x^2)^x\left[\ln(1 + x^2) + \dfrac{2x^2}{1 + x^2}\right]$.`),
                        ex(R`$f(x) = x^{\sin x}$ için $f'\left(\frac\pi2\right)$ türevini hesaplayınız.`, [
                            R`$\ln y = \sin x\ln x \Rightarrow \dfrac{y'}{y} = \cos x\ln x + \dfrac{\sin x}{x}$.`,
                            R`$x = \frac\pi2$: $y = \left(\frac\pi2\right)^1$, parantez $0 + \frac{1}{\pi/2} = \frac2\pi$.`,
                        ], R`$f'\left(\frac\pi2\right) = \frac\pi2\cdot\frac2\pi = 1$.`),
                        widget("graph", "y = xˣ ve teğeti", "x kaydırıcısıyla noktayı seç. Eğim y′ = xˣ(ln x + 1); x = 1/e'de yatay teğet (en küçük değer).", {
                            fns: [{ expr: "x^x", label: "y = xˣ", xmin: 0.001 }],
                            params: { a: { min: 0.1, max: 2.2, step: 0.01, value: 1, label: "x" } },
                            view: { xmin: -0.3, xmax: 2.6, ymin: -0.3, ymax: 5 }, height: 260,
                            extras: (pr) => {
                                const a = pr.a, y = Math.pow(a, a), m = y * (Math.log(a) + 1);
                                return [
                                    { type: "fn", f: (x) => y + m * (x - a), color: Cl.green, dash: true, width: 2, xmin: a - 0.8, xmax: a + 0.8 },
                                    { type: "point", x: a, y, color: Cl.pink },
                                    { type: "point", x: 1 / Math.E, y: Math.pow(1 / Math.E, 1 / Math.E), color: Cl.orange, r: 4, label: "x = 1/e", labelPos: "sw" },
                                ];
                            },
                            readout: (pr) => {
                                const a = pr.a, y = Math.pow(a, a), m = y * (Math.log(a) + 1);
                                return `${T(`y' = x^x(\\ln x + 1)`)}: x = ${F(a, 2)} için y ≈ ${F(y, 3)}, eğim ≈ <b>${F(m, 3)}</b>.`;
                            },
                        }),
                        tip(R`Logaritmik türev, çok sayıda çarpan/bölen içeren ifadelerde de kolaylık sağlar: $y = \dfrac{x^2\sqrt{x + 1}}{(x - 2)^3}$ ise $\ln y = 2\ln x + \frac12\ln(x + 1) - 3\ln(x - 2)$.`),
                        quiz(R`$y = x^x$ ise $y'$ nedir?`, [R`$x^x(\ln x + 1)$`, R`$x\cdot x^{x - 1}$`, R`$x^x\ln x$`, R`$x^x$`], 0, R`$\ln y = x\ln x \Rightarrow \frac{y'}{y} = \ln x + 1$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.9 =========================== */
        {
            no: "3.9", title: "Hiperbolik Fonksiyonların Türevi", page: 137,
            lessons: [
                {
                    id: "hiperbolik-turev", title: "cosh, sinh, tanh …",
                    summary: "(cosh x)' = sinh x, (sinh x)' = cosh x.",
                    blocks: [
                        simple(R`Hiperbolik fonksiyonlar $e^x$ ve $e^{-x}$'ten kurulduğu için türevleri doğrudan bulunur. Trigonometriye çok benzerler ama <b>işaretler</b> farklıdır: $(\cosh x)' = +\sinh x$.`),
                        p(R`Hatırlatma: $\cosh x = \dfrac{e^x + e^{-x}}{2}$, $\sinh x = \dfrac{e^x - e^{-x}}{2}$, $\tanh x = \dfrac{\sinh x}{\cosh x}$, $\coth x = \dfrac{\cosh x}{\sinh x}$, $\operatorname{sech}x = \dfrac{1}{\cosh x}$, $\operatorname{csch}x = \dfrac{1}{\sinh x}$, $\cosh^2x - \sinh^2x = 1$.`),
                        ex(R`$(\tanh x)'$ türevini bulunuz.`, [
                            R`$(\cosh x)' = \dfrac{e^x - e^{-x}}{2} = \sinh x$, $(\sinh x)' = \cosh x$.`,
                            R`$\left(\dfrac{\sinh x}{\cosh x}\right)' = \dfrac{\cosh^2x - \sinh^2x}{\cosh^2x} = \dfrac{1}{\cosh^2x}$.`,
                        ], R`$(\tanh x)' = \operatorname{sech}^2x$.`),
                        formula("Hiperbolik türevler ($u = u(x)$)", R`<table class="mtable">
                            <tr><td>$(\sinh u)' = u'\cosh u$</td><td>$(\cosh u)' = u'\sinh u$</td></tr>
                            <tr><td>$(\tanh u)' = u'\operatorname{sech}^2u$</td><td>$(\coth u)' = -u'\operatorname{csch}^2u$</td></tr>
                            <tr><td>$(\operatorname{sech}u)' = -u'\operatorname{sech}u\tanh u$</td><td>$(\operatorname{csch}u)' = -u'\operatorname{csch}u\coth u$</td></tr></table>`),
                        widget("derivative", "cosh ve sinh birbirinin türevi", "cosh x'in türevi sinh x, sinh x'in türevi cosh x.", {
                            presets: [
                                { tex: "\\cosh x", expr: "cosh(x)", dexpr: "sinh(x)", x0: 1, view: { xmin: -3, xmax: 3, ymin: -1, ymax: 6 }, dview: { xmin: -3, xmax: 3, ymin: -5, ymax: 5 } },
                                { tex: "\\sinh x", expr: "sinh(x)", dexpr: "cosh(x)", x0: 0, view: { xmin: -3, xmax: 3, ymin: -5, ymax: 5 }, dview: { xmin: -3, xmax: 3, ymin: -1, ymax: 6 } },
                                { tex: "\\tanh x", expr: "tanh(x)", dexpr: "sech(x)^2", x0: 0, view: { xmin: -4, xmax: 4, ymin: -1.5, ymax: 1.5 }, dview: { xmin: -4, xmax: 4, ymin: -0.3, ymax: 1.3 } },
                            ],
                        }),
                        ex(R`$y = \cosh(\ln x)$ için $y'$ türevini bulunuz.`, [
                            R`$y' = \sinh(\ln x)\cdot\frac1x = \frac1x\cdot\dfrac{e^{\ln x} - e^{-\ln x}}{2} = \dfrac{1}{2x}\left(x - \dfrac1x\right)$.`,
                        ], R`$y' = \dfrac{x^2 - 1}{2x^2}$.`),
                        ex(R`$f(x) = \arctan(\tanh x)$ için $f'(0)$ türevini hesaplayınız.`, [
                            R`$f'(x) = \dfrac{(\tanh x)'}{1 + \tanh^2x} = \dfrac{\operatorname{sech}^2x}{1 + \tanh^2x}$.`,
                        ], R`$f'(0) = \dfrac{1}{1 + 0} = 1$.`),
                        ex(R`$f(x) = \ln(\sinh3x) - \ln(\cosh3x)$ için $f'\left(\frac{\ln2}{3}\right)$ türevini hesaplayınız.`, [
                            R`$f'(x) = \dfrac{3\cosh3x}{\sinh3x} - \dfrac{3\sinh3x}{\cosh3x} = \dfrac{3(\cosh^23x - \sinh^23x)}{\sinh3x\cosh3x} = \dfrac{3}{\sinh3x\cosh3x}$.`,
                            R`$3x = \ln2$: $\sinh(\ln2) = \frac{2 - \frac12}{2} = \frac34$, $\cosh(\ln2) = \frac{2 + \frac12}{2} = \frac54$.`,
                        ], R`$f'\left(\frac{\ln2}{3}\right) = \dfrac{3}{\frac34\cdot\frac54} = \dfrac{16}{5}$.`),
                        quiz(R`$(\cosh2x)'$ hangisidir?`, [R`$2\sinh2x$`, R`$-2\sinh2x$`, R`$\sinh2x$`, R`$2\cosh2x$`], 0, R`$u'\sinh u$; trigonometrinin aksine eksi yok.`),
                    ],
                },
            ],
        },

        /* =========================== 3.10 =========================== */
        {
            no: "3.10", title: "Ters Hiperbolik Fonksiyonların Türevi", page: 139,
            lessons: [
                {
                    id: "ters-hiperbolik-turev", title: "arcsinh, arccosh, arctanh …",
                    summary: "(arcsinh x)' = 1/√(x² + 1), (arccosh x)' = 1/√(x² − 1).",
                    blocks: [
                        simple(R`Ters hiperbolik fonksiyonlar logaritmayla yazılabilir: $\operatorname{arccosh}x = \ln\left(x + \sqrt{x^2 - 1}\right)$. Türevleri bu formülden ya da ters fonksiyon kuralından bulunur ve yine cebirsel çıkar.`),
                        ex(R`$f(x) = \operatorname{arccosh}x$ fonksiyonunun türevini bulunuz.`, [
                            R`$\left[\ln\left(x + \sqrt{x^2 - 1}\right)\right]' = \dfrac{1 + \frac{x}{\sqrt{x^2 - 1}}}{x + \sqrt{x^2 - 1}} = \dfrac{\sqrt{x^2 - 1} + x}{\sqrt{x^2 - 1}\left(x + \sqrt{x^2 - 1}\right)}$.`,
                        ], R`$(\operatorname{arccosh}x)' = \dfrac{1}{\sqrt{x^2 - 1}}$, $(x > 1)$.`),
                        formula("Ters hiperbolik türevler", R`<table class="mtable">
                            <tr><td>$(\operatorname{arcsinh}x)' = \dfrac{1}{\sqrt{x^2 + 1}}$</td><td>her $x$</td></tr>
                            <tr><td>$(\operatorname{arccosh}x)' = \dfrac{1}{\sqrt{x^2 - 1}}$</td><td>$x > 1$</td></tr>
                            <tr><td>$(\operatorname{arctanh}x)' = \dfrac{1}{1 - x^2}$</td><td>$|x| < 1$</td></tr>
                            <tr><td>$(\operatorname{arccoth}x)' = \dfrac{1}{1 - x^2}$</td><td>$|x| > 1$</td></tr>
                            <tr><td>$(\operatorname{arcsech}x)' = -\dfrac{1}{x\sqrt{1 - x^2}}$</td><td>$0 < x < 1$</td></tr>
                            <tr><td>$(\operatorname{arccsch}x)' = -\dfrac{1}{|x|\sqrt{1 + x^2}}$</td><td>$x \ne 0$</td></tr></table>`),
                        warn(R`Kitapta $(\operatorname{arctanh}x)' = \dfrac{1}{x^2 - 1}$ yazılmış; bu <b>işaret hatasıdır</b>. $\operatorname{arctanh}x = \frac12\ln\frac{1 + x}{1 - x}$ artan bir fonksiyondur ve türevi $\dfrac{1}{1 - x^2} > 0$'dır. Aynı düzeltme $\operatorname{arccoth}$ için de geçerli.`, "Kitapta işaret hatası"),
                        ex(R`$y = \operatorname{arcsinh}(\tan x)$ için $y'$ türevini bulunuz.`, [
                            R`$y' = \dfrac{(\tan x)'}{\sqrt{1 + \tan^2x}} = \dfrac{1 + \tan^2x}{\sqrt{1 + \tan^2x}} = \sqrt{1 + \tan^2x} = \sqrt{\dfrac{1}{\cos^2x}}$.`,
                        ], R`$y' = \dfrac{1}{|\cos x|}$.`),
                        ex(R`$f(x) = x^2\operatorname{arccsch}(x^2)$ için $f'(1)$ türevini hesaplayınız.`, [
                            R`$f'(x) = 2x\operatorname{arccsch}(x^2) + x^2\cdot\dfrac{-2x}{x^2\sqrt{1 + x^4}} = 2x\left[\operatorname{arccsch}(x^2) - \dfrac{1}{\sqrt{1 + x^4}}\right]$.`,
                            R`$\operatorname{arccsch}x = \ln\dfrac{1 + \sqrt{1 + x^2}}{x}$ (x > 0) → $\operatorname{arccsch}1 = \ln(1 + \sqrt2)$.`,
                        ], R`$f'(1) = 2\left[\ln(1 + \sqrt2) - \frac{1}{\sqrt2}\right] = \ln(3 + 2\sqrt2) - \sqrt2$.`),
                        ex(R`$f(x) = (1 - x)\operatorname{arctanh}x$ için $f'(0)$ türevini hesaplayınız.`, [
                            R`$f'(x) = -\operatorname{arctanh}x + (1 - x)\cdot\dfrac{1}{1 - x^2} = -\operatorname{arctanh}x + \dfrac{1}{1 + x}$.`,
                        ], R`$f'(0) = 0 + 1 = 1$. (Kitap hatalı türev formülüyle $-1$ bulmuş.)`),
                        quiz(R`$(\operatorname{arcsinh}2x)'$ hangisidir?`, [R`$\dfrac{2}{\sqrt{4x^2 + 1}}$`, R`$\dfrac{1}{\sqrt{4x^2 + 1}}$`, R`$\dfrac{2}{\sqrt{4x^2 - 1}}$`, R`$\dfrac{2}{1 + 4x^2}$`], 0, R`$\frac{u'}{\sqrt{u^2 + 1}}$, $u = 2x$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.11 =========================== */
        {
            no: "3.11", title: "Parametrik Fonksiyonların Türevi", page: 141,
            lessons: [
                {
                    id: "parametrik-turev", title: "Parametrik Türev",
                    summary: "dy/dx = (dy/dt)/(dx/dt) = ẏ/ẋ.",
                    blocks: [
                        simple(R`Bir karınca düzlemde yürüyor: $t$ anındaki konumu $x = u(t)$, $y = v(t)$. Yolun eğimi, “$y$'nin değişme hızı / $x$'in değişme hızı”dır. Parametreyi yok etmeye gerek yoktur.`),
                        def("Parametrik türev", R`$x = u(t)$, $y = v(t)$ türevlenebilir ve $\dot x \ne 0$ ise
                            $$y' = \frac{dy}{dx} = \frac{dy/dt}{dx/dt} = \frac{\dot y}{\dot x}.$$
                            <i>Neden:</i> $\dfrac{\Delta y}{\Delta x} = \dfrac{\Delta y/\Delta t}{\Delta x/\Delta t}$ ve $u, v$ sürekli olduğundan $\Delta t \to 0 \iff \Delta x \to 0$.`),
                        ex(R`$x = 2(t - \sin t)$, $y = 2(1 - \cos t)$ olan fonksiyonun türevini bulunuz; $t = \frac\pi2$'deki değerini hesaplayınız.`, [
                            R`$\dot x = 2(1 - \cos t)$, $\dot y = 2\sin t$ → $\dfrac{dy}{dx} = \dfrac{\sin t}{1 - \cos t}$.`,
                            R`$t = \frac\pi2$: $\dfrac{1}{1 - 0}$.`,
                        ], R`$y'\left(\frac\pi2\right) = 1$.`),
                        widget("graph", "Sikloid üzerinde teğet", "t'yi değiştir: nokta sikloid üzerinde ilerler, teğetin eğimi ẏ/ẋ = sin t / (1 − cos t).", {
                            fns: [],
                            params: { t: { min: 0.2, max: 6.1, step: 0.01, value: 1.57, label: "t" } },
                            view: { xmin: -1, xmax: 14, ymin: -1, ymax: 6 }, height: 260, equal: true,
                            extras: (pr) => {
                                const t = pr.t, x = 2 * (t - Math.sin(t)), y = 2 * (1 - Math.cos(t)), m = Math.sin(t) / (1 - Math.cos(t));
                                return [
                                    { type: "param", x: (s) => 2 * (s - Math.sin(s)), y: (s) => 2 * (1 - Math.cos(s)), t0: 0, t1: 4 * Math.PI, color: Cl.blue, width: 3 },
                                    { type: "fn", f: (u) => y + m * (u - x), color: Cl.green, dash: true, width: 2, xmin: x - 2.5, xmax: x + 2.5 },
                                    { type: "point", x, y, color: Cl.pink },
                                ];
                            },
                            readout: (pr) => `t = ${F(pr.t, 2)}: ${T(`\\frac{dy}{dx} = \\frac{\\sin t}{1-\\cos t} \\approx ${F(Math.sin(pr.t) / (1 - Math.cos(pr.t)), 3).replace("−", "-")}`)}`,
                        }),
                        tip(R`$\dot x = 0$ olan noktalarda (sikloidin sivri uçları gibi) teğet düşey olabilir; $\dot y = 0$ ve $\dot x \ne 0$ olan yerde teğet yataydır.`),
                        quiz(R`$x = t^2$, $y = t^3$ için $t = 2$'de $\frac{dy}{dx}$ kaçtır?`, ["3", R`$\frac32$`, "12", R`$\frac23$`], 0, R`$\frac{3t^2}{2t} = \frac{3t}{2} = 3$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.12 =========================== */
        {
            no: "3.12", title: "Kapalı Biçimde Tanımlanan Fonksiyonların Türevi", page: 142,
            lessons: [
                {
                    id: "kapali-turev", title: "Kapalı Türev",
                    summary: "F(x, y) = 0: iki tarafın türevini al, y'yü çek.",
                    blocks: [
                        simple(R`$x^2 + y^2 = 25$ çemberinde $y$'yi $x$ cinsinden tek bir formülle yazamayız. Ama $y$'yi “$x$'in bir fonksiyonu” sayıp her terimin türevini alabiliriz: $y^2$'nin türevi <b>zincir kuralıyla</b> $2y\,y'$ olur.`),
                        def("Yöntem", R`$F(x, y) = 0$ bağıntısında her iki tarafın $x$'e göre türevi alınır ($y$ içeren terimlerde zincir kuralıyla $y'$ çarpanı gelir), çıkan eşitlikten $y'$ çekilir.`),
                        ex(R`$x^2 + y^2 - 3xy + 2x - 4y + 5 = 0$ eşitliği ile tanımlanan fonksiyonun türevini hesaplayınız.`, [
                            R`$2x + 2yy' - 3(y + xy') + 2 - 4y' = 0$ ($xy$'nin türevi çarpım kuralıyla).`,
                            R`$(2y - 3x - 4)y' + 2x - 3y + 2 = 0$.`,
                        ], R`$y' = \dfrac{3y - 2x - 2}{2y - 3x - 4}$.`),
                        ex(R`$4xy^2 + x^3 + 2y - 4 = 0$ eşitliği ile tanımlanan fonksiyonun $x = 0$ noktasındaki türevini hesaplayınız.`, [
                            R`$x = 0$: $2y - 4 = 0 \Rightarrow y = 2$.`,
                            R`Türev: $4y^2 + 8xyy' + 3x^2 + 2y' = 0$. $x = 0$, $y = 2$ yaz: $16 + 2y' = 0$.`,
                        ], R`$y' = -8$.`),
                        widget("graph", "Çemberde kapalı türev", "x² + y² = 25 çemberinde nokta seç. Kapalı türev y′ = −x/y verir; teğet yarıçapa diktir.", {
                            fns: [],
                            params: { t: { min: 0.05, max: 6.23, step: 0.01, value: 0.93, label: "açı" } },
                            view: { xmin: -8, xmax: 8, ymin: -7, ymax: 7 }, height: 280, equal: true,
                            extras: (pr) => {
                                const x = 5 * Math.cos(pr.t), y = 5 * Math.sin(pr.t), m = -x / y;
                                const items = [
                                    { type: "implicit", F: (a, b) => a * a + b * b - 25, color: Cl.blue },
                                    { type: "seg", x1: 0, y1: 0, x2: x, y2: y, color: Cl.gray, width: 1.6, dash: [5, 4] },
                                    { type: "point", x, y, color: Cl.pink, label: `(${F(x, 2)}, ${F(y, 2)})` },
                                ];
                                if (Math.abs(y) > 0.05) items.push({ type: "fn", f: (u) => y + m * (u - x), color: Cl.green, dash: true, width: 2 });
                                else items.push({ type: "vline", x, color: Cl.green, width: 2 });
                                return items;
                            },
                            readout: (pr) => {
                                const x = 5 * Math.cos(pr.t), y = 5 * Math.sin(pr.t);
                                return `${T("2x + 2y\\,y' = 0 \\Rightarrow y' = -\\frac{x}{y}")} · bu noktada ${Math.abs(y) > 0.05 ? `y′ ≈ <b>${F(-x / y, 3)}</b>` : "y = 0: teğet <b>düşey</b>"}.`;
                            },
                        }),
                        quiz(R`$x^2 + y^2 = 25$ çemberinin $(3, 4)$ noktasındaki teğetinin eğimi nedir?`, [R`$-\frac34$`, R`$\frac34$`, R`$-\frac43$`, R`$\frac43$`], 0, R`$y' = -\frac xy = -\frac34$.`),
                        quiz(R`$xy = 6$ eğrisinde $y'$ hangisidir?`, [R`$-\dfrac{y}{x}$`, R`$\dfrac{y}{x}$`, R`$-\dfrac{x}{y}$`, R`$\dfrac{6}{x}$`], 0, R`$y + xy' = 0$.`),
                    ],
                },
            ],
        },

        /* =========================== 3.13 =========================== */
        {
            no: "3.13", title: "Yüksek Mertebeden Türevler", page: 143,
            lessons: [
                {
                    id: "yuksek-mertebe", title: "İkinci, Üçüncü, n. Türev",
                    summary: "y″ = (y′)′; n. türevde örüntü yakala.",
                    blocks: [
                        simple(R`Türevin türevini almaya devam edebiliriz. Konum → hız → ivme zinciri gibi: konumun türevi hız, hızın türevi (ikinci türev) ivmedir. $n$. türevde genelde bir <b>örüntü</b> aranır.`),
                        def("Tanım", R`$y' = \dfrac{dy}{dx} = f'(x)$ birinci türev; $y'' = \dfrac{d}{dx}\left(\dfrac{dy}{dx}\right) = \dfrac{d^2y}{dx^2} = f''(x)$ ikinci türev; genel olarak
                            $$y^{(n)} = \frac{d}{dx}\left(\frac{d^{n-1}y}{dx^{n-1}}\right).$$`),
                        ex(R`$y = 6x^5 - 8x^4 + 2x^3 - 3x + 5$ fonksiyonunun üçüncü mertebeden türevini bulunuz.`, [
                            R`$y' = 30x^4 - 32x^3 + 6x^2 - 3$`,
                            R`$y'' = 120x^3 - 96x^2 + 12x$`,
                        ], R`$y''' = 360x^2 - 192x + 12$.`),
                        ex(R`$f(x) = 3x^6 - 4x^3 + 2x^2 - 1$ için $f^{(4)}(1)$ türevini hesaplayınız.`, [
                            R`$f' = 18x^5 - 12x^2 + 4x$, $f'' = 90x^4 - 24x + 4$, $f''' = 360x^3 - 24$, $f^{(4)} = 1080x^2$.`,
                        ], R`$f^{(4)}(1) = 1080$.`),
                        ex(R`$f(x) = \dfrac1x$ fonksiyonunun $n$. türevini bulunuz; $x = 1$'deki değerini hesaplayınız.`, [
                            R`$f' = -\frac{1}{x^2} = (-1)^1\frac{1!}{x^2}$, $f'' = \frac{2}{x^3} = (-1)^2\frac{2!}{x^3}$, $f''' = -\frac{6}{x^4} = (-1)^3\frac{3!}{x^4}$.`,
                        ], R`$f^{(n)}(x) = (-1)^n\dfrac{n!}{x^{n+1}}$, $f^{(n)}(1) = (-1)^nn!$.`),
                        ex(R`$x^3 + 2y^2 - 3xy - 4y + 2 = 0$ ile tanımlanan $y = f(x)$ fonksiyonunun ikinci türevinin $x = 0$'daki değerini hesaplayınız.`, [
                            R`Türev: $3x^2 + 4yy' - 3(y + xy') - 4y' = 0 \Rightarrow y' = \dfrac{3y - 3x^2}{4y - 3x - 4}$.`,
                            R`$x = 0$: $2y^2 - 4y + 2 = 2(y - 1)^2 = 0 \Rightarrow y = 1$. Payda $4 - 0 - 4 = 0$!`,
                        ], R`$y'$ bu noktada tanımsız → $y'$ yok, dolayısıyla $y''$ de yoktur.`),
                        ex(R`$x^3 + y^3 + 3xy + 3y^2 + 6x + 6y = 0$ ile tanımlanan $y = f(x)$'in $x = 1$'deki ikinci türevini hesaplayınız.`, [
                            R`$x = 1$: $y^3 + 3y^2 + 9y + 7 = (y + 1)^3 + 6(y + 1) = (y + 1)[(y + 1)^2 + 6] = 0 \Rightarrow y = -1$.`,
                            R`Türev: $3x^2 + 3y^2y' + 3y + 3xy' + 6yy' + 6 + 6y' = 0 \Rightarrow y' = -\dfrac{x^2 + y + 2}{y^2 + x + 2y + 2}$.`,
                            R`$(1, -1)$: pay $1 - 1 + 2 = 2$, payda $1 + 1 - 2 + 2 = 2$ → $y' = -\frac22 = -1$.`,
                            R`$y'' = -\dfrac{(2x + y')(y^2 + x + 2y + 2) - (2yy' + 1 + 2y')(x^2 + y + 2)}{(y^2 + x + 2y + 2)^2}$; $x = 1$, $y = -1$, $y' = -1$: $-\dfrac{(2 - 1)\cdot2 - (2 + 1 - 2)\cdot2}{4} = -\dfrac{2 - 2}{4}$.`,
                        ], R`$y'(1) = -1$ ve $y''(1) = 0$. (Kitap baştaki eksi işaretini düşürüp $y' = 1$ almış ve $y'' = -1$ bulmuş.)`),
                        def("Parametrik ikinci türev", R`$x = u(t)$, $y = v(t)$ ise
                            $$\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{\dot y}{\dot x}\right)}{\dot x} = \frac{\dot x\ddot y - \ddot x\dot y}{(\dot x)^3}.$$`),
                        ex(R`$x = 4\cos t$, $y = 3\sin t$ olduğuna göre $\frac{d^2y}{dx^2}$'nin $t = \frac\pi4$'teki değerini bulunuz.`, [
                            R`$\dot x = -4\sin t$, $\ddot x = -4\cos t$, $\dot y = 3\cos t$, $\ddot y = -3\sin t$.`,
                            R`$\dfrac{\dot x\ddot y - \ddot x\dot y}{(\dot x)^3} = \dfrac{12\sin^2t + 12\cos^2t}{-64\sin^3t} = -\dfrac{3}{16\sin^3t}$.`,
                        ], R`$t = \frac\pi4$: $-\dfrac{3}{16}\cdot\dfrac{1}{(\sqrt2/2)^3} = -\dfrac{3\sqrt2}{8}$. (Kitapta pay $12\sin^2t - 12\cos^2t$ yazılmış ve sonuç 0 bulunmuş; doğrusu $\sin^2t + \cos^2t = 1$ ile $-\frac{3\sqrt2}{8}$'dir.)`),
                        ex(R`$f(x) = x^4 - 6x^3 - 24x^2 + 5x - 7$ fonksiyonu veriliyor. $f''(x)$'in işaretini inceleyiniz.`, [
                            R`$f'(x) = 4x^3 - 18x^2 - 48x + 5$, $f''(x) = 12x^2 - 36x - 48 = 12(x - 4)(x + 1)$.`,
                        ], R`$(-\infty, -1)$ ve $(4, \infty)$'da $f'' > 0$; $(-1, 4)$'te $f'' < 0$.`),
                        widget("graph", "f, f′ ve f″ bir arada", "f(x) = x³ − 3x için üç grafik. f′'nin sıfırları f'nin tepe/çukurları, f″'nün sıfırı ise bükülme noktası.", {
                            fns: [{ expr: "x^3-3x", label: "f" }, { expr: "3x^2-3", label: "f′" }, { expr: "6x", label: "f″" }],
                            view: { xmin: -3, xmax: 3, ymin: -6, ymax: 8 }, height: 280,
                        }),
                        quiz(R`$f(x) = \sin x$ ise $f^{(4)}(x)$ nedir?`, [R`$\sin x$`, R`$\cos x$`, R`$-\sin x$`, R`$-\cos x$`], 0, R`$\cos \to -\sin \to -\cos \to \sin$: 4 adımda bir döner.`),
                        quiz(R`$f(x) = e^{2x}$ ise $f^{(n)}(x)$ nedir?`, [R`$2^ne^{2x}$`, R`$e^{2x}$`, R`$2ne^{2x}$`, R`$n!e^{2x}$`], 0, R`Her türevde bir 2 çarpanı gelir.`),
                    ],
                },
            ],
        },
    ];

    global.CHAPTERS = global.CHAPTERS || {};
    global.CHAPTERS.turev = {
        no: 3, id: "turev", title: "Türev",
        intro: "Türevin tanımı ve geometrik anlamı, türev alma kuralları ve zincir kuralı; ters, trigonometrik, logaritmik, üstel ve hiperbolik fonksiyonların türevleri; parametrik, kapalı ve yüksek mertebeden türevler.",
        sections,
    };
})(window);
