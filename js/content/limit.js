/*
 * Bölüm 2 - Limit ve Süreklilik (Matematik 1, Mustafa Balcı, s. 81-111)
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

    // Parçalı fonksiyonları sgn ile yaz: x > c için A, x < c için B
    const piece = (c, right, left) => `(1+sgn(x-(${c})))/2*(${right})+(1-sgn(x-(${c})))/2*(${left})`;

    const sections = [
        /* =========================== 2.1 =========================== */
        {
            no: "2.1", title: "Limit", page: 81,
            lessons: [
                {
                    id: "limit-nedir", title: "Limit Nedir?",
                    summary: "x bir sayıya yaklaşırken f(x) neye yaklaşıyor?",
                    blocks: [
                        simple(R`Limit bir <b>tahmin oyunu</b>dur: $x$'i $a$'ya <b>gittikçe yaklaştırırız</b> (ama $a$'ya hiç eşit yapmayız) ve $f(x)$ değerlerinin hangi sayıya yaklaştığına bakarız. O sayıya limit denir: $\lim\limits_{x\to a} f(x) = L$.`),
                        p(R`Kitaptaki ilk örnek: $f(x) = 2x + 1$ için $x$'i 2'ye yaklaştıralım.`),
                        table(R`<table class="mtable"><tr><th>$x$</th><td>1,9</td><td>1,99</td><td>1,999</td><td>→ 2 ←</td><td>2,001</td><td>2,01</td><td>2,1</td></tr>
                            <tr><th>$f(x)$</th><td>4,8</td><td>4,98</td><td>4,998</td><td>→ 5 ←</td><td>5,002</td><td>5,02</td><td>5,2</td></tr></table>`),
                        p(R`$x$ 2'ye yaklaştıkça $f(x)$ 5'e yaklaşıyor: $\lim\limits_{x\to 2}(2x + 1) = 5$.`),
                        widget("approach", "Yaklaşma laboratuvarı", "h kaydırıcısını büyüt: pembe (soldan) ve yeşil (sağdan) noktalar a'ya yaklaşır. Tablo ve grafikte f(x)'in neye yaklaştığını izle.", {
                            presets: [
                                { tex: "2x+1,\\ a=2", label: "y = 2x + 1", expr: "2x+1", a: 2, view: { xmin: -1, xmax: 4, ymin: -1, ymax: 9 }, note: "İki taraftan da 5'e yaklaşıyor → <b>limit 5</b>. Burada f(2) = 5 de, ama bu şart değil (sonraki örneğe bak)." },
                                { tex: "\\frac{x^2-1}{x-1},\\ a=1", label: "y = (x² − 1)/(x − 1)", expr: "(x^2-1)/(x-1)", a: 1, view: { xmin: -2, xmax: 4, ymin: -1, ymax: 5 }, holes: [[1, 2]], note: "x = 1'de fonksiyon <b>tanımsız</b> (0/0), grafikte boşluk var. Yine de değerler 2'ye yaklaşıyor → <b>limit 2</b>. Limit, a noktasındaki değere değil, <b>çevresine</b> bakar!" },
                                { tex: "\\frac{x}{|x|},\\ a=0", label: "y = x/|x|", expr: "x/abs(x)", a: 0, view: { xmin: -3, xmax: 3, ymin: -2, ymax: 2 }, holes: [[0, 1], [0, -1]], note: "Soldan −1'e, sağdan 1'e yaklaşıyor. İki taraf farklı → <b>limit yok</b>." },
                                { tex: "\\frac{\\sin x}{x},\\ a=0", label: "y = sin x / x", expr: "sin(x)/x", a: 0, view: { xmin: -8, xmax: 8, ymin: -0.6, ymax: 1.4 }, holes: [[0, 1]], note: "0'da tanımsız ama iki taraftan da 1'e yaklaşıyor → <b>limit 1</b> (2.3'te ispatı var)." },
                            ],
                        }),
                        tip(R`Limit sorusu “$f(a)$ kaç?” değil, “$a$'nın <b>hemen yanında</b> $f$ ne yapıyor?” sorusudur. Bu yüzden $f(a)$ tanımsız olsa bile limit olabilir.`, "Altın kural"),
                        quiz(R`$\lim\limits_{x\to 3}(x^2 + 1)$ kaçtır?`, ["10", "9", "7", "Yoktur"], 0, R`Polinomlarda limit = o noktadaki değer: $9 + 1 = 10$.`),
                        quiz(R`$f(2)$ tanımsız ise $\lim\limits_{x\to 2} f(x)$ için hangisi doğrudur?`, ["Kesinlikle yoktur", "Var olabilir", "0'dır", "Sonsuzdur"], 1, R`Limit $a$'nın çevresine bakar. Örnek: $\frac{x^2-4}{x-2}$, $x = 2$'de tanımsız ama limiti 4.`),
                    ],
                },
                {
                    id: "epsilon-delta", title: "ε–δ Tanımı",
                    summary: "“Yeterince yakın” sözünü kesinleştirmek.",
                    blocks: [
                        simple(R`“$f(x)$, $L$'ye yaklaşır” sözünü kesin yapmak için bir oyun oynarız: Rakibin bir tolerans verir: <b>$\varepsilon$</b> (“$f(x)$, $L$'den en fazla bu kadar uzak olsun”). Sen de bir <b>$\delta$</b> bulursun (“$x$'i $a$'dan en fazla bu kadar uzak tut”). Her $\varepsilon$ için bir $\delta$ bulabiliyorsan limit $L$'dir.`),
                        def("Tanım", R`$A \subset \mathbb{R}$, $f: A \to \mathbb{R}$ ve $a$, $A$'nın bir yığılma noktası olsun. Her $\varepsilon > 0$ için
                            $$0 < |x - a| < \delta \;\Longrightarrow\; |f(x) - L| < \varepsilon$$
                            olacak şekilde bir $\delta > 0$ bulunabiliyorsa, $x$, $a$'ya yaklaştığında $f$'nin limiti $L$'dir: $\lim\limits_{x\to a} f(x) = L$.`),
                        widget("epsdelta", "Epsilon–delta oyunu", "ε'u değiştir: turuncu bant (y ekseni toleransı) daralınca, eğrinin bu bantta kalması için gereken yeşil bant (δ) da daralır.", {
                            presets: [
                                { tex: "3x+1,\\ a=2", expr: "3x+1", a: 2, L: 7, view: { xmin: 0, xmax: 4, ymin: 4, ymax: 10 }, rule: (e) => `\\delta = \\frac{\\varepsilon}{3} = ${F(e / 3, 4).replace("−", "-")}` },
                                { tex: "\\sqrt{x},\\ a=4", expr: "sqrt(x)", a: 4, L: 2, view: { xmin: -0.5, xmax: 10, ymin: 0, ymax: 3.6 } },
                                { tex: "x^2+3x,\\ a=1", expr: "x^2+3x", a: 1, L: 4, view: { xmin: -1, xmax: 3, ymin: 1, ymax: 7 } },
                                { tex: "\\frac{x^2-1}{x-1},\\ a=1", expr: "(x^2-1)/(x-1)", a: 1, L: 2, hole: true, view: { xmin: -1, xmax: 3, ymin: 0, ymax: 4 }, rule: (e) => `\\delta = \\varepsilon = ${F(e, 4)}` },
                            ],
                        }),
                        ex(R`$f(x) = \sqrt x$, $a = 4$, $L = 2$, $\varepsilon = 1$ olsun. $0 < |x - 4| < \delta$ olduğunda $|f(x) - L| < \varepsilon$ kalacak şekilde bir $\delta$ bulunuz.`, [
                            R`Bant $1 < \sqrt x < 3$. Uç noktalar: $\sqrt x = 3 \Rightarrow x_1 = 9$; $\sqrt x = 1 \Rightarrow x_2 = 1$.`,
                            R`4'ten uzaklıklar: $|9 - 4| = 5$, $|1 - 4| = 3$. Simetrik bir aralık için küçüğü seçilir.`,
                        ], R`$\delta = \min\{5, 3\} = 3$: $0 < |x - 4| < 3$ için $|\sqrt x - 2| < 1$.`),
                        ex(R`$\lim\limits_{x\to 2}(3x + 1) = 7$ olduğunu gösteriniz.`, [
                            R`$|3x + 1 - 7| < \varepsilon \iff |3x - 6| < \varepsilon \iff 3|x - 2| < \varepsilon \iff |x - 2| < \frac\varepsilon3$.`,
                        ], R`$\delta = \frac\varepsilon3$ (ya da daha küçüğü) seçilirse tanım sağlanır.`),
                        ex(R`$\lim\limits_{x\to 1}(x^2 + 3x) = 4$ olduğunu gösteriniz.`, [
                            R`$|x^2 + 3x - 4| = |x + 4|\,|x - 1|$. $|x + 4|$'ü sınırlamamız gerek.`,
                            R`$|x - 1| < 1$ varsayalım: $0 < x < 2 \Rightarrow 4 < x + 4 < 6$, yani $|x + 4| < 6$.`,
                            R`O zaman $|x^2 + 3x - 4| < 6|x - 1| < \varepsilon$ için $|x - 1| < \frac\varepsilon6$ yeter.`,
                        ], R`$\delta = \min\left\{1, \frac\varepsilon6\right\}$.`),
                        tip(R`Doğrusal $f(x) = mx + n$ için kural hep aynı: $\delta = \frac{\varepsilon}{|m|}$. Eğim ne kadar büyükse, $\delta$ o kadar küçük olmalı.`),
                        quiz(R`$\lim\limits_{x\to 1}(5x - 2) = 3$ için ε–δ tanımında hangi δ yeter?`, [R`$\frac\varepsilon5$`, R`$5\varepsilon$`, R`$\varepsilon - 5$`, R`$\frac\varepsilon2$`], 0, R`$|5x - 5| = 5|x - 1| < \varepsilon \iff |x - 1| < \frac\varepsilon5$.`),
                    ],
                },
                {
                    id: "limit-kurallari", title: "Limit Kuralları ve Sadeleştirme",
                    summary: "Toplam, çarpım, bölüm; 0/0 belirsizliği.",
                    blocks: [
                        simple(R`Limitler sayılarla işlem gibi davranır: toplamın limiti limitlerin toplamı, çarpımın limiti limitlerin çarpımıdır. Polinomlarda limit almak = <b>$x$ yerine $a$ yazmak</b>. Yazınca $\frac00$ çıkarsa: <b>sadeleştir</b>, sonra yaz.`),
                        def("Teorem 2.1", R`$\lim\limits_{x\to a} f(x)$ ve $\lim\limits_{x\to a} g(x)$ limitleri varsa:
                            <ol>
                                <li>$\lim\limits_{x\to a}(\alpha f)(x) = \alpha\lim\limits_{x\to a} f(x)$</li>
                                <li>$\lim\limits_{x\to a}(f + g)(x) = \lim\limits_{x\to a} f(x) + \lim\limits_{x\to a} g(x)$</li>
                                <li>$\lim\limits_{x\to a}(f\cdot g)(x) = \lim\limits_{x\to a} f(x)\cdot\lim\limits_{x\to a} g(x)$</li>
                                <li>$\lim\limits_{x\to a} g(x) \neq 0$ ise $\lim\limits_{x\to a}\dfrac{f(x)}{g(x)} = \dfrac{\lim f(x)}{\lim g(x)}$</li>
                            </ol>
                            Ayrıca $\lim\limits_{x\to a} c = c$, $\lim\limits_{x\to a} x = a$ ve bir $P$ polinomu için $\lim\limits_{x\to a} P(x) = P(a)$.`),
                        ex(R`$\lim\limits_{x\to 2}(5x^3 - 8x^2 + x - 4)$ limitini hesaplayınız.`, [
                            R`Polinom: $x = 2$ yaz. $5\cdot8 - 8\cdot4 + 2 - 4$.`,
                        ], R`$40 - 32 + 2 - 4 = 6$.`),
                        ex(R`$\lim\limits_{x\to 1}\dfrac{x^3 + 2x^2 - 3x}{x^2 - 1}$ limitini hesaplayınız.`, [
                            R`$x = 1$ yazınca $\frac{0}{0}$ çıkıyor: belirsiz. Çarpanlara ayıralım.`,
                            R`Pay: $x(x^2 + 2x - 3) = x(x - 1)(x + 3)$. Payda: $(x - 1)(x + 1)$.`,
                            R`$x \neq 1$ olduğundan $(x - 1)$'ler sadeleşir: $\dfrac{x(x + 3)}{x + 1}$.`,
                            R`Şimdi $x = 1$ yaz: $\dfrac{1\cdot4}{2}$.`,
                        ], R`$2$.`),
                        formula("0/0 çıkınca ne yapılır?", R`<ul>
                            <li><b>Çarpanlara ayır</b> ve ortak çarpanı sadeleştir.</li>
                            <li><b>Köklü ifadede eşleniğiyle çarp:</b> $\sqrt A - B$ ise $\sqrt A + B$ ile çarp-böl.</li>
                            <li><b>Trigonometride</b> $\lim\limits_{x\to0}\frac{\sin x}{x} = 1$ kullan (2.3).</li>
                        </ul>`),
                        ex(R`$\lim\limits_{x\to 0}\dfrac{\sqrt{x + 4} - 2}{x}$ limitini hesaplayınız.`, [
                            R`$\frac00$ belirsizliği. Eşlenikle çarp: $\dfrac{(\sqrt{x+4} - 2)(\sqrt{x+4} + 2)}{x(\sqrt{x+4} + 2)} = \dfrac{x + 4 - 4}{x(\sqrt{x+4} + 2)}$.`,
                            R`$x$'ler sadeleşir: $\dfrac{1}{\sqrt{x + 4} + 2}$.`,
                        ], R`$\dfrac{1}{2 + 2} = \dfrac14$.`),
                        widget("approach", "Sadeleştirmeyi doğrula", "Sadeleştirilen ifadenin limitinin, değerlerin gerçekten yaklaştığı sayı olduğunu tablodan kontrol et.", {
                            presets: [
                                { tex: "\\frac{x^3+2x^2-3x}{x^2-1}", label: "f", expr: "(x^3+2x^2-3x)/(x^2-1)", a: 1, view: { xmin: -0.5, xmax: 3, ymin: -1, ymax: 5 }, holes: [[1, 2]], note: "Değerler 2'ye yaklaşıyor ✓" },
                                { tex: "\\frac{\\sqrt{x+4}-2}{x}", label: "f", expr: "(sqrt(x+4)-2)/x", a: 0, view: { xmin: -4, xmax: 6, ymin: 0, ymax: 0.6 }, holes: [[0, 0.25]], note: "Değerler 0,25 = 1/4'e yaklaşıyor ✓" },
                            ],
                        }),
                        quiz(R`$\lim\limits_{x\to 3}\dfrac{x^2 - 9}{x - 3}$ kaçtır?`, ["6", "0", "3", "Yoktur"], 0, R`$\frac{(x-3)(x+3)}{x-3} = x + 3 \to 6$.`),
                        quiz(R`$\lim\limits_{t\to 9}\dfrac{3 - \sqrt t}{9 - t}$ kaçtır?`, [R`$\frac16$`, R`$-\frac16$`, "0", "6"], 0, R`$9 - t = (3 - \sqrt t)(3 + \sqrt t)$ → $\frac{1}{3 + \sqrt t} \to \frac16$.`),
                    ],
                },
            ],
        },

        /* =========================== 2.2 =========================== */
        {
            no: "2.2", title: "Sağ ve Sol Taraflı Limitler", page: 86,
            lessons: [
                {
                    id: "sag-sol-limit", title: "Sağdan ve Soldan Limit",
                    summary: "İki yönden yaklaşınca aynı yere varıyor muyuz?",
                    blocks: [
                        simple(R`$a$'ya iki yoldan gelinir: <b>soldan</b> (küçük sayılardan, $x \to a^-$) ve <b>sağdan</b> (büyük sayılardan, $x \to a^+$). Limitin var olması için iki yolun <b>aynı yere</b> çıkması gerekir.`),
                        def("Tanım", R`$\forall\varepsilon > 0$ için $a - \delta < x < a$ olduğunda $|f(x) - L_1| < \varepsilon$ kalacak bir $\delta > 0$ varsa $L_1$, $f$'nin $a$'daki <b>sol taraflı limiti</b>dir: $\lim\limits_{x\to a^-} f(x) = L_1$.<br>
                            $a < x < a + \delta$ için aynısı sağlanıyorsa $L_2$ <b>sağ taraflı limit</b>tir: $\lim\limits_{x\to a^+} f(x) = L_2$.`),
                        formula("Limitin var olma şartı", R`$$\lim_{x\to a^+} f(x) = \lim_{x\to a^-} f(x) = L \iff \lim_{x\to a} f(x) = L$$`),
                        ex(R`$f(x) = \dfrac{x}{|x|}$ fonksiyonunun $x = 0$'daki sağ ve sol limitlerini bulunuz.`, [
                            R`$x > 0$ için $|x| = x$: $\lim\limits_{x\to0^+}\frac xx = 1$.`,
                            R`$x < 0$ için $|x| = -x$: $\lim\limits_{x\to0^-}\frac{x}{-x} = -1$.`,
                        ], R`Sağ limit 1, sol limit −1. Farklı olduklarından $x = 0$'da limit yoktur.`),
                        ex(R`$f(x) = \begin{cases} x^2 - 2x + 3, & x \ge 1 \\ -x^2 + 2x - 2, & x < 1\end{cases}$ fonksiyonunun $x = 1$'deki sağ ve sol limitlerini bulunuz.`, [
                            R`Sağdan ($x \ge 1$ kuralı): $1 - 2 + 3 = 2$.`,
                            R`Soldan ($x < 1$ kuralı): $-1 + 2 - 2 = -1$.`,
                        ], R`Sağ limit 2, sol limit −1: limit yok.`),
                        ex(R`$f(x) = x - \llbracket x \rrbracket$ fonksiyonunun $x = 2$ ve $x = \frac32$'deki limitlerini bulunuz.`, [
                            R`2'nin hemen sağında $\llbracket x \rrbracket = 2$: $\lim\limits_{x\to2^+} = 2 - 2 = 0$.`,
                            R`2'nin hemen solunda $\llbracket x \rrbracket = 1$: $\lim\limits_{x\to2^-} = 2 - 1 = 1$. Farklı → limit yok.`,
                            R`$\frac32$'nin iki yanında da $\llbracket x \rrbracket = 1$: iki taraf da $\frac32 - 1 = \frac12$.`,
                        ], R`$x = 2$'de limit yok; $\lim\limits_{x\to 3/2}(x - \llbracket x \rrbracket) = \frac12$.`),
                        widget("approach", "Sağdan–soldan", "Parçalı fonksiyonlarda iki tarafın farklı yere gittiğini gör.", {
                            presets: [
                                { tex: "x - \\llbracket x \\rrbracket,\\ a=2", label: "y = x − ⟦x⟧", expr: "x-[x]", a: 2, view: { xmin: -1, xmax: 4, ymin: -0.5, ymax: 1.5 }, holes: [[2, 1]], dots: [[2, 0]], note: "Soldan 1, sağdan 0 → <b>limit yok</b> (sıçrama)." },
                                { tex: "\\text{parçalı},\\ a=1", label: "f", expr: piece(1, "x^2-2x+3", "-x^2+2x-2"), a: 1, view: { xmin: -1, xmax: 3, ymin: -3, ymax: 4 }, holes: [[1, -1]], dots: [[1, 2]], note: "Soldan −1, sağdan 2 → <b>limit yok</b>." },
                                { tex: "\\llbracket x^5 \\rrbracket,\\ a=2", label: "y = ⟦x⁵⟧", expr: "[x^5]", a: 2, view: { xmin: 1.9, xmax: 2.1, ymin: 24, ymax: 40 }, note: "Soldan 31, sağdan 32 → limit yok (Problem 6)." },
                            ],
                        }),
                        tip(R`$f$ yalnızca $[a, b]$'de tanımlıysa uç noktalarda sadece bir taraftan yaklaşılabilir: $\lim\limits_{x\to b} f(x) = \lim\limits_{x\to b^-} f(x)$ ve $\lim\limits_{x\to a} f(x) = \lim\limits_{x\to a^+} f(x)$.`, "Uç noktalar"),
                        quiz(R`$\lim\limits_{x\to 0^-}\dfrac{|x|}{x}$ kaçtır?`, ["−1", "1", "0", "Yoktur"], 0, R`$x < 0$ için $|x| = -x$ → $-1$.`),
                        quiz(R`$\lim\limits_{x\to 3^+}\llbracket x \rrbracket$ kaçtır?`, ["3", "2", "4", "Yoktur"], 0, R`3'ün hemen sağında $\llbracket x \rrbracket = 3$. (Soldan 2 olurdu.)`),
                    ],
                },
                {
                    id: "sonsuzda-limit", title: "Sonsuzda Limit",
                    summary: "x çok büyüdükçe f(x) neye yaklaşıyor?",
                    blocks: [
                        simple(R`$x \to \infty$ demek “$x$'i <b>istediğimiz kadar büyütelim</b>” demektir. Grafik sağa doğru bir yatay doğruya ($y = L$) yapışıyorsa limit $L$'dir. Rasyonel ifadelerde kural basit: <b>en büyük kuvvetler yarışır</b>.`),
                        def("Tanım", R`$\lim\limits_{x\to\infty} f(x) = L \iff \forall\varepsilon > 0$ için $\exists M$, öyle ki her $x > M$ için $|f(x) - L| < \varepsilon$.<br>
                            $x \to -\infty$ için: $\forall\varepsilon > 0$ için $\exists N$, her $x < N$ için $|f(x) - L| < \varepsilon$.`),
                        ex(R`$\lim\limits_{x\to\infty}\dfrac{x + 4}{x} = 1$ olduğunu gösteriniz.`, [
                            R`$\left|\frac{x + 4}{x} - 1\right| = \frac{4}{|x|} < \varepsilon \iff |x| > \frac4\varepsilon$.`,
                        ], R`$M = \frac4\varepsilon$ alınırsa $x > M$ için fark $\varepsilon$'dan küçük kalır.`),
                        formula("Rasyonel fonksiyonlarda sonsuzda limit", R`$$\lim_{x\to\infty}\frac{a_nx^n + \cdots + a_0}{b_mx^m + \cdots + b_0} = \begin{cases} 0, & n < m \\ \dfrac{a_n}{b_m}, & n = m \\ \operatorname{sgn}\left(\dfrac{a_n}{b_m}\right)\cdot\infty, & n > m\end{cases}$$
                            Yöntem: pay ve paydayı en büyük kuvvet parantezine al; $\frac{1}{x^k} \to 0$ olur.`),
                        ex(R`$\lim\limits_{x\to\infty}\dfrac{3x^2 - 4x + 5}{2x^2 + x - 1}$ limitini hesaplayınız.`, [
                            R`$x^2$ parantezine al: $\dfrac{x^2(3 - \frac4x + \frac5{x^2})}{x^2(2 + \frac1x - \frac1{x^2})}$.`,
                            R`$x^2$'ler sadeleşir; $\frac{1}{x}, \frac{1}{x^2} \to 0$: $\dfrac{3 - 0 + 0}{2 + 0 - 0}$.`,
                        ], R`$\dfrac32$ (dereceler eşit → baş katsayıların oranı).`),
                        ex(R`$\lim\limits_{x\to\infty}\left(\sqrt{x^2 + x} - x\right)$ limitini hesaplayınız.`, [
                            R`$\infty - \infty$ belirsizliği. Eşlenikle çarp: $\dfrac{x^2 + x - x^2}{\sqrt{x^2 + x} + x} = \dfrac{x}{\sqrt{x^2 + x} + x}$.`,
                            R`$\sqrt{x^2 + x} = |x|\sqrt{1 + \frac1x} = x\sqrt{1 + \frac1x}$ ($x > 0$): $\dfrac{1}{\sqrt{1 + \frac1x} + 1}$.`,
                        ], R`$\dfrac{1}{1 + 1} = \dfrac12$. (Ama $x \to -\infty$ için ifade $+\infty$'a gider.)`),
                        widget("graph", "Yatay asimptot", "Grafiği sağa doğru izle: eğri kesikli doğruya yapışıyor mu? Tablodaki kural ile karşılaştır.", {
                            presets: [
                                { label: "(3x²−4x+5)/(2x²+x−1)", fns: [{ expr: "(3x^2-4x+5)/(2x^2+x-1)", label: "f" }, { expr: "1.5", dash: true, color: Cl.orange, width: 1.6, trace: false, label: "y = 3/2" }], view: { xmin: -2, xmax: 30, ymin: -2, ymax: 4 } },
                                { label: "(2x+5)/(4x²+8x+1)", fns: [{ expr: "(2x+5)/(4x^2+8x+1)", label: "f" }, { expr: "0", dash: true, color: Cl.orange, width: 1.6, trace: false }], view: { xmin: -30, xmax: 30, ymin: -1, ymax: 1.5 } },
                                { label: "√(x²+x) − x", fns: [{ expr: "sqrt(x^2+x)-x", label: "f" }, { expr: "0.5", dash: true, color: Cl.orange, width: 1.6, trace: false, label: "y = 1/2" }], view: { xmin: -6, xmax: 40, ymin: -1, ymax: 3 } },
                            ],
                            view: { xmin: -2, xmax: 30, ymin: -2, ymax: 4 }, height: 260,
                            readout: (pr, c, h) => ["Pay ve payda 2. derece → limit 3/2.", "Pay 1., payda 2. derece → limit 0.", "Sağa doğru 1/2'ye yaklaşıyor; sola doğru büyüyor."][h.presetIndex],
                        }),
                        ex(R`Hangi $x$'ler için $\left|\dfrac{2x^2}{x^2 + 1} - 2\right| < \dfrac{1}{85}$ olur?`, [
                            R`$\left|\frac{2x^2 - 2x^2 - 2}{x^2 + 1}\right| = \frac{2}{x^2 + 1} < \frac{1}{85} \iff x^2 + 1 > 170$.`,
                        ], R`$x^2 > 169 \iff x < -13$ veya $x > 13$.`),
                        quiz(R`$\lim\limits_{x\to\infty}\dfrac{5x^3 - 1}{2x^3 + 7x}$ kaçtır?`, [R`$\frac52$`, "0", R`$\infty$`, R`$-\frac17$`], 0, R`Dereceler eşit: $\frac52$.`),
                        quiz(R`$\lim\limits_{x\to\infty}\dfrac{x}{\llbracket x \rrbracket}$ kaçtır?`, ["1", "0", R`$\infty$`, "Yoktur"], 0, R`$x = \llbracket x \rrbracket + k$, $0 \le k < 1$: $1 + \frac{k}{\llbracket x \rrbracket} \to 1$.`),
                    ],
                },
                {
                    id: "sonsuz-limit-sandvic", title: "Sonsuz Limit ve Sandviç Teoremi",
                    summary: "Sınırsız büyüme; iki fonksiyon arasına sıkıştırma.",
                    blocks: [
                        simple(R`Bazen $x \to a$ iken $f(x)$ bir sayıya yaklaşmaz, <b>sınırsız büyür</b>: o zaman $\lim f(x) = +\infty$ yazarız (grafikte dikey asimptot). <b>Sandviç teoremi</b> ise şöyle der: iki fonksiyon aynı sayıya gidiyorsa, aralarına sıkışan fonksiyon da oraya gitmek <b>zorundadır</b>.`),
                        def("Sonsuz limit", R`$\lim\limits_{x\to a} f(x) = +\infty \iff$ her $B > 0$ için $\exists\delta > 0$, öyle ki $0 < |x - a| < \delta$ olan tüm $x$'ler için $f(x) > B$.<br>
                            $-\infty$ benzer şekilde: her $K$ için $f(x) < K$. Sağ ve sol taraflı sonsuz limitler de aynı yolla tanımlanır.`),
                        ex(R`$\lim\limits_{x\to1^+}\dfrac{4}{x - 1}$ ve $\lim\limits_{x\to1^-}\dfrac{4}{x - 1}$ limitlerini hesaplayınız.`, [
                            R`$x > 1$: payda küçük pozitif → $\frac{4}{x - 1} > B \iff x - 1 < \frac4B$. $\delta = \frac4B$ seçilebilir: $+\infty$.`,
                            R`$x < 1$: payda küçük negatif → değerler $-\infty$'a gider.`,
                        ], R`$\lim\limits_{x\to1^+} = +\infty$, $\lim\limits_{x\to1^-} = -\infty$. $x = 1$ dikey asimptottur.`),
                        def("Teorem 2.2 — Sandviç Teoremi", R`$a$'nın bir delinmiş komşuluğundaki her $x$ için $g(x) \le f(x) \le h(x)$ ve
                            $$\lim_{x\to a} g(x) = \lim_{x\to a} h(x) = L$$
                            ise $\lim\limits_{x\to a} f(x) = L$'dir. (Tek taraflı limitler için de geçerlidir.)`),
                        ex(R`$\lim\limits_{x\to0} x\sin\dfrac1x$ limitini hesaplayınız.`, [
                            R`$\sin\frac1x$ ne yaptığı belirsiz (salınır) ama $|\sin\frac1x| \le 1$.`,
                            R`Buradan $\left|x\sin\frac1x\right| \le |x|$, yani $-|x| \le x\sin\frac1x \le |x|$.`,
                            R`$\lim\limits_{x\to0}(-|x|) = \lim\limits_{x\to0}|x| = 0$.`,
                        ], R`Sandviç: $\lim\limits_{x\to0} x\sin\frac1x = 0$.`),
                        widget("graph", "Sandviç", "Pembe eğri, mavi kesikli sınırların arasına sıkışmış. x → 0'da sınırlar 0'a gittiği için o da 0'a gider. Yakınlaştır (+) ve izle!", {
                            presets: [
                                { label: "x·sin(1/x)", fns: [{ expr: "abs(x)", dash: true, color: Cl.blue, width: 1.8, trace: false, label: "|x|" }, { expr: "-abs(x)", dash: true, color: Cl.blue, width: 1.8, trace: false, label: "−|x|" }, { expr: "x*sin(1/x)", color: Cl.pink, width: 2.4, label: "x sin(1/x)" }], view: { xmin: -1, xmax: 1, ymin: -1, ymax: 1 } },
                                { label: "x²·sin(1/x)", fns: [{ expr: "x^2", dash: true, color: Cl.blue, width: 1.8, trace: false, label: "x²" }, { expr: "-x^2", dash: true, color: Cl.blue, width: 1.8, trace: false }, { expr: "x^2*sin(1/x)", color: Cl.pink, width: 2.4 }], view: { xmin: -1, xmax: 1, ymin: -1, ymax: 1 } },
                                { label: "4/(x−1)", fns: [{ expr: "4/(x-1)", color: Cl.pink, width: 2.6, label: "4/(x−1)" }], view: { xmin: -3, xmax: 5, ymin: -10, ymax: 10 } },
                            ],
                            view: { xmin: -1, xmax: 1, ymin: -1, ymax: 1 }, height: 280,
                            extras: (pr, c, pi) => (pi === 2 ? [{ type: "vline", x: 1, color: Cl.orange, width: 1.6, label: "x = 1 (dikey asimptot)" }] : []),
                            readout: (pr, c, h) => ["−|x| ≤ x sin(1/x) ≤ |x| ve iki sınır da 0'a gider → limit 0.", "−x² ≤ x² sin(1/x) ≤ x² → limit 0 (Problem 16a).", "x → 1⁺: +∞, x → 1⁻: −∞ (görünüm için − tuşuyla uzaklaş)."][h.presetIndex],
                        }),
                        quiz(R`$\lim\limits_{x\to0^+}\dfrac1x$ nedir?`, [R`$+\infty$`, R`$-\infty$`, "0", "1"], 0, R`Küçük pozitif sayıya bölmek çok büyük pozitif sayı verir.`),
                        quiz(R`$\lim\limits_{x\to0} x^2\cos\dfrac{1}{\sqrt[3]{x}}$ kaçtır?`, ["0", "1", "Yoktur", R`$\infty$`], 0, R`$-x^2 \le x^2\cos(\ldots) \le x^2$, sandviç ile 0.`),
                    ],
                },
            ],
        },

        /* =========================== 2.3 =========================== */
        {
            no: "2.3", title: "Bazı Trigonometrik Limitler", page: 93,
            lessons: [
                {
                    id: "sinx-bolu-x", title: "sin x / x → 1",
                    summary: "Trigonometrik limitlerin anahtarı.",
                    blocks: [
                        simple(R`Çok küçük açılarda (radyan) <b>$\sin x \approx x$</b>'tir. Bu yüzden $\frac{\sin x}{x} \to 1$. Trigonometrik limitlerin neredeyse hepsi bu tek bilgiyle çözülür: ifadeyi $\frac{\sin(\text{şey})}{\text{şey}}$ kalıbına benzet.`),
                        p(R`Birim çemberde $0 < \theta < \frac\pi2$ için alanları karşılaştıralım: $\text{Alan}(\triangle BOH) < \text{Alan}(\text{BOA dilimi}) < \text{Alan}(\triangle COA)$:
                            $$\frac12\cos\theta\sin\theta < \frac12\theta < \frac12\tan\theta$$
                            2 ile çarpıp $\sin\theta$'ya bölünce $\cos\theta < \dfrac{\theta}{\sin\theta} < \dfrac{1}{\cos\theta}$. İki uç da 1'e gittiğinden (sandviç!) ortadaki de 1'e gider.`),
                        formula("Temel trigonometrik limitler", R`$$\lim_{x\to0}\frac{\sin x}{x} = 1, \qquad \lim_{x\to0}\frac{\tan x}{x} = 1, \qquad \lim_{x\to0}\frac{\sin ax}{\sin bx} = \frac ab$$
                            $$\lim_{x\to0}\frac{1 - \cos x}{x^2} = \frac12 \qquad (\text{çünkü } 1 - \cos x = 2\sin^2\tfrac x2)$$`),
                        widget("graph", "sin x ≈ x", "0'ın yakınında sin x ile y = x neredeyse aynı. Oranları (yeşil) 1'e yaklaşıyor.", {
                            fns: [{ expr: "x", dash: true, color: Cl.gray, width: 1.8, label: "y = x", trace: false }, { expr: "sin(x)", color: Cl.blue, label: "sin x" }, { expr: "sin(x)/x", color: Cl.green, label: "sin x / x" }],
                            view: { xmin: -7, xmax: 7, ymin: -2, ymax: 2 }, height: 270,
                            extras: () => [{ type: "point", x: 0, y: 1, color: Cl.green, open: true, label: "(0, 1)" }],
                        }),
                        ex(R`$\lim\limits_{x\to0}\dfrac{\sin ax}{\sin bx} = \dfrac ab$ olduğunu gösteriniz.`, [
                            R`$\dfrac{\sin ax}{\sin bx} = \dfrac{\frac{\sin ax}{ax}\cdot ax}{\frac{\sin bx}{bx}\cdot bx} = \dfrac ab\cdot\dfrac{\frac{\sin ax}{ax}}{\frac{\sin bx}{bx}}$.`,
                            R`$x \to 0$ iken $ax \to 0$ ve $bx \to 0$: kesirler 1'e gider.`,
                        ], R`$\dfrac ab\cdot\dfrac11 = \dfrac ab$.`),
                        ex(R`$\lim\limits_{x\to\infty} x\sin\dfrac3x$ limitini hesaplayınız.`, [
                            R`$\frac3x = \theta$ de: $x \to \infty$ iken $\theta \to 0$, $x = \frac3\theta$.`,
                            R`$\lim\limits_{\theta\to0}\frac3\theta\sin\theta = 3\lim\limits_{\theta\to0}\frac{\sin\theta}{\theta}$.`,
                        ], R`$3$.`),
                        ex(R`$\lim\limits_{x\to0}\dfrac{1 - \cos2x}{x^2}$ limitini hesaplayınız.`, [
                            R`$1 - \cos2x = 2\sin^2x$: $\dfrac{2\sin^2x}{x^2} = 2\cdot\dfrac{\sin x}{x}\cdot\dfrac{\sin x}{x}$.`,
                        ], R`$2\cdot1\cdot1 = 2$.`),
                        warn(R`Bu limitler <b>radyan</b> için geçerlidir. Derece kullansaydık $\lim\limits_{x\to0}\frac{\sin x^\circ}{x} = \frac{\pi}{180}$ çıkardı.`),
                        quiz(R`$\lim\limits_{x\to0}\dfrac{\tan3x}{\tan5x}$ kaçtır?`, [R`$\frac35$`, R`$\frac53$`, "1", "0"], 0, R`$\tan kx \approx kx$: $\frac{3x}{5x}$.`),
                        quiz(R`$\lim\limits_{x\to0}\dfrac{(\sin3x)^2}{x^2\cos x}$ kaçtır?`, ["9", "3", "1", "0"], 0, R`$\left(\frac{\sin3x}{x}\right)^2\cdot\frac{1}{\cos x} \to 3^2\cdot1$.`),
                        quiz(R`$\lim\limits_{x\to2}\dfrac{\sin(x^2 - 4)}{x - 2}$ kaçtır?`, ["4", "1", "0", "2"], 0, R`$\frac{\sin(x^2-4)}{x^2-4}\cdot(x + 2) \to 1\cdot4$.`),
                    ],
                },
                {
                    id: "e-limiti", title: "Üstel Limitler ve e Sayısı",
                    summary: "(1 + 1/x)^x → e",
                    blocks: [
                        simple(R`Bankada %100 faiz düşün: yılda bir kez eklenirse paran 2 katına çıkar. Faizi yılda $x$ kez, $\frac1x$'er parça eklersen paran $\left(1 + \frac1x\right)^x$ katına çıkar. $x$ büyüdükçe bu sayı sonsuza gitmez; <b>$e \approx 2{,}718$</b>'e yaklaşır.`),
                        formula("Limit alma kuralları", R`<ol>
                            <li>$a > 1$ için $\lim\limits_{x\to\infty}a^x = +\infty$, $\lim\limits_{x\to-\infty}a^x = 0$</li>
                            <li>$0 < a < 1$ için $\lim\limits_{x\to\infty}a^x = 0$, $\lim\limits_{x\to-\infty}a^x = +\infty$</li>
                            <li>$\lim\limits_{x\to a}[f(x)]^n = \left[\lim\limits_{x\to a}f(x)\right]^n$</li>
                            <li>$\lim\limits_{x\to a}\sqrt[n]{f(x)} = \sqrt[n]{\lim\limits_{x\to a}f(x)}$ ($n$ çiftse $f \ge 0$)</li>
                            <li>$\lim\limits_{x\to a}f(x) = 0$ ve $g$, $a$ civarında <b>sınırlı</b> ise $\lim\limits_{x\to a}f(x)g(x) = 0$</li>
                            <li>$\lim u(x) = 0$, $\lim v(x) = +\infty$ ve $\lim u(x)v(x) = \lambda$ ise $\lim\,[1 + u(x)]^{v(x)} = e^\lambda$</li>
                        </ol>`),
                        widget("graph", "e'ye yaklaşma", "Kural 6'nın grafiği: (1 + a/x)^x eğrisi sağa doğru e^a'ya yapışıyor. a'yı değiştir.", {
                            fns: [{ expr: "(1+a/x)^x", label: "(1 + a/x)^x" }, { expr: "e^a", dash: true, color: Cl.orange, width: 1.6, trace: false, label: "y = eᵃ" }],
                            params: { a: { min: 1, max: 3, step: 1, value: 1 } },
                            view: { xmin: -1, xmax: 40, ymin: -1, ymax: 22 }, height: 260,
                            readout: (pr) => `${T(`\\lim_{x\\to\\infty}\\left(1 + \\frac{${pr.a}}{x}\\right)^x = e^{${pr.a}} \\approx ${F(Math.exp(pr.a), 4)}`)} &nbsp; (x = 1000 için ${F(Math.pow(1 + pr.a / 1000, 1000), 4)})`,
                        }),
                        ex(R`$\lim\limits_{x\to\infty}\left(1 + \dfrac1x\right)^x$ limitini hesaplayınız.`, [
                            R`$u(x) = \frac1x \to 0$, $v(x) = x \to \infty$, $u(x)v(x) = 1$.`,
                        ], R`Kural 6: $e^1 = e$.`),
                        ex(R`$\lim\limits_{x\to0}(1 + 3x)^{1/x}$ limitini hesaplayınız.`, [
                            R`$\frac1x = t$ de: $x \to 0^+$ iken $t \to \infty$. İfade $\left(1 + \frac3t\right)^t$.`,
                            R`$u = \frac3t \to 0$, $v = t$, $uv = 3$.`,
                        ], R`$e^3$.`),
                        ex(R`$\lim\limits_{x\to\infty}\left(\dfrac{x^2 + 2x + 3}{x^2 + 4}\right)^{2x + 3}$ limitini hesaplayınız.`, [
                            R`$\frac{x^2 + 2x + 3}{x^2 + 4} = 1 + \frac{2x - 1}{x^2 + 4}$: $u = \frac{2x - 1}{x^2 + 4} \to 0$.`,
                            R`$v = 2x + 3 \to \infty$; $uv = \frac{(2x - 1)(2x + 3)}{x^2 + 4} \to 4$.`,
                        ], R`$e^4$.`),
                        ex(R`$\lim\limits_{x\to\infty}\left[\left(\dfrac12\right)^{-x} + \dfrac3x\right]$ limitini hesaplayınız.`, [
                            R`$\left(\frac12\right)^{-x} = 2^x \to +\infty$; $\frac3x \to 0$.`,
                        ], R`$+\infty$.`),
                        quiz(R`$\lim\limits_{x\to\infty}\left(\dfrac{x + 2}{x}\right)^{x+1}$ kaçtır?`, [R`$e^2$`, R`$e$`, "1", R`$\infty$`], 0, R`$u = \frac2x$, $v = x + 1$, $uv \to 2$.`),
                        quiz(R`$\lim\limits_{x\to-\infty}3^x$ kaçtır?`, ["0", R`$\infty$`, "1", "3"], 0, R`$3^{-1000} = \frac{1}{3^{1000}}$ çok küçük.`),
                    ],
                },
            ],
        },

        /* =========================== 2.4 =========================== */
        {
            no: "2.4", title: "Süreklilik", page: 100,
            lessons: [
                {
                    id: "sureklilik-tanim", title: "Süreklilik Nedir?",
                    summary: "Kalemi kaldırmadan çizilebilen grafik.",
                    blocks: [
                        simple(R`Bir fonksiyon bir noktada <b>süreklidir</b>, eğer grafiği oradan <b>kalemi kaldırmadan</b> geçiyorsa. Matematik diliyle: o noktadaki <b>limit</b>, o noktadaki <b>değere</b> eşit.`),
                        def("Tanım", R`$A \subset \mathbb{R}$, $f: A \to \mathbb{R}$ ve $a \in A$ olsun.
                            $$\lim_{x\to a} f(x) = f(a)$$
                            ise $f$, $a$ noktasında <b>süreklidir</b>. $A$'nın her noktasında sürekliyse $f$, $A$ üzerinde süreklidir.<br>
                            Eşdeğer ε–δ tanımı: her $\varepsilon > 0$ için bir $\delta > 0$ vardır öyle ki $|x - a| < \delta$ olan her $x \in A$ için $|f(x) - f(a)| < \varepsilon$.`),
                        formula("Üç şart", R`$f$'nin $a$'da sürekli olması için:
                            <ol><li>$f(a)$ <b>tanımlı</b> olmalı,</li><li>$\lim\limits_{x\to a}f(x)$ <b>var</b> olmalı,</li><li>ikisi <b>eşit</b> olmalı.</li></ol>`),
                        widget("graph", "Üç durum", "Kitaptaki üç durum: limit yok / limit var ama f(a)'dan farklı / limit = f(a).", {
                            presets: [
                                { label: "(1) limit yok", view: { xmin: -1, xmax: 3, ymin: -0.5, ymax: 4 }, fns: [{ expr: piece(1, "x^2/4+2.5", "x/2+0.5"), label: "f" }] },
                                { label: "(2) lim ≠ f(a)", fns: [{ expr: "x^2/4+1.75", label: "f" }] },
                                { label: "(3) sürekli", fns: [{ expr: "x^2/4+1.75", label: "f" }] },
                            ],
                            view: { xmin: -1, xmax: 3, ymin: -0.5, ymax: 4 }, height: 250,
                            extras: (pr, c, pi) => [
                                [{ type: "point", x: 1, y: 1, color: Cl.blue, open: true }, { type: "point", x: 1, y: 2.75, color: Cl.blue }],
                                [{ type: "point", x: 1, y: 2, color: Cl.blue, open: true }, { type: "point", x: 1, y: 3.2, color: Cl.red, label: "f(1)" }],
                                [{ type: "point", x: 1, y: 2, color: Cl.green, label: "f(1) = limit" }],
                            ][pi],
                            readout: (pr, c, h) => [
                                `<span class="bad">Soldan 1'e, sağdan 2,75'e gidiyor: limit yok → süreksiz.</span>`,
                                `<span class="bad">Limit 2 var ama f(1) = 3,2 ≠ 2 → süreksiz.</span> (f(1)'i 2 yapsak sürekli olurdu.)`,
                                `<span class="good">lim f(x) = f(1) = 2 → sürekli.</span>`,
                            ][h.presetIndex],
                        }),
                        ex(R`$f(x) = \begin{cases} -x^2, & x < 0 \\ 0, & x = 0 \\ x + 1, & x > 0\end{cases}$ fonksiyonunun $x = 0$'daki sürekliliğini inceleyiniz.`, [
                            R`Sağdan: $\lim\limits_{x\to0^+}(x + 1) = 1$. Soldan: $\lim\limits_{x\to0^-}(-x^2) = 0$.`,
                            R`Sağ ve sol limitler farklı: limit yok.`,
                        ], R`$f$, $x = 0$'da sürekli değildir.`),
                        ex(R`$f(x) = \sin x$ fonksiyonunun her yerde sürekli olduğunu gösteriniz.`, [
                            R`Dönüşüm formülü: $\sin x - \sin a = 2\sin\frac{x - a}{2}\cos\frac{x + a}{2}$.`,
                            R`$|\sin u| \le |u|$ ve $|\cos v| \le 1$: $|\sin x - \sin a| \le 2\cdot\frac{|x - a|}{2}\cdot1 = |x - a|$.`,
                        ], R`$\delta = \varepsilon$ seçilir: sinüs her $a$'da süreklidir.`),
                        def("Teorem 2.4", R`$f$ ve $g$, $a$'da sürekli ve $c \in \mathbb{R}$ ise $|f|$, $f^2$, $cf$, $f + g$, $f - g$ ve $f\cdot g$ de $a$'da süreklidir. Ayrıca $g(a) \neq 0$ ise $\frac fg$ de $a$'da süreklidir.`),
                        def("Teorem 2.5 — Bileşke", R`$f$, $a$'da ve $g$, $f(a)$'da sürekli ise $g\circ f$, $a$'da süreklidir.`),
                        tip(R`Bu teoremler sayesinde <b>polinomlar her yerde</b>, rasyonel fonksiyonlar <b>paydanın sıfır olmadığı her yerde</b>, $\sin, \cos, e^x$ <b>her yerde</b> süreklidir. Süreksizlik ararken yalnızca “şüpheli” noktalara bak: paydanın sıfırları, parçalı fonksiyonların ek yerleri, tam kısmın tam sayıları.`, "Pratik kural"),
                        ex(R`$f(x) = \dfrac{x^3 + 3x}{x^2 - 1}$ hangi noktalarda süreksizdir?`, [
                            R`Pay ve payda polinom: her yerde sürekli. Tek sorun payda sıfır olunca.`,
                            R`$x^2 - 1 = 0 \Rightarrow x = \pm1$.`,
                        ], R`$x = -1$ ve $x = 1$'de süreksiz (parçalı sürekli fonksiyon).`),
                        quiz(R`$f(x) = \llbracket x \rrbracket + 2x$ nerelerde süreksizdir?`, ["Tam sayılarda", "Hiçbir yerde", "Yalnızca 0'da", "Her yerde"], 0, R`$\llbracket x \rrbracket$'in tam sayılarda limiti yok.`),
                        quiz(R`$g(x) = \begin{cases}\frac{x^2-4}{x-2}, & x \ne 2 \\ m, & x = 2\end{cases}$ her yerde sürekli ise $m$ kaçtır?`, ["4", "2", "0", "Hiçbir değer"], 0, R`$\lim\limits_{x\to2}(x + 2) = 4 = g(2)$ olmalı.`),
                    ],
                },
                {
                    id: "sureksizlik-turleri", title: "Süreksizlik Türleri",
                    summary: "Kaldırılabilir, sıçrama, sonsuz.",
                    blocks: [
                        simple(R`Grafik üç farklı şekilde kopabilir: <b>bir delik</b> (kaldırılabilir: tek noktayı düzeltince geçer), <b>bir basamak</b> (sıçrama: iki taraf farklı yükseklikte) ve <b>bir uçurum</b> (sonsuz: grafik ±∞'a fırlar).`),
                        def("Süreksizlik çeşitleri", R`$f$, $a$'da süreksiz olsun.
                            <ol>
                                <li>$\lim\limits_{x\to a}f(x)$ var ama $f(a)$'dan farklı ya da $f(a)$ tanımsız: <b>kaldırılabilir süreksizlik</b>. $f(a)$ limit değeri olarak tanımlanırsa fonksiyon sürekli olur.</li>
                                <li>Sağ ve sol limitler var ama farklı: <b>sıçrama süreksizliği</b>. $J = \left|\lim\limits_{x\to a^+}f(x) - \lim\limits_{x\to a^-}f(x)\right|$ sayısına <b>sıçrama</b> denir.</li>
                                <li>Sağ ve sol limitlerden en az biri $\pm\infty$ ya da yok: <b>sonsuz süreksizlik</b>.</li>
                            </ol>`),
                        widget("graph", "Süreksizlik galerisi", "Her türü seç ve grafiğe bak. Grafik çizicide de dene!", {
                            presets: [
                                { label: "Kaldırılabilir", fns: [{ expr: "(x^2-1)/(x-1)", label: "(x²−1)/(x−1)" }], view: { xmin: -2, xmax: 4, ymin: -1, ymax: 5 } },
                                { label: "Sıçrama", fns: [{ expr: "x/abs(x)", label: "x/|x|" }], view: { xmin: -3, xmax: 3, ymin: -2, ymax: 2 } },
                                { label: "Sonsuz", fns: [{ expr: "1/(x-1)^2", label: "1/(x−1)²" }], view: { xmin: -2, xmax: 4, ymin: -1, ymax: 8 } },
                                { label: "Salınım", fns: [{ expr: "sin(1/x)", label: "sin(1/x)" }], view: { xmin: -1, xmax: 1, ymin: -1.5, ymax: 1.5 } },
                            ],
                            view: { xmin: -2, xmax: 4, ymin: -1, ymax: 5 }, height: 260,
                            extras: (pr, c, pi) => [
                                [{ type: "point", x: 1, y: 2, color: Cl.blue, open: true, label: "delik" }],
                                [{ type: "point", x: 0, y: 1, color: Cl.blue, open: true }, { type: "point", x: 0, y: -1, color: Cl.blue, open: true }, { type: "seg", x1: 0.08, y1: -1, x2: 0.08, y2: 1, color: Cl.pink, width: 2, label: "J = 2", labelOffset: [26, 0] }],
                                [{ type: "vline", x: 1, color: Cl.orange, width: 1.4 }],
                                [],
                            ][pi],
                            readout: (pr, c, h) => [
                                "x = 1'de limit 2 var, f(1) tanımsız → <b>kaldırılabilir</b>. f(1) = 2 tanımlanırsa sürekli olur.",
                                "Sağdan 1, soldan −1 → <b>sıçrama</b>, J = |1 − (−1)| = 2.",
                                "x → 1 iken +∞ → <b>sonsuz süreksizlik</b> (dikey asimptot).",
                                "0'a yaklaştıkça −1 ile 1 arasında sonsuz kez salınır; limit yok (Problem 14). Yakınlaştırarak bak!",
                            ][h.presetIndex],
                        }),
                        def("Tek taraflı süreklilik — Teorem 2.3", R`$\lim\limits_{x\to a^+}f(x) = f(a)$ ise $f$, $a$'da <b>sağdan sürekli</b>; $\lim\limits_{x\to a^-}f(x) = f(a)$ ise <b>soldan sürekli</b>dir.<br>Bir fonksiyon bir noktada ancak ve ancak <b>hem sağdan hem soldan</b> sürekliyse o noktada süreklidir.`),
                        ex(R`$f(x) = \begin{cases} x^2 + 1, & x \ge 1 \\ 2x - x^2, & x < 1\end{cases}$ fonksiyonunun $x = 1$'deki sürekliliğini inceleyiniz.`, [
                            R`Sağdan: $\lim\limits_{x\to1^+}(x^2 + 1) = 2 = f(1)$: sağdan sürekli.`,
                            R`Soldan: $\lim\limits_{x\to1^-}(2x - x^2) = 1 \neq 2$: soldan süreksiz.`,
                        ], R`$x = 1$'de sürekli değil (sıçrama, $J = 1$).`),
                        def("Parçalı sürekli fonksiyon", R`Sonlu sayıda süreksizlik noktası olan fonksiyona <b>parçalı sürekli</b> fonksiyon denir.`),
                        ex(R`$u = \dfrac{1}{x - 1}$ olmak üzere $f(u) = \dfrac{1}{u^2 + u - 2}$ fonksiyonunun süreksizlik noktalarını bulunuz.`, [
                            R`$u$, $x = 1$'de süreksiz.`,
                            R`$f(u)$, $u^2 + u - 2 = 0$ iken süreksiz: $u = -2$ veya $u = 1$.`,
                            R`$\frac{1}{x - 1} = -2 \Rightarrow x = \frac12$; $\;\frac{1}{x - 1} = 1 \Rightarrow x = 2$.`,
                        ], R`Süreksizlik noktaları: $x = \frac12,\ 1,\ 2$.`),
                        quiz(R`$f(x) = \dfrac{x^3 - 1}{x^2 - 1}$ fonksiyonunun $x = 1$'deki süreksizliği hangi türdendir?`, ["Kaldırılabilir", "Sıçrama", "Sonsuz", "Süreklidir"], 0, R`$\frac{(x-1)(x^2+x+1)}{(x-1)(x+1)} \to \frac32$: limit var, $f(1)$ tanımsız.`),
                        quiz(R`$\arctan\dfrac{1}{x - 3}$ fonksiyonunun $x = 3$'teki sıçrama miktarı nedir?`, [R`$\pi$`, R`$\frac\pi2$`, "0", R`$2\pi$`], 0, R`Sağdan $\frac\pi2$, soldan $-\frac\pi2$: $J = \pi$.`),
                    ],
                },
            ],
        },

        /* =========================== 2.5 =========================== */
        {
            no: "2.5", title: "Kapalı Aralıkta Sürekli Fonksiyonlar", page: 105,
            lessons: [
                {
                    id: "ara-deger-bolzano", title: "Ara Değer ve Bolzano Teoremi",
                    summary: "Sürekli fonksiyon arada hiçbir değeri atlamaz.",
                    blocks: [
                        simple(R`Sabah 10°C, öğlen 20°C ise arada bir an <b>tam 15°C</b> olmuş olmalı — sıcaklık “zıplayamaz”. Sürekli fonksiyonlar da böyle: $f(a)$ ile $f(b)$ arasındaki <b>her değeri</b> en az bir kez alırlar. Özellikle işaret değiştiriyorsa arada bir <b>kök</b> vardır.`),
                        p(R`$f$, $(a, b)$'nin her noktasında sürekli, $a$'da sağdan ve $b$'de soldan sürekli ise $f$, $[a, b]$ <b>kapalı aralığında süreklidir</b>.`),
                        def("Teorem 2.6 — Ara Değer Teoremi", R`$f$, $[a, b]$'de sürekli ve $p$, $f(a)$ ile $f(b)$ arasında herhangi bir sayı ise $[a, b]$'de $f(c) = p$ olacak şekilde en az bir $c$ noktası vardır.`),
                        def("Teorem 2.7 — Bolzano Teoremi", R`$f$, $[a, b]$'de sürekli ve $f(a)$ ile $f(b)$ zıt işaretli ($f(a)\cdot f(b) < 0$) ise $a$ ile $b$ arasında $f(c) = 0$ olacak şekilde en az bir $c$ vardır.`),
                        widget("bisection", "Kök avı (ikiye bölme)", "İşaret değişen aralığı her adımda ikiye böl: kök bu yolla istenen hassasiyetle bulunur. Hesap makineleri de böyle çalışır!", {
                            presets: [
                                { tex: "x^3+x^2-1,\\ [0,1]", expr: "x^3+x^2-1", I: [0, 1], view: { xmin: -1, xmax: 2, ymin: -2, ymax: 3 } },
                                { tex: "x^2-5,\\ [2,3]", expr: "x^2-5", I: [2, 3], view: { xmin: 0, xmax: 4, ymin: -6, ymax: 8 } },
                                { tex: "x^6+2x-2,\\ [0,1]", expr: "x^6+2x-2", I: [0, 1], view: { xmin: -2, xmax: 1.5, ymin: -4, ymax: 6 } },
                                { tex: "\\cos x - x,\\ [0,1]", expr: "cos(x)-x", I: [0, 1], view: { xmin: -1, xmax: 2, ymin: -2, ymax: 2 } },
                            ],
                        }),
                        ex(R`$x^3 + x^2 - 1 = 0$ denkleminin 0 ile 1 arasında bir köke sahip olduğunu gösteriniz.`, [
                            R`$f(x) = x^3 + x^2 - 1$ polinom → $[0, 1]$'de sürekli.`,
                            R`$f(0) = -1 < 0$, $f(1) = 1 > 0$: zıt işaretli.`,
                        ], R`Bolzano: $0 < c < 1$ ve $c^3 + c^2 - 1 = 0$ olan bir $c$ vardır.`),
                        warn(R`Süreklilik şartı <b>vazgeçilmezdir</b>. $f(x) = \begin{cases} x + 2, & 0 \le x \le 3 \\ x - 2, & -3 \le x < 0\end{cases}$ için $f(-3) = -5$, $f(3) = 5$ ama $f$, $-2 \le p < 2$ değerlerini hiç almaz (örneğin $f(c) = 1$ olamaz) — çünkü 0'da sürekli değil. Benzer şekilde $\frac1x$, $-1$ ile $1$ arasında hiç 0 olmaz.`, "Şart önemli"),
                        quiz(R`$f$, $[1, 4]$'te sürekli, $f(1) = -3$, $f(4) = 5$. Hangisi <b>kesinlikle</b> doğrudur?`, ["(1, 4) aralığında f'nin bir kökü vardır", "f(2) = 0", "f artandır", "f'nin tam bir kökü vardır"], 0, R`Bolzano yalnızca “en az bir” kök garanti eder; yerini ya da sayısını söylemez.`),
                    ],
                },
                {
                    id: "ekstremum", title: "En Büyük ve En Küçük Değer",
                    summary: "Kapalı aralıkta sürekli fonksiyon sınırlıdır.",
                    blocks: [
                        simple(R`Kapalı bir aralıkta sürekli bir fonksiyonun grafiği, iki ucu sabitlenmiş bir ip gibidir: sonsuza kaçamaz. Bu yüzden mutlaka bir <b>en yüksek</b> ve bir <b>en alçak</b> noktası vardır.`),
                        def("Teorem — Sınırlılık", R`$f: [a, b] \to \mathbb{R}$ sürekli ise sınırlıdır: her $x \in [a, b]$ için $m \le f(x) \le M$ olacak şekilde $m$ ve $M$ sayıları vardır.`),
                        def("Yerel ve mutlak ekstremum", R`$|x - c| < \delta$ şartını sağlayan her $x$ için $f(x) \le f(c)$ olacak bir $\delta > 0$ varsa $f$, $c$'de <b>yerel maksimuma</b>; $f(x) \ge f(d)$ ise $d$'de <b>yerel minimuma</b> sahiptir (bunlara <b>ekstremum</b> denir).<br>
                            Tüm tanım kümesinde $f(x) \le f(p)$ ise $f(p)$ <b>mutlak maksimum</b> (en büyük değer), $f(x) \ge f(r)$ ise $f(r)$ <b>mutlak minimum</b> (en küçük değer)dur.`),
                        tip(R`Her mutlak maksimum aynı zamanda yerel maksimumdur, tersi doğru değildir. Yerel ekstremumlar birden fazla olabilir; mutlak maksimum ve minimum <b>değerleri</b> (varsa) tektir.`),
                        def("Teorem 2.8", R`$f: [a, b] \to \mathbb{R}$ sürekli ve yerel ekstremumlarını $(a, b)$ içindeki $c_1, c_2, \ldots, c_n$ noktalarında alıyor olsun.
                            $$f(a),\ f(c_1),\ \ldots,\ f(c_n),\ f(b)$$
                            sayılarının en büyüğü mutlak maksimum, en küçüğü mutlak minimum değerdir. <b>Uç noktaları unutma!</b>`),
                        ex(R`$f(x) = \begin{cases} -x, & -3 \le x < -1 \\ x + 2, & -1 \le x < 0 \\ 2(x - 1)^2, & 0 \le x \le 3\end{cases}$ fonksiyonunun yerel ve mutlak ekstremum değerlerini bulunuz.`, [
                            R`Parçalar ek yerlerinde birleşiyor ($f(-1) = 1$, $f(0) = 2$): $[-3, 3]$'te sürekli.`,
                            R`Yerel ekstremumlar: $x = -1$'de yerel minimum ($f = 1$), $x = 0$'da yerel maksimum ($f = 2$), $x = 1$'de yerel minimum ($f = 0$).`,
                            R`Uçlar: $f(-3) = 3$, $f(3) = 2\cdot4 = 8$.`,
                            R`Karşılaştır: $\{3, 1, 2, 0, 8\}$.`,
                        ], R`Mutlak minimum $f(1) = 0$, mutlak maksimum $f(3) = 8$: her $x \in [-3, 3]$ için $0 \le f(x) \le 8$.`),
                        widget("graph", "Ekstremum avı", "Kitaptaki parçalı fonksiyon. Yeşil: mutlak min, kırmızı: mutlak max, turuncu: yerel ekstremumlar.", {
                            fns: [{ expr: `${piece(-1, piece(0, "2(x-1)^2", "x+2"), "-x")}`, label: "f", xmin: -3, xmax: 3 }],
                            view: { xmin: -4, xmax: 4, ymin: -1, ymax: 9 }, height: 270,
                            extras: () => [
                                { type: "point", x: -3, y: 3, color: Cl.gray, label: "f(−3) = 3", labelPos: "nw" },
                                { type: "point", x: -1, y: 1, color: Cl.orange, label: "yerel min", labelPos: "sw" },
                                { type: "point", x: 0, y: 2, color: Cl.orange, label: "yerel max", labelPos: "ne" },
                                { type: "point", x: 1, y: 0, color: Cl.green, label: "mutlak min", labelPos: "se" },
                                { type: "point", x: 3, y: 8, color: Cl.red, label: "mutlak max", labelPos: "nw" },
                            ],
                        }),
                        def("Teorem 2.9 — Ters fonksiyon", R`$f: [a, b] \to \mathbb{R}$ sürekli ve kesin artan, $f(a) = c$, $f(b) = d$ ise:
                            <ol><li>$f: [a, b] \to [c, d]$'nin $f^{-1}: [c, d] \to [a, b]$ tersi vardır,</li><li>$f^{-1}$, $[c, d]$'de kesin artandır,</li><li>$f^{-1}$, $[c, d]$'de süreklidir.</li></ol>`),
                        quiz(R`$f(x) = x^2$ fonksiyonunun $[-1, 2]$'deki mutlak maksimum değeri nedir?`, ["4", "1", "0", "2"], 0, R`Uçlar: $f(-1) = 1$, $f(2) = 4$; içte $f(0) = 0$ (min). En büyük: 4 — uç noktada!`),
                        quiz(R`$f(x) = \frac1x$ fonksiyonunun $(0, 1]$ aralığında en büyük değeri var mıdır?`, ["Yoktur", "1", "0", R`$\infty$`], 0, R`Aralık kapalı değil (0 dahil değil); $f$ sınırsız büyür. Teorem kapalı aralık ister.`),
                    ],
                },
            ],
        },
    ];

    global.CHAPTERS = global.CHAPTERS || {};
    global.CHAPTERS.limit = {
        no: 2, id: "limit", title: "Limit ve Süreklilik",
        intro: "Limit kavramı ve ε–δ tanımı, sağ-sol ve sonsuz limitler, trigonometrik ve üstel limitler, süreklilik ve kapalı aralıkta sürekli fonksiyonların özellikleri.",
        sections,
    };
})(window);
