/*
 * Bölüm 4 - Türevin Uygulamaları (Matematik 1, Mustafa Balcı, s. 151-209)
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

    // f ve f' (sayısal) — grafik araçlarında yardımcı
    const num = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;

    const sections = [
        /* =========================== 4.1 =========================== */
        {
            no: "4.1", title: "Türevin Geometrik Anlamı", page: 151,
            lessons: [
                {
                    id: "teget-normal", title: "Teğet ve Normal Denklemi",
                    summary: "Teğet: y − f(a) = f'(a)(x − a); normal ona dik.",
                    blocks: [
                        simple(R`Türev, bir noktadaki <b>teğetin eğimidir</b>. Eğimi ve bir noktası bilinen doğrunun denklemini yazmayı zaten biliyoruz; tek yeni şey eğimi $f'(a)$ ile bulmak. Normal ise teğete dik doğrudur: eğimi $-\frac{1}{f'(a)}$.`),
                        p(R`Eğri üzerinde sabit $A(a, f(a))$ ve hareketli $P(x, f(x))$ noktası alalım. $AP$ kirişinin eğimi $m_{AP} = \dfrac{f(x) - f(a)}{x - a}$'dır. $P$, $A$'ya yaklaştıkça kiriş teğete yaklaşır; teğetin eğimi $m = \lim\limits_{x\to a}\dfrac{f(x) - f(a)}{x - a} = f'(a)$ olur.`),
                        formula("Teğet ve normal", R`<b>Teğet:</b> $y - f(a) = f'(a)(x - a)$<br>
                            <b>Normal</b> ($f'(a) \ne 0$): $y - f(a) = -\dfrac{1}{f'(a)}(x - a)$<br>
                            <span class="muted">$f'(a) = 0$ ise teğet yatay ($y = f(a)$), normal düşey ($x = a$) olur.</span>`),
                        ex(R`$f(x) = x^3 - 3x$ eğrisine $x = 2$ absisli noktasından çizilen teğetin denklemini bulunuz.`, [
                            R`$f'(x) = 3x^2 - 3 \Rightarrow m = f'(2) = 9$.`,
                            R`$f(2) = 8 - 6 = 2$.`,
                        ], R`$y - 2 = 9(x - 2) \Rightarrow y = 9x - 16$.`),
                        widget("graph", "Teğet ve normal", "a'yı değiştir: yeşil teğet, turuncu normal. Normal, teğete her zaman diktir (eğimlerin çarpımı −1).", {
                            presets: [
                                { label: "y = x³ − 3x", fns: [{ expr: "x^3-3x", label: "f" }], view: { xmin: -4, xmax: 4, ymin: -4, ymax: 5 } },
                                { label: "y = x² + 1", fns: [{ expr: "x^2+1", label: "f" }], view: { xmin: -4, xmax: 4, ymin: -1, ymax: 6 } },
                                { label: "y = 3x − x²", fns: [{ expr: "3x-x^2", label: "f" }], view: { xmin: -2, xmax: 5, ymin: -3, ymax: 4 } },
                            ],
                            params: { a: { min: -2, max: 3, step: 0.05, value: 1, label: "a" } },
                            equal: true, height: 290,
                            extras: (pr, c) => {
                                const f = c[0].f, a = pr.a, y = f(a), m = num(f, a);
                                const items = [
                                    { type: "fn", f: (x) => y + m * (x - a), color: Cl.green, width: 2, label: "teğet" },
                                    { type: "point", x: a, y, color: Cl.pink },
                                ];
                                if (Math.abs(m) > 1e-6) items.push({ type: "fn", f: (x) => y - (x - a) / m, color: Cl.orange, dash: true, width: 2, label: "normal" });
                                else items.push({ type: "vline", x: a, color: Cl.orange, width: 2, label: "normal" });
                                return items;
                            },
                            readout: (pr, c) => {
                                const f = c[0].f, a = pr.a, y = f(a), m = num(f, a);
                                return `A(${F(a, 2)}, ${F(y, 2)}) · teğet eğimi ${T(`f'(a) \\approx ${F(m, 3).replace("−", "-")}`)}` +
                                    (Math.abs(m) > 1e-6 ? ` · normal eğimi ${T(`-\\frac{1}{f'(a)} \\approx ${F(-1 / m, 3).replace("−", "-")}`)}` : " · teğet yatay, normal düşey");
                            },
                        }),
                        ex(R`$y = 3x - x^2$ eğrisinin $y = x$ doğrusuna paralel olan teğetinin denklemini yazınız.`, [
                            R`Paralel → eğim 1: $y' = 3 - 2x = 1 \Rightarrow x = 1$, $y = 2$.`,
                        ], R`$y - 2 = 1(x - 1) \Rightarrow y = x + 1$.`),
                        ex(R`$y = x^2 + 1$ eğrisinin apsisi 1 olan noktasından çizilen normalin denklemini yazınız.`, [
                            R`Nokta $(1, 2)$; $f'(1) = 2$ → normalin eğimi $-\frac12$.`,
                            R`$y - 2 = -\frac12(x - 1) \Rightarrow 2y - 4 = -x + 1$.`,
                        ], R`$x + 2y - 5 = 0$. (Kitapta $x - 2y - 5 = 0$ basılmış; bu doğru $(1, 2)$'den geçmez.)`),
                        quiz(R`$y = x^2$ eğrisinin $(2, 4)$ noktasındaki teğetinin denklemi?`, [R`$y = 4x - 4$`, R`$y = 2x$`, R`$y = 4x + 4$`, R`$y = 4x$`], 0, R`$m = 4$: $y - 4 = 4(x - 2)$.`),
                        quiz(R`Teğetin eğimi $\frac23$ ise normalin eğimi nedir?`, [R`$-\frac32$`, R`$\frac32$`, R`$-\frac23$`, R`$\frac23$`], 0, R`Dik doğrular: $m_1m_2 = -1$.`),
                    ],
                },
                {
                    id: "egriler-arasi-aci", title: "İki Eğri Arasındaki Açı",
                    summary: "Kesim noktasındaki teğetler arasındaki açı.",
                    blocks: [
                        simple(R`İki eğri kesiştiğinde aralarındaki açı, kesim noktasındaki <b>teğetleri</b> arasındaki açıdır. İki doğru arasındaki açı formülü (Bölüm 0) burada teğet eğimleriyle kullanılır.`),
                        def("Tanım", R`İki eğri bir $C$ noktasında kesişsin. $C$'deki teğetlerin oluşturduğu açıya (ölçüleri farklıysa <b>dar</b> olanına) <b>iki eğri arasındaki açı</b> denir. Açı dikse eğriler <b>dik kesişir</b>.`),
                        formula("Açı formülü", R`Teğet eğimleri $m_1$ ve $m_2$ ise $\tan\alpha = \left|\dfrac{m_1 - m_2}{1 + m_1m_2}\right|$. $m_1m_2 = -1$ ise eğriler dik kesişir.`),
                        ex(R`$y = 2x^2 + 3$ ve $y = \frac{3}{10}x^2 + \frac{47}{10}$ eğrileri kaç derecelik açı altında kesişirler?`, [
                            R`$2x^2 + 3 = \frac{3x^2 + 47}{10} \Rightarrow 17x^2 = 17 \Rightarrow x = \pm1$: $A(1, 5)$, $B(-1, 5)$.`,
                            R`$A$'da $m_1 = 4x = 4$, $m_2 = \frac{3x}{5} = \frac35$: $\tan\alpha = \dfrac{4 - \frac35}{1 + 4\cdot\frac35} = 1$.`,
                            R`$B$'de $m_1 = -4$, $m_2 = -\frac35$: $\tan\theta = -1$, geniş açı $135°$, dar açı $45°$.`,
                        ], R`Eğriler her iki noktada da $45°$'lik açı altında kesişir.`),
                        ex(R`$xy = a^2$ ve $x^2 - y^2 = b^2$ eğrilerinin dik kesiştiğini gösteriniz.`, [
                            R`$xy = a^2 \Rightarrow y + xy' = 0 \Rightarrow m_1 = -\frac{y_0}{x_0}$.`,
                            R`$x^2 - y^2 = b^2 \Rightarrow 2x - 2yy' = 0 \Rightarrow m_2 = \frac{x_0}{y_0}$.`,
                        ], R`$m_1m_2 = -1$: eğriler dik kesişir.`),
                        widget("graph", "Eğriler arasındaki açı", "Kitaptaki iki parabol (1, 5)'te kesişiyor. Teğetler (kesikli) arasındaki dar açı 45°.", {
                            fns: [{ expr: "2x^2+3", label: "y = 2x² + 3" }, { expr: "0.3x^2+4.7", label: "y = 0,3x² + 4,7" }],
                            view: { xmin: -3, xmax: 3, ymin: 2, ymax: 9 }, height: 270, equal: true,
                            extras: () => [
                                { type: "fn", f: (x) => 5 + 4 * (x - 1), color: Cl.blue, dash: true, width: 1.8, xmin: 0.2, xmax: 2 },
                                { type: "fn", f: (x) => 5 + 0.6 * (x - 1), color: Cl.pink, dash: true, width: 1.8, xmin: -0.5, xmax: 2.8 },
                                { type: "point", x: 1, y: 5, color: Cl.orange, label: "A(1, 5): 45°", labelPos: "se" },
                                { type: "point", x: -1, y: 5, color: Cl.orange, label: "B(−1, 5)", labelPos: "sw" },
                            ],
                        }),
                        quiz(R`Teğet eğimleri $m_1 = 2$, $m_2 = -\frac12$ olan iki eğri nasıl kesişir?`, ["Dik", "45° ile", "Paralel", "Teğet"], 0, R`$m_1m_2 = -1$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.2 =========================== */
        {
            no: "4.2", title: "Türevin Fiziksel Uygulamaları", page: 154,
            lessons: [
                {
                    id: "hiz-ivme", title: "Hız ve İvme",
                    summary: "v = s'(t), a = v'(t) = s''(t).",
                    blocks: [
                        simple(R`Alınan yol $s(t)$ ise <b>hız</b> yolun zamana göre türevi, <b>ivme</b> ise hızın türevidir. Ortalama hız “toplam yol / süre”dir; süreyi sıfıra yaklaştırınca anlık hız çıkar.`),
                        def("Anlık hız ve ivme", R`$t_0$ anındaki hız: $v(t_0) = \lim\limits_{t\to t_0}\dfrac{s(t) - s(t_0)}{t - t_0} = s'(t_0)$.<br>
                            İvme: $a(t_0) = \lim\limits_{t\to t_0}\dfrac{v(t) - v(t_0)}{t - t_0} = v'(t_0) = s''(t_0)$.`),
                        ex(R`Düzgün hızlanan bir hareketlinin yolu $s(t) = v_0t + \frac12at^2$'dir. $t$ anındaki hızı nedir? Hangi $t$'de hız, ilk hızın iki katına çıkar?`, [
                            R`$v(t) = s'(t) = v_0 + at$.`,
                            R`$v_0 + at = 2v_0 \Rightarrow t = \frac{v_0}{a}$.`,
                        ], R`$v(t) = v_0 + at$; $t = \frac{v_0}{a}$ anında hız $2v_0$ olur.`),
                        ex(R`$v_0$ ilk hızıyla yukarı atılan cismin yolu $s = v_0t - \frac12gt^2$'dir. Hızı ne olur, ne zaman sıfır olur?`, [
                            R`$v = s'(t) = v_0 - gt$.`,
                        ], R`$v = 0 \iff t = \frac{v_0}{g}$ (cisim en yüksek noktada).`),
                        widget("graph", "Yol, hız ve ivme", "t'yi kaydır. Yukarı atış: s = 20t − 5t² (g = 10). Hız doğrusal azalır, t = 2'de sıfır; ivme sabit −10.", {
                            fns: [{ expr: "20x-5x^2", label: "s(t)" }, { expr: "20-10x", label: "v(t)" }, { expr: "-10+0x", label: "a(t)", dash: true }],
                            params: { t: { min: 0, max: 4, step: 0.05, value: 1, label: "t (s)" } },
                            view: { xmin: -0.3, xmax: 4.5, ymin: -22, ymax: 25 }, height: 280,
                            extras: (pr) => [
                                { type: "vline", x: pr.t, color: Cl.gray, width: 1.2 },
                                { type: "point", x: pr.t, y: 20 * pr.t - 5 * pr.t * pr.t, color: Cl.blue },
                                { type: "point", x: pr.t, y: 20 - 10 * pr.t, color: Cl.pink },
                            ],
                            readout: (pr) => `t = ${F(pr.t, 2)} s: yükseklik ${T(`s = ${F(20 * pr.t - 5 * pr.t * pr.t, 2).replace("−", "-")}`)} m, hız ${T(`v = ${F(20 - 10 * pr.t, 2).replace("−", "-")}`)} m/s ${pr.t < 2 ? "(yükseliyor)" : pr.t > 2 ? "(düşüyor)" : "(tepe noktası!)"}.`,
                        }),
                        quiz(R`$s(t) = t^3 - 6t$ ise $t = 2$'deki ivme kaçtır?`, ["12", "6", "0", "2"], 0, R`$s'' = 6t$.`),
                        quiz(R`$s(t) = 5 + 3t + t^2$ için $t = 4$'teki hız?`, ["11", "8", "33", "2"], 0, R`$v = 3 + 2t$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.3 =========================== */
        {
            no: "4.3", title: "Türevin İktisatta Uygulanması", page: 155,
            lessons: [
                {
                    id: "marjinal-esneklik", title: "Marjinal Maliyet, Hasılat ve Esneklik",
                    summary: "Marjinal = türev; esneklik = (x/y)·dy/dx.",
                    blocks: [
                        simple(R`İktisatta <b>marjinal</b> kelimesi “bir birim daha üretirsem ne değişir?” demektir; matematikte karşılığı türevdir. <b>Esneklik</b> ise yüzde değişimlerin oranıdır: $x$ yüzde 1 artınca $y$ yüzde kaç değişir?`),
                        def("Marjinal maliyet", R`Toplam maliyet $m = f(q)$ ($q$: üretim miktarı) ise birim başına ortalama ek maliyet $\dfrac{\Delta m}{\Delta q} = \dfrac{f(q + \Delta q) - f(q)}{\Delta q}$; $\Delta q \to 0$ limiti <b>marjinal maliyettir</b>: $m' = f'(q)$.`),
                        ex(R`Bir salça fabrikasında maliyet $m = 1000 + 90q - q^2$ ($0 \le q \le 45$, $q$ ton, $m$ milyon lira). Üretim 40 ton iken marjinal maliyet kaçtır?`, [
                            R`$m' = 90 - 2q$.`,
                        ], R`$m'(40) = 90 - 80 = 10$ milyon/ton.`),
                        def("Esneklik", R`$x$ ve $y$'nin oransal artışları $\frac{\Delta x}{x}$, $\frac{\Delta y}{y}$ olmak üzere
                            $$\frac{Ey}{Ex} = \lim_{\Delta x\to0}\frac{\Delta y/y}{\Delta x/x} = \frac xy\cdot\frac{dy}{dx}$$
                            ifadesine $f$'nin <b>esnekliği</b> (elastikiyeti) denir. Esneklik boyutsuz bir sayıdır.`),
                        ex(R`$y = 2x - 4$ olsun. $y$'nin $x$'e göre esnekliğini bulunuz; $x = 4$ için hesaplayınız. $x$ %1 artarsa $y$ yüzde kaç artar?`, [
                            R`$\frac{Ey}{Ex} = \frac{x}{2x - 4}\cdot2 = \frac{x}{x - 2}$.`,
                        ], R`$x = 4$: $\frac{4}{2} = 2$ → $y$ yaklaşık %2 artar.`),
                        def("Marjinal hasılat", R`Birim fiyat $p = f(q)$ ise toplam hasılat $R = p\cdot q = f(q)\,q$ ve marjinal hasılat $R' = qf'(q) + f(q)$.`),
                        ex(R`Talep fonksiyonu $p = 1 - q$ olan malın marjinal hasılatını bulunuz.`, [
                            R`$R = q(1 - q) = q - q^2$.`,
                        ], R`$R' = 1 - 2q$.`),
                        ex(R`Talep fonksiyonu $p = 8 - q$ olan bir mal için maksimum gelir ne olur?`, [
                            R`$R = 8q - q^2$; parabolün tepesi $q = 4$ ($R' = 8 - 2q = 0$).`,
                        ], R`$R(4) = 32 - 16 = 16$.`),
                        widget("graph", "Gelir ve marjinal gelir", "p = 8 − q talebi. Marjinal gelir R′ sıfır olduğunda (q = 4) gelir en büyüktür.", {
                            fns: [{ expr: "8x-x^2", label: "R(q)" }, { expr: "8-2x", label: "R′(q)" }],
                            params: { q: { min: 0, max: 8, step: 0.1, value: 2, label: "q" } },
                            view: { xmin: -0.5, xmax: 9, ymin: -9, ymax: 18 }, height: 260,
                            extras: (pr) => [{ type: "point", x: pr.q, y: 8 * pr.q - pr.q * pr.q, color: Cl.blue }, { type: "point", x: pr.q, y: 8 - 2 * pr.q, color: Cl.pink }, { type: "point", x: 4, y: 16, color: Cl.green, label: "max", labelPos: "ne" }],
                            readout: (pr) => `q = ${F(pr.q, 1)}: gelir R = ${F(8 * pr.q - pr.q * pr.q, 2)}, marjinal gelir R′ = ${F(8 - 2 * pr.q, 2)} ${pr.q < 4 ? "(> 0, üretimi artırmak geliri artırır)" : pr.q > 4 ? "(< 0, üretimi artırmak geliri düşürür)" : "(= 0, maksimum gelir)"}.`,
                        }),
                        tip(R`<b>Maksimum kâr kuralı:</b> Kâr $P(x) = R(x) - C(x)$ maksimum ise $P'(x) = 0$, yani $R'(x) = C'(x)$: marjinal gelir = marjinal maliyet (4.5'teki örnek).`),
                        quiz(R`$C(q) = q^2 + 5q + 20$ ise $q = 10$'daki marjinal maliyet?`, ["25", "170", "20", "15"], 0, R`$C' = 2q + 5$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.4 =========================== */
        {
            no: "4.4", title: "Maksimum – Minimum", page: 161,
            lessons: [
                {
                    id: "artan-azalan", title: "Artan ve Azalan Fonksiyonlar",
                    summary: "f' > 0 ise artan, f' < 0 ise azalan.",
                    blocks: [
                        simple(R`Yokuş yukarı yürürken eğim pozitif, aşağı inerken negatiftir. Türevin <b>işareti</b> fonksiyonun yönünü söyler: işaret tablosu yapmak = fonksiyonun nerede çıktığını, nerede indiğini bulmak.`),
                        def("Teorem 4.1", R`$f: I \to \mathbb{R}$ sürekli ve $a \in I$'da türevli olsun. $f'(a) > 0$ ise $f$, $a$'nın bir $(a - \delta, a + \delta)$ komşuluğunda artan; $f'(a) < 0$ ise azalandır.`),
                        def("Sonuç 4.1", R`$f$, $[a, b]$'de sürekli ve $(a, b)$'de türevli olsun. Her $x \in (a, b)$ için $f'(x) > 0$ ise $f$, $[a, b]$'de <b>artan</b>; $f'(x) < 0$ ise <b>azalandır</b>.`),
                        ex(R`$f(x) = x^2 - 4x + 3$ fonksiyonunun artan ve azalan olduğu aralıkları bulunuz.`, [
                            R`$f'(x) = 2x - 4$; işaret tablosu: $x < 2$ iken $-$, $x > 2$ iken $+$.`,
                        ], R`$(-\infty, 2]$'de azalan, $[2, \infty)$'da artan.`),
                        ex(R`$f(x) = x^3 + 3x$ fonksiyonunun artan veya azalan olduğu aralıkları bulunuz.`, [
                            R`$f'(x) = 3x^2 + 3 = 3(x^2 + 1) > 0$, her $x$ için.`,
                        ], R`$f$, $(-\infty, \infty)$'da artandır.`),
                        widget("derivative", "Türevin işareti ve yön", "Noktayı kaydır: yeşil teğet (f′ > 0) → artan, kırmızı (f′ < 0) → azalan, turuncu → yatay teğet.", {
                            presets: [
                                { tex: "x^2-4x+3", expr: "x^2-4x+3", dexpr: "2x-4", x0: 1, view: { xmin: -1, xmax: 5, ymin: -2, ymax: 6 }, dview: { xmin: -1, xmax: 5, ymin: -6, ymax: 6 } },
                                { tex: "x^3-3x", expr: "x^3-3x", dexpr: "3x^2-3", x0: 0, view: { xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 4 }, dview: { xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 10 } },
                                { tex: "x^3+3x", expr: "x^3+3x", dexpr: "3x^2+3", x0: 0, view: { xmin: -2, xmax: 2, ymin: -10, ymax: 10 }, dview: { xmin: -2, xmax: 2, ymin: -1, ymax: 15 } },
                            ],
                        }),
                        quiz(R`$f(x) = 2x - x^2$ hangi aralıkta artandır?`, [R`$(-\infty, 1]$`, R`$[1, \infty)$`, R`$(-\infty, \infty)$`, R`$[0, 2]$`], 0, R`$f' = 2 - 2x > 0 \iff x < 1$.`),
                    ],
                },
                {
                    id: "yerel-ekstremum", title: "Yerel Ekstremum ve Kritik Noktalar",
                    summary: "Fermat: ekstremumda f'(c) = 0; işaret değişimi testi.",
                    blocks: [
                        simple(R`Bir dağın tepesinde ve vadinin dibinde yer <b>düzdür</b>: teğet yataydır. Bu yüzden yerel maksimum ve minimumları $f'(x) = 0$ olan yerlerde (ve türevin olmadığı köşelerde) ararız. Ama düz olan her yer tepe değildir; türevin <b>işaret değiştirip değiştirmediğine</b> bakmak gerekir.`),
                        def("İşaret değişimi testi", R`$c$'nin solunda $f' > 0$, sağında $f' < 0$ ise $c$'de <b>yerel maksimum</b>; solunda $f' < 0$, sağında $f' > 0$ ise <b>yerel minimum</b> vardır.`),
                        ex(R`$f(x) = x^3 - 3x$ fonksiyonunun yerel ekstremum noktalarını ve değerlerini bulunuz.`, [
                            R`$f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)$: $x < -1$'de $+$, $-1 < x < 1$'de $-$, $x > 1$'de $+$.`,
                            R`$f$, $(-\infty, -1]$'de artan, $[-1, 1]$'de azalan, $[1, \infty)$'da artan.`,
                        ], R`$x = -1$'de yerel maksimum $f(-1) = 2$; $x = 1$'de yerel minimum $f(1) = -2$.`),
                        def("Teorem 4.2 — Fermat", R`$f: [a, b] \to \mathbb{R}$, $c \in (a, b)$'de yerel ekstremuma sahip ve $c$'de türevlenebiliyorsa $f'(c) = 0$'dır.<br>
                            <i>İspat:</i> Yerel maksimumda $f(c + h) - f(c) \le 0$; $h > 0$ için oran $\le 0 \Rightarrow f'(c) \le 0$, $h < 0$ için oran $\ge 0 \Rightarrow f'(c) \ge 0$. İkisi birden: $f'(c) = 0$.`),
                        warn(R`<b>1)</b> Fermat'ın karşıtı doğru değil: $f(x) = x^3$ için $f'(0) = 0$ ama 0'da ekstremum yoktur.<br>
                            <b>2)</b> Ekstremum türevsiz noktada da olabilir: $f(x) = x^{2/3} + 1$, $x = 0$'da yerel minimuma sahip ama $f'(0)$ yok ($f'(x) = \frac{2}{3\sqrt[3]x}$).`, "İki uyarı"),
                        def("Tanım — Kritik nokta", R`$f'(c) = 0$ şartını sağlayan $c$ noktalarına $f$'nin <b>durağan</b> (duraklama) ya da <b>kritik</b> noktaları denir.`),
                        ex(R`$f(x) = 3x^5 - 20x^3$ fonksiyonunun kritik noktalarını bulunuz. Hangileri yerel ekstremum noktasıdır?`, [
                            R`$f'(x) = 15x^4 - 60x^2 = 15x^2(x^2 - 4) = 0 \Rightarrow x = 0$ (çift kat), $x = \pm2$.`,
                            R`İşaret: $x < -2$: $+$; $(-2, 0)$: $-$; $(0, 2)$: $-$; $x > 2$: $+$.`,
                        ], R`$x = -2$ yerel maksimum, $x = 2$ yerel minimum; $x = 0$ kritik nokta ama ekstremum değil (işaret değişmiyor).`),
                        widget("graph", "Kritik noktalar avı", "Turuncu noktalar f′ = 0 olan yerler. Hepsi ekstremum değil: işaret değişmeyen yerde (x = 0) eğri yalnızca düzleşip devam eder.", {
                            presets: [
                                { label: "3x⁵ − 20x³", fns: [{ expr: "3x^5-20x^3", label: "f" }], view: { xmin: -3, xmax: 3, ymin: -80, ymax: 80 } },
                                { label: "x³ − 3x", fns: [{ expr: "x^3-3x", label: "f" }], view: { xmin: -3, xmax: 3, ymin: -4, ymax: 4 } },
                                { label: "x sin x + cos x", fns: [{ expr: "x*sin(x)+cos(x)", label: "f", xmin: 0, xmax: 6.2832 }], view: { xmin: -0.5, xmax: 7, ymin: -5.5, ymax: 3 } },
                            ],
                            height: 270,
                            extras: (pr, c, pi) => {
                                const pts = [[[-2, 64, "max"], [0, 0, "ekstremum değil"], [2, -64, "min"]], [[-1, 2, "max"], [1, -2, "min"]], [[Math.PI / 2, Math.PI / 2, "max"], [3 * Math.PI / 2, -3 * Math.PI / 2, "min"]]][pi];
                                return pts.map(([x, y, l]) => ({ type: "point", x, y, color: l === "ekstremum değil" ? Cl.orange : l === "max" ? Cl.red : Cl.green, label: l, labelPos: l === "min" ? "se" : "ne" }));
                            },
                        }),
                        ex(R`$f(x) = x\sin x + \cos x$, $f: [0, 2\pi] \to \mathbb{R}$ fonksiyonunun yerel ekstremum noktalarını ve değerlerini bulunuz.`, [
                            R`$f'(x) = \sin x + x\cos x - \sin x = x\cos x$. $(0, 2\pi)$'de $x > 0$ olduğundan işaret $\cos x$'in işaretidir.`,
                            R`$(0, \frac\pi2)$: $+$; $(\frac\pi2, \frac{3\pi}2)$: $-$; $(\frac{3\pi}2, 2\pi)$: $+$.`,
                        ], R`$x = \frac\pi2$'de yerel maksimum $f = \frac\pi2$; $x = \frac{3\pi}2$'de yerel minimum $f = -\frac{3\pi}2$.`),
                        quiz(R`$f'(c) = 0$ ise $c$ için ne söylenebilir?`, ["Kritik noktadır; ekstremum olmayabilir", "Kesin maksimumdur", "Kesin minimumdur", "Fonksiyon c'de süreksizdir"], 0, R`Örnek: $x^3$, $c = 0$.`),
                    ],
                },
                {
                    id: "mutlak-ekstremum", title: "Mutlak Ekstremum ve İkinci Türev Testi",
                    summary: "Kapalı aralıkta: kritik noktalar + uçlar; f'' ile max/min.",
                    blocks: [
                        simple(R`Kapalı aralıkta en büyük ve en küçük değeri bulmak bir <b>yarışma</b> gibidir: adaylar uç noktalar, kritik noktalar ve türevsiz noktalardır. Hepsinin değeri hesaplanır, en büyüğü ve en küçüğü kazanır.`),
                        def("Teorem 4.3", R`$f: [a, b] \to \mathbb{R}$'nin kritik noktaları $c_1, \ldots, c_p$, türevsiz olduğu noktalar $s_1, \ldots, s_r$ ise
                            $$\{f(a),\ f(c_1), \ldots, f(c_p),\ f(s_1), \ldots, f(s_r),\ f(b)\}$$
                            kümesinin en büyük elemanı <b>mutlak maksimum</b>, en küçüğü <b>mutlak minimum</b> değeridir.`),
                        ex(R`$f(x) = 2x^3 - 9x^2 - 24x + 45$, $f: [-5, 5] \to \mathbb{R}$ fonksiyonunun en büyük ve en küçük değerini bulunuz. $f([-5, 5])$ kümesi nedir?`, [
                            R`$f'(x) = 6x^2 - 18x - 24 = 6(x + 1)(x - 4) = 0 \Rightarrow x = -1, 4$.`,
                            R`$f(-5) = -310$, $f(-1) = 58$, $f(4) = -67$, $f(5) = -50$.`,
                        ], R`Mutlak minimum $-310$ ($x = -5$), mutlak maksimum $58$ ($x = -1$); $f([-5, 5]) = [-310, 58]$.`),
                        ex(R`$[-2, 2]$'de $f(x) = 3x^4 - 4x^3 + 12$'nin yerel ve mutlak ekstremumlarını bulunuz.`, [
                            R`$f'(x) = 12x^3 - 12x^2 = 12x^2(x - 1)$: kritik noktalar $0$ (çift kat) ve $1$.`,
                            R`İşaret 0'da değişmez, 1'de $-$'den $+$'ya geçer → $x = 1$ yerel minimum, $f(1) = 11$.`,
                            R`$f(0) = 12$, $f(-2) = 48 + 32 + 12 = 92$, $f(2) = 48 - 32 + 12 = 28$.`,
                        ], R`Mutlak maksimum $f(-2) = 92$, mutlak minimum $f(1) = 11$.`),
                        widget("graph", "Kapalı aralıkta yarışma", "Aralığın uçlarını (a, b) değiştir. Mutlak maksimum (kırmızı) ve minimum (yeşil) bazen uçta, bazen kritik noktada çıkar.", {
                            fns: [{ expr: "2x^3-9x^2-24x+45", label: "f" }],
                            params: { a: { min: -5, max: 3, step: 0.1, value: -5, label: "a" }, b: { min: -2, max: 6, step: 0.1, value: 5, label: "b" } },
                            view: { xmin: -6, xmax: 7, ymin: -330, ymax: 120 }, height: 280,
                            extras: (pr, c) => {
                                const f = c[0].f, a = Math.min(pr.a, pr.b), b = Math.max(pr.a, pr.b);
                                const cand = [a, b, -1, 4].filter((x) => x >= a && x <= b);
                                const vals = cand.map((x) => [x, f(x)]);
                                const mx = vals.reduce((m, v) => (v[1] > m[1] ? v : m)), mn = vals.reduce((m, v) => (v[1] < m[1] ? v : m));
                                return [
                                    { type: "shadeX", a, b },
                                    ...vals.map(([x, y]) => ({ type: "point", x, y, color: Cl.gray, r: 4 })),
                                    { type: "point", x: mx[0], y: mx[1], color: Cl.red, label: `max ${F(mx[1], 1)}` },
                                    { type: "point", x: mn[0], y: mn[1], color: Cl.green, label: `min ${F(mn[1], 1)}`, labelPos: "se" },
                                ];
                            },
                            readout: (pr, c) => {
                                const a = Math.min(pr.a, pr.b), b = Math.max(pr.a, pr.b);
                                const cand = [a, b, -1, 4].filter((x) => x >= a && x <= b);
                                return `Adaylar: ${cand.map((x) => `f(${F(x, 1)}) = ${F(c[0].f(x), 1)}`).join(", ")}.`;
                            },
                        }),
                        def("Teorem 4.4 — İkinci türev testi", R`$f$, $(a, b)$'de türevli, $c$ bir kritik nokta ve $f''(c) \ne 0$ olsun.<br>
                            (1) $f''(c) > 0$ ise $c$'de <b>yerel minimum</b> (kap yukarı, ∪),<br>(2) $f''(c) < 0$ ise $c$'de <b>yerel maksimum</b> (kap aşağı, ∩) vardır.`),
                        ex(R`$f(x) = x\ln x - x$, $f: \mathbb{R}^+ \to \mathbb{R}$ fonksiyonunun yerel ekstremum noktalarını bulunuz.`, [
                            R`$f'(x) = \ln x + 1 - 1 = \ln x = 0 \Rightarrow x = 1$.`,
                            R`$f''(x) = \frac1x \Rightarrow f''(1) = 1 > 0$.`,
                        ], R`$x = 1$ yerel minimum, değeri $f(1) = -1$.`),
                        ex(R`$A\left(\frac52, 0\right)$ noktasının $y = \sqrt x$ eğrisine olan uzaklığını hesaplayınız.`, [
                            R`Eğri üzerindeki nokta $P(x, \sqrt x)$: $d = \sqrt{\left(x - \frac52\right)^2 + x}$. Kökün içini en küçük yapmak yeter: $f(x) = \left(x - \frac52\right)^2 + x$.`,
                            R`$f'(x) = 2x - 4 = 0 \Rightarrow x = 2$; $f''(2) = 2 > 0$ (minimum).`,
                        ], R`$d = \sqrt{\frac14 + 2} = \frac32$ birim.`),
                        warn(R`$f''(c) = 0$ ise test <b>karar veremez</b> ($x^4$ minimum, $x^3$ ekstremumsuz, ikisinde de $f''(0) = 0$). O zaman işaret değişimi testine dön.`),
                        quiz(R`$f'(2) = 0$ ve $f''(2) = -3$ ise $x = 2$ için ne söylenir?`, ["Yerel maksimum", "Yerel minimum", "Dönüm noktası", "Karar verilemez"], 0, R`$f'' < 0$: kap aşağı, tepe.`),
                        quiz(R`$f(x) = x^2$'nin $[-1, 3]$'teki mutlak maksimum değeri?`, ["9", "1", "0", "3"], 0, R`Adaylar $f(-1) = 1$, $f(0) = 0$, $f(3) = 9$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.5 =========================== */
        {
            no: "4.5", title: "Maksimum – Minimum Problemleri", page: 168,
            lessons: [
                {
                    id: "optimizasyon", title: "Optimizasyon: Yöntem ve Geometri",
                    summary: "Tek değişkenli fonksiyon kur, kritik nokta + uçları karşılaştır.",
                    blocks: [
                        simple(R`“En büyük alan”, “en az malzeme”, “en kısa yol” sorularının hepsi aynı reçeteyle çözülür: istenen çokluğu <b>tek değişkenli</b> bir fonksiyon olarak yaz, değişkenin sınırlarını belirle, türevini sıfıra eşitle ve adayları karşılaştır.`),
                        formula("Çözüm adımları", R`<ol>
                            <li>Verilenleri değişkenlerle göster.</li>
                            <li>Maksimum/minimum istenen çokluğu bir ifade olarak yaz.</li>
                            <li>Verilenlerle değişkenleri azaltıp <b>tek değişkenli</b> fonksiyon elde et.</li>
                            <li>Değişkenin sınırlarını tespit et.</li>
                            <li>Kritik noktaları bul.</li>
                            <li>Kritik noktalarda ve uçlarda fonksiyon değerlerini hesapla.</li>
                            <li>En büyüğü maksimum, en küçüğü minimumdur (bunlar <b>mutlak</b> ekstremumlardır).</li></ol>`),
                        ex(R`Toplamları 40 olan iki pozitif tam sayının kareleri toplamı en fazla kaç olur?`, [
                            R`Sayılar $x$, $y$; $x + y = 40 \Rightarrow f(x) = x^2 + (40 - x)^2$, $x \in [1, 39]$.`,
                            R`$f'(x) = 4x - 80 = 0 \Rightarrow x = 20$ (kritik nokta).`,
                            R`$f(1) = 1521$, $f(20) = 800$, $f(39) = 1521$.`,
                        ], R`En büyük değer $1521$ ($1$ ve $39$), en küçük değer $800$ ($20$ ve $20$).`),
                        ex(R`9 cm eninde dikdörtgen bir kâğıt şeridin $D$ köşesi kıvrılarak $[AB]$ kenarı üzerine getiriliyor. $FAE$ üçgeninin alanı en fazla kaç cm² olabilir?`, [
                            R`$|AE| = x$, $|AF| = y$ → $|DF| = |FE| = 9 - y$. Pisagor: $x^2 + y^2 = (9 - y)^2 \Rightarrow y = \dfrac{81 - x^2}{18}$.`,
                            R`$S(x) = \frac12xy = \frac{1}{36}(81x - x^3)$; $S'(x) = \frac{1}{36}(81 - 3x^2) = 0 \Rightarrow x = 3\sqrt3$.`,
                            R`$S''(x) = -\frac x6 < 0$ → maksimum.`,
                        ], R`$S(3\sqrt3) = \frac{1}{36}(81\cdot3\sqrt3 - 81\sqrt3) = \dfrac{9\sqrt3}{2}$ cm².`),
                        ex(R`$r$ yarıçaplı çemberin içine çizilebilen ikizkenar üçgenin alanı en fazla ne olur?`, [
                            R`$|AH| = h$, $|BC| = a$; $OHC$ dik üçgeninde $r^2 = (h - r)^2 + \left(\frac a2\right)^2 \Rightarrow a = 2\sqrt{2rh - h^2}$.`,
                            R`$S = \frac12ah = h\sqrt{2rh - h^2}$, $0 < h < 2r$.`,
                            R`$S' = \sqrt{2rh - h^2} + \dfrac{(r - h)h}{\sqrt{2rh - h^2}} = 0 \Rightarrow h(3r - 2h) = 0 \Rightarrow h = \frac{3r}{2}$.`,
                        ], R`Maksimum alan $S = \dfrac{3\sqrt3}{4}r^2$ (eşkenar üçgen).`),
                        ex(R`Bir kâğıdın 24 cm²'lik kısmına yazı yazılacak; alttan ve üstten 1,5 cm, sağdan ve soldan 1 cm boşluk bırakılacak. Kâğıdın alanı en az kaç cm² olmalı?`, [
                            R`Yazı alanı $x \times y$, $xy = 24$; kâğıt $(x + 2)(y + 3)$.`,
                            R`$S(x) = (x + 2)\left(\frac{24}{x} + 3\right) = 3x + \frac{48}{x} + 30$; $S' = 3 - \frac{48}{x^2} = 0 \Rightarrow x = 4$.`,
                        ], R`$S(4) = 12 + 12 + 30 = 54$ cm².`),
                        ex(R`Yarıçapı 6 cm olan bir küre içine yerleştirilen dik koninin hacmi en fazla kaç cm³ olabilir?`, [
                            R`Koninin yüksekliği $h$, taban yarıçapı $r$: Öklid bağıntısı $r^2 = h(12 - h)$.`,
                            R`$V = \frac13\pi r^2h = \frac13\pi(12h^2 - h^3)$; $V' = \frac13\pi(24h - 3h^2) = 0 \Rightarrow h = 8$.`,
                        ], R`$V_{\max} = \frac13\pi(12\cdot64 - 512) = \dfrac{256\pi}{3}$ cm³.`),
                        ex(R`$y = x + 4$, $y = -x + 4$ doğruları ve $Ox$-ekseni arasındaki bölgede, iki köşesi doğrular üzerinde, iki köşesi $Ox$ üzerinde olan dikdörtgenin alanı en fazla kaç br²?`, [
                            R`Simetriden köşe $(x, -x + 4)$: $A(x) = 2x(4 - x) = 8x - 2x^2$.`,
                            R`$A' = 8 - 4x = 0 \Rightarrow x = 2$; $A'' = -4 < 0$.`,
                        ], R`$A_{\max} = 16 - 8 = 8$ br².`),
                        quiz(R`Çevresi 20 olan dikdörtgenlerin en büyük alanı?`, ["25", "20", "24", "100"], 0, R`$A = x(10 - x)$, $x = 5$: kare.`),
                    ],
                },
                {
                    id: "optimizasyon-uygulama", title: "Optimizasyon: Hacim, Maliyet, Kâr",
                    summary: "Kutu, silindir, yol maliyeti ve kâr problemleri.",
                    blocks: [
                        simple(R`Mühendislikte optimizasyon her yerdedir: en az malzemeyle kutu yapmak, en ucuz güzergâhı seçmek, kârı en büyük yapmak. Reçete aynı: <b>kısıtı kullanarak değişkeni teke indir</b>, sonra türev.`),
                        ex(R`Çevresi 36 cm olan dikdörtgen bir karton, kenarlarından biri etrafında döndürülüyor. Oluşan silindirin hacmi en fazla kaç cm³?`, [
                            R`Kenarlar $x$ ve $18 - x$; $x$ yarıçap olsun: $V = \pi x^2(18 - x) = \pi(18x^2 - x^3)$.`,
                            R`$V' = \pi(36x - 3x^2) = 3\pi x(12 - x) = 0 \Rightarrow x = 12$; $V''(12) = \pi(36 - 72) < 0$.`,
                        ], R`$V = \pi\cdot144\cdot6 = 864\pi$ cm³. (Kitapta $\pi\cdot36\cdot6 = 216\pi$ yazılmış; $x^2 = 144$ olduğundan doğrusu $864\pi$'dir.)`),
                        ex(R`Kenarı 12 cm olan kare kartonun köşelerinden eşit kareler kesilip üstü açık kutu yapılıyor. Hacim en fazla kaç cm³?`, [
                            R`Kesilen kare kenarı $x$: $V(x) = (12 - 2x)^2x$, $0 < x < 6$.`,
                            R`$V'(x) = 12(x^2 - 8x + 12) = 12(x - 2)(x - 6)$: $x = 2$'de $+$'dan $-$'ye.`,
                        ], R`$V(2) = 8^2\cdot2 = 128$ cm³.`),
                        widget("graph", "Üstü açık kutu", "x (kesilen karenin kenarı) kaydırıcısıyla oyna. Hacim V = (12 − 2x)²x, x = 2'de en büyük.", {
                            fns: [{ expr: "(12-2x)^2*x", label: "V(x)", xmin: 0, xmax: 6 }],
                            params: { x0: { min: 0.1, max: 5.9, step: 0.05, value: 1, label: "x (cm)" } },
                            view: { xmin: -0.5, xmax: 6.5, ymin: -10, ymax: 150 }, height: 260,
                            extras: (pr) => [{ type: "point", x: pr.x0, y: (12 - 2 * pr.x0) ** 2 * pr.x0, color: Cl.pink }, { type: "point", x: 2, y: 128, color: Cl.green, label: "max 128", labelPos: "ne" }],
                            readout: (pr) => `x = ${F(pr.x0, 2)} cm → taban ${F(12 - 2 * pr.x0, 2)} × ${F(12 - 2 * pr.x0, 2)}, yükseklik ${F(pr.x0, 2)}: ${T(`V \\approx ${F((12 - 2 * pr.x0) ** 2 * pr.x0, 2)}`)} cm³.`,
                        }),
                        ex(R`Üstü açık, 64 cm³ hacimli dik silindir şeklinde kutular yapılacak. En az alüminyum için taban yarıçapı kaç cm olmalı?`, [
                            R`Alan $A = \pi r^2 + 2\pi rh$; $\pi r^2h = 64 \Rightarrow h = \frac{64}{\pi r^2}$.`,
                            R`$A(r) = \pi r^2 + \frac{128}{r}$; $A'(r) = 2\pi r - \frac{128}{r^2} = 0 \Rightarrow r^3 = \frac{64}{\pi}$.`,
                        ], R`$r = \dfrac{4}{\sqrt[3]\pi}$ cm (bu durumda $h = r$).`),
                        ex(R`B köyü A'nın 40 km doğusunda, C köyü B'nin 20 km kuzeyinde; A–B ve B–C arasında stabilize yol var. 1 km stabilize yolu asfaltlamak 30, 1 km yeni yol açıp asfaltlamak 60 milyar TL. A ile C arası en az kaça mal olur?`, [
                            R`AB üzerinde $|AP| = x$ kadar gidip P'den C'ye yeni yol açalım: $M(x) = 30x + 60\sqrt{(40 - x)^2 + 400}$, $0 \le x \le 40$.`,
                            R`$M'(x) = 30 - \dfrac{60(40 - x)}{\sqrt{(40 - x)^2 + 400}} = 0 \Rightarrow \sqrt{(40 - x)^2 + 400} = 2(40 - x) \Rightarrow 40 - x = \frac{20}{\sqrt3}$.`,
                            R`$M(0) = 1200\sqrt5 \approx 2683$; $M\left(40 - \frac{20}{\sqrt3}\right) = 1200 - \frac{600}{\sqrt3} + 60\cdot\frac{40}{\sqrt3} = 1200 + 600\sqrt3 \approx 2239$; $M(40) = 1200 + 1200 = 2400$.`,
                        ], R`En az $1200 + 600\sqrt3 \approx 2239$ milyar TL. (Kitapta son değer $1200 + 200\sqrt3 \approx 1546$ hesaplanmış; $\sqrt{400/3 + 400} = \frac{40}{\sqrt3}$ alınınca doğrusu $\approx 2239$'dur.)`),
                        ex(R`$x$ parça mal satıldığında maliyet $C(x)$, gelir $R(x)$, kâr $P(x) = R(x) - C(x)$'tir. Maksimum kârın, marjinal gelir ile marjinal maliyetin eşit olduğu yerde oluştuğunu gösteriniz.`, [
                            R`$P$ maksimumsa (Fermat) $P'(x) = 0$.`,
                        ], R`$P'(x) = R'(x) - C'(x) = 0 \Rightarrow R'(x) = C'(x)$.`),
                        tip(R`Kökler veya çok terimli ifadeler varsa, <b>karesini</b> en küçük/büyük yapmak aynı noktayı verir (uzaklık problemlerinde $d$ yerine $d^2$ kullan). Sonucu bulduktan sonra uç değerlerle mutlaka karşılaştır.`),
                        quiz(R`Alanı 36 cm² olan dikdörtgenin çevresi en az kaç cm?`, ["24", "36", "26", "20"], 0, R`$Ç = 2\left(x + \frac{36}{x}\right)$, $x = 6$: kare.`),
                    ],
                },
            ],
        },

        /* =========================== 4.6 =========================== */
        {
            no: "4.6", title: "Türevle İlgili Teoremler", page: 177,
            lessons: [
                {
                    id: "rolle", title: "Rolle Teoremi",
                    summary: "f(a) = f(b) ise arada f'(c) = 0 olan c var.",
                    blocks: [
                        simple(R`Aynı yükseklikten başlayıp aynı yükseklikte biten pürüzsüz bir yolda, arada en az bir yerde <b>düz</b> (yatay) bir an mutlaka vardır: ya bir tepe ya bir çukur.`),
                        def("Teorem 4.5 — Rolle", R`$f$, $[a, b]$'de sürekli ve her $x \in (a, b)$'de türevli olsun. $f(a) = f(b)$ ise $(a, b)$'de $f'(c) = 0$ olacak şekilde <b>en az bir</b> $c$ vardır.<br>
                            <i>İspat:</i> $f$ en büyük değeri $M$'yi, en küçük değeri $m$'yi alır. $M = m$ ise $f$ sabittir. $m < M$ ise $f(a) = f(b)$ olduğundan bu değerlerden biri bir iç noktada alınır; Fermat'tan $f'(c) = 0$.`),
                        def("Sonuç 4.2 ve 4.3", R`Geometrik yorum: $f(a) = f(b)$ ise eğrinin en az bir noktadaki teğeti $Ox$-eksenine paraleldir.<br>
                            Cebirsel yorum: Türevlenebilen bir fonksiyonun iki kökü arasında, türevinin sıfır olduğu en az bir yer vardır.`),
                        ex(R`$f(x) = x^4 - 5x^2 + 4$ olsun. $f'(x) = 0$ denkleminin kökleri için birer sınır bulunuz.`, [
                            R`$f(x) = (x + 2)(x + 1)(x - 1)(x - 2)$: kökler $-2, -1, 1, 2$.`,
                            R`Rolle: $(-2, -1)$, $(-1, 1)$, $(1, 2)$ aralıklarının her birinde $f'$'nün bir kökü var.`,
                        ], R`Gerçekten $f'(x) = 4x^3 - 10x = 2x(2x^2 - 5) = 0 \Rightarrow x = -\sqrt{\frac52},\ 0,\ \sqrt{\frac52}$.`),
                        ex(R`Rolle teoreminden yararlanarak $5x^4 - 4x + 1 = 0$ denkleminin $(0, 1)$ aralığında bir köke sahip olduğunu gösteriniz.`, [
                            R`Türevi bu ifade olan bir fonksiyon seç: $f(x) = x^5 - 2x^2 + x$, $f'(x) = 5x^4 - 4x + 1$.`,
                            R`$f(0) = 0 = f(1)$.`,
                        ], R`Rolle: $f'(c) = 0$ olan bir $c \in (0, 1)$ var; yani denklemin $(0, 1)$'de kökü var.`),
                        widget("meanvalue", "Rolle: yatay teğet avı", "Uçlardaki yükseklikler eşitken yeşil teğetler yatay olur. Uçları kaydırıp eşitliği bozarsan Ortalama Değer Teoremi'ne geçersin.", {
                            presets: [
                                { tex: "x^4-5x^2+4", expr: "x^4-5x^2+4", a: -2, b: 2, min: -2.5, max: 2.5, view: { xmin: -3, xmax: 3, ymin: -3, ymax: 6 } },
                                { tex: "x^5-2x^2+x", expr: "x^5-2x^2+x", a: 0, b: 1, min: -0.5, max: 1.5, view: { xmin: -0.6, xmax: 1.6, ymin: -0.6, ymax: 0.6 } },
                                { tex: "\\sin x", expr: "sin(x)", a: 0, b: 3.1416, min: -1, max: 7, view: { xmin: -1, xmax: 7, ymin: -1.5, ymax: 1.5 } },
                            ],
                        }),
                        warn(R`Şartlar vazgeçilmez: $f(x) = 1 - x^{2/3}$ için $f(-1) = f(1) = 0$ ama $f'(c) = 0$ olan $c$ yok — çünkü $f$, 0'da türevli değil. Benzer şekilde sıçramalı fonksiyonlarda da teorem işlemez.`),
                        quiz(R`Rolle teoreminin şartlarından biri <b>değildir</b>:`, ["f, (a, b)'de artan olmalı", "f, [a, b]'de sürekli olmalı", "f, (a, b)'de türevli olmalı", "f(a) = f(b) olmalı"], 0, R`Artanlık şart değil; zaten $f(a) = f(b)$ iken artan olamaz (sabit hariç).`),
                    ],
                },
                {
                    id: "ortalama-deger", title: "Ortalama Değer Teoremleri",
                    summary: "f'(x₀) = (f(b) − f(a))/(b − a); Cauchy versiyonu.",
                    blocks: [
                        simple(R`100 km'lik yolu 1 saatte giden bir araba, yolculuğun <b>bir anında</b> tam 100 km/s hızla gitmiş olmalıdır. Grafikte: uçları birleştiren kirişe paralel en az bir teğet vardır.`),
                        def("Teorem 4.6 — Ortalama Değer (Lagrange)", R`$f$, $[a, b]$'de sürekli ve $(a, b)$'de türevli ise $(a, b)$'de
                            $$f'(x_0) = \frac{f(b) - f(a)}{b - a}$$
                            olacak şekilde en az bir $x_0$ vardır. $x_0 = a + \theta(b - a)$, $0 < \theta < 1$ yazılabilir.<br>
                            <i>İspat:</i> $G(x) = f(x) - \frac{f(b) - f(a)}{b - a}x$ fonksiyonu $G(a) = G(b)$ sağlar; Rolle uygulanır.`),
                        ex(R`$f: [-1, 2] \to \mathbb{R}$, $f(x) = x^2 + 2x$ fonksiyonunun ortalama değerini ve teoremdeki $x_0$'ı bulunuz.`, [
                            R`$\frac{f(2) - f(-1)}{2 - (-1)} = \frac{8 - (-1)}{3} = 3$.`,
                            R`$f'(x_0) = 2x_0 + 2 = 3 \Rightarrow x_0 = \frac12$.`,
                        ], R`Ortalama değer 3, $x_0 = \frac12$.`),
                        widget("meanvalue", "Kirişe paralel teğet", "a ve b'yi kaydır: pembe kirişin eğimine eşit eğimli (paralel) yeşil teğet(ler) her zaman bulunur.", {
                            presets: [
                                { tex: "x^2+2x", expr: "x^2+2x", a: -1, b: 2, min: -3, max: 3, view: { xmin: -3.5, xmax: 3.5, ymin: -2, ymax: 12 } },
                                { tex: "x^3-3x", expr: "x^3-3x", a: -2, b: 2.2, min: -2.5, max: 2.5, view: { xmin: -3, xmax: 3, ymin: -5, ymax: 6 } },
                                { tex: "\\sqrt{x}", expr: "sqrt(x)", a: 0, b: 4, min: 0, max: 9, view: { xmin: -0.5, xmax: 9.5, ymin: -0.5, ymax: 3.5 } },
                            ],
                        }),
                        ex(R`Her $x \in \mathbb{R}$ için $e^x \ge 1 + x$ olduğunu gösteriniz.`, [
                            R`$x > 0$: $[0, x]$'te ODT: $\frac{e^x - 1}{x} = e^{x_0} > e^0 = 1$ ($0 < x_0 < x$) → $e^x > 1 + x$.`,
                            R`$x < 0$: $[x, 0]$'da $\frac{1 - e^x}{-x} = e^{x_0} < 1$; $-x > 0$ ile çarp: $1 - e^x < -x$.`,
                        ], R`$x = 0$'da eşitlik, diğer her yerde $e^x > 1 + x$.`),
                        def("Teorem 4.7 — Genelleştirilmiş ODT (Cauchy)", R`$f$ ve $g$, $[a, b]$'de sürekli, $(a, b)$'de türevli ve her $x \in (a, b)$ için $g'(x) \ne 0$ ise
                            $$\frac{f'(x_0)}{g'(x_0)} = \frac{f(b) - f(a)}{g(b) - g(a)}$$
                            olacak şekilde en az bir $x_0 \in (a, b)$ vardır. (L'Hospital kuralının ispatında kullanılır.)`),
                        ex(R`$f(x) = x^3 + x$, $g(x) = x^2$ ($[0, 1]$) için genelleştirilmiş ODT'deki $x_0$'ı bulunuz.`, [
                            R`$\frac{3x_0^2 + 1}{2x_0} = \frac{2 - 0}{1 - 0} \Rightarrow 3x_0^2 - 4x_0 + 1 = 0 \Rightarrow x_0 = \frac13$ veya $1$.`,
                        ], R`$x_0 \in (0, 1)$ olduğundan $x_0 = \frac13$.`),
                        def("Sonuç 4.4 ve 4.5", R`$f$, $[a, b]$'de sürekli ve her $x \in (a, b)$ için $f'(x) = 0$ ise $f$ <b>sabittir</b>.<br>
                            $f'(x) = g'(x)$ ise $f(x) = g(x) + k$: türevleri eşit fonksiyonlar bir sabit kadar farklıdır.`),
                        ex(R`$f'(x) = 3x^2$ ve $f(1) = 3$ olduğuna göre $f(x)$ nedir?`, [
                            R`$(x^3)' = 3x^2$ → $f(x) = x^3 + k$.`,
                            R`$f(1) = 1 + k = 3 \Rightarrow k = 2$.`,
                        ], R`$f(x) = x^3 + 2$.`),
                        quiz(R`$f(x) = x^2$ için $[0, 4]$'te ODT'deki $x_0$ nedir?`, ["2", "1", "4", R`$\sqrt2$`], 0, R`$\frac{16 - 0}{4} = 4 = 2x_0$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.7 =========================== */
        {
            no: "4.7", title: "Konveks Fonksiyonlar", page: 182,
            lessons: [
                {
                    id: "konveks-konkav", title: "Konvekslik, Konkavlık ve Dönüm Noktası",
                    summary: "f'' > 0 konveks (∪), f'' < 0 konkav (∩).",
                    blocks: [
                        simple(R`Grafik <b>gülümsüyorsa</b> (∪) fonksiyon konvekstir, <b>somurtuyorsa</b> (∩) konkavdır. Konvekste teğetlerin eğimi artar, yani $f'$ artandır, dolayısıyla $f'' > 0$. Gülümsemeden somurtmaya geçilen yer <b>dönüm noktasıdır</b>.`),
                        def("Tanım — Konveks küme ve konveks fonksiyon", R`$K \subset \mathbb{R}^2$'nin herhangi iki noktasını birleştiren doğru parçası $K$'nın içinde kalıyorsa $K$ <b>konveks kümedir</b>.<br>
                            $f$, $[a, b]$'de sürekli olsun. Grafiğin <b>üstündeki</b> bölge $K = \{(x, y): x \in [a, b],\ y \ge f(x)\}$ konveks ise $f$ <b>konvekstir</b> (yukarı bükümlü); grafiğin <b>altındaki</b> bölge konveks ise $f$ <b>konkavdır</b> (aşağı bükümlü).`),
                        def("Teorem 4.8", R`$f: [a, b] \to \mathbb{R}$'nin $(a, b)$'de ikinci türevi var olsun. Her $x \in (a, b)$ için $f''(x) > 0$ ise $f$ konveks, $f''(x) < 0$ ise konkavdır.`),
                        ex(R`$y = 3x^5 - 10x^3$ eğrisinin konveks ve konkav olduğu aralıkları bulunuz.`, [
                            R`$y' = 15x^4 - 30x^2$, $y'' = 60x^3 - 60x = 60x(x - 1)(x + 1)$.`,
                            R`İşaret: $(-\infty, -1)$: $-$; $(-1, 0)$: $+$; $(0, 1)$: $-$; $(1, \infty)$: $+$.`,
                        ], R`$(-1, 0)$ ve $(1, \infty)$'da konveks; $(-\infty, -1)$ ve $(0, 1)$'de konkav.`),
                        def("Tanım — Dönüm (büküm) noktası", R`$f$'nin konvekslikten konkavlığa (ya da tersine) geçtiği ve sürekli olduğu noktaya <b>dönüm noktası</b> denir.<br>
                            1) $a$ dönüm noktası ise ya $f''(a) = 0$ ya da $f''(a)$ yoktur. 2) $f''$, $a$'da işaret değiştiriyorsa $a$ dönüm noktasıdır.`),
                        ex(R`$f(x) = x^3 - 3x^2 - 4x + 12$ fonksiyonunun konveks ve konkav olduğu aralıkları ve dönüm noktasını bulunuz.`, [
                            R`$f'(x) = 3x^2 - 6x - 4$, $f''(x) = 6x - 6$: $x < 1$'de $-$, $x > 1$'de $+$.`,
                            R`$f(1) = 1 - 3 - 4 + 12 = 6$.`,
                        ], R`$(-\infty, 1)$'de konkav, $(1, \infty)$'da konveks; dönüm noktası $(1, 6)$.`),
                        widget("graph", "Gülümseyen ve somurtan eğri", "Nokta x'i kaydır. f″ > 0 (mavi bölge) konveks: teğet eğrinin altında; f″ < 0 (pembe) konkav: teğet üstte.", {
                            presets: [
                                { label: "x³ − 3x² − 4x + 12", fns: [{ expr: "x^3-3x^2-4x+12", label: "f" }], view: { xmin: -3, xmax: 4.5, ymin: -6, ymax: 16 } },
                                { label: "3x⁵ − 10x³", fns: [{ expr: "3x^5-10x^3", label: "f" }], view: { xmin: -2, xmax: 2, ymin: -10, ymax: 10 } },
                            ],
                            params: { a: { min: -2, max: 3.5, step: 0.05, value: -0.5, label: "x" } },
                            height: 280,
                            extras: (pr, c) => {
                                const f = c[0].f, a = pr.a, y = f(a), m = num(f, a);
                                const d2 = (f(a + 1e-3) - 2 * y + f(a - 1e-3)) / 1e-6;
                                return [
                                    { type: "fn", f: (x) => y + m * (x - a), color: d2 > 0 ? Cl.blue : Cl.pink, dash: true, width: 2 },
                                    { type: "point", x: a, y, color: d2 > 0 ? Cl.blue : Cl.pink },
                                ];
                            },
                            readout: (pr, c) => {
                                const f = c[0].f, a = pr.a, y = f(a), d2 = (f(a + 1e-3) - 2 * y + f(a - 1e-3)) / 1e-6;
                                return `x = ${F(a, 2)}: ${T(`f''(x) \\approx ${F(d2, 2).replace("−", "-")}`)} → ${Math.abs(d2) < 0.05 ? "<b>dönüm noktası</b> civarı" : d2 > 0 ? "<b>konveks</b> (∪)" : "<b>konkav</b> (∩)"}.`;
                            },
                        }),
                        quiz(R`$f(x) = x^3$ için $x = 0$ nedir?`, ["Dönüm noktası", "Yerel maksimum", "Yerel minimum", "Süreksizlik noktası"], 0, R`$f'' = 6x$ işaret değiştirir; $(-\infty, 0]$'da konkav, $[0, \infty)$'da konveks.`),
                        quiz(R`$f(x) = e^x$ fonksiyonu hangisidir?`, ["Her yerde konveks", "Her yerde konkav", "x = 0'da dönüm noktası var", "Hem konveks hem konkav"], 0, R`$f'' = e^x > 0$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.8 =========================== */
        {
            no: "4.8", title: "Belirsiz Şekiller", page: 187,
            lessons: [
                {
                    id: "lhospital", title: "L'Hospital Kuralı: 0/0 ve ∞/∞",
                    summary: "lim f/g = lim f'/g' (belirsizlik varken).",
                    blocks: [
                        simple(R`$\frac00$ belirsizliğinde iki fonksiyon da sıfıra gidiyor; hangisi daha <b>hızlı</b> gidiyor? Hızları türevleridir! L'Hospital kuralı, oranın limitini türevlerin oranına bakarak bulur. (Bölüm/çarpım kuralı uygulanmaz: pay ve paydanın türevi <b>ayrı ayrı</b> alınır.)`),
                        p(R`Limitlerde karşılaşılan belirsiz şekiller: $\dfrac00,\ \dfrac\infty\infty,\ \infty - \infty,\ 0\cdot\infty,\ 0^0,\ \infty^0,\ 1^\infty$.`),
                        def("Teorem 4.9 — L'Hospital Kuralı", R`$f$ ve $g$, $a$'da sürekli, $a$'nın delinmiş bir komşuluğunda türevli ve orada $g'(x) \ne 0$ olsun. $\lim\limits_{x\to a}f(x) = \lim\limits_{x\to a}g(x) = 0$ ise
                            $$\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}.$$
                            <i>İspat:</i> Genelleştirilmiş ODT ile $\frac{f(x) - f(a)}{g(x) - g(a)} = \frac{f'(x_0)}{g'(x_0)}$, $x_0 \in (a, x)$; $x \to a$ iken $x_0 \to a$.`),
                        tip(R`$\lim\frac{f'}{g'}$ yine $\frac00$ ise kural <b>tekrar</b> uygulanır. Kural sağ/sol limitler, $x \to \pm\infty$ (Sonuç 4.4) ve $\frac\infty\infty$ belirsizliği için de geçerlidir.`),
                        ex(R`$\lim\limits_{x\to1}\dfrac{\ln x}{2x^2 - 3x + 1}$ limitini hesaplayınız.`, [
                            R`$x = 1$: $\frac{0}{0}$.`,
                            R`$\lim\limits_{x\to1}\dfrac{1/x}{4x - 3} = \dfrac11$.`,
                        ], R`$1$.`),
                        ex(R`$\lim\limits_{x\to0}\dfrac{x - \sin x}{x^3}$ limitini hesaplayınız.`, [
                            R`$\frac00$: $\lim\dfrac{1 - \cos x}{3x^2}$ — yine $\frac00$.`,
                            R`$\lim\dfrac{\sin x}{6x}$ — yine $\frac00$ → $\lim\dfrac{\cos x}{6}$.`,
                        ], R`$\dfrac16$.`),
                        widget("approach", "L'Hospital sonucunu tablodan doğrula", "h'yi küçült: değerler L'Hospital ile bulunan sayıya yaklaşıyor.", {
                            presets: [
                                { tex: "\\frac{\\ln x}{2x^2-3x+1},\\ a=1", label: "f", expr: "ln(x)/(2x^2-3x+1)", a: 1, view: { xmin: 0.2, xmax: 2.5, ymin: -1, ymax: 3 }, holes: [[1, 1]], note: "Değerler 1'e yaklaşıyor ✓" },
                                { tex: "\\frac{x-\\sin x}{x^3},\\ a=0", label: "f", expr: "(x-sin(x))/x^3", a: 0, view: { xmin: -3, xmax: 3, ymin: 0, ymax: 0.3 }, holes: [[0, 1 / 6]], note: "Değerler 1/6 ≈ 0,16667'ye yaklaşıyor ✓ (çok küçük h'de bilgisayarın yuvarlama hatası görülebilir)" },
                                { tex: "\\frac{\\ln(\\sin x)}{\\ln(\\tan x)},\\ a=0^+", label: "f", expr: "ln(sin(x))/ln(tan(x))", a: 0, view: { xmin: -0.2, xmax: 1.5, ymin: 0, ymax: 2 }, holes: [[0, 1]], note: "Sağdan 1'e yaklaşıyor (solda tanımsız) ✓" },
                            ],
                        }),
                        ex(R`$\lim\limits_{x\to0^+}\dfrac{\ln(\sin x)}{\ln(\tan x)}$ limitini hesaplayınız.`, [
                            R`$\frac{-\infty}{-\infty}$ belirsizliği. $\dfrac{\frac{\cos x}{\sin x}}{\frac{1 + \tan^2x}{\tan x}} = \dfrac{\cos x}{\sin x}\cdot\dfrac{\tan x}{1 + \tan^2x} = \dfrac{1}{1 + \tan^2x}$.`,
                        ], R`$1$.`),
                        ex(R`$\lim\limits_{x\to\infty}\dfrac{\sin\frac1x}{\frac{x}{1 + x^2}}$ limitini hesaplayınız.`, [
                            R`$\frac00$ ($x \to \infty$). Türevler: $\dfrac{\cos\frac1x\cdot\left(-\frac{1}{x^2}\right)}{\frac{1 - x^2}{(1 + x^2)^2}} = \cos\frac1x\cdot\dfrac{(1 + x^2)^2}{x^2(x^2 - 1)}$.`,
                        ], R`$1\cdot1 = 1$.`),
                        warn(R`Kuralı uygulamadan önce mutlaka belirsizliği kontrol et! $\lim\limits_{x\to0}\frac{\cos x}{x + 1} = 1$'dir; yanlışlıkla türev alırsan $\frac{-\sin x}{1} \to 0$ gibi yanlış bir sonuç çıkar.`),
                        quiz(R`$\lim\limits_{x\to0}\dfrac{e^x - 1}{x}$ kaçtır?`, ["1", "0", "e", R`$\infty$`], 0, R`$\frac00$: $\frac{e^x}{1} \to 1$.`),
                        quiz(R`$\lim\limits_{x\to\infty}\dfrac{\ln x}{x}$ kaçtır?`, ["0", "1", R`$\infty$`, "Yoktur"], 0, R`$\frac\infty\infty$: $\frac{1/x}{1} \to 0$.`),
                    ],
                },
                {
                    id: "diger-belirsizlikler", title: "0·∞, ∞ − ∞, 0⁰, ∞⁰, 1^∞",
                    summary: "Önce 0/0 veya ∞/∞ hâline getir.",
                    blocks: [
                        simple(R`Diğer belirsizlikler doğrudan L'Hospital'a girmez; önce kesir hâline <b>dönüştürülür</b>. Üslü belirsizliklerde ise logaritma alınıp çarpıma indirilir.`),
                        formula("Dönüştürme yolları", R`<ul>
                            <li>$0\cdot\infty$: $u\cdot v = \dfrac{u}{1/v}$ → $\frac00$ ya da $\frac\infty\infty$.</li>
                            <li>$\infty - \infty$: $u - v = \dfrac{\frac1v - \frac1u}{\frac{1}{uv}}$ ya da ortak payda → $\frac00$.</li>
                            <li>$0^0,\ \infty^0,\ 1^\infty$: $y = [u(x)]^{v(x)}$ ise $\ln y = v\ln u$ ($0\cdot\infty$); $\lim\ln y = \lambda$ ise $\lim y = e^\lambda$.</li></ul>`),
                        ex(R`$\lim\limits_{x\to0}(1 - \cos x)\cot x$ limitini hesaplayınız.`, [
                            R`$0\cdot\infty$: $(1 - \cos x)\dfrac{\cos x}{\sin x}$ → $\lim\dfrac{1 - \cos x}{\sin x}\cdot\lim\cos x$.`,
                            R`$\frac00$: $\lim\dfrac{\sin x}{\cos x} = 0$.`,
                        ], R`$0$.`),
                        ex(R`$\lim\limits_{x\to0}\left(\cot x - \dfrac1x\right)$ limitini hesaplayınız.`, [
                            R`$\infty - \infty$: $\dfrac{x\cos x - \sin x}{x\sin x}$ → $\frac00$.`,
                            R`$\dfrac{-x\sin x}{\sin x + x\cos x}$ → yine $\frac00$ → $-\dfrac{\sin x + x\cos x}{2\cos x - x\sin x} \to -\frac02$.`,
                        ], R`$0$.`),
                        ex(R`$\lim\limits_{x\to0^-}(1 - e^x)^{\sin x}$ limitini hesaplayınız.`, [
                            R`$0^0$: $\ln y = \sin x\ln(1 - e^x) = \dfrac{\ln(1 - e^x)}{1/\sin x}$ ($\frac\infty\infty$).`,
                            R`$\dfrac{\frac{-e^x}{1 - e^x}}{\frac{-\cos x}{\sin^2x}} = \dfrac{e^x}{\cos x}\cdot\dfrac{\sin^2x}{1 - e^x}$; $\lim\frac{\sin^2x}{1 - e^x} = \lim\frac{2\sin x\cos x}{-e^x} = 0$.`,
                        ], R`$\lim\ln y = 0 \Rightarrow \lim y = e^0 = 1$.`),
                        ex(R`$\lim\limits_{x\to0^+}(\cot x)^{1/\ln x}$ limitini hesaplayınız.`, [
                            R`$\infty^0$: $\ln y = \dfrac{\ln\cot x}{\ln x}$ ($\frac\infty\infty$).`,
                            R`$\dfrac{\frac{-1/\sin^2x}{\cot x}}{1/x} = -\dfrac{x}{\sin x}\cdot\dfrac{1}{\cos x} \to -1$.`,
                        ], R`$e^{-1}$.`),
                        ex(R`$\lim\limits_{x\to0}(1 + 3x)^{1/x}$ limitini hesaplayınız.`, [
                            R`$1^\infty$: $\ln y = \dfrac{\ln(1 + 3x)}{x}$ → $\dfrac{3/(1 + 3x)}{1} \to 3$.`,
                        ], R`$e^3$.`),
                        quiz(R`$\lim\limits_{x\to0^+}x\ln x$ kaçtır?`, ["0", R`$-\infty$`, "1", "−1"], 0, R`$\frac{\ln x}{1/x}$: $\frac{1/x}{-1/x^2} = -x \to 0$.`),
                        quiz(R`$\lim\limits_{x\to0^+}x^x$ kaçtır?`, ["1", "0", "e", "Yoktur"], 0, R`$\ln y = x\ln x \to 0$ → $e^0$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.9 =========================== */
        {
            no: "4.9", title: "Diferansiyeller", page: 192,
            lessons: [
                {
                    id: "diferansiyel", title: "Diferansiyel ve Yaklaşık Hesap",
                    summary: "dy = f'(x)dx; f(x + Δx) ≈ f(x) + f'(x)Δx.",
                    blocks: [
                        simple(R`Eğriye çok yakından bakınca neredeyse <b>düz</b> görünür: teğet doğrusuna yapışır. Bu yüzden küçük bir $\Delta x$ adımında eğrinin gerçek artışı $\Delta y$ yerine teğetin artışı $dy = f'(x)\,\Delta x$ kullanılabilir. Hesap makinesi olmadan $\sqrt5$'i bulmak gibi.`),
                        def("Diferansiyel", R`$\dfrac{\Delta y}{\Delta x} = f'(x) + \varepsilon$ ($\varepsilon \to 0$) olduğundan $\Delta y = f'(x)\Delta x + \varepsilon\Delta x$. $f'(x)\Delta x$ terimine $f$'nin <b>diferansiyeli</b> denir: $dy = f'(x)\,dx$.<br>
                            İkinci diferansiyel: $d^2y = f''(x)\,dx^2$; genel olarak $d^ky = f^{(k)}(x)\,dx^k$.`),
                        formula("Yaklaşık değer", R`$\Delta x$ küçükse $\quad f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x$.`),
                        ex(R`$\sqrt5$ sayısının yaklaşık değerini bulunuz.`, [
                            R`$f(x) = \sqrt x$: $\sqrt{x + \Delta x} \approx \sqrt x + \dfrac{\Delta x}{2\sqrt x}$.`,
                            R`$x = 4$, $\Delta x = 1$: $\sqrt5 \approx 2 + \frac14 = 2{,}25$.`,
                            R`Daha iyisi: $x = 4{,}84 = 2{,}2^2$, $\Delta x = 0{,}16$: $\sqrt5 \approx 2{,}2 + \dfrac{0{,}16}{4{,}4} = 2{,}2363\ldots$`,
                        ], R`$\sqrt5 \approx 2{,}2364$ (gerçek değer $2{,}2361$). Kitapta $x = 4{,}484$ basılmış; doğrusu $4{,}84$.`),
                        widget("graph", "dy ile Δy", "Δx'i küçült: teğet boyunca artış dy (yeşil) gerçek artış Δy'ye (pembe) yaklaşır. f(x) = √x, x = 4.", {
                            fns: [{ expr: "sqrt(x)", label: "y = √x" }],
                            params: { dx: { min: 0.05, max: 5, step: 0.05, value: 1, label: "Δx" } },
                            view: { xmin: 2.5, xmax: 9.5, ymin: 1.4, ymax: 3.3 }, height: 270,
                            extras: (pr) => {
                                const x0 = 4, y0 = 2, dx = pr.dx, dy = dx / 4, y1 = Math.sqrt(x0 + dx);
                                return [
                                    { type: "fn", f: (x) => 2 + (x - 4) / 4, color: Cl.green, dash: true, width: 2, label: "teğet" },
                                    { type: "seg", x1: x0, y1: y0, x2: x0 + dx, y2: y0, color: Cl.gray, width: 1.4 },
                                    { type: "seg", x1: x0 + dx, y1: y0, x2: x0 + dx, y2: y0 + dy, color: Cl.green, width: 3 },
                                    { type: "seg", x1: x0 + dx + 0.06, y1: y0, x2: x0 + dx + 0.06, y2: y1, color: Cl.pink, width: 3 },
                                    { type: "point", x: x0, y: y0, color: Cl.blue },
                                    { type: "point", x: x0 + dx, y: y1, color: Cl.pink },
                                ];
                            },
                            readout: (pr) => {
                                const dx = pr.dx, dy = dx / 4, Dy = Math.sqrt(4 + dx) - 2;
                                return `${T(`dy = \\frac{\\Delta x}{2\\sqrt4} = ${F(dy, 4)}`)}, ${T(`\\Delta y = \\sqrt{${F(4 + dx, 2)}} - 2 = ${F(Dy, 4)}`)} · hata ${F(Math.abs(dy - Dy), 4)}. Yani ${T(`\\sqrt{${F(4 + dx, 2)}} \\approx ${F(2 + dy, 4)}`)}.`;
                            },
                        }),
                        quiz(R`$y = x^3$ için $dy$ nedir?`, [R`$3x^2\,dx$`, R`$3x^2$`, R`$x^3\,dx$`, R`$3x\,dx$`], 0, R`$dy = f'(x)\,dx$.`),
                        quiz(R`Diferansiyelle $\sqrt{9{,}06}$ yaklaşık kaçtır?`, ["3,01", "3,06", "3,02", "3,1"], 0, R`$3 + \frac{0{,}06}{6} = 3{,}01$.`),
                    ],
                },
            ],
        },

        /* =========================== 4.10 =========================== */
        {
            no: "4.10", title: "Eğri Çizimleri", page: 196,
            lessons: [
                {
                    id: "asimtotlar", title: "Düşey, Yatay ve Eğik Asimptotlar",
                    summary: "Eğrinin sonsuzda yaklaştığı doğrular/eğriler.",
                    blocks: [
                        simple(R`Asimptot, eğrinin sonsuza giderken <b>yapıştığı</b> ama (genelde) dokunmadığı doğrudur. Grafik çizerken önce asimptotları kesikli çizgiyle çizmek, eğrinin “iskeletini” verir.`),
                        def("Düşey asimptot", R`$\lim\limits_{x\to a^\pm}f(x) = \pm\infty$ eşitliklerinden en az biri sağlanırsa $x = a$ doğrusu bir <b>düşey asimptottur</b>. Rasyonel $y = \frac{P(x)}{Q(x)}$'te $Q(x) = 0$'ın kökleri adaydır; $P$'nin de kökü olan noktalarda limite bakılmalıdır.`),
                        ex(R`$y = \dfrac{x^2 + 5x - 14}{x^3 - 4x}$ eğrisinin düşey asimptotlarını bulunuz.`, [
                            R`$x^3 - 4x = x(x - 2)(x + 2) = 0 \Rightarrow x = -2, 0, 2$.`,
                            R`Pay $x = -2$'de $-20$, $x = 0$'da $-14$ (sıfır değil) → asimptot. $x = 2$'de pay da 0!`,
                            R`$\lim\limits_{x\to2}\dfrac{x^2 + 5x - 14}{x^3 - 4x} = \lim\dfrac{2x + 5}{3x^2 - 4} = \dfrac98$ (sonlu).`,
                        ], R`Düşey asimptotlar $x = -2$ ve $x = 0$; $x = 2$ asimptot değil (boşluk).`),
                        ex(R`$y = 2^{1/x}$ ve $y = \ln x$ eğrilerinin düşey asimptotunu bulunuz.`, [
                            R`$\lim\limits_{x\to0^-}2^{1/x} = 2^{-\infty} = 0$, $\lim\limits_{x\to0^+}2^{1/x} = \infty$.`,
                            R`$\lim\limits_{x\to0^+}\ln x = -\infty$.`,
                        ], R`İkisinde de $x = 0$ düşey asimptottur.`),
                        def("Yatay asimptot", R`$\lim\limits_{x\to\infty}f(x) = b$ ise $y = b$; $\lim\limits_{x\to-\infty}f(x) = c$ ise $y = c$ <b>yatay asimptottur</b>.`),
                        ex(R`$y = \dfrac{3x^2 + 1}{x^2 - 4}$ ve $y = \dfrac{\ln x}{x}$ eğrilerinin yatay asimptotlarını bulunuz.`, [
                            R`$\lim\limits_{x\to\pm\infty}\frac{3x^2 + 1}{x^2 - 4} = 3$.`,
                            R`L'Hospital: $\lim\frac{\ln x}{x} = \lim\frac{1/x}{1} = 0$.`,
                        ], R`$y = 3$ ve $y = 0$ ($Ox$-ekseni).`),
                        def("Eğri ve eğik asimptot", R`$\lim\limits_{x\to\pm\infty}|f(x) - p(x)| = 0$ olacak bir $p$ polinomu varsa $y = p(x)$ <b>eğri asimptottur</b>; $p(x) = mx + n$ ise <b>eğik asimptot</b>:
                            $$m = \lim_{x\to\pm\infty}\frac{f(x)}{x}, \qquad n = \lim_{x\to\pm\infty}[f(x) - mx].$$
                            Rasyonel fonksiyonda pay paydaya bölünür; <b>bölüm</b> asimptottur.`),
                        ex(R`$y = \dfrac{x^3 + x}{x - 1}$ eğrisinin eğri asimptotunu bulunuz.`, [
                            R`Bölme: $\dfrac{x^3 + x}{x - 1} = x^2 + x + 2 + \dfrac{2}{x - 1}$.`,
                        ], R`$y = x^2 + x + 2$ eğri asimptottur, çünkü $\frac{2}{x - 1} \to 0$.`),
                        ex(R`$y = \sqrt{x^2 - x}$ eğrisinin eğik asimptotlarını bulunuz.`, [
                            R`$x \to \infty$: $m = \lim\frac{\sqrt{x^2 - x}}{x} = \lim\sqrt{1 - \frac1x} = 1$.`,
                            R`$n = \lim(\sqrt{x^2 - x} - x) = \lim\dfrac{-x}{\sqrt{x^2 - x} + x} = -\frac12$.`,
                        ], R`$y = x - \frac12$ ($x \to \infty$) ve benzer şekilde $y = -x + \frac12$ ($x \to -\infty$).`),
                        tip(R`<b>Not:</b> $a > 0$ için $y = \sqrt{ax^2 + bx + c}$'nin eğik asimptotları $y = \sqrt a\left|x + \frac{b}{2a}\right|$'dır. Örneğin $y = \sqrt{4x^2 + 8x + 1}$ için $y = 2|x + 1|$. $a < 0$ ise asimptot yoktur.`, "Kökler için kısayol"),
                        widget("graph", "Asimptotlar", "Kesikli çizgiler asimptotlar. Uzaklaştır (−) düğmesiyle eğrinin sonsuzda onlara yapıştığını gör.", {
                            presets: [
                                { label: "(x² + 5x − 14)/(x³ − 4x)", fns: [{ expr: "(x^2+5x-14)/(x^3-4x)", label: "f" }], view: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 } },
                                { label: "(3x² + 1)/(x² − 4)", fns: [{ expr: "(3x^2+1)/(x^2-4)", label: "f" }], view: { xmin: -8, xmax: 8, ymin: -8, ymax: 12 } },
                                { label: "(x³ + x)/(x − 1)", fns: [{ expr: "(x^3+x)/(x-1)", label: "f" }], view: { xmin: -5, xmax: 5, ymin: -10, ymax: 25 } },
                                { label: "√(x² − x)", fns: [{ expr: "sqrt(x^2-x)", label: "f" }], view: { xmin: -6, xmax: 6, ymin: -1, ymax: 7 } },
                            ],
                            height: 290,
                            extras: (pr, c, pi) => {
                                const A = Cl.orange;
                                if (pi === 0) return [{ type: "vline", x: -2, color: A, width: 1.6 }, { type: "vline", x: 0, color: A, width: 1.6 }, { type: "hline", y: 0, color: A, width: 1.6 }, { type: "point", x: 2, y: 9 / 8, color: Cl.blue, open: true, label: "boşluk (2, 9/8)" }];
                                if (pi === 1) return [{ type: "vline", x: -2, color: A, width: 1.6 }, { type: "vline", x: 2, color: A, width: 1.6 }, { type: "hline", y: 3, color: A, width: 1.6, label: "y = 3" }];
                                if (pi === 2) return [{ type: "vline", x: 1, color: A, width: 1.6 }, { type: "fn", f: (x) => x * x + x + 2, color: A, dash: true, width: 1.8, label: "y = x² + x + 2" }];
                                return [{ type: "fn", f: (x) => x - 0.5, color: A, dash: true, width: 1.8, xmin: 0, label: "y = x − 1/2" }, { type: "fn", f: (x) => -x + 0.5, color: A, dash: true, width: 1.8, xmax: 1 }];
                            },
                        }),
                        quiz(R`$y = \dfrac{2x + 1}{x - 3}$'ün asimptotları?`, [R`$x = 3,\ y = 2$`, R`$x = -3,\ y = 2$`, R`$x = 3,\ y = 0$`, R`$x = 2,\ y = 3$`], 0, R`Payda 0: $x = 3$; dereceler eşit: $y = \frac21$.`),
                        quiz(R`$y = \dfrac{x^2}{x + 1}$'in eğik asimptotu?`, [R`$y = x - 1$`, R`$y = x + 1$`, R`$y = x$`, "Yoktur"], 0, R`$\frac{x^2}{x + 1} = x - 1 + \frac{1}{x + 1}$.`),
                    ],
                },
                {
                    id: "egri-cizimi", title: "Eğri Çizimi ve Değişim Tablosu",
                    summary: "Tanım kümesi → asimptot → eksenler → f' → f'' → tablo → grafik.",
                    blocks: [
                        simple(R`Grafik çizmek bir <b>dedektiflik</b> işidir: her adım bir ipucu verir (nerede tanımlı, nerede sonsuza kaçıyor, nerede çıkıp iniyor). İpuçları bir <b>değişim tablosunda</b> toplanır, eğri tablodan çizilir.`),
                        formula("Eğri çizim adımları", R`<ol>
                            <li>Tanım kümesi bulunur.</li>
                            <li>Asimptotlar bulunur.</li>
                            <li>Eksenleri kestiği noktalar: $x = 0$ → $y$; $y = 0$ → $f(x) = 0$'ın kökleri.</li>
                            <li>$f'$ ve işareti: artan/azalan aralıklar, maksimum–minimum.</li>
                            <li>$f''$ ve işareti: konveks/konkav aralıklar (çoğu zaman atlanabilir).</li>
                            <li>Değişim tablosu yapılır.</li>
                            <li>Tabloya göre çizim yapılır.</li></ol>`),
                        ex(R`$y = x^4 - 8x^2$ eğrisini çiziniz.`, [
                            R`$T = \mathbb{R}$; asimptot yok.`,
                            R`$y = 0$: $x^2(x^2 - 8) = 0 \Rightarrow x = 0, \pm2\sqrt2$.`,
                            R`$y' = 4x^3 - 16x = 4x(x^2 - 4) = 0 \Rightarrow x = 0, \pm2$; $y(0) = 0$, $y(\pm2) = -16$.`,
                            R`Tablo: $-\infty \searrow -16$ ($x = -2$, min) $\nearrow 0$ ($x = 0$, max) $\searrow -16$ ($x = 2$, min) $\nearrow +\infty$.`,
                        ], R`W şeklinde, $y$-eksenine göre simetrik bir eğri (çift fonksiyon).`),
                        ex(R`$y = \dfrac{x^2 - 4}{x^2 + 2x + 1}$ eğrisini çiziniz.`, [
                            R`$T = \mathbb{R}\setminus\{-1\}$; $x = -1$ düşey ($\lim = -\infty$), $y = 1$ yatay asimptot.`,
                            R`$(0, -4)$, $(-2, 0)$, $(2, 0)$ noktaları.`,
                            R`$y' = \dfrac{2x(x + 1)^2 - 2(x + 1)(x^2 - 4)}{(x + 1)^4} = \dfrac{2(x + 4)}{(x + 1)^3}$; $y' = 0 \Rightarrow x = -4$, $y = \frac43$.`,
                            R`$x < -4$: artan; $-4 < x < -1$: azalan; $x > -1$: artan.`,
                        ], R`$x = -4$'te yerel maksimum $\frac43$; eğri soldan $y = 1$'e, sağdan yine $y = 1$'e yaklaşır.`),
                        ex(R`$y = x + \frac1x$ ve $y = \left|x + \frac1x\right|$ eğrilerini çiziniz.`, [
                            R`$T = \mathbb{R}\setminus\{0\}$; $x = 0$ düşey, $y = x$ eğik asimptot.`,
                            R`$y' = 1 - \frac{1}{x^2} = 0 \Rightarrow x = \pm1$: $y(-1) = -2$ (yerel max), $y(1) = 2$ (yerel min).`,
                            R`$|f|$ için: $Ox$'in altındaki parça eksene göre yansıtılır.`,
                        ], R`İki kollu eğri: sağda $(1, 2)$ çukurlu, solda $(-1, -2)$ tepeli; mutlak değerlisi iki “U” kolu.`),
                        ex(R`$y = e^{\frac{x + 1}{x}}$ eğrisini çiziniz.`, [
                            R`$T = \mathbb{R}\setminus\{0\}$; $\lim\limits_{x\to0^+} = +\infty$, $\lim\limits_{x\to0^-} = 0$ → $x = 0$ düşey; $\lim\limits_{x\to\pm\infty} = e$ → $y = e$ yatay.`,
                            R`$y' = e^{\frac{x + 1}{x}}\left(-\frac{1}{x^2}\right) < 0$: her aralıkta azalan.`,
                        ], R`Sol kol $e$'den $0$'a iner, sağ kol $+\infty$'dan $e$'ye iner.`),
                        ex(R`$y = \sqrt{x^2 - 2x - 3}$ ve $y = \ln\dfrac{x - 1}{x + 1}$ eğrilerini çiziniz.`, [
                            R`Kök: $T = (-\infty, -1]\cup[3, \infty)$, eğik asimptot $y = |x - 1|$; $y' = \frac{x - 1}{\sqrt{x^2 - 2x - 3}}$: solda azalan, sağda artan.`,
                            R`Logaritma: $T = \mathbb{R}\setminus[-1, 1]$, $y = 0$ yatay, $x = \pm1$ düşey asimptot; $y' = \frac{2}{x^2 - 1} > 0$: artan; eksenleri kesmez.`,
                        ], R`Grafikler aşağıdaki araçta.`),
                        widget("graph", "Kitaptaki eğriler", "Her eğri için tabloyla grafiği karşılaştır: tepe, çukur ve asimptotları bul.", {
                            presets: [
                                { label: "x⁴ − 8x²", fns: [{ expr: "x^4-8x^2", label: "y" }], view: { xmin: -4, xmax: 4, ymin: -20, ymax: 15 } },
                                { label: "(x² − 4)/(x + 1)²", fns: [{ expr: "(x^2-4)/(x^2+2x+1)", label: "y" }], view: { xmin: -9, xmax: 6, ymin: -8, ymax: 4 } },
                                { label: "x + 1/x", fns: [{ expr: "x+1/x", label: "y" }, { expr: "abs(x+1/x)", label: "|y|", dash: true }], view: { xmin: -5, xmax: 5, ymin: -6, ymax: 6 } },
                                { label: "e^((x+1)/x)", fns: [{ expr: "exp((x+1)/x)", label: "y" }], view: { xmin: -6, xmax: 6, ymin: -1, ymax: 10 } },
                                { label: "√(x² − 2x − 3)", fns: [{ expr: "sqrt(x^2-2x-3)", label: "y" }], view: { xmin: -5, xmax: 7, ymin: -1, ymax: 6 } },
                                { label: "ln((x − 1)/(x + 1))", fns: [{ expr: "ln((x-1)/(x+1))", label: "y" }], view: { xmin: -6, xmax: 6, ymin: -4, ymax: 4 } },
                            ],
                            height: 290,
                            extras: (pr, c, pi) => {
                                const A = Cl.orange;
                                return [
                                    [{ type: "point", x: -2, y: -16, color: Cl.green }, { type: "point", x: 2, y: -16, color: Cl.green }, { type: "point", x: 0, y: 0, color: Cl.red }],
                                    [{ type: "vline", x: -1, color: A, width: 1.5 }, { type: "hline", y: 1, color: A, width: 1.5 }, { type: "point", x: -4, y: 4 / 3, color: Cl.red, label: "(−4, 4/3)", labelPos: "nw" }],
                                    [{ type: "vline", x: 0, color: A, width: 1.5 }, { type: "fn", f: (x) => x, color: A, dash: true, width: 1.5, label: "y = x" }],
                                    [{ type: "vline", x: 0, color: A, width: 1.5 }, { type: "hline", y: Math.E, color: A, width: 1.5, label: "y = e" }],
                                    [{ type: "fn", f: (x) => Math.abs(x - 1), color: A, dash: true, width: 1.5, label: "y = |x − 1|" }],
                                    [{ type: "vline", x: -1, color: A, width: 1.5 }, { type: "vline", x: 1, color: A, width: 1.5 }, { type: "hline", y: 0, color: A, width: 1.5 }],
                                ][pi];
                            },
                        }),
                        quiz(R`$y = x^3 - 3x$ için değişim tablosunda $x = -1$'deki değer?`, ["2 (yerel max)", "−2 (yerel min)", "0", "Tanımsız"], 0, R`$f(-1) = -1 + 3 = 2$; $f'$, $+$'dan $-$'ye geçer.`),
                    ],
                },
            ],
        },

        /* =========================== 4.11 =========================== */
        {
            no: "4.11", title: "Parametrik Gösterimler", page: 204,
            lessons: [
                {
                    id: "parametrik-egriler", title: "Parametrik Eğriler: Çember, Elips, Sikloid, Astroid",
                    summary: "x = f(t), y = g(t): eğriyi hareketle tanımlamak.",
                    blocks: [
                        simple(R`Düzlemde hareket eden bir parçacığın yolunu $y = f(x)$ biçiminde yazmak her zaman mümkün değildir. Bunun yerine konumu zamana bağlarız: $x = f(t)$, $y = g(t)$. Böylece eğri üzerinde bir <b>yön</b> de tanımlanmış olur.`),
                        def("Parametrik denklemler", R`$f$ ve $g$ sürekli olmak üzere $x = f(t)$, $y = g(t)$, $a \le t \le b$ denklemleri bir eğri tanımlar. $(f(a), g(a))$ <b>başlangıç</b>, $(f(b), g(b))$ <b>bitim</b> noktasıdır.`),
                        ex(R`$x^2 + y^2 = 1$ çemberinin bir parametrik denklemini yazınız.`, [
                            R`$OP$'nin $Ox$ ile yaptığı açı $t$ ise $P = (\cos t, \sin t)$.`,
                        ], R`$x = \cos t$, $y = \sin t$, $0 \le t \le 2\pi$.`),
                        ex(R`$\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$ elipsinin parametrik gösterimini yazınız.`, [
                            R`$a$ yarıçaplı asal ve $b$ yarıçaplı yedek çember çizilir; $OQ$'nun açısı $t$ ise elips noktası $(a\cos t, b\sin t)$.`,
                        ], R`$x = a\cos t$, $y = b\sin t$, $0 \le t \le 2\pi$.`),
                        ex(R`Yatay bir doğru üzerinde kaymadan yuvarlanan $a$ yarıçaplı çember üzerindeki $P$ noktasının yörüngesini (sikloid) bulunuz.`, [
                            R`Başlangıçta $P$ orijinde; dönme açısı $t$. Kaymadan yuvarlanma: $|OQ| = \overset{\frown}{PQ} = at$.`,
                            R`$x = |OQ| - |PN| = at - a\sin t$, $y = |MQ| - |MN| = a - a\cos t$.`,
                        ], R`Sikloid: $x = a(t - \sin t)$, $y = a(1 - \cos t)$.`),
                        ex(R`$r$ yarıçaplı bir çember, $a = 4r$ yarıçaplı sabit çemberin içinde kaymadan yuvarlanıyor. Üzerindeki $P$ noktasının çizdiği eğriyi (astroid) bulunuz.`, [
                            R`Merkezler doğrusunun açısı $t$, küçük çemberin dönme açısı $\alpha$: yay eşitliği $4rt = \alpha r \Rightarrow \alpha = 4t$; $m(\widehat{LCP}) = \frac\pi2 - 3t$.`,
                            R`$x = 3r\cos t + r\cos3t = r(3\cos t + 4\cos^3t - 3\cos t) = 4r\cos^3t$.`,
                            R`$y = 3r\sin t - r\sin3t = 4r\sin^3t$.`,
                        ], R`Astroid: $x = a\cos^3t$, $y = a\sin^3t$; kartezyen denklemi $x^{2/3} + y^{2/3} = a^{2/3}$.`),
                        warn(R`Kitapta astroidin kartezyen denklemine geçerken $\left(\frac xa\right)^{2/3} = \cos^2t$, $\left(\frac ya\right)^{2/3} = \sin^2t$ olmalıyken üsler $\frac32$ yazılmış; toplayınca $\left(\frac xa\right)^{2/3} + \left(\frac ya\right)^{2/3} = 1$ çıkar.`),
                        widget("graph", "Parametrik eğri çizici", "t'yi kaydır: nokta eğri üzerinde ilerler ve geride bıraktığı iz çizilir. Yeşil kesikli doğru o andaki teğet (eğim ẏ/ẋ).", {
                            presets: [
                                { label: "Çember", fns: [], view: { xmin: -2, xmax: 2, ymin: -1.5, ymax: 1.5 } },
                                { label: "Elips (a = 3, b = 2)", fns: [], view: { xmin: -4, xmax: 4, ymin: -3, ymax: 3 } },
                                { label: "Sikloid (a = 1)", fns: [], view: { xmin: -0.5, xmax: 13, ymin: -1, ymax: 4 } },
                                { label: "Astroid (a = 2)", fns: [], view: { xmin: -3, xmax: 3, ymin: -2.3, ymax: 2.3 } },
                            ],
                            params: { t: { min: 0.01, max: 6.28, step: 0.01, value: 2, label: "t" } },
                            equal: true, height: 290,
                            extras: (pr, c, pi) => {
                                const curves = [
                                    [(t) => Math.cos(t), (t) => Math.sin(t)],
                                    [(t) => 3 * Math.cos(t), (t) => 2 * Math.sin(t)],
                                    [(t) => 2 * t - Math.sin(2 * t), (t) => 1 - Math.cos(2 * t)],
                                    [(t) => 2 * Math.cos(t) ** 3, (t) => 2 * Math.sin(t) ** 3],
                                ];
                                const [X, Y] = curves[pi], t = pr.t, x = X(t), y = Y(t);
                                const dx = num(X, t), dy = num(Y, t);
                                const items = [
                                    { type: "param", x: X, y: Y, t0: 0, t1: 2 * Math.PI, color: Cl.gray, width: 1.5, dash: [4, 4] },
                                    { type: "param", x: X, y: Y, t0: 0, t1: t, color: Cl.blue, width: 3 },
                                    { type: "point", x, y, color: Cl.pink },
                                ];
                                if (Math.abs(dx) > 1e-4) items.push({ type: "fn", f: (u) => y + (dy / dx) * (u - x), color: Cl.green, dash: true, width: 1.8, xmin: x - 1.5, xmax: x + 1.5 });
                                return items;
                            },
                            readout: (pr, c, h) => ["x = cos t, y = sin t", "x = 3cos t, y = 2sin t", "x = 2t − sin 2t, y = 1 − cos 2t (t yerine 2t ile iki kemer)", "x = 2cos³t, y = 2sin³t"][h.presetIndex] + ` · t = ${F(pr.t, 2)}`,
                        }),
                        quiz(R`$x = 2\cos t$, $y = 2\sin t$ hangi eğridir?`, ["2 yarıçaplı çember", "Elips", "Sikloid", "Doğru"], 0, R`$x^2 + y^2 = 4$.`),
                        quiz(R`$x = t$, $y = t^2$ parametrik eğrisi hangisidir?`, [R`$y = x^2$ parabolü`, "Çember", R`$y = \sqrt x$`, "Doğru"], 0, R`$t = x$ yaz.`),
                    ],
                },
            ],
        },
    ];

    global.CHAPTERS = global.CHAPTERS || {};
    global.CHAPTERS["turev-uygulamalari"] = {
        no: 4, id: "turev-uygulamalari", title: "Türevin Uygulamaları",
        intro: "Teğet ve normal, hız–ivme ve marjinal kavramlar; artan-azalan fonksiyonlar, ekstremumlar ve optimizasyon; Rolle ve ortalama değer teoremleri, konvekslik, L'Hospital kuralı, diferansiyel, asimptotlar ve eğri çizimi, parametrik eğriler.",
        sections,
    };
})(window);
