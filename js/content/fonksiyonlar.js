/*
 * Bölüm 1 - Fonksiyonlar (Matematik 1, Mustafa Balcı, s. 35-80)
 * Her ders bir "blocks" listesinden oluşur; tipler app.js'deki renderBlock() içinde çizilir.
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

    const PI = Math.PI;

    const sections = [
        /* =========================== 1.1 =========================== */
        {
            no: "1.1", title: "Fonksiyon Kavramı", page: 35,
            lessons: [
                {
                    id: "fonksiyon-nedir", title: "Fonksiyon Nedir?",
                    summary: "Sayı giren, tek bir sonuç çıkan makine.",
                    blocks: [
                        simple(R`Fonksiyonu bir <b>makine</b> gibi düşün. Makineye bir sayı atarsın (<b>girdi</b>), makine kendi kuralına göre işler ve sana <b>tek bir</b> sonuç verir (<b>çıktı</b>). Örneğin “her sayıyı 2 ile çarp” makinesine 3 atarsan 6 çıkar.`),
                        p(R`Günlük hayatta da her yerde fonksiyon var: Bir dairenin alanı $A = \pi r^2$ yarıçapa bağlıdır; yarıçap değişince alan da değişir. Bir aracın gittiği yol, geçen zamana bağlıdır. <b>Bir şey değişince ona bağlı başka bir şeyin nasıl değiştiğini</b> anlatan kurala fonksiyon diyoruz.`),
                        widget("machine", "Fonksiyon makinesi", "Bir kural seç, x değerini ayarla ve makineye at. Çıkan her (x, f(x)) ikilisi aşağıda bir nokta olur — yeterince nokta koyunca grafiğin şekli ortaya çıkar.", {
                            rules: [
                                { tex: "f(x) = 2x", expr: "2x" },
                                { tex: "f(x) = x^2", expr: "x^2" },
                                { tex: "f(x) = x + 3", expr: "x+3" },
                                { tex: "f(x) = 3x - 1", expr: "3x-1" },
                            ],
                            view: { xmin: -5, xmax: 5, ymin: -14, ymax: 17 },
                        }),
                        def("Tanım", R`$A$ ve $B$ iki küme olsun. $A$'nın <b>her</b> elemanını $B$'nin <b>bir ve yalnız bir</b> elemanına eşleyen kurala $A$'dan $B$'ye bir <b>fonksiyon</b> denir ve
                            $$f : A \to B \quad\text{veya}\quad A \xrightarrow{\;f\;} B$$
                            biçiminde gösterilir.`),
                        p(R`Bu gösterimde:
                            <ul>
                                <li>$A$ kümesine <b>tanım kümesi</b>, $B$ kümesine <b>değer kümesi</b> denir.</li>
                                <li>$x$ elemanının gittiği yer $f(x)$ ile gösterilir; $f(x)$'e “$x$'in görüntüsü” denir.</li>
                                <li>$y = f(x)$ yazınca $x$'e <b>bağımsız değişken</b>, $y$'ye <b>bağımlı değişken</b> denir (çünkü $y$, $x$'e bağlı).</li>
                            </ul>
                            Örneğin “her sayıya 2 katını karşılık getir” kuralı $f(x) = 2x$ veya kısaca $y = 2x$ diye yazılır.`),
                        tip(R`İki altın kural:
                            <ol>
                                <li>$A$'da <b>boşta eleman kalmaz</b> — her girdinin bir çıktısı olmalı.</li>
                                <li>$A$'daki bir eleman <b>iki farklı yere gidemez</b> — bir girdinin tek çıktısı olur.</li>
                            </ol>
                            $B$'de ise boşta eleman kalabilir ve $B$'deki bir elemana birden çok ok gelebilir. Bunlar sorun değil.`, "Kısa yol"),
                        widget("mapping", "Fonksiyon mu, değil mi?", "Ok diyagramına bak ve karar ver. Cevapladıktan sonra kuralı bozan elemanlar kırmızı kesikli çizgiyle işaretlenir.", {
                            cases: [
                                { A: [1, 2, 3], B: ["a", "b", "c"], arrows: [[0, 0], [1, 1], [2, 1]], isFn: true, why: "A'daki her elemandan tam bir ok çıkıyor. b'ye iki ok gelmesi sorun değil." },
                                { A: [1, 2, 3], B: ["a", "b", "c"], arrows: [[0, 0], [0, 1], [1, 2], [2, 2]], isFn: false, why: "1 elemanı hem a'ya hem b'ye gidiyor. Bir girdinin iki çıktısı olamaz." },
                                { A: [1, 2, 3], B: ["a", "b"], arrows: [[0, 0], [1, 1]], isFn: false, why: "3 elemanı boşta kaldı. Tanım kümesindeki her eleman eşlenmeli." },
                                { A: [1, 2, 3, 4], B: ["a", "b", "c"], arrows: [[0, 2], [1, 2], [2, 2], [3, 2]], isFn: true, why: "Hepsi c'ye gidiyor ama her elemandan tam bir ok var. Bu bir sabit fonksiyon." },
                            ],
                        }),
                        ex(R`Bir karenin alanı, bir kenar uzunluğunun fonksiyonu mudur?`, [
                            R`Kenar uzunluğu $k$ olan karenin alanı $A = k^2$'dir.`,
                            R`Her $k$ için <b>bir ve yalnız bir</b> alan vardır: kenarı 3 olan karenin alanı mutlaka 9'dur, başka bir şey olamaz.`,
                        ], R`Evet. Alan, kenar uzunluğunun fonksiyonudur: $A(k) = k^2$.`),
                        ex(R`Bir dikdörtgenin alanı, çevresinin fonksiyonu mudur?`, [
                            R`Çevresi 40 cm olan iki dikdörtgen düşünelim: biri $4 \times 16$, diğeri $9 \times 11$.`,
                            R`Alanları: $4 \cdot 16 = 64$ cm² ve $9 \cdot 11 = 99$ cm².`,
                            R`Aynı girdiye (çevre = 40) iki farklı çıktı (64 ve 99) karşılık geldi.`,
                        ], R`Hayır, fonksiyon değildir. Bir çevreye birden çok alan karşılık gelebiliyor.`),
                        quiz(R`$f(x) = 3x + 1$ ise $f(2)$ kaçtır?`, ["5", "6", "7", "9"], 2, R`$x$ yerine 2 yaz: $f(2) = 3 \cdot 2 + 1 = 7$.`),
                        quiz(R`Bir $f: A \to B$ fonksiyonu için hangisi <b>her zaman</b> doğrudur?`, ["A'da boşta eleman kalabilir", "A'daki bir eleman B'de iki elemana gidebilir", "B'de boşta eleman kalabilir", "B'deki her elemana tek ok gelir"], 2, R`Fonksiyon sadece A için kural koyar: A'nın her elemanı tam bir yere gider. B'de boşta eleman kalabilir.`),
                    ],
                },
                {
                    id: "tanim-kumesi", title: "Tanım Kümesi Nasıl Bulunur?",
                    summary: "Makineye hangi sayıları atabiliriz?",
                    blocks: [
                        simple(R`Tanım kümesi, makinenin <b>bozulmadan çalıştığı</b> sayıların listesidir. Reel sayılarda iki büyük yasak vardır: <b>sıfıra bölme</b> ve <b>negatif sayının karekökü</b>. Bu yasaklara takılan sayıları çıkar; geriye kalan her şey tanım kümesidir.`),
                        def("Tanım", R`$A \subset \mathbb{R}$, $B \subset \mathbb{R}$ ve $f$, $A$'dan $B$'ye bir fonksiyon ise $f$'ye <b>reel değişkenli, reel değerli</b> fonksiyon denir. Kuralı verilen böyle bir fonksiyonun tanım kümesi, $f(x)$ ifadesini <b>reel sayı yapan</b> tüm $x$ noktalarının kümesidir.`),
                        formula("Kontrol listesi", R`<ul>
                            <li><b>Kesir varsa:</b> payda $\neq 0$ olmalı.</li>
                            <li><b>Çift dereceli kök varsa</b> ($\sqrt{\;\;}$, $\sqrt[4]{\;\;}$, …): kök içi $\geq 0$ olmalı.</li>
                            <li><b>Logaritma varsa:</b> içi $> 0$ olmalı (1.6'da göreceğiz).</li>
                            <li>Hiçbiri yoksa (ör. polinomlar): tanım kümesi tüm reel sayılar, $\mathbb{R}$.</li>
                        </ul>`),
                        ex(R`$f(x) = \sqrt{1 - x^2}$ fonksiyonunun tanım kümesini bulunuz.`, [
                            R`Karekökün içi negatif olamaz: $1 - x^2 \geq 0$.`,
                            R`Düzenleyelim: $x^2 \leq 1$.`,
                            R`Karesi 1'den büyük olmayan sayılar $-1$ ile $1$ arasındadır: $-1 \leq x \leq 1$.`,
                        ], R`Tanım kümesi $[-1, 1]$ kapalı aralığıdır.`),
                        widget("graph", "Tanım kümesini gör", "Mavi bant tanım kümesi. Bandın dışında grafik yok, çünkü orada kök içi negatif oluyor. Grafiğin üzerinde gezin (telefonda dokun) ve koordinatları gör.", {
                            fns: [{ expr: "sqrt(1-x^2)", label: "y = √(1 − x²)" }],
                            shade: [[-1, 1]],
                            view: { xmin: -2, xmax: 2, ymin: -0.8, ymax: 1.6 }, equal: true, height: 260,
                            extras: () => [
                                { type: "point", x: -1, y: 0, color: Cl.blue, label: "−1", labelPos: "sw" },
                                { type: "point", x: 1, y: 0, color: Cl.blue, label: "1", labelPos: "se" },
                            ],
                        }),
                        ex(R`$f(x) = \dfrac{x + 1}{x - 2}$ fonksiyonunun tanım kümesini bulunuz.`, [
                            R`Kesir var, payda sıfır olamaz: $x - 2 \neq 0$.`,
                            R`Buradan $x \neq 2$.`,
                        ], R`Tanım kümesi $\mathbb{R} \setminus \{2\}$, yani 2 hariç bütün reel sayılar.`),
                        quiz(R`$f(x) = \sqrt{x - 3}$ fonksiyonunun tanım kümesi hangisidir?`, [R`$x \geq 3$`, R`$x > 3$`, R`$x \leq 3$`, "Tüm reel sayılar"], 0, R`Kök içi $\geq 0$: $x - 3 \geq 0 \Rightarrow x \geq 3$. ($x = 3$ olabilir çünkü $\sqrt{0} = 0$.)`),
                        quiz(R`$f(x) = \dfrac{5}{x^2 - 4}$ hangi $x$ değerlerinde tanımsızdır?`, [R`$x = 4$`, R`$x = 2$ ve $x = -2$`, R`$x = 0$`, "Hiçbir yerde"], 1, R`Payda sıfır olamaz: $x^2 - 4 = 0 \Rightarrow x^2 = 4 \Rightarrow x = \pm 2$.`),
                    ],
                },
                {
                    id: "grafik-kokler", title: "Grafik ve Sıfır Yerleri",
                    summary: "Fonksiyonu resme dökmek ve köklerini bulmak.",
                    blocks: [
                        simple(R`Her girdi–çıktı ikilisini $(x,\, f(x))$ noktası olarak koordinat düzlemine işaretle. Bu noktaların <b>hepsi birlikte</b> fonksiyonun grafiğini oluşturur. Grafik, fonksiyonun “fotoğrafı”dır.`),
                        def("Grafik", R`$f: A \to B$ fonksiyonu için $\{(x, f(x)) : x \in A\}$ kümesine $f$'nin <b>grafiği</b> denir. Bu noktalar $xOy$ düzleminde işaretlenince grafik çizilmiş olur.`),
                        def("Sıfır yerleri (kökler)", R`$f(x) = 0$ eşitliğini sağlayan $x$ değerlerine fonksiyonun <b>sıfır yerleri</b> veya <b>kökleri</b> denir. Grafikte kökler, eğrinin <b>x-eksenini kestiği</b> noktalardır (çünkü orada $y = 0$).`),
                        ex(R`$f(x) = x^2 - 4$ fonksiyonunun sıfır yerlerini bulunuz.`, [
                            R`$f(x) = 0$ yazalım: $x^2 - 4 = 0$.`,
                            R`$x^2 = 4$.`,
                            R`Karesi 4 olan sayılar: $x = 2$ veya $x = -2$.`,
                        ], R`Kökler $-2$ ve $2$. Grafik x-eksenini tam bu noktalarda keser.`),
                        widget("graph", "Kökleri grafikte gör", "Kırmızı noktalar kökler: grafiğin x-eksenini kestiği yerler.", {
                            fns: [{ expr: "x^2-4", label: "y = x² − 4" }],
                            view: { xmin: -4, xmax: 4, ymin: -5, ymax: 5 }, height: 260,
                            extras: () => [
                                { type: "point", x: -2, y: 0, color: Cl.red, label: "x = −2", labelPos: "nw" },
                                { type: "point", x: 2, y: 0, color: Cl.red, label: "x = 2" },
                            ],
                        }),
                        widget("vtest", "Dikey doğru testi", "Bir eğri fonksiyon grafiği mi? Dikey doğruyu gezdir: Bir yerde bile 2 ya da daha fazla noktada kesiyorsa fonksiyon değildir."),
                        tip(R`Dikey doğru demek <b>sabit bir $x$</b> demek. Dikey doğru eğriyi iki noktada keserse, o $x$'e iki farklı $y$ karşılık geliyor demektir — bu da fonksiyonun “tek çıktı” kuralını bozar.`, "Neden çalışıyor?"),
                        quiz(R`Bir fonksiyonun grafiği x-eksenini 3 noktada kesiyorsa ne söylenebilir?`, ["Fonksiyonun 3 kökü vardır", "Bu bir fonksiyon değildir", "Tanım kümesi 3 elemanlıdır", R`$f(3) = 0$'dır`], 0, R`x-eksenini kestiği her nokta bir köktür. x-eksenini kesmek fonksiyonluğu bozmaz; dikey doğrular önemlidir.`),
                    ],
                },
                {
                    id: "esitlik-islemler", title: "Eşitlik ve Dört İşlem",
                    summary: "Fonksiyonları toplamak, çıkarmak, çarpmak, bölmek.",
                    blocks: [
                        simple(R`İki fonksiyonu toplamak için <b>her $x$'te çıktılarını toplarsın</b>: $(f+g)(x) = f(x) + g(x)$. Çıkarma, çarpma ve bölme de aynı mantıkla çalışır. Tek dikkat: bölmede payda sıfır olamaz.`),
                        def("Eşit fonksiyonlar", R`$f$ ve $g$ aynı küme üzerinde tanımlı olsun. Bu kümenin <b>her</b> $x$ elemanı için $f(x) = g(x)$ ise $f$ ile $g$ <b>eşittir</b> denir ve $f = g$ yazılır.`),
                        ex(R`$f, g: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2 - 1$ ve $g(x) = (x - 1)(x + 1)$ eşit midir?`, [
                            R`$g(x)$'i açalım: $(x - 1)(x + 1) = x^2 + x - x - 1 = x^2 - 1$.`,
                            R`Her $x \in \mathbb{R}$ için $g(x) = f(x)$.`,
                        ], R`Evet, $f = g$. Kurallar farklı yazılmış ama aynı fonksiyon!`),
                        formula("İşlemler", R`$f$ ve $g$ iki fonksiyon olsun:
                            $$(f + g)(x) = f(x) + g(x) \qquad (f - g)(x) = f(x) - g(x)$$
                            $$(f \cdot g)(x) = f(x) \cdot g(x) \qquad \left(\frac{f}{g}\right)(x) = \frac{f(x)}{g(x)}$$
                            $$(c \cdot f)(x) = c \cdot f(x) \quad (c \text{ bir sayı})$$
                            $f+g$, $f-g$, $f\cdot g$ her ikisinin de tanımlı olduğu noktalarda; $\frac{f}{g}$ ise bunlara ek olarak $g(x) = 0$ olan noktalar <b>hariç</b> tanımlıdır.`),
                        ex(R`$f(x) = x^2$ ve $g(x) = x - 1$ için $f+g$, $f-g$, $f\cdot g$ ve $\frac{f}{g}$ fonksiyonlarını bulunuz. Tanım kümelerini belirtiniz.`, [
                            R`$(f+g)(x) = x^2 + x - 1$`,
                            R`$(f-g)(x) = x^2 - (x - 1) = x^2 - x + 1$ <span class="muted">(parantezi unutma!)</span>`,
                            R`$(f\cdot g)(x) = x^2(x - 1) = x^3 - x^2$`,
                            R`$\left(\frac{f}{g}\right)(x) = \dfrac{x^2}{x - 1}$; burada $x - 1 \neq 0$ olmalı.`,
                        ], R`İlk üçünün tanım kümesi $\mathbb{R}$, bölümünki $\mathbb{R} \setminus \{1\}$.`),
                        widget("ops", "İşlem laboratuvarı", "Kendi f ve g fonksiyonlarını yaz, bir işlem seç. Yeşil eğri sonuç; dikey çizgide her üçünün değerini karşılaştır.", { f: "x^2", g: "x-1" }),
                        warn(R`$\frac{f}{g}$'yi incelerken $g$'nin sıfır olduğu noktaları <b>mutlaka</b> tanım kümesinden çıkar. Yukarıdaki araçta “f / g” seçip $x = 1$'e git: grafik orada kopar.`),
                        quiz(R`$f(x) = 2x$ ve $g(x) = x + 3$ ise $(f \cdot g)(1)$ kaçtır?`, ["5", "6", "8", "10"], 2, R`$f(1) = 2$, $g(1) = 4$, çarpım $2 \cdot 4 = 8$.`),
                    ],
                },
                {
                    id: "goruntu-orten", title: "Görüntü Kümesi, İçine ve Örten",
                    summary: "Değer kümesinin hepsi kullanılıyor mu?",
                    blocks: [
                        simple(R`Değer kümesi $B$, makineden <b>çıkabilecek</b> sonuçların listesidir. Görüntü kümesi ise <b>gerçekten çıkan</b> sonuçlardır. $B$'nin her elemanı en az bir kez çıkıyorsa fonksiyon <b>örten</b>; bazıları hiç çıkmıyorsa <b>içine</b> fonksiyondur.`),
                        def("Görüntü ve ters görüntü", R`$f: A \to B$ bir fonksiyon, $E \subset A$ ve $F \subset B$ olsun.
                            $$f(E) = \{f(x) : x \in E\}$$
                            kümesine $E$'nin $f$ altındaki <b>görüntüsü</b>,
                            $$f^{-1}(F) = \{x : f(x) \in F\}$$
                            kümesine $F$'nin <b>ters görüntüsü</b> denir. $f(A)$ kümesine fonksiyonun <b>görüntü kümesi</b> denir ve her zaman $f(A) \subset B$'dir.`),
                        def("İçine / örten", R`$f: A \to B$ için $f(A) = B$ oluyorsa $f$ <b>örten</b> fonksiyondur; aksi halde <b>içine</b> fonksiyondur. Yani $f$ örten ise $B$'nin her elemanı $A$'daki en az bir elemanın görüntüsüdür.`),
                        ex(R`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$ örten midir?`, [
                            R`Bir sayının karesi asla negatif olmaz: $x^2 \geq 0$.`,
                            R`Yani $-1$, $-5$ gibi negatif sayılar <b>hiç çıkmaz</b>.`,
                            R`Görüntü kümesi $f(\mathbb{R}) = [0, \infty)$, ama değer kümesi $\mathbb{R}$.`,
                        ], R`$f(\mathbb{R}) \neq \mathbb{R}$ olduğundan $x^2$ <b>içine</b> fonksiyondur.`),
                        ex(R`$g: \mathbb{R} \to \mathbb{R}$, $g(x) = x - 2$ örten midir?`, [
                            R`Herhangi bir $y$ seçelim. $g(x) = y$ olacak bir $x$ var mı?`,
                            R`$x - 2 = y \Rightarrow x = y + 2$. Bu her $y$ için bir reel sayı.`,
                        ], R`Evet, her $y$ yakalanıyor: $g$ örtendir.`),
                        tip(R`x-eksenine paralel (yatay) <b>her</b> doğru grafiği <b>en az bir</b> noktada kesiyorsa fonksiyon $\mathbb{R}$'ye örtendir. Hiç kesmeyen bir yatay doğru bulursan, o $y$ değeri görüntü kümesinde yoktur.`, "Grafikle kontrol"),
                        widget("hline", "Yatay doğru ile örtenlik testi", "Yatay doğruyu yukarı-aşağı kaydır. Hiç kesmediği bir yükseklik var mı?", {
                            presets: [
                                { tex: "x^2", label: "y = x²", expr: "x^2", verdict: "<b>y = x²</b>: y < 0 olan yatay doğrular grafiği hiç kesmez → ℝ'ye örten değil, <b>içine</b>.", view: { xmin: -4, xmax: 4, ymin: -4, ymax: 6 } },
                                { tex: "x - 2", label: "y = x − 2", expr: "x-2", verdict: "<b>y = x − 2</b>: her yatay doğru tam 1 noktada keser → <b>örten</b>.", view: { xmin: -4, xmax: 6, ymin: -4, ymax: 6 } },
                                { tex: "2^x", label: "y = 2ˣ", expr: "2^x", verdict: "<b>y = 2ˣ</b>: y ≤ 0 olan doğrular hiç kesmez → ℝ'ye örten değil, <b>içine</b>.", view: { xmin: -4, xmax: 4, ymin: -4, ymax: 6 } },
                            ],
                        }),
                        quiz(R`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = |x|$ için hangisi doğrudur?`, ["Örtendir", "İçinedir", "Fonksiyon değildir"], 1, R`Mutlak değer negatif olamaz; negatif sayılar hiç çıkmaz. Görüntü kümesi $[0, \infty) \neq \mathbb{R}$.`),
                    ],
                },
                {
                    id: "birebir", title: "Birebir Fonksiyon",
                    summary: "Farklı girdiler, farklı çıktılar.",
                    blocks: [
                        simple(R`Birebir fonksiyonda <b>iki farklı sayı aynı sonucu veremez</b>. Okul numarası gibi: her öğrencinin numarası farklıdır; numarayı görünce öğrenciyi kesin bilirsin.`),
                        def("Birebir", R`$f: A \to B$ fonksiyonunda farklı elemanların görüntüleri de farklı ise $f$ <b>birebir</b>dir. Sembollerle:
                            $$x_1 \neq x_2 \Rightarrow f(x_1) \neq f(x_2)$$
                            ya da (aynı anlamda)
                            $$f(x_1) = f(x_2) \Rightarrow x_1 = x_2.$$`),
                        def("Birebir örten", R`Hem birebir hem örten olan fonksiyona <b>birebir örten</b> fonksiyon denir. Bu fonksiyonlarda $A$ ile $B$'nin elemanları tam tamına eşleşir — ileride göreceğimiz ters fonksiyon için şart budur.`),
                        ex(R`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 3$ birebir örten midir?`, [
                            R`<b>Birebir mi?</b> $x_1 \neq x_2$ ise $2x_1 \neq 2x_2 \Rightarrow 2x_1 + 3 \neq 2x_2 + 3 \Rightarrow f(x_1) \neq f(x_2)$. ✓`,
                            R`<b>Örten mi?</b> Bir $y$ verilsin. $2x + 3 = y$ olacak $x$: $x = \dfrac{y - 3}{2}$. Bu her $y$ için bir reel sayı. ✓`,
                        ], R`$f$ birebir örtendir.`),
                        tip(R`<b>Yatay doğru testi:</b> Her yatay doğru grafiği <b>en fazla bir</b> noktada kesiyorsa fonksiyon birebirdir. İki noktada kesen bir yatay doğru bulursan, aynı $y$'yi veren iki farklı $x$ bulmuşsun demektir.`),
                        widget("hline", "Yatay doğru testi", "Fonksiyon seç ve yatay doğruyu gezdir. Kırmızı noktalar: aynı y değerini veren farklı x'ler.", {
                            presets: [
                                { tex: "2x+3", label: "y = 2x + 3", expr: "2x+3", verdict: "<b>2x + 3</b>: her yatay doğru tam 1 noktada keser → birebir ve örten.", view: { xmin: -5, xmax: 3, ymin: -4, ymax: 6 } },
                                { tex: "x^2", label: "y = x²", expr: "x^2", verdict: "<b>x²</b>: örneğin y = 1 doğrusu x = −1 ve x = 1'de keser → birebir <u>değil</u> (f(−1) = f(1) = 1).", view: { xmin: -4, xmax: 4, ymin: -4, ymax: 6 } },
                                { tex: "x^3", label: "y = x³", expr: "x^3", verdict: "<b>x³</b>: her yatay doğru tam 1 noktada keser → birebir ve örten.", view: { xmin: -3, xmax: 3, ymin: -4, ymax: 6 } },
                                { tex: "x^3-3x", label: "y = x³ − 3x", expr: "x^3-3x", verdict: "<b>x³ − 3x</b>: her yatay doğru en az 1 kez keser (örten) ama −2 < k < 2 için 3 kez keser → birebir <u>değil</u>.", view: { xmin: -3, xmax: 3, ymin: -4, ymax: 6 } },
                            ],
                        }),
                        p(R`Birebir bir fonksiyonun grafiği verildiğinde, x-eksenine paralel çizilen doğrular grafiği <b>en fazla bir noktada</b> keser.`),
                        quiz(R`Aşağıdaki $\mathbb{R} \to \mathbb{R}$ fonksiyonlarından hangisi birebirdir?`, [R`$x^2$`, R`$|x|$`, R`$x^3$`, R`$\cos x$`], 2, R`$x^3$ her yatay doğruyu bir kez keser. $x^2$ ve $|x|$'te $f(-1) = f(1)$; $\cos x$'te $\cos 0 = \cos 2\pi$.`),
                    ],
                },
                {
                    id: "bileske", title: "Birim ve Bileşke Fonksiyon",
                    summary: "Makineleri uç uca bağlamak.",
                    blocks: [
                        simple(R`Bileşke, <b>iki makineyi uç uca eklemek</b>tir. Sayıyı önce $f$ makinesine at, çıkan sonucu $g$ makinesine at. Bunu $g \circ f$ ile gösteririz ve <b>sağdan sola</b> okuruz: önce $f$, sonra $g$.`),
                        def("Birim fonksiyon", R`$f$, $A$'dan $A$'ya bir fonksiyon olsun. Her $x \in A$ için $f(x) = x$ ise $f$'ye <b>birim (özdeşlik) fonksiyon</b> denir, $I_A$ ile gösterilir. Hiçbir şeyi değiştirmeyen makinedir; $I_{\mathbb{R}}$'nin grafiği $y = x$ doğrusudur.`),
                        def("Bileşke fonksiyon", R`$f: A \to B$ ve $g: B \to C$ fonksiyonları verilsin. $A$'nın her $x$ elemanını $C$'nin $g(f(x))$ elemanına götüren fonksiyona $f$ ile $g$'nin <b>bileşkesi</b> denir:
                            $$(g \circ f)(x) = g\big(f(x)\big).$$`),
                        ex(R`$f(x) = 3x - 1$ ve $g(x) = x^2$ için $(g\circ f)(x)$ ve $(f\circ g)(x)$ ifadelerini bulunuz.`, [
                            R`$(g\circ f)(x) = g(f(x)) = g(3x - 1)$. $g$'nin kuralında $x$ gördüğün yere $3x - 1$ yaz.`,
                            R`$= (3x - 1)^2 = 9x^2 - 6x + 1$.`,
                            R`$(f\circ g)(x) = f(g(x)) = f(x^2) = 3x^2 - 1$.`,
                        ], R`$g\circ f = 9x^2 - 6x + 1$, $f\circ g = 3x^2 - 1$. Farklılar! Genelde $f \circ g \neq g \circ f$.`),
                        widget("compose", "Bileşke zinciri", "Bir x seç ve iki sırayı karşılaştır. Fonksiyonları değiştirip kendi örneklerini dene.", { f: "3x-1", g: "x^2" }),
                        tip(R`$(g \circ f)(x)$'i hesaplarken içten dışa çalış: önce $f(x)$'i bul, sonra onu $g$'ye ver. “İçteki önce” kuralı.`),
                        quiz(R`$f(x) = x + 2$ ve $g(x) = 2x$ ise $(g \circ f)(1)$ kaçtır?`, ["4", "5", "6", "8"], 2, R`Önce $f(1) = 3$, sonra $g(3) = 6$.`),
                        quiz(R`Aynı fonksiyonlar için $(f \circ g)(1)$ kaçtır?`, ["4", "5", "6", "8"], 0, R`Önce $g(1) = 2$, sonra $f(2) = 4$. Sıra değişince sonuç değişti!`),
                    ],
                },
                {
                    id: "ters-fonksiyon", title: "Ters Fonksiyon",
                    summary: "Makineyi geri çalıştırmak.",
                    blocks: [
                        simple(R`Ters fonksiyon, makineyi <b>geri sarmak</b>tır. $f$, 2'yi 9'a götürüyorsa $f^{-1}$, 9'u 2'ye geri getirir. Bunun için $f$'nin <b>birebir ve örten</b> olması gerekir; yoksa “geri dönüş yolu” belirsiz olur.`),
                        def("Tanım", R`$f: A \to B$ birebir örten olsun.
                            $$(g\circ f)(x) = x \quad\text{ve}\quad (f\circ g)(y) = y$$
                            eşitliklerini sağlayan $g$ fonksiyonuna $f$'nin <b>tersi</b> denir ve $f^{-1}$ ile gösterilir. Buna göre $f^{-1}\circ f = I_A$ ve $f \circ f^{-1} = I_B$ olur.`),
                        formula("Ters nasıl bulunur?", R`<ol>
                            <li>$y = f(x)$ yaz.</li>
                            <li>Denklemi $x$'i yalnız bırakacak şekilde çöz: $x = \ldots y \ldots$</li>
                            <li>$x$ ile $y$'nin yerini değiştir: $y = f^{-1}(x)$.</li>
                        </ol>`),
                        ex(R`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^3 + 1$ fonksiyonunun, varsa tersini bulup grafiğini çiziniz.`, [
                            R`$f$ birebir ve örten olduğundan tersi vardır. $y = x^3 + 1$ yaz.`,
                            R`$x$'i yalnız bırak: $x^3 = y - 1 \Rightarrow x = \sqrt[3]{y - 1}$.`,
                            R`Harfleri değiştir: $f^{-1}(x) = \sqrt[3]{x - 1}$.`,
                            R`Kontrol: $f(2) = 9$ ve $f^{-1}(9) = \sqrt[3]{8} = 2$ ✓`,
                        ], R`$f^{-1}(x) = \sqrt[3]{x - 1}$. Grafiği, $y = x^3 + 1$'in $y = x$ doğrusuna göre simetriğidir.`),
                        tip(R`$(a, b)$ noktası $y = f(x)$ üzerinde ise $(b, a)$ noktası $y = f^{-1}(x)$ üzerindedir. Bu iki nokta $y = x$ doğrusuna göre simetriktir. Bu yüzden $f$ ile $f^{-1}$'in grafikleri $y = x$'e göre <b>ayna görüntüsü</b>dür.`, "Grafikte ters"),
                        widget("inverse", "Ayna: f ve f⁻¹", "Mavi f, pembe f⁻¹. Noktayı kaydır: (a, b) noktası (b, a) olarak aynada belirir.", {
                            presets: [
                                { tex: "x^3+1", expr: "x^3+1", dom: [-1.7, 1.6], a: [-1.5, 1.5], inv: R`f^{-1}(x) = \sqrt[3]{x-1}`, invLabelAt: [3.6, 1.2] },
                                { tex: "2x+3", expr: "2x+3", dom: [-4, 1], a: [-3, 0.8], inv: R`f^{-1}(x) = \frac{x-3}{2}`, invLabelAt: [4, 0.2] },
                                { tex: "2^x", expr: "2^x", dom: [-5, 2.3], a: [-2, 2], inv: R`f^{-1}(x) = \log_2 x`, invLabelAt: [4.3, 1.6] },
                                { tex: R`x^2,\ x\ge 0`, expr: "x^2", dom: [0, 2.2], a: [0, 2], inv: R`f^{-1}(x) = \sqrt{x}`, invLabelAt: [4.3, 1.7] },
                            ],
                        }),
                        warn(R`$f^{-1}(x)$ ile $\dfrac{1}{f(x)}$ <b>aynı şey değildir</b>! $f(x) = 2x$ için $f^{-1}(x) = \frac{x}{2}$ ama $\frac{1}{f(x)} = \frac{1}{2x}$.`, "Sık yapılan hata"),
                        quiz(R`$f(x) = 2x - 4$ ise $f^{-1}(6)$ kaçtır?`, ["2", "5", "8", "10"], 1, R`$f^{-1}(6) = a$ demek $f(a) = 6$ demek: $2a - 4 = 6 \Rightarrow a = 5$.`),
                    ],
                },
                {
                    id: "monotonluk", title: "Artan ve Azalan Fonksiyonlar",
                    summary: "Grafik yokuş mu çıkıyor, iniyor mu?",
                    blocks: [
                        simple(R`Grafiğin üzerinde soldan sağa yürüyen bir karınca düşün. Karınca <b>yokuş çıkıyorsa</b> fonksiyon orada <b>artan</b>, <b>yokuş iniyorsa</b> <b>azalan</b>dır.`),
                        def("Tanım", R`$A \subset \mathbb{R}$, $f: A \to \mathbb{R}$ ve $E \subset A$ olsun. $E$'deki her $x_1 < x_2$ için:
                            <ul>
                                <li>$f(x_1) < f(x_2)$ ise $f$, $E$ üzerinde <b>artan</b>,</li>
                                <li>$f(x_1) \leq f(x_2)$ ise <b>azalmayan</b>,</li>
                                <li>$f(x_1) > f(x_2)$ ise <b>azalan</b>,</li>
                                <li>$f(x_1) \geq f(x_2)$ ise <b>artmayan</b> fonksiyondur.</li>
                            </ul>
                            Bir aralığın tamamında artan veya azalan fonksiyona <b>kesin monoton</b>, sonlu sayıda aralıkta ayrı ayrı monoton olana <b>parçalı monoton</b> fonksiyon denir.`),
                        formula("Grafikten okuma", R`<ul>
                            <li>Kesin monoton <b>artan</b>: sağdaki nokta soldakinden daha <b>yukarıda</b>.</li>
                            <li>Kesin monoton <b>azalan</b>: soldaki nokta sağdakinden daha <b>yukarıda</b>.</li>
                            <li><b>Azalmayan</b>: soldaki nokta sağdakinin <b>yukarısında olamaz</b> (eşit olabilir — düz kısımlar serbest).</li>
                        </ul>`),
                        ex(R`$f(x) = 2x + 4$ ve $g(x) = x^2$ fonksiyonlarının monotonluk durumlarını inceleyiniz.`, [
                            R`$x_1 < x_2 \Rightarrow 2x_1 < 2x_2 \Rightarrow 2x_1 + 4 < 2x_2 + 4$, yani $f(x_1) < f(x_2)$: $f$ her yerde artandır.`,
                            R`$g(x) = x^2$: $(-\infty, 0]$ aralığında azalır ($-3 \to 9$, $-1 \to 1$), $[0, +\infty)$ aralığında artar ($1 \to 1$, $3 \to 9$).`,
                        ], R`$f$ kesin monoton (artan); $g$ ise tüm $\mathbb{R}$'de monoton değil, <b>parçalı monoton</b>.`),
                        widget("monotone", "Karınca yürüyüşü", "Noktayı gezdir. Yeşil kısımlar artan, kırmızı kısımlar azalan.", {
                            presets: [
                                { tex: "2x+4", expr: "2x+4", verdict: "Bu fonksiyon her yerde artan → <b>kesin monoton</b>." },
                                { tex: "x^2", expr: "x^2", verdict: "(−∞, 0] aralığında azalan, [0, ∞) aralığında artan → <b>parçalı monoton</b>." },
                                { tex: "x^3-3x", expr: "x^3-3x", verdict: "(−∞, −1] artan, [−1, 1] azalan, [1, ∞) artan → <b>parçalı monoton</b>." },
                                { tex: "-x+1", expr: "-x+1", verdict: "Her yerde azalan → <b>kesin monoton</b>." },
                            ],
                        }),
                        quiz(R`$f(x) = -3x + 5$ için hangisi doğrudur?`, ["Artandır", "Azalandır", "Sabittir", "Parçalı monotondur"], 1, R`$x$ büyüdükçe $-3x$ küçülür. Eğim negatif → azalan.`),
                    ],
                },
                {
                    id: "tek-cift", title: "Tek ve Çift Fonksiyonlar",
                    summary: "Ayna simetrisi ve dönme simetrisi.",
                    blocks: [
                        simple(R`<b>Çift</b> fonksiyonun grafiği y-eksenine göre <b>ayna</b> gibidir: sol yarı, sağ yarının yansımasıdır. <b>Tek</b> fonksiyonun grafiği orijin etrafında <b>180° döndürülünce</b> aynı kalır.`),
                        def("Tanım", R`$x \in A$ olduğunda $-x \in A$ oluyorsa $A$ <b>simetrik küme</b>dir. Simetrik bir $A$ kümesi üzerinde tanımlı $f$ için:
                            <ul>
                                <li>Her $x \in A$ için $f(-x) = f(x)$ ise $f$ <b>çift</b> fonksiyondur.</li>
                                <li>Her $x \in A$ için $f(-x) = -f(x)$ ise $f$ <b>tek</b> fonksiyondur.</li>
                            </ul>`),
                        tip(R`İsim kuvvetlerden gelir: $x^2, x^4, x^6$ (çift kuvvetler) <b>çift</b>; $x, x^3, x^5$ (tek kuvvetler) <b>tek</b> fonksiyondur.`, "İsim nereden geliyor?"),
                        ex(R`$f(x) = x^2 + 1$, $g(x) = x^3$, $h(x) = x + 2$, $k(x) = 0$ fonksiyonlarının hangileri tek, hangileri çifttir?`, [
                            R`$f(-x) = (-x)^2 + 1 = x^2 + 1 = f(x)$ → $f$ <b>çift</b>.`,
                            R`$g(-x) = (-x)^3 = -x^3 = -g(x)$ → $g$ <b>tek</b>.`,
                            R`$h(-x) = -x + 2$. Bu ne $h(x) = x + 2$'ye ne de $-h(x) = -x - 2$'ye eşit → $h$ <b>ne tek ne çift</b>.`,
                            R`$k(-x) = 0 = k(x)$ ve $k(-x) = 0 = -k(x)$ → $k$ <b>hem tek hem çift</b>.`,
                        ], R`Çoğu fonksiyon ne tek ne çifttir; tek ya da çift olmak özel bir simetridir.`),
                        widget("parity", "Simetri dedektifi", "Fonksiyon seç ve a'yı değiştir. A ve B noktalarının y değerlerini karşılaştır.", {
                            presets: [
                                { tex: "x^2", label: "y = x²", expr: "x^2" },
                                { tex: "x^3", label: "y = x³", expr: "x^3" },
                                { tex: R`\cos x`, label: "y = cos x", expr: "cos(x)" },
                                { tex: R`\sin x`, label: "y = sin x", expr: "sin(x)" },
                                { tex: "x+2", label: "y = x + 2", expr: "x+2" },
                                { tex: "|x|", label: "y = |x|", expr: "abs(x)" },
                            ],
                        }),
                        p(R`Grafik açısından: $f$ çift ise $(x, f(x))$ grafiğin bir noktası olduğunda $(-x, f(x))$ de grafiğin noktasıdır — bu iki nokta y-eksenine göre simetriktir. Benzer düşünceyle tek fonksiyonların grafiklerinin $O(0, 0)$ orijin noktasına göre simetrik olduğu görülür.`),
                        quiz(R`$f(x) = x^4 - 3x^2$ için hangisi doğrudur?`, ["Tektir", "Çifttir", "Ne tek ne çifttir"], 1, R`$f(-x) = (-x)^4 - 3(-x)^2 = x^4 - 3x^2 = f(x)$.`),
                        quiz(R`Grafiği orijine göre simetrik olan bir fonksiyon …`, ["çifttir", "tektir", "birim fonksiyondur", "sabittir"], 1, R`Orijine göre simetri tek fonksiyonların özelliğidir.`),
                    ],
                },
            ],
        },

        /* =========================== 1.2 =========================== */
        {
            no: "1.2", title: "Bazı Özel Fonksiyonlar", page: 45,
            lessons: [
                {
                    id: "kuvvet-polinom", title: "Kuvvet ve Polinom Fonksiyonları",
                    summary: "x'in kuvvetleri ve onların toplamları.",
                    blocks: [
                        simple(R`<b>Kuvvet fonksiyonu</b>: $x$'i kendisiyle $n$ kez çarp, $x^n$. <b>Polinom</b>: bu kuvvetlerin sayılarla çarpılıp toplanmış hali, örneğin $3x^2 - 5x + 2$. Matematikte en çok kullanılan, en “uslu” fonksiyonlardır.`),
                        def("Kuvvet fonksiyonu", R`$n \in \mathbb{N}$ olmak üzere $f(x) = x^n$ biçiminde tanımlanan fonksiyonlara <b>kuvvet fonksiyonu</b> denir. $n$ çift ise kuvvet fonksiyonu çifttir (grafik y-eksenine simetrik), $n$ tek ise tektir (grafik orijine simetrik).`),
                        widget("graph", "Kuvvet fonksiyonu", "n'yi değiştir: Çift n'lerde grafik U gibi, tek n'lerde S gibi. Hepsi (0, 0) ve (1, 1)'den geçer!", {
                            fns: [{ expr: "x^n", label: (pr) => `y = x^${pr.n}` }],
                            params: { n: { min: 1, max: 8, step: 1, value: 2 } },
                            view: { xmin: -2, xmax: 2, ymin: -2, ymax: 2.5 }, height: 280,
                            extras: (pr) => [
                                { type: "point", x: 1, y: 1, color: Cl.green, label: "(1, 1)" },
                                { type: "point", x: -1, y: Math.pow(-1, pr.n), color: Cl.pink, label: `(−1, ${pr.n % 2 ? "−1" : "1"})`, labelPos: pr.n % 2 ? "sw" : "nw" },
                            ],
                            readout: (pr) => pr.n % 2 === 0
                                ? `n = ${pr.n} <b>çift</b> → ${T("(-x)^{" + pr.n + "} = x^{" + pr.n + "}")}: fonksiyon çift, grafik y-eksenine göre simetrik.`
                                : `n = ${pr.n} <b>tek</b> → ${T("(-x)^{" + pr.n + "} = -x^{" + pr.n + "}")}: fonksiyon tek, grafik orijine göre simetrik.`,
                        }),
                        def("Polinom fonksiyonu", R`$n \in \mathbb{N}$ ve $a_0, a_1, \ldots, a_n$ sabit reel sayılar, $a_n \neq 0$ olmak üzere
                            $$p(x) = a_n x^n + a_{n-1}x^{n-1} + \ldots + a_1 x + a_0$$
                            biçiminde tanımlanan fonksiyona <b>polinom fonksiyonu</b> denir. $n$ doğal sayısına polinomun <b>derecesi</b>, $a_0, a_1, \ldots, a_n$ sayılarına polinomun <b>katsayıları</b> denir.`),
                        formula("İki temel özellik", R`<ol>
                            <li>İki polinomun toplamı ve çarpımı yine bir polinomdur.</li>
                            <li>$r$ sayısı $n$. dereceden $p$ polinomunun $m$ katlı bir kökü ise $p(x) = (x - r)^m\, q(x)$ olacak şekilde $n - m$. dereceden bir $q$ polinomu vardır.</li>
                        </ol>`),
                        ex(R`$p(x) = x^6 + x^5 + x^4 + x^3 = x^3(x + 1)(x^2 + 1)$ eşitliği ile verilen $p$ polinomunun reel köklerini bulunuz.`, [
                            R`Çarpım sıfır ⇔ çarpanlardan biri sıfır.`,
                            R`$x^3 = 0 \Rightarrow x = 0$ (bu kök <b>3 katlı</b>).`,
                            R`$x + 1 = 0 \Rightarrow x = -1$.`,
                            R`$x^2 + 1 = 0 \Rightarrow x^2 = -1$: reel çözüm yok.`,
                        ], R`Reel kökler: $x_1 = x_2 = x_3 = 0$ ve $x_4 = -1$. Diğer iki kök reel değildir.`),
                        widget("graph", "İkinci dereceden polinom", "a, b, c katsayılarını değiştir. a'nın işareti kolların yönünü, c ise y-eksenini kestiği yeri belirler.", {
                            fns: [{ expr: "a*x^2+b*x+c", label: "y = ax² + bx + c" }],
                            params: { a: { min: -3, max: 3, step: 0.5, value: 1 }, b: { min: -5, max: 5, step: 0.5, value: -2 }, c: { min: -5, max: 5, step: 0.5, value: -3 } },
                            view: { xmin: -5, xmax: 5, ymin: -6, ymax: 6 }, height: 280,
                            extras: (pr) => [{ type: "point", x: 0, y: pr.c, color: Cl.orange, label: `(0, ${F(pr.c)})` }],
                            readout: (pr) => {
                                if (pr.a === 0) return `a = 0 olunca derece düşer: ${T(`y = ${F(pr.b).replace("−", "-")}x ${pr.c < 0 ? "-" : "+"} ${F(Math.abs(pr.c))}`)} bir doğru (1. derece).`;
                                const D = pr.b * pr.b - 4 * pr.a * pr.c;
                                const r = D > 1e-12 ? `iki farklı reel kök: x ≈ ${F((-pr.b - Math.sqrt(D)) / (2 * pr.a), 3)} ve x ≈ ${F((-pr.b + Math.sqrt(D)) / (2 * pr.a), 3)}` : Math.abs(D) <= 1e-12 ? `bir çift katlı kök: x = ${F(-pr.b / (2 * pr.a), 3)}` : "reel kök yok (grafik x-eksenini kesmez)";
                                return `Derece 2. ${T("\\Delta = b^2 - 4ac = " + F(D).replace("−", "-"))} → ${r}.`;
                            },
                        }),
                        quiz(R`$p(x) = 4x^5 - 2x^2 + 7$ polinomunun derecesi kaçtır?`, ["2", "4", "5", "7"], 2, R`Derece, en büyük kuvvettir: $x^5$.`),
                    ],
                },
                {
                    id: "rasyonel", title: "Rasyonel Fonksiyon ve Kısıtlama",
                    summary: "Polinom bölü polinom.",
                    blocks: [
                        simple(R`Rasyonel fonksiyon = <b>polinom bölü polinom</b>. Kesir olduğu için paydanın sıfır olduğu yerlerde grafik kopar; o noktalarda fonksiyon tanımsızdır.`),
                        def("Rasyonel fonksiyon", R`$p$ ve $q$ polinom, $q \neq 0$ olmak üzere
                            $$f(x) = \frac{p(x)}{q(x)}$$
                            biçiminde tanımlanan $f$ fonksiyonuna <b>rasyonel fonksiyon</b> denir. Bir rasyonel fonksiyon, paydayı sıfır yapan noktalar hariç diğer tüm noktalarda tanımlıdır.`),
                        ex(R`$f(x) = \dfrac{x^2 - 1}{x^3 - 3x^2 - 4x}$ fonksiyonunun tanım kümesini bulunuz.`, [
                            R`Paydayı çarpanlarına ayıralım: $x^3 - 3x^2 - 4x = x(x^2 - 3x - 4) = x(x + 1)(x - 4)$.`,
                            R`Payda $x_1 = 0$, $x_2 = -1$, $x_3 = 4$ noktalarında sıfır olur.`,
                        ], R`Tanım kümesi $\mathbb{R} \setminus \{-1, 0, 4\}$.`),
                        widget("graph", "Paydanın sıfır olduğu yerler", "Kırmızı kesikli doğrular paydanın sıfır olduğu yerler: grafik bu noktalarda kopuyor.", {
                            fns: [{ expr: "(x^2-1)/(x^3-3x^2-4x)", label: "f" }],
                            view: { xmin: -3, xmax: 6, ymin: -4, ymax: 4 }, height: 280,
                            extras: () => [-1, 0, 4].map((x) => ({ type: "vline", x, color: Cl.red, width: 1.5, label: `x = ${x === -1 ? "−1" : x}` })),
                        }),
                        tip(R`Her polinom aynı zamanda bir rasyonel fonksiyondur, çünkü $p(x) = \dfrac{p(x)}{1}$ biçiminde yazılabilir.`),
                        def("Kısıtlanmış fonksiyon", R`$f: A \to B$ bir fonksiyon ve $E \subset A$ olsun. Her $x \in E$ için $g(x) = f(x)$ olan $g$ fonksiyonuna $f$'nin $E$'ye <b>kısıtlanmışı</b> denir, $f|_E$ ile gösterilir. Kısıtlamada <b>kural değişmez</b>, sadece tanım kümesi daraltılır.`),
                        ex(R`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 1$ ve $g: \mathbb{N} \to \mathbb{R}$, $g(x) = 2x + 1$ veriliyor. Aralarındaki ilişki nedir?`, [
                            R`Kurallar aynı: $2x + 1$.`,
                            R`Ama $g$ sadece doğal sayılarda tanımlı. Grafiği bir doğru değil, <b>ayrık noktalar</b>dır: $(0, 1), (1, 3), (2, 5), \ldots$`,
                        ], R`$g = f|_{\mathbb{N}}$: $g$, $f$'nin $\mathbb{N}$'ye kısıtlanmışıdır.`),
                        quiz(R`$f(x) = \dfrac{3}{x^2 - 9}$ fonksiyonunun tanım kümesi nedir?`, [R`$\mathbb{R}$`, R`$\mathbb{R}\setminus\{3\}$`, R`$\mathbb{R}\setminus\{-3, 3\}$`, R`$\mathbb{R}\setminus\{9\}$`], 2, R`$x^2 - 9 = 0 \Rightarrow x = \pm 3$.`),
                    ],
                },
                {
                    id: "tam-kisim", title: "Tam Kısım Fonksiyonu",
                    summary: "Merdiven şeklindeki fonksiyon.",
                    blocks: [
                        simple(R`$\llbracket x\rrbracket $, $x$'ten <b>büyük olmayan en büyük tam sayı</b>dır. Sayı doğrusunda $x$'in üstünde ya da <b>solunda</b> kalan ilk tam sayı. Örnekler: $\llbracket 2{,}7\rrbracket  = 2$, $\llbracket 5\rrbracket  = 5$, $\llbracket -1{,}3\rrbracket  = -2$ (dikkat!).`),
                        def("Tanım", R`$A \subset \mathbb{R}$ olsun. $f(x) = \llbracket x\rrbracket $ şeklinde tanımlanan $f: A \to \mathbb{R}$ fonksiyonuna <b>tam kısım fonksiyonu</b> denir. $p$ bir tam sayı olmak üzere
                            $$p \leq x < p + 1 \;\Rightarrow\; \llbracket x\rrbracket  = p.$$`),
                        table(R`<table class="mtable"><tr><th>Aralık</th><th>$\llbracket x\rrbracket $</th></tr>
                            <tr><td>$-3 \leq x < -2$</td><td>$-3$</td></tr>
                            <tr><td>$-2 \leq x < -1$</td><td>$-2$</td></tr>
                            <tr><td>$-1 \leq x < 0$</td><td>$-1$</td></tr>
                            <tr><td>$0 \leq x < 1$</td><td>$0$</td></tr>
                            <tr><td>$1 \leq x < 2$</td><td>$1$</td></tr>
                            <tr><td>$2 \leq x < 3$</td><td>$2$</td></tr></table>`),
                        widget("graph", "Merdiven", "Dolu nokta: o değer alınıyor; boş nokta: alınmıyor. Kaydırıcıyla x'i değiştir ve tam kısmını gör. Grafik çizicide [x] yazarak da kullanabilirsin.", {
                            presets: [
                                { label: "y = ⟦x⟧", fns: [{ expr: "[x]", label: "y = ⟦x⟧" }] },
                                { label: "y = x − ⟦x⟧", fns: [{ expr: "x-[x]", label: "y = x − ⟦x⟧" }] },
                                { label: "y = ⟦x²⟧", fns: [{ expr: "[x^2]", label: "y = ⟦x²⟧" }], view: { xmin: -2.2, xmax: 2.2, ymin: -0.8, ymax: 4.6 } },
                            ],
                            params: { a: { label: "x değeri", min: -3, max: 3, step: 0.1, value: 1.7 } },
                            view: { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 }, height: 290,
                            extras: (pr, comp, pi) => {
                                const items = [];
                                if (pi === 0) for (let n = -4; n <= 4; n++) items.push({ type: "point", x: n, y: n, color: Cl.blue, r: 4 }, { type: "point", x: n + 1, y: n, color: Cl.blue, r: 4, open: true });
                                if (pi === 1) for (let n = -4; n <= 4; n++) items.push({ type: "point", x: n, y: 0, color: Cl.blue, r: 4 }, { type: "point", x: n, y: 1, color: Cl.blue, r: 4, open: true });
                                const y = comp[0].f(pr.a);
                                items.push({ type: "vline", x: pr.a, color: Cl.orange, width: 1.4 }, { type: "point", x: pr.a, y, color: Cl.orange, label: `(${F(pr.a)}, ${F(y)})` });
                                return items;
                            },
                            readout: (pr, comp, h) => {
                                const fl = Math.floor(pr.a + 1e-12);
                                if (h.presetIndex === 1) return T(`${F(pr.a).replace("−", "-")} - \\llbracket ${F(pr.a).replace("−", "-")}\\rrbracket  = ${F(pr.a).replace("−", "-")} - (${fl}) = ${F(pr.a - fl).replace("−", "-")}`) + " → bu, sayının ondalık (kesir) kısmıdır.";
                                if (h.presetIndex === 2) return T(`\\llbracket (${F(pr.a).replace("−", "-")})^2\\rrbracket  = \\llbracket ${F(pr.a * pr.a, 2)}\\rrbracket  = ${Math.floor(pr.a * pr.a + 1e-12)}`);
                                return T(`\\llbracket ${F(pr.a).replace("−", "-")}\\rrbracket  = ${fl}`) + ` çünkü ${T(`${fl} \\le ${F(pr.a).replace("−", "-")} < ${fl + 1}`)}.`;
                            },
                        }),
                        warn(R`Negatif sayılarda dikkat: $\llbracket -0{,}5\rrbracket  = -1$, $0$ <b>değil</b>! Çünkü $-0{,}5$'ten büyük olmayan en büyük tam sayı $-1$'dir ($0 > -0{,}5$).`),
                        ex(R`$y = x - \llbracket x\rrbracket $ eşitliği ile verilen $f: [-2, 2] \to \mathbb{R}$ fonksiyonunun grafiğini çiziniz.`, [
                            R`$-2 \leq x < -1$ için $\llbracket x\rrbracket  = -2$, yani $y = x + 2$.`,
                            R`$-1 \leq x < 0$ için $y = x + 1$; $\;0 \leq x < 1$ için $y = x$; $\;1 \leq x < 2$ için $y = x - 1$.`,
                            R`$x = 2$ için $y = 2 - 2 = 0$.`,
                        ], R`Grafik, 0'dan 1'e çıkıp her tam sayıda başa dönen <b>testere dişi</b> şeklindedir. (Yukarıdaki araçta ikinci seçenek.)`),
                        ex(R`$f: [-2, 2] \to \mathbb{R}$, $f(x) = \llbracket x^2\rrbracket $ fonksiyonunun grafiğini çiziniz.`, [
                            R`$f(-x) = \llbracket (-x)^2\rrbracket  = \llbracket x^2\rrbracket  = f(x)$: $f$ çifttir; $[0, 2]$'de çizip y-eksenine göre yansıtmak yeter.`,
                            R`$0 \leq x < 1 \Rightarrow 0 \leq x^2 < 1 \Rightarrow \llbracket x^2\rrbracket  = 0$`,
                            R`$1 \leq x < \sqrt2 \Rightarrow \llbracket x^2\rrbracket  = 1$; $\;\sqrt2 \leq x < \sqrt3 \Rightarrow 2$; $\;\sqrt3 \leq x < 2 \Rightarrow 3$; $\;x = 2 \Rightarrow 4$.`,
                        ], R`Basamakların genişliği giderek daralan bir merdiven elde edilir. (Araçta üçüncü seçenek.)`),
                        quiz(R`$\llbracket -2{,}4\rrbracket $ kaçtır?`, ["−2", "−3", "2", "−2,4"], 1, R`$-3 \leq -2{,}4 < -2$ olduğundan cevap $-3$.`),
                    ],
                },
                {
                    id: "mutlak-deger", title: "Mutlak Değer Fonksiyonu",
                    summary: "Aşağıdaki parçaları yukarı katla.",
                    blocks: [
                        simple(R`Mutlak değer, bir sayının <b>sıfıra uzaklığıdır</b>; uzaklık negatif olamaz. Grafikte bunun anlamı: x-ekseninin <b>altına düşen parçalar yukarı katlanır</b>, tıpkı bir kâğıdı x-ekseninden katlamak gibi.`),
                        def("Tanım", R`$A \subset \mathbb{R}$ ve $f$, $A$'dan $\mathbb{R}$'ye bir fonksiyon olsun.
                            $$|f|(x) = |f(x)| = \begin{cases} f(x), & f(x) \geq 0 \\ -f(x), & f(x) < 0 \end{cases}$$
                            şeklinde tanımlanan $|f|$ fonksiyonuna $f$'nin <b>mutlak değer fonksiyonu</b> denir.`),
                        formula("İki çizim tekniği", R`<b>$y = |f(x)|$:</b> Önce $y = f(x)$'i çiz. x-ekseninin üstündeki kısım aynen kalır, altındaki kısım x-eksenine göre yukarı yansıtılır.<br><br>
                            <b>$y = f(|x|)$:</b> Önce $y = f(x)$'i yalnızca $x \geq 0$ için çiz. Sonra bu parçayı y-eksenine göre sola yansıt (sağ taraf sola kopyalanır).`),
                        widget("graph", "Katlama makinesi", "Kesikli eğri orijinal fonksiyon. Seçenekleri değiştirerek iki tekniğin farkını gör.", {
                            presets: [
                                { label: "y = x² − 3x − 4", fns: [{ expr: "x^2-3x-4", label: "f(x)" }] },
                                { label: "y = |x² − 3x − 4|", fns: [{ expr: "x^2-3x-4", dash: true, width: 1.8, color: Cl.gray, trace: false, noExport: true }, { expr: "abs(x^2-3x-4)", label: "|f(x)|", color: Cl.pink }] },
                                { label: "y = |x|² − 3|x| − 4", fns: [{ expr: "x^2-3x-4", dash: true, width: 1.8, color: Cl.gray, trace: false, noExport: true }, { expr: "abs(x)^2-3abs(x)-4", label: "f(|x|)", color: Cl.green }] },
                                { label: "y = |x² − 2|x||", fns: [{ expr: "x^2-2x", dash: true, width: 1.8, color: Cl.gray, trace: false, noExport: true }, { expr: "abs(abs(x)^2-2abs(x))", label: "|f(|x|)|", color: Cl.purple }] },
                            ],
                            view: { xmin: -6, xmax: 6, ymin: -7, ymax: 8 }, height: 300,
                        }),
                        ex(R`$y = |x^2 - 3x - 4|$ eğrisini çiziniz.`, [
                            R`Önce $y = x^2 - 3x - 4$'ü çizelim. $x = 0$ için $y = -4$.`,
                            R`Kökler: $(x - 4)(x + 1) = 0 \Rightarrow x_1 = 4$, $x_2 = -1$.`,
                            R`Tepe noktası: $x_0 = -\dfrac{b}{2a} = \dfrac32$, $y_0 = \left(\dfrac32\right)^2 - 3\cdot\dfrac32 - 4 = -\dfrac{25}{4}$.`,
                            R`x-ekseninin altında kalan kısım ($-1 < x < 4$) x-eksenine göre yukarı yansıtılır; tepe noktası $\left(\frac32, \frac{25}{4}\right)$ olur.`,
                        ], R`Grafik hiçbir yerde x-ekseninin altına inmez.`),
                        ex(R`$y = |x|^2 - 4|x|$ eğrisini çiziniz.`, [
                            R`$x \geq 0$ için $|x| = x$ olduğundan $y = x^2 - 4x$ eğrisini çiz (kökler $0$ ve $4$, tepe $(2, -4)$).`,
                            R`Bu parçanın y-eksenine göre simetriğini al.`,
                        ], R`W harfine benzeyen, y-eksenine göre simetrik bir grafik elde edilir (çift fonksiyon!).`),
                        quiz(R`$y = |f(x)|$ grafiği için hangisi <b>her zaman</b> doğrudur?`, ["x-ekseninin altına inmez", "y-eksenine göre simetriktir", "Orijinden geçer", "Kesin monotondur"], 0, R`Mutlak değer negatif olamaz, bu yüzden $|f(x)| \geq 0$.`),
                    ],
                },
                {
                    id: "isaret", title: "İşaret (sgn) Fonksiyonu",
                    summary: "Sadece işarete bak: +1, 0, −1.",
                    blocks: [
                        simple(R`İşaret fonksiyonu sayının sadece <b>işaretini</b> söyler: pozitifse $1$, negatifse $-1$, sıfırsa $0$. Sayının büyüklüğü önemli değil: $\text{sgn}(5) = \text{sgn}(1000) = 1$.`),
                        def("Tanım", R`$f$, $A \subset \mathbb{R}$'den $\mathbb{R}$'ye bir fonksiyon olsun.
                            $$(\text{sgn} f)(x) = \text{sgn}\, f(x) = \begin{cases} 1, & f(x) > 0 \\ 0, & f(x) = 0 \\ -1, & f(x) < 0 \end{cases}$$
                            şeklinde tanımlanan fonksiyona $f$'nin <b>işaret fonksiyonu</b> denir.`),
                        p(R`Bu tanım $f(x) \neq 0$ iken $\dfrac{|f(x)|}{f(x)}$ ifadesinden gelir: $f(x) > 0$ ise bu kesir $1$, $f(x) < 0$ ise $-1$ olur.`),
                        ex(R`$f(x) = x^2 - 2x - 3$ veriliyor. $\text{sgn} f$ fonksiyonunun grafiğini çiziniz.`, [
                            R`$x^2 - 2x - 3 = 0$ denkleminin kökleri: $x_1 = -1$, $x_2 = 3$.`,
                            R`İşaret tablosu: $x < -1$ için $+$, $\;-1 < x < 3$ için $-$, $\;x > 3$ için $+$.`,
                            R`Buna göre sgn: $+$ olan yerde $1$, $-$ olan yerde $-1$, köklerde $0$.`,
                        ], R`$$\text{sgn}(x^2 - 2x - 3) = \begin{cases} 1, & x < -1 \text{ veya } x > 3 \\ 0, & x = -1 \text{ veya } x = 3 \\ -1, & -1 < x < 3 \end{cases}$$`),
                        widget("graph", "İşaret grafiği", "Kesikli eğri f(x) = x² − 2x − 3. Kalın basamaklar onun işareti.", {
                            fns: [
                                { expr: "x^2-2x-3", dash: true, width: 1.8, color: Cl.gray, label: "f(x)", trace: false },
                                { expr: "sgn(x^2-2x-3)", label: "sgn f(x)", color: Cl.pink, width: 3.4 },
                            ],
                            view: { xmin: -3, xmax: 5, ymin: -4.5, ymax: 3 }, height: 280,
                            extras: () => [
                                { type: "point", x: -1, y: 0, color: Cl.pink, r: 4.5 }, { type: "point", x: 3, y: 0, color: Cl.pink, r: 4.5 },
                                { type: "point", x: -1, y: 1, color: Cl.pink, r: 4.5, open: true }, { type: "point", x: -1, y: -1, color: Cl.pink, r: 4.5, open: true },
                                { type: "point", x: 3, y: 1, color: Cl.pink, r: 4.5, open: true }, { type: "point", x: 3, y: -1, color: Cl.pink, r: 4.5, open: true },
                            ],
                        }),
                        quiz(R`$\text{sgn}(-7)$ kaçtır?`, ["−7", "−1", "0", "1"], 1, R`$-7 < 0$ olduğundan işareti $-1$.`),
                    ],
                },
            ],
        },

        /* =========================== 1.3 =========================== */
        {
            no: "1.3", title: "Bazı Pratik Çizimler", page: 50,
            lessons: [
                {
                    id: "yansimalar", title: "Yansımalar",
                    summary: "−f(x), f(−x) ve f(2p − x)",
                    blocks: [
                        simple(R`Bildiğin bir grafiği <b>aynaya tutarak</b> yeni grafikler elde edebilirsin. Formüldeki eksi işaretinin <b>nerede</b> olduğu, aynanın nerede durduğunu söyler.`),
                        formula("Kurallar", R`<ul>
                            <li>$y = -f(x)$: <b>x-eksenine</b> göre yansıma. $\;A(a, b) \to B(a, -b)$</li>
                            <li>$y = f(-x)$: <b>y-eksenine</b> göre yansıma. $\;A(a, b) \to B(-a, b)$</li>
                            <li>$y = f(2p - x)$: <b>$x = p$ doğrusuna</b> göre yansıma. $\;A(a, b) \to B(2p - a, b)$</li>
                        </ul>`),
                        tip(R`Eksi <b>dışarıda</b> (f'nin önünde) → $y$ değişir → yukarı-aşağı ayna.<br>Eksi <b>içeride</b> ($x$'in önünde) → $x$ değişir → sağ-sol ayna.`, "Hafıza ipucu"),
                        widget("transform", "Ayna laboratuvarı", "Bir temel fonksiyon seç ve yansımaları aç/kapat. A noktasının nereye gittiğini izle.", { controls: ["negf", "negx", "mirror", "p"], p: 2 }),
                        ex(R`$y = x^2 - 4x + 5$ eğrisinden yararlanarak $y = -x^2 + 4x - 5$ eğrisini çiziniz.`, [
                            R`Dikkat: $-x^2 + 4x - 5 = -(x^2 - 4x + 5)$.`,
                            R`Yani yeni fonksiyon $y = -f(x)$.`,
                        ], R`Grafiği x-eksenine göre yansıtmak yeter: tepe noktası $(2, 1)$ iken $(2, -1)$ olur.`),
                        ex(R`$y = x^2 + 2x$ eğrisinden yararlanarak $y = x^2 - 2x$ eğrisini çiziniz.`, [
                            R`$f(x) = x^2 + 2x$ ise $f(-x) = (-x)^2 + 2(-x) = x^2 - 2x$.`,
                        ], R`İstenen eğri, $y = x^2 + 2x$'in y-eksenine göre simetriğidir.`),
                        ex(R`$f(x) = x^2 - 2x$ ise $y = f(8 - x)$ eğrisini nasıl çizersiniz?`, [
                            R`$f(2p - x)$ kalıbı: $2p = 8 \Rightarrow p = 4$.`,
                            R`Grafik $x = 4$ doğrusuna göre yansıtılır.`,
                        ], R`$f$'nin kökleri $0$ ve $2$ idi; yansımaları $8$ ve $6$ olur.`),
                        quiz(R`$y = f(-x)$ grafiği, $y = f(x)$ grafiğinin hangi yansımasıdır?`, ["x-eksenine göre", "y-eksenine göre", "orijine göre", "y = x'e göre"], 1, R`Eksi içeride, $x$'in önünde → sağ-sol ayna → y-ekseni.`),
                    ],
                },
                {
                    id: "kaydirma-germe", title: "Kaydırma ve Germe",
                    summary: "f(x − p), c·f(x) ve f(x) + k",
                    blocks: [
                        simple(R`Grafiği <b>taşımak</b> için formüle sayı ekle: Parantezin <b>içine</b> eklenen sayı grafiği <b>sağa-sola</b>, <b>dışına</b> eklenen sayı <b>yukarı-aşağı</b> taşır. Önündeki çarpan ise grafiği dikey yönde <b>uzatır</b> ya da <b>basıklaştırır</b>.`),
                        formula("Kurallar", R`<ul>
                            <li>$y = f(x - p)$: $p > 0$ ise $p$ birim <b>sağa</b>, $p < 0$ ise $|p|$ birim <b>sola</b> kaydırılır. $\;A(a, b) \to B(a + p, b)$</li>
                            <li>$y = c \cdot f(x)$: her noktanın ordinatı $c$ ile çarpılır. $\;A(a, b) \to B(a, cb)$</li>
                            <li>$y = f(x) + k$: $k > 0$ ise $k$ birim <b>yukarı</b>, $k < 0$ ise $|k|$ birim <b>aşağı</b> kaydırılır. $\;A(a, b) \to B(a, b + k)$</li>
                        </ul>`),
                        warn(R`$f(x - 2)$ grafiği <b>sağa</b> kayar, sola değil! Çünkü eski grafikte $x = 0$'da olan şeye ulaşmak için artık $x - 2 = 0$, yani $x = 2$ yazmak gerekir.`, "Ters gibi görünen kural"),
                        widget("transform", "Kaydır ve ger", "p, c ve k kaydırıcılarıyla oyna. Pembe eğri yeni grafik; formül anında güncellenir.", { controls: ["p", "c", "k"] }),
                        ex(R`$y = x^3$ eğrisinden yararlanarak $y = (x - 2)^3$ ve $y = (x + 1)^3$ eğrilerini çiziniz.`, [
                            R`$(x - 2)^3 = f(x - 2)$ → $y = x^3$ eğrisi 2 birim <b>sağa</b> kaydırılır.`,
                            R`$(x + 1)^3 = f(x - (-1))$ → 1 birim <b>sola</b> kaydırılır.`,
                        ], R`Orijindeki dönüm noktası sırasıyla $(2, 0)$ ve $(-1, 0)$'a taşınır.`),
                        ex(R`$y = -x^2 + 4x - 3$ grafiğinden yararlanarak $y = f(x) + 3$ eğrisini çiziniz.`, [
                            R`Eğrinin her noktası 3 birim yukarı kaydırılır.`,
                            R`Yeni fonksiyon: $-x^2 + 4x$; kökleri $0$ ve $4$ (eskiden $1$ ve $3$ idi).`,
                        ], R`Tepe noktası $(2, 1)$'den $(2, 4)$'e çıkar.`),
                        ex(R`$y = x^3 - 3x$ eğrisinden yararlanarak $y = 2f(x)$ eğrisini çiziniz.`, [
                            R`Her noktanın ordinatı 2 ile çarpılır; kökler ($0$, $\pm\sqrt3$) yerinde kalır.`,
                            R`$(-1, 2)$ noktası $(-1, 4)$'e, $(1, -2)$ noktası $(1, -4)$'e gider.`,
                        ], R`Grafik dikey yönde 2 kat uzar: $y = 2x^3 - 6x$.`),
                        quiz(R`$y = (x + 3)^2 - 1$ grafiği, $y = x^2$'den nasıl elde edilir?`, ["3 sağa, 1 yukarı", "3 sola, 1 aşağı", "3 sağa, 1 aşağı", "3 sola, 1 yukarı"], 1, R`$x + 3 = x - (-3)$ → 3 sola; $-1$ → 1 aşağı.`),
                    ],
                },
            ],
        },

        /* =========================== 1.4 =========================== */
        {
            no: "1.4", title: "Trigonometrik Fonksiyonlar", page: 54,
            lessons: [
                {
                    id: "aci-olcusu", title: "Açı Ölçüsü: Derece ve Radyan",
                    summary: "Açıyı yay uzunluğuyla ölçmek.",
                    blocks: [
                        simple(R`Açıyı ölçmenin iki yolu var. <b>Derece</b>: tam tur 360 eşit parça. <b>Radyan</b>: yarıçap uzunluğunda bir ipi çemberin üzerine sardığında oluşan açı <b>1 radyan</b>dır. Tam tur $2\pi \approx 6{,}28$ radyandır.`),
                        def("Radyan", R`Merkezi $O$, yarıçapı 1 birim olan çembere <b>birim çember</b> denir. Birim çemberde, verilen bir açıya karşılık gelen yayın uzunluğuna o açının <b>radyan</b> olarak ölçüsü denir.`),
                        formula("Dönüşümler", R`Birim çemberin çevresi $2\pi$, tam açı $360^\circ$ olduğundan
                            $$2\pi \text{ radyan} = 360^\circ$$
                            $$1 \text{ radyan} = \frac{360^\circ}{2\pi} \approx 57^\circ, \qquad 1^\circ = \frac{2\pi}{360} \approx 0{,}02 \text{ radyan}$$
                            Yarıçapı $r$ olan çemberde $\theta$ radyanlık merkez açının gördüğü yay: $\;s = r\,\theta$.`),
                        table(R`<table class="mtable"><tr><th>Derece</th><td>0</td><td>30</td><td>45</td><td>60</td><td>90</td><td>120</td><td>135</td><td>150</td><td>180</td><td>270</td><td>360</td></tr>
                            <tr><th>Radyan</th><td>0</td><td>$\frac{\pi}{6}$</td><td>$\frac{\pi}{4}$</td><td>$\frac{\pi}{3}$</td><td>$\frac{\pi}{2}$</td><td>$\frac{2\pi}{3}$</td><td>$\frac{3\pi}{4}$</td><td>$\frac{5\pi}{6}$</td><td>$\pi$</td><td>$\frac{3\pi}{2}$</td><td>$2\pi$</td></tr></table>`),
                        widget("angle", "Açı ve yay", "Açıyı ve yarıçapı değiştir. Pembe yayın uzunluğu s = r·θ. Açıyı 57°'ye getir ve ne olduğunu gör!"),
                        ex(R`Yarıçapı 6 birim olan bir çemberde bir merkez açıya karşılık gelen yayın uzunluğu $2\pi$ birim olduğuna göre, merkez açının ölçüsü kaç radyandır?`, [
                            R`$s = r\theta$ formülünü kullan.`,
                            R`$2\pi = 6\,\theta$`,
                            R`$\theta = \dfrac{2\pi}{6} = \dfrac{\pi}{3}$`,
                        ], R`$\theta = \dfrac{\pi}{3}$ radyan, yani $60^\circ$.`),
                        ex(R`Bir çember 6 eş parçaya bölünüyor. Bir yaya karşılık gelen merkez açının ölçüsünü radyan cinsinden yazınız.`, [
                            R`Merkez açının tamamı $2\pi$ radyan.`,
                            R`$\theta = \dfrac{2\pi}{6} = \dfrac{\pi}{3}$`,
                        ], R`$\dfrac{\pi}{3}$ radyan.`),
                        quiz(R`$135^\circ$ kaç radyandır?`, [R`$\frac{\pi}{4}$`, R`$\frac{3\pi}{4}$`, R`$\frac{2\pi}{3}$`, R`$\frac{5\pi}{6}$`], 1, R`$135 \cdot \frac{\pi}{180} = \frac{3\pi}{4}$.`),
                    ],
                },
                {
                    id: "birim-cember", title: "Birim Çember: sin ve cos",
                    summary: "Noktanın yatay konumu cos, dikey konumu sin.",
                    blocks: [
                        simple(R`Yarıçapı 1 olan çemberin üzerinde bir nokta düşün. Açı $\theta$ iken noktanın <b>yatay</b> konumu $\cos\theta$, <b>dikey</b> konumu $\sin\theta$'dır. Bu kadar! Nokta çemberde döndükçe bu iki değer $-1$ ile $1$ arasında gidip gelir.`),
                        def("Tanım", R`Merkezi orijinde, yarıçapı 1 olan çember üzerinde $[OK]$ kenarı ile $\theta$ açısı yapan $[OP]$ yarıçapını çizelim. $P$ noktasının apsisine <b>$\cos\theta$</b> (kosinüs), ordinatına <b>$\sin\theta$</b> (sinüs) denir: $P(\cos\theta, \sin\theta)$. Buradan
                            $$-1 \leq \sin\theta \leq 1, \qquad -1 \leq \cos\theta \leq 1.$$`),
                        widget("unitCircle", "Birim çemberden dalgaya", "Açıyı değiştir. Soldaki çemberde mavi = cos, pembe = sin. Sağda aynı değerler bir dalga çiziyor.", { value: 30 }),
                        formula("Dik üçgende", R`Bir dik üçgende $\theta$ dar açısı için:
                            $$\sin\theta = \frac{\text{karşı dik kenar}}{\text{hipotenüs}}, \qquad \cos\theta = \frac{\text{komşu dik kenar}}{\text{hipotenüs}}$$
                            Diğer dört oran:
                            $$\tan\theta = \frac{\sin\theta}{\cos\theta}, \quad \cot\theta = \frac{\cos\theta}{\sin\theta}, \quad \sec\theta = \frac{1}{\cos\theta}, \quad \csc\theta = \frac{1}{\sin\theta}$$
                            Bu ifadelerin tanımlı olması için paydaların sıfırdan farklı olması gerekir.`),
                        tip(R`<b>I. bölge</b> ($0 < \theta < \frac{\pi}{2}$): $\cos > 0$, $\sin > 0$<br>
                            <b>II. bölge</b> ($\frac{\pi}{2} < \theta < \pi$): $\cos < 0$, $\sin > 0$<br>
                            <b>III. bölge</b> ($\pi < \theta < \frac{3\pi}{2}$): $\cos < 0$, $\sin < 0$<br>
                            <b>IV. bölge</b> ($\frac{3\pi}{2} < \theta < 2\pi$): $\cos > 0$, $\sin < 0$`, "Bölgelere göre işaretler"),
                        table(R`<table class="mtable"><tr><th>$\theta$</th><th>$\sin\theta$</th><th>$\cos\theta$</th><th>$\tan\theta$</th><th>$\cot\theta$</th></tr>
                            <tr><td>$0$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>tanımsız</td></tr>
                            <tr><td>$\pi/6$</td><td>$1/2$</td><td>$\sqrt3/2$</td><td>$1/\sqrt3$</td><td>$\sqrt3$</td></tr>
                            <tr><td>$\pi/4$</td><td>$\sqrt2/2$</td><td>$\sqrt2/2$</td><td>$1$</td><td>$1$</td></tr>
                            <tr><td>$\pi/3$</td><td>$\sqrt3/2$</td><td>$1/2$</td><td>$\sqrt3$</td><td>$1/\sqrt3$</td></tr>
                            <tr><td>$\pi/2$</td><td>$1$</td><td>$0$</td><td>tanımsız</td><td>$0$</td></tr>
                            <tr><td>$2\pi/3$</td><td>$\sqrt3/2$</td><td>$-1/2$</td><td>$-\sqrt3$</td><td>$-1/\sqrt3$</td></tr>
                            <tr><td>$3\pi/4$</td><td>$\sqrt2/2$</td><td>$-\sqrt2/2$</td><td>$-1$</td><td>$-1$</td></tr>
                            <tr><td>$5\pi/6$</td><td>$1/2$</td><td>$-\sqrt3/2$</td><td>$-1/\sqrt3$</td><td>$-\sqrt3$</td></tr>
                            <tr><td>$\pi$</td><td>$0$</td><td>$-1$</td><td>$0$</td><td>tanımsız</td></tr></table>`),
                        ex(R`$\cos\dfrac{2\pi}{3}$ ve $\sin\dfrac{2\pi}{3}$ ifadelerini hesaplayınız.`, [
                            R`$\dfrac{2\pi}{3} = 120^\circ$: karşılık gelen nokta II. bölgededir.`,
                            R`Referans açı $60^\circ$: $\cos 60^\circ = \frac12$, $\sin 60^\circ = \frac{\sqrt3}{2}$.`,
                            R`II. bölgede apsis (cos) negatif, ordinat (sin) pozitif: $P\left(-\frac12, \frac{\sqrt3}{2}\right)$.`,
                        ], R`$\cos\dfrac{2\pi}{3} = -\dfrac12$, $\sin\dfrac{2\pi}{3} = \dfrac{\sqrt3}{2}$. Genel olarak $\cos(\pi - \theta) = -\cos\theta$ ve $\sin(\pi - \theta) = \sin\theta$.`),
                        quiz(R`$\sin\theta < 0$ ve $\cos\theta > 0$ ise $\theta$ hangi bölgededir?`, ["I. bölge", "II. bölge", "III. bölge", "IV. bölge"], 3, R`cos (yatay) pozitif → sağda; sin (dikey) negatif → aşağıda. Sağ-alt = IV. bölge.`),
                    ],
                },
                {
                    id: "trig-ozdeslikler", title: "Temel Trigonometrik Özdeşlikler",
                    summary: "Her açı için doğru olan eşitlikler.",
                    blocks: [
                        simple(R`Özdeşlik, <b>her açı için</b> doğru olan bir eşitliktir. En önemlisi Pisagor'dan gelir: birim çemberdeki $P(\cos x, \sin x)$ noktasının orijine uzaklığı 1 olduğu için $\cos^2 x + \sin^2 x = 1$.`),
                        formula("Temel bağıntılar", R`$$\cos^2 x + \sin^2 x = 1$$
                            $(x, -y)$ noktası $(x, y)$'nin x-eksenine göre simetriği olduğundan:
                            $$\cos(-\theta) = \cos\theta, \qquad \sin(-\theta) = -\sin\theta$$`),
                        formula("Toplam ve fark formülleri", R`$$\cos(\theta \pm \gamma) = \cos\theta\cos\gamma \mp \sin\theta\sin\gamma$$
                            $$\sin(\theta \pm \gamma) = \sin\theta\cos\gamma \pm \cos\theta\sin\gamma$$
                            $$\tan(\theta \pm \gamma) = \frac{\tan\theta \pm \tan\gamma}{1 \mp \tan\theta\tan\gamma}$$`),
                        formula(R`İki kat formülleri ($\gamma = \theta$ alınarak)`,R`$$\cos 2\theta = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta$$
                            $$\sin 2\theta = 2\sin\theta\cos\theta, \qquad \tan 2\theta = \frac{2\tan\theta}{1 - \tan^2\theta}$$`),
                        formula("Dönüşüm formülleri", R`$$\sin\alpha\sin\beta = -\tfrac12\left[\cos(\alpha+\beta) - \cos(\alpha-\beta)\right]$$
                            $$\sin\alpha\cos\beta = \tfrac12\left[\sin(\alpha+\beta) + \sin(\alpha-\beta)\right]$$
                            $$\cos\alpha\cos\beta = \tfrac12\left[\cos(\alpha+\beta) + \cos(\alpha-\beta)\right]$$
                            $\alpha + \beta = p$, $\alpha - \beta = q$ konursa:
                            $$\sin p + \sin q = 2\sin\frac{p+q}{2}\cos\frac{p-q}{2}, \qquad \cos p + \cos q = 2\cos\frac{p+q}{2}\cos\frac{p-q}{2}$$`),
                        widget("graph", "Özdeşliği gözünle gör", "İki farklı yazılış aynı grafiği veriyorsa özdeşlik doğrudur. Kesikli ve kalın eğriler üst üste biniyor mu?", {
                            presets: [
                                { label: "sin²x + cos²x = 1", fns: [{ expr: "sin(x)^2", dash: true, width: 1.8, label: "sin²x", color: Cl.pink }, { expr: "cos(x)^2", dash: true, width: 1.8, label: "cos²x", color: Cl.blue }, { expr: "sin(x)^2+cos(x)^2", label: "toplam", color: Cl.green, width: 3.4 }] },
                                { label: "sin 2x = 2 sin x cos x", fns: [{ expr: "sin(2x)", label: "sin 2x", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "2sin(x)cos(x)", label: "2 sin x cos x", color: Cl.pink, dash: true, width: 2.4 }] },
                                { label: "cos(−x) = cos x", fns: [{ expr: "cos(-x)", label: "cos(−x)", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "cos(x)", label: "cos x", color: Cl.pink, dash: true, width: 2.4 }] },
                                { label: "cos 2x = 1 − 2sin²x", fns: [{ expr: "cos(2x)", label: "cos 2x", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "1-2sin(x)^2", label: "1 − 2sin²x", color: Cl.pink, dash: true, width: 2.4 }] },
                            ],
                            view: { xmin: -2 * PI, xmax: 2 * PI, ymin: -1.8, ymax: 1.8 }, piAxis: true, height: 260,
                        }),
                        ex(R`$\sin 75^\circ$ değerini hesaplayınız.`, [
                            R`$75^\circ = 45^\circ + 30^\circ$ yazalım.`,
                            R`$\sin(45^\circ + 30^\circ) = \sin 45^\circ\cos 30^\circ + \cos 45^\circ\sin 30^\circ$`,
                            R`$= \dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2} + \dfrac{\sqrt2}{2}\cdot\dfrac12 = \dfrac{\sqrt6 + \sqrt2}{4}$`,
                        ], R`$\sin 75^\circ = \dfrac{\sqrt6 + \sqrt2}{4} \approx 0{,}966$.`),
                        quiz(R`$\sin\theta = \frac35$ ve $\theta$ dar açı ise $\cos\theta$ kaçtır?`, [R`$\frac45$`, R`$\frac34$`, R`$\frac25$`, R`$\frac53$`], 0, R`$\cos^2\theta = 1 - \frac{9}{25} = \frac{16}{25}$, dar açıda cos pozitif: $\frac45$.`),
                    ],
                },
                {
                    id: "periyot", title: "Trigonometrik Fonksiyonlar ve Periyot",
                    summary: "Kendini tekrar eden fonksiyonlar.",
                    blocks: [
                        simple(R`Periyodik fonksiyon <b>kendini tekrar eden</b> fonksiyondur — saatin akrebi, mevsimler, kalp atışı gibi. Sinüs grafiği her $2\pi$'de bir aynı dalgayı çizer; bu tekrar uzunluğuna <b>periyot</b> denir.`),
                        p(R`Her $x$ yay uzunluğuna bir $\sin x$ ve bir $\cos x$ karşılık geldiğinden $f(x) = \sin x$ ve $g(x) = \cos x$ birer fonksiyondur. Bunlar ve bunlardan tanımlanan $\tan x = \frac{\sin x}{\cos x}$, $\cot x = \frac{\cos x}{\sin x}$, $\sec x = \frac{1}{\cos x}$, $\csc x = \frac{1}{\sin x}$ fonksiyonlarına <b>trigonometrik fonksiyonlar</b> denir.`),
                        def("Periyodik fonksiyon", R`$f: A \to \mathbb{R}$ verilsin. Her $x \in \mathbb{R}$ için
                            $$f(x + T) = f(x)$$
                            olacak şekilde pozitif bir $T$ sayısı varsa $f$ <b>periyodik</b> fonksiyondur ve $T$'ye $f$'nin bir <b>periyodu</b> denir. $T$ sayılarının en küçüğü varsa buna <b>esas periyot</b> denir.`),
                        widget("graph", "Altı trigonometrik fonksiyon", "Her birinin grafiğine bak: tekrar eden parçayı bul. tan, cot, sec ve csc'nin kopup sonsuza gittiği yerler paydanın sıfır olduğu yerlerdir.", {
                            presets: [
                                { label: "sin x", fns: [{ expr: "sin(x)", label: "y = sin x" }] },
                                { label: "cos x", fns: [{ expr: "cos(x)", label: "y = cos x" }] },
                                { label: "tan x", fns: [{ expr: "tan(x)", label: "y = tan x" }] },
                                { label: "cot x", fns: [{ expr: "cot(x)", label: "y = cot x" }] },
                                { label: "sec x", fns: [{ expr: "sec(x)", label: "y = sec x" }] },
                                { label: "csc x", fns: [{ expr: "csc(x)", label: "y = csc x" }] },
                            ],
                            view: { xmin: -2 * PI, xmax: 2 * PI, ymin: -4, ymax: 4 }, piAxis: true, height: 280,
                            readout: (pr, c, h) => [
                                "<b>sin x</b>: tanım kümesi ℝ, görüntü [−1, 1], esas periyot 2π, <b>tek</b> fonksiyon (orijine simetrik).",
                                "<b>cos x</b>: sin(x + π/2) = cos x olduğundan sinüsün π/2 sola kaymışıdır. Periyot 2π, <b>çift</b> fonksiyon.",
                                "<b>tan x</b>: cos x = 0 olan x = (2k + 1)π/2 noktalarında tanımsız. Esas periyot <b>π</b>, tek fonksiyon.",
                                "<b>cot x</b>: x = kπ noktalarında tanımsız. Esas periyot <b>π</b>, tek fonksiyon.",
                                "<b>sec x</b>: x ≠ (2k + 1)π/2. Periyot 2π, <b>çift</b> fonksiyon (y-eksenine simetrik).",
                                "<b>csc x</b>: x ≠ kπ. Periyot 2π, <b>tek</b> fonksiyon.",
                            ][h.presetIndex],
                        }),
                        formula("Teorem 1.1 — periyot formülleri", R`$m$ pozitif tam sayı, $a, b$ reel sayılar ve $a \neq 0$ olsun:
                            <ol>
                                <li>$\sin x$ ve $\cos x$'in periyodu $2\pi$; $\;\tan x$ ve $\cot x$'in periyodu $\pi$.</li>
                                <li>$\sin(ax + b)$ ve $\cos(ax + b)$'nin periyodu $\dfrac{2\pi}{|a|}$.</li>
                                <li>$\tan(ax + b)$ ve $\cot(ax + b)$'nin periyodu $\dfrac{\pi}{|a|}$.</li>
                                <li>$\sin^{2m}(ax + b)$ ve $\cos^{2m}(ax + b)$'nin periyodu $\dfrac{\pi}{|a|}$ (çift kuvvet).</li>
                                <li>$\sin^{2m-1}(ax + b)$ ve $\cos^{2m-1}(ax + b)$'nin periyodu $\dfrac{2\pi}{|a|}$ (tek kuvvet).</li>
                                <li>$\tan^m(ax + b)$ ve $\cot^m(ax + b)$'nin periyodu $\dfrac{\pi}{|a|}$.</li>
                            </ol>`),
                        widget("graph", "Dalga ayarlayıcı", "a dalganın yüksekliğini (genlik), b sıklığını, c ise kaymasını belirler. Periyodun nasıl değiştiğini izle.", {
                            fns: [
                                { expr: "sin(x)", dash: true, width: 1.6, color: Cl.gray, label: "sin x", trace: false, noExport: true },
                                { expr: "a*sin(b*x+c)", label: "y = a·sin(bx + c)", color: Cl.pink, width: 3.2 },
                            ],
                            params: { a: { min: -3, max: 3, step: 0.5, value: 2 }, b: { min: 0.5, max: 4, step: 0.5, value: 2 }, c: { min: -3, max: 3, step: 0.25, value: 0 } },
                            view: { xmin: -2 * PI, xmax: 2 * PI, ymin: -3.5, ymax: 3.5 }, piAxis: true, height: 280,
                            readout: (pr) => {
                                const per = (2 * PI) / Math.abs(pr.b);
                                const pf = MathParser.piFrac(per);
                                return `Periyot = ${T(`\\frac{2\\pi}{|b|} = \\frac{2\\pi}{${F(pr.b)}}`)} = <b>${pf || F(per, 3)}</b> &nbsp;·&nbsp; Genlik = |a| = <b>${F(Math.abs(pr.a))}</b> → değerler ${T(`[-${F(Math.abs(pr.a))}, ${F(Math.abs(pr.a))}]`)} arasında.`;
                            },
                        }),
                        ex(R`$f(x) = x - \llbracket x\rrbracket $ fonksiyonu periyodik midir? Periyodik ise esas periyodunu bulunuz.`, [
                            R`$m$ pozitif bir tam sayı olsun: $f(x + m) = x + m - \llbracket x + m\rrbracket  = x + m - (\llbracket x\rrbracket  + m) = x - \llbracket x\rrbracket  = f(x)$.`,
                            R`Her pozitif tam sayı bir periyottur. Bunların en küçüğü 1'dir.`,
                        ], R`Evet, esas periyodu 1'dir. Grafiğinin $[0, 1)$'deki parçası arka arkaya kopyalanır.`),
                        ex(R`$f(x) = \sin^4 x + \cos^4 x$'in esas periyodunu bulunuz.`, [
                            R`Teoreme göre $\sin^4 x$ ve $\cos^4 x$'in esas periyodu $\pi$; yani $\pi$, $f$'nin bir periyodudur.`,
                            R`Fakat $f\left(x + \frac{\pi}{2}\right) = \sin^4\left(x + \frac\pi2\right) + \cos^4\left(x + \frac\pi2\right) = \cos^4 x + \sin^4 x = f(x)$.`,
                        ], R`$\frac{\pi}{2}$ de bir periyottur. <b>Sonuç 1.1:</b> $f$ ve $g$'nin esas periyodu $T$ ise $T$, $f \pm g$'nin bir periyodudur ama esas periyodu olmayabilir.`),
                        quiz(R`$f(x) = \sin(3x + 1)$ fonksiyonunun esas periyodu nedir?`, [R`$2\pi$`, R`$\frac{2\pi}{3}$`, R`$\frac{\pi}{3}$`, R`$3\pi$`], 1, R`$\frac{2\pi}{|a|} = \frac{2\pi}{3}$.`),
                        quiz(R`$\tan(2x)$'in esas periyodu nedir?`, [R`$\pi$`, R`$\frac{\pi}{2}$`, R`$2\pi$`, R`$\frac{\pi}{4}$`], 1, R`Tanjant için $\frac{\pi}{|a|} = \frac{\pi}{2}$.`),
                    ],
                },
                {
                    id: "sinus-kosinus", title: "Sinüs ve Kosinüs Teoremi",
                    summary: "Her üçgende kenar ve açı hesabı.",
                    blocks: [
                        simple(R`Dik olmayan üçgenlerde de eksik kenar ve açıları bulabiliriz. <b>Sinüs teoremi</b>: her kenarın, karşısındaki açının sinüsüne oranı aynıdır. <b>Kosinüs teoremi</b>: Pisagor teoreminin her üçgen için genelleşmiş hâlidir.`),
                        def("Teorem 1.2 — Sinüs teoremi", R`$ABC$ üçgeninin çevrel çemberinin yarıçapı $R$ olsun.
                            $$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$$`),
                        def("Teorem 1.3 — Kosinüs teoremi", R`Bir $ABC$ üçgeninde $|BC| = a$, $|AC| = b$, $|AB| = c$ olsun. Köşe açıları $A, B, C$ ise
                            $$a^2 = b^2 + c^2 - 2bc\cos A$$
                            $$b^2 = a^2 + c^2 - 2ac\cos B$$
                            $$c^2 = a^2 + b^2 - 2ab\cos C$$`),
                        tip(R`$C = 90^\circ$ ise $\cos C = 0$ olur ve kosinüs teoremi $c^2 = a^2 + b^2$, yani <b>Pisagor teoremi</b> olur!`, "Pisagor nerede?"),
                        widget("triangle", "Üçgen hesaplayıcı", "İki kenarı ve aradaki açıyı ayarla; üçüncü kenar kosinüs teoremiyle, diğer açılar sinüs teoremiyle hesaplanır. Başlangıç değerleri kitaptaki örnek."),
                        ex(R`Bir $ABC$ üçgeninde $m(\hat A) = 75^\circ$, $m(\hat B) = 60^\circ$, $|AB| = c = 8$ br olduğuna göre $|AC|$ kenar uzunluğunu bulunuz.`, [
                            R`$m(\hat C) = 180^\circ - (75^\circ + 60^\circ) = 45^\circ$.`,
                            R`Sinüs teoremi: $\dfrac{b}{\sin B} = \dfrac{c}{\sin C} \Rightarrow \dfrac{b}{\sin 60^\circ} = \dfrac{8}{\sin 45^\circ}$`,
                            R`$\dfrac{b}{\frac{\sqrt3}{2}} = \dfrac{8}{\frac{\sqrt2}{2}} \Rightarrow b = \dfrac{8\sqrt3}{\sqrt2} = 4\sqrt6$`,
                        ], R`$|AC| = b = 4\sqrt6 \approx 9{,}8$ br.`),
                        ex(R`Bir $ABC$ üçgeninde $a = 3$, $b = 5$ ve $m(\hat C) = 120^\circ$ ise $c$ kaç birimdir?`, [
                            R`Kosinüs teoremi: $c^2 = a^2 + b^2 - 2ab\cos C$`,
                            R`$= 9 + 25 - 2\cdot 3\cdot 5\cdot\left(-\dfrac12\right) = 34 + 15 = 49$`,
                        ], R`$c = 7$ birim.`),
                        quiz(R`Kenarları 5, 5, 5 olan üçgende bir iç açının kosinüsü kaçtır?`, ["0", R`$\frac12$`, R`$\frac{\sqrt3}{2}$`, "1"], 1, R`Eşkenar üçgende açılar $60^\circ$; $\cos 60^\circ = \frac12$. Kosinüs teoremiyle: $25 = 25 + 25 - 50\cos A \Rightarrow \cos A = \frac12$.`),
                    ],
                },
            ],
        },

        /* =========================== 1.5 =========================== */
        {
            no: "1.5", title: "Ters Trigonometrik Fonksiyonlar", page: 63,
            lessons: [
                {
                    id: "arcsin-arccos", title: "Arksinüs ve Arkkosinüs",
                    summary: "“Sinüsü bu olan açı kaç?”",
                    blocks: [
                        simple(R`$\arcsin$ soruyu tersine çevirir: “Sinüsü $\frac12$ olan açı kaç?” Cevap: $\frac{\pi}{6}$. Ama sinüsü $\frac12$ olan <b>sonsuz</b> açı var ($\frac\pi6, \frac{5\pi}{6}, \frac{13\pi}{6}, \ldots$). Bu yüzden cevabı her zaman <b>tek bir aralıktan</b> seçeriz.`),
                        p(R`$\sin x$ fonksiyonu $\mathbb{R}$'de birebir değildir, bu yüzden tersi yoktur. Ama onu $\left[-\frac\pi2, \frac\pi2\right]$ aralığına kısıtlarsak ve değer kümesi olarak $[-1, 1]$'i alırsak, birebir örten bir fonksiyon olur. Bu kısıtlanmış fonksiyonun tersi vardır.`),
                        def("Arksinüs", R`$\sin : \left[-\frac\pi2, \frac\pi2\right] \to [-1, 1]$ fonksiyonunun tersine <b>arksinüs</b> denir ($\arcsin$ veya $\sin^{-1}$):
                            $$u = \arcsin v \iff \sin u = v \text{ ve } u \in \left[-\tfrac\pi2, \tfrac\pi2\right]$$`),
                        def("Arkkosinüs", R`$\cos : [0, \pi] \to [-1, 1]$ fonksiyonu birebir örtendir; tersine <b>arkkosinüs</b> denir:
                            $$u = \arccos v \iff \cos u = v \text{ ve } u \in [0, \pi]$$`),
                        widget("arcfn", "Ters fonksiyon aynası", "Mavi kalın kısım kısıtlanmış sin/cos, pembe onun tersi. v değerini seç (ya da hazır değerlere dokun) ve açıyı oku.", { fns: ["sin", "cos"] }),
                        ex(R`$\arcsin\dfrac{\sqrt3}{2}$ ve $\arcsin\left(-\dfrac12\right)$ ifadelerini hesaplayınız.`, [
                            R`$\arcsin\dfrac{\sqrt3}{2} = u \iff \sin u = \dfrac{\sqrt3}{2}$ ve $u \in \left[-\frac\pi2, \frac\pi2\right]$ → $u = \dfrac\pi3$.`,
                            R`$\arcsin\left(-\dfrac12\right) = t \iff \sin t = -\dfrac12$ ve $t \in \left[-\frac\pi2, \frac\pi2\right]$ → $t = -\dfrac\pi6$.`,
                        ], R`$\arcsin\dfrac{\sqrt3}{2} = \dfrac\pi3$, $\quad\arcsin\left(-\dfrac12\right) = -\dfrac\pi6$.`),
                        ex(R`$\arccos 1$ ve $\arccos\left(-\dfrac{\sqrt3}{2}\right)$ ifadelerini hesaplayınız.`, [
                            R`$\arccos 1 = u \iff \cos u = 1$, $u \in [0, \pi]$ → $u = 0$.`,
                            R`$\arccos\left(-\dfrac{\sqrt3}{2}\right) = t \iff \cos t = -\dfrac{\sqrt3}{2}$, $t \in [0, \pi]$ → $t = \dfrac{5\pi}{6}$.`,
                        ], R`$\arccos 1 = 0$, $\quad\arccos\left(-\dfrac{\sqrt3}{2}\right) = \dfrac{5\pi}{6}$.`),
                        warn(R`$\arcsin 2$ <b>tanımsızdır</b>: sinüs hiçbir zaman 1'den büyük olamaz. $\arcsin$ ve $\arccos$'un tanım kümesi $[-1, 1]$'dir.`),
                        quiz(R`$\arccos 0$ kaçtır?`, ["0", R`$\frac{\pi}{2}$`, R`$\pi$`, R`$-\frac{\pi}{2}$`], 1, R`$\cos u = 0$ ve $u \in [0, \pi]$ → $u = \frac{\pi}{2}$.`),
                    ],
                },
                {
                    id: "arctan-arccot", title: "Arktanjant ve Arkkotanjant",
                    summary: "Her reel sayı için bir açı.",
                    blocks: [
                        simple(R`Tanjant her reel değeri alabildiği için $\arctan$ <b>her reel sayı için</b> tanımlıdır ve cevap hep $\left(-\frac\pi2, \frac\pi2\right)$ arasındadır. “Tanjantı bu olan açı kaç?” sorusunun cevabıdır.`),
                        def("Arktanjant", R`$\tan : \left(-\frac\pi2, \frac\pi2\right) \to \mathbb{R}$ fonksiyonunun tersine <b>arktanjant</b> denir; $\tan^{-1} : \mathbb{R} \to \left(-\frac\pi2, \frac\pi2\right)$:
                            $$u = \arctan v \iff v = \tan u \text{ ve } u \in \left(-\tfrac\pi2, \tfrac\pi2\right)$$`),
                        def("Arkkotanjant", R`Kotanjant $(0, \pi)$ aralığında birebir örten olduğundan tersi vardır:
                            $$u = \text{arccot}\, v \iff v = \cot u \text{ ve } u \in (0, \pi)$$`),
                        widget("arcfn", "Arktanjant ve arkkotanjant", "Değeri büyüttükçe arctan'ın π/2'ye yaklaştığını ama asla ulaşmadığını gör.", { fns: ["tan", "cot"] }),
                        ex(R`$\arctan(-\sqrt3)$ ve $\arctan 1$ ifadelerini hesaplayınız.`, [
                            R`$\arctan(-\sqrt3) = u \iff \tan u = -\sqrt3$, $u \in \left(-\frac\pi2, \frac\pi2\right)$ → $u = -\dfrac\pi3$.`,
                            R`$\arctan 1 = t \iff \tan t = 1$ → $t = \dfrac\pi4$.`,
                        ], R`$\arctan(-\sqrt3) = -\dfrac\pi3$, $\quad\arctan 1 = \dfrac\pi4$.`),
                        ex(R`$\text{arccot}\left(-\dfrac{1}{\sqrt3}\right)$ ve $\text{arccot}\,\sqrt3$ ifadelerini hesaplayınız.`, [
                            R`$u = \text{arccot}\left(-\dfrac{1}{\sqrt3}\right) \iff \cot u = -\dfrac{1}{\sqrt3}$, $u \in (0, \pi)$ → $u = \dfrac{2\pi}{3}$.`,
                            R`$a = \text{arccot}\,\sqrt3 \iff \cot a = \sqrt3$ → $a = \dfrac\pi6$.`,
                        ], R`$\dfrac{2\pi}{3}$ ve $\dfrac{\pi}{6}$.`),
                        tip(R`$y = \arctan x$ grafiği iki yatay doğruya yaklaşır ama asla değmez: $y = -\frac\pi2$ ve $y = \frac\pi2$. Bu doğrulara <b>yatay asimptot</b> denir.`, "Grafik ipucu"),
                        quiz(R`$\arctan 0$ kaçtır?`, ["0", R`$\frac{\pi}{2}$`, R`$\pi$`, "tanımsız"], 0, R`$\tan 0 = 0$ ve $0 \in \left(-\frac\pi2, \frac\pi2\right)$.`),
                    ],
                },
            ],
        },

        /* =========================== 1.6 =========================== */
        {
            no: "1.6", title: "Üstel ve Logaritmik Fonksiyonlar", page: 69,
            lessons: [
                {
                    id: "ustel", title: "Üstel Fonksiyon",
                    summary: "Katlanarak büyüme.",
                    blocks: [
                        simple(R`Üstel fonksiyonda değişken <b>üste</b> çıkar: $2^x$. Her adımda <b>katlanarak</b> büyür — bakteriler, bileşik faiz, sosyal medyada yayılan bir video böyle büyür.`),
                        ex(R`Başlangıçta 1 milyon üyeye sahip olan bir bakteri topluluğunda üye sayısı her saatte bir önceki saatin 3 katına çıkıyor. $t$ saat sonra topluluk kaç milyon üyeli olur? $t = \frac52$ için hesaplayınız.`, [
                            R`Başlangıçta $f(0) = 1$ milyon. 1 saat sonra $f(1) = 3$, 2 saat sonra $f(2) = 3\cdot 3 = 3^2$, 3 saat sonra $f(3) = 3^3$ milyon.`,
                            R`Kalıp belli: $t$ saat sonra $f(t) = 3^t$ milyon.`,
                            R`$f\left(\frac52\right) = 3^{5/2} = \left(\sqrt3\right)^5 = \sqrt{3^5} = \sqrt{243} \approx 15{,}588457$`,
                        ], R`Yaklaşık 15 588 457 üye.`),
                        def("Tanım", R`$a$, 1'den farklı pozitif bir sayı olsun. $f(x) = a^x$ biçiminde tanımlanan fonksiyona <b>üstel fonksiyon</b> denir.<br>Her $x$ için $a^x > 0$ olduğundan $f(x) = a^x$'in görüntü kümesi pozitif reel sayılar kümesi $\mathbb{R}^+$'dır; grafik daima x-ekseninin üstündedir.`),
                        widget("graph", "Taban ayarlayıcı", "a'yı değiştir: 1'den büyükken artan, 0 ile 1 arasındayken azalan. Her durumda grafik (0, 1)'den geçer.", {
                            fns: [{ expr: "a^x", label: (pr) => `y = ${F(pr.a)}ˣ` }],
                            params: { a: { min: 0.2, max: 4, step: 0.1, value: 2 } },
                            view: { xmin: -4, xmax: 4, ymin: -1, ymax: 8 }, height: 280,
                            extras: () => [{ type: "point", x: 0, y: 1, color: Cl.orange, label: "(0, 1)", labelPos: "nw" }],
                            readout: (pr) => Math.abs(pr.a - 1) < 1e-9
                                ? `<span class="bad">a = 1 üstel fonksiyon değildir</span>: 1ˣ = 1 sabit fonksiyon.`
                                : pr.a > 1 ? `a = ${F(pr.a)} > 1 → <span class="good">artan</span>: x₁ < x₂ ise a^x₁ < a^x₂.` : `0 < a = ${F(pr.a)} < 1 → <span class="bad">azalan</span>: x₁ < x₂ ise a^x₁ > a^x₂.`,
                        }),
                        formula("Üs kuralları", R`$$a^0 = 1, \qquad a^1 = a, \qquad a^{x+t} = a^x \cdot a^t$$
                            $$a^{-x} = \frac{1}{a^x}, \qquad (a^x)^t = a^{xt}, \qquad a^x \cdot b^x = (ab)^x$$
                            $$a^x = a^t \iff x = t$$`),
                        ex(R`Aşağıda kuralları verilen fonksiyonlardan hangileri birer üstel fonksiyondur?<br>(a) $f(x) = 2^{-x}$ (b) $g(x) = 3^{2x}$ (c) $h(x) = 4^{x/5}$ (d) $s(x) = (-7)^x$`, [
                            R`(a) $f(x) = 2^{-x} = \left(\frac12\right)^x$ → üstel (taban $\frac12$).`,
                            R`(b) $g(x) = 3^{2x} = (3^2)^x = 9^x$ → üstel.`,
                            R`(c) $h(x) = 4^{x/5} = \left(\sqrt[5]{4}\right)^x$ → üstel.`,
                            R`(d) Taban $a = -7$ pozitif değil → üstel <b>değil</b>.`,
                        ], R`(a), (b), (c) üstel fonksiyon; (d) değil.`),
                        quiz(R`$f(x) = (0{,}5)^x$ için hangisi doğrudur?`, ["Artandır", "Azalandır", "Sabittir", "Negatif değerler alır"], 1, R`Taban $0 < 0{,}5 < 1$ olduğundan azalan.`),
                    ],
                },
                {
                    id: "logaritma", title: "Logaritma Fonksiyonu",
                    summary: "Üstel fonksiyonun tersi.",
                    blocks: [
                        simple(R`Logaritma bir <b>sorudur</b>: “2'yi kaçıncı kuvvete yükseltirsem 32 olur?” Cevap 5, yani $\log_2 32 = 5$. Logaritma, üstel fonksiyonun <b>tersidir</b>.`),
                        def("Tanım", R`$y = a^x$ grafiğinden görüldüğü gibi $f(x) = a^x$ ile tanımlanan $f: \mathbb{R} \to \mathbb{R}^+$ fonksiyonu birebir örtendir. Dolayısıyla tersi vardır; bu ters fonksiyona <b>logaritma fonksiyonu</b> denir ve $y = \log_a x$ biçiminde yazılır (“a tabanına göre logaritma x”). $x > 0$ için
                            $$y = \log_a x \iff x = a^y.$$`),
                        p(R`$\log_a x$ ifadesinde $a$ sayısına <b>taban</b>, $x$ sayısına <b>logaritması alınan sayı</b> denir. Tanımlı olması için $a > 0$, $a \neq 1$ ve $x > 0$ olmalıdır.
                            <ul>
                                <li>10 tabanına göre logaritmaya <b>bayağı logaritma</b> denir, $\log x$ yazılır.</li>
                                <li>$e \approx 2{,}7182818\ldots$ tabanına göre logaritmaya <b>doğal logaritma</b> denir, $\ln x$ yazılır: $y = \ln x \iff e^y = x$.</li>
                            </ul>`),
                        widget("explog", "Üstel ve logaritma: ayna ikizleri", "Tabanı değiştir. Mavi aˣ ile pembe logₐx her zaman y = x doğrusuna göre birbirinin yansıması."),
                        p(R`$f$ ile $f^{-1}$'in grafikleri $y = x$ doğrusuna göre simetrik olduğundan $y = a^x$ ve $y = \log_a x$ eğrileri de $y = x$'e göre simetriktir. $f$ artan olduğunda $f^{-1}$ de artan olacağından, $a > 1$ için $y = \log_a x$ artan; $0 < a < 1$ için azalandır.`),
                        ex(R`$\log_2 32$, $\log_8 4$ ve $\log_{\frac13}\frac19$ sayılarını hesaplayınız.`, [
                            R`$\log_2 32 = u \iff 2^u = 32 = 2^5 \Rightarrow u = 5$.`,
                            R`$\log_8 4 = v \iff 8^v = 4 \iff (2^3)^v = 2^2 \iff 2^{3v} = 2^2 \Rightarrow 3v = 2 \Rightarrow v = \frac23$.`,
                            R`$\log_{\frac13}\frac19 = s \iff \left(\frac13\right)^s = \frac19 \iff 3^{-s} = 3^{-2} \Rightarrow s = 2$.`,
                        ], R`$\log_2 32 = 5$, $\;\log_8 4 = \frac23$, $\;\log_{\frac13}\frac19 = 2$.`),
                        widget("logcalc", "Logaritma hesaplayıcı", "Taban ve sayıyı gir: logaritmanın sorduğu soruyu ve cevabını gör."),
                        quiz(R`$\log_3 81$ kaçtır?`, ["3", "4", "9", "27"], 1, R`$3^4 = 81$.`),
                    ],
                },
                {
                    id: "log-kurallari", title: "Logaritma Kuralları",
                    summary: "Çarpmayı toplamaya çeviren araç.",
                    blocks: [
                        simple(R`Logaritma <b>çarpmayı toplamaya</b>, bölmeyi çıkarmaya, kuvvet almayı çarpmaya çevirir. Hesap makinesi yokken büyük sayıları çarpmak için insanlar bu yüzden logaritma tabloları kullanırdı!`),
                        formula("Kurallar", R`$a, b, c$ uygun tabanlar ($> 0$, $\neq 1$), $x, t, y > 0$ olsun:
                            $$\log_a a = 1, \qquad \log_a 1 = 0$$
                            $$\log_a(x\cdot t) = \log_a x + \log_a t, \qquad \log_a\frac{x}{y} = \log_a x - \log_a y$$
                            $$\log_a x^k = k\log_a x \quad (k \in \mathbb{R})$$
                            $$\log_a b = \frac{\log_c b}{\log_c a} \;\text{(taban değiştirme)}, \qquad \log_a b = \frac{1}{\log_b a}$$
                            $$\log_{a^n} b^m = \frac{m}{n}\log_a b, \qquad a^{\log_a x} = x$$`),
                        ex(R`$\log_a(x\cdot t) = \log_a x + \log_a t$ kuralı nereden geliyor?`, [
                            R`$\log_a x = u$ ve $\log_a t = v$ olsun. Tanım gereği $a^u = x$ ve $a^v = t$.`,
                            R`Çarpalım: $x\cdot t = a^u \cdot a^v = a^{u+v}$.`,
                            R`Yine tanım gereği: $\log_a(x\cdot t) = u + v$.`,
                        ], R`$\log_a(x\cdot t) = \log_a x + \log_a t$. Üs kuralı $a^{u+v} = a^u a^v$'nin logaritma dilindeki hâli!`),
                        ex(R`$\log_2 8^{15}$ ifadesini hesaplayınız.`, [
                            R`Kuvvet kuralı: $\log_2 8^{15} = 15\log_2 8$.`,
                            R`$= 15\log_2 2^3 = 15\cdot 3\cdot\log_2 2 = 15\cdot 3\cdot 1$.`,
                        ], R`$45$.`),
                        ex(R`$\log_{\frac19} 243$ ifadesinin değerini bulunuz.`, [
                            R`Hepsini 3'ün kuvveti olarak yaz: $\frac19 = 3^{-2}$, $243 = 3^5$.`,
                            R`$\log_{3^{-2}} 3^5 = \dfrac{5}{-2}\log_3 3 = -\dfrac52$.`,
                        ], R`$-\dfrac52$.`),
                        ex(R`$3^{\log_3 7} + 3^{\log_3 2}$ işleminin sonucunu bulunuz.`, [
                            R`$a^{\log_a x} = x$ kuralı: $3^{\log_3 7} = 7$ ve $3^{\log_3 2} = 2$.`,
                        ], R`$7 + 2 = 9$.`),
                        widget("graph", "Kuralı grafikte doğrula", "ln(2x) ile ln 2 + ln x aynı eğri mi? Kalın ve kesikli eğriler üst üste biniyorsa kural doğru.", {
                            presets: [
                                { label: "ln(2x) = ln 2 + ln x", fns: [{ expr: "ln(2x)", label: "ln(2x)", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "ln(2)+ln(x)", label: "ln 2 + ln x", color: Cl.pink, dash: true, width: 2.4 }] },
                                { label: "ln(x³) = 3 ln x", fns: [{ expr: "ln(x^3)", label: "ln(x³)", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "3ln(x)", label: "3 ln x", color: Cl.pink, dash: true, width: 2.4 }] },
                                { label: "log₂x = ln x / ln 2", fns: [{ expr: "log(2, x)", label: "log₂ x", color: Cl.blue, width: 5, alpha: 0.4 }, { expr: "ln(x)/ln(2)", label: "ln x / ln 2", color: Cl.pink, dash: true, width: 2.4 }] },
                            ],
                            view: { xmin: -0.5, xmax: 8, ymin: -3, ymax: 4 }, height: 260,
                        }),
                        quiz(R`$\log_5 25 + \log_5 5$ kaçtır?`, ["2", "3", "5", "30"], 1, R`$2 + 1 = 3$. (Ya da $\log_5 125 = 3$.)`),
                        quiz(R`$\log 1000$ (10 tabanında) kaçtır?`, ["2", "3", "10", "100"], 1, R`$10^3 = 1000$.`),
                        quiz(R`$\ln e^4$ kaçtır?`, ["1", "e", "4", "4e"], 2, R`$\ln e^4 = 4\ln e = 4$.`),
                    ],
                },
            ],
        },

        /* =========================== 1.7 =========================== */
        {
            no: "1.7", title: "Hiperbolik Fonksiyonlar ve Tersleri", page: 73,
            lessons: [
                {
                    id: "hiperbolik", title: "Hiperbolik Fonksiyonlar",
                    summary: "eˣ'in çift ve tek parçaları.",
                    blocks: [
                        simple(R`Hiperbolik fonksiyonlar $e^x$ ile $e^{-x}$'in <b>ortalaması</b> ve <b>yarı farkı</b>dır. İsimleri trigonometrik fonksiyonlara benzer çünkü formülleri de çok benzer. İki ucundan tutulan bir zincirin ya da elektrik telinin aldığı şekil $\cosh x$ grafiğidir!`),
                        p(R`Simetrik bir küme üzerinde tanımlı her $f$ fonksiyonu için
                            $$f(x) = \underbrace{\frac{f(x) + f(-x)}{2}}_{\text{çift}} + \underbrace{\frac{f(x) - f(-x)}{2}}_{\text{tek}}$$
                            olduğundan, her fonksiyon biri çift biri tek iki fonksiyonun toplamı şeklinde yazılabilir. $f(x) = e^x$ fonksiyonunun çift ve tek parçalarına sırasıyla <b>hiperbolik kosinüs</b> ve <b>hiperbolik sinüs</b> denir.`),
                        def("Tanım", R`$$\cosh x = \frac{e^x + e^{-x}}{2}, \qquad \sinh x = \frac{e^x - e^{-x}}{2}$$
                            Diğerleri trigonometrideki gibi tanımlanır:
                            $$\tanh x = \frac{\sinh x}{\cosh x} = \frac{e^x - e^{-x}}{e^x + e^{-x}}, \qquad \coth x = \frac{\cosh x}{\sinh x} \;(x \neq 0)$$
                            $$\text{sech}\, x = \frac{1}{\cosh x} = \frac{2}{e^x + e^{-x}}, \qquad \text{csch}\, x = \frac{1}{\sinh x} \;(x \neq 0)$$`),
                        widget("graph", "Hiperbolik fonksiyonlar", "Her birinin grafiğini incele. cosh'ta kesikli eğriler eˣ/2 ve e⁻ˣ/2: cosh onların toplamı.", {
                            presets: [
                                { label: "cosh x", fns: [{ expr: "e^x/2", dash: true, width: 1.6, color: Cl.gray, trace: false, label: "eˣ/2" }, { expr: "e^(-x)/2", dash: true, width: 1.6, color: Cl.gray, trace: false, label: "e⁻ˣ/2" }, { expr: "cosh(x)", label: "y = cosh x" }] },
                                { label: "sinh x", fns: [{ expr: "e^x/2", dash: true, width: 1.6, color: Cl.gray, trace: false, label: "eˣ/2" }, { expr: "-e^(-x)/2", dash: true, width: 1.6, color: Cl.gray, trace: false, label: "−e⁻ˣ/2" }, { expr: "sinh(x)", label: "y = sinh x" }] },
                                { label: "tanh x", fns: [{ expr: "tanh(x)", label: "y = tanh x" }] },
                                { label: "coth x", fns: [{ expr: "coth(x)", label: "y = coth x" }] },
                                { label: "sech x", fns: [{ expr: "sech(x)", label: "y = sech x" }] },
                                { label: "csch x", fns: [{ expr: "csch(x)", label: "y = csch x" }] },
                            ],
                            view: { xmin: -4, xmax: 4, ymin: -3, ymax: 4 }, height: 290,
                            extras: (pr, c, pi) => (pi === 2 || pi === 3 ? [{ type: "hline", y: 1, color: Cl.orange, width: 1.3, label: "y = 1" }, { type: "hline", y: -1, color: Cl.orange, width: 1.3, label: "y = −1" }] : []),
                            readout: (pr, c, h) => [
                                "<b>cosh</b>: çift fonksiyon, en küçük değeri cosh 0 = 1. [0, ∞) üzerinde artan.",
                                "<b>sinh</b>: tek fonksiyon, ℝ üzerinde artan; sinh 0 = 0.",
                                "<b>tanh</b>: tek, ℝ'de artan; −1 < tanh x < 1 (turuncu doğrulara yaklaşır, değmez).",
                                "<b>coth</b>: x = 0'da tanımsız; (−∞, 0) ve (0, ∞) aralıklarında azalan. |coth x| > 1.",
                                "<b>sech</b>: çift fonksiyon; [0, ∞) üzerinde azalan; 0 < sech x ≤ 1.",
                                "<b>csch</b>: tek fonksiyon, x = 0'da tanımsız; (−∞, 0) ve (0, ∞)'da azalan.",
                            ][h.presetIndex],
                        }),
                        formula("Temel bağıntılar", R`$$\cosh^2 x - \sinh^2 x = 1$$
                            $$\cosh 2x = \cosh^2 x + \sinh^2 x, \qquad \sinh 2x = 2\sinh x\cosh x$$
                            $$\cosh^2 x = \tfrac12(\cosh 2x + 1), \qquad \sinh^2 x = \tfrac12(\cosh 2x - 1)$$
                            $$\cosh(x + y) = \cosh x\cosh y + \sinh x\sinh y$$
                            $$\sinh(x + y) = \sinh x\cosh y + \cosh x\sinh y$$
                            $$\text{csch}^2 x = \coth^2 x - 1, \qquad \text{sech}^2 x = 1 - \tanh^2 x$$`),
                        tip(R`Trigonometride $\cos^2 x + \sin^2 x = 1$ iken hiperbolikte $\cosh^2 x - \sinh^2 x = 1$. Tek fark bir işaret! $(\cos t, \sin t)$ noktaları çember çizer; $(\cosh t, \sinh t)$ noktaları ise <b>hiperbol</b> çizer — isim buradan gelir.`, "Trigonometriyle karşılaştır"),
                        ex(R`$\cosh^2 x - \sinh^2 x = 1$ olduğunu gösteriniz.`, [
                            R`$\cosh^2 x = \left(\dfrac{e^x + e^{-x}}{2}\right)^2 = \dfrac{e^{2x} + 2 + e^{-2x}}{4}$`,
                            R`$\sinh^2 x = \left(\dfrac{e^x - e^{-x}}{2}\right)^2 = \dfrac{e^{2x} - 2 + e^{-2x}}{4}$`,
                            R`Fark: $\dfrac{(e^{2x} + 2 + e^{-2x}) - (e^{2x} - 2 + e^{-2x})}{4} = \dfrac{4}{4} = 1$`,
                        ], R`$\cosh^2 x - \sinh^2 x = 1$ ✓ (Not: $e^x \cdot e^{-x} = 1$ olduğu için orta terim $2$ çıktı.)`),
                        p(R`Ayrıca $\cosh(-x) = \cosh x$ ve $\text{sech}(-x) = \text{sech}\, x$ olduğundan bu ikisi <b>çift</b>; $\sinh(-x) = -\sinh x$ ve $\text{csch}(-x) = -\text{csch}\, x$ olduğundan bunlar <b>tek</b> fonksiyondur. $e^{2x} + 1 > 1$ olduğundan $\tanh x$ her yerde tanımlıdır ve $-1 < \tanh x < 1$'dir.`),
                        quiz(R`$\cosh 0$ kaçtır?`, ["0", "1", "e", "tanımsız"], 1, R`$\cosh 0 = \frac{e^0 + e^0}{2} = \frac{1 + 1}{2} = 1$.`),
                        quiz(R`$\tanh x$ fonksiyonunun görüntü kümesi nedir?`, [R`$\mathbb{R}$`, R`$(-1, 1)$`, R`$[0, \infty)$`, R`$(0, 1)$`], 1, R`$-1 < \tanh x < 1$; uçlara yaklaşır ama ulaşmaz.`),
                    ],
                },
                {
                    id: "hiperbolik-ters", title: "Ters Hiperbolik Fonksiyonlar",
                    summary: "Birebir oldukları aralıklarda tersler.",
                    blocks: [
                        simple(R`Hiperbolik fonksiyonları <b>birebir oldukları aralıklarda</b> kısıtlarsak tersleri olur. Her ters fonksiyonda olduğu gibi grafikleri $y = x$ doğrusuna göre aynadır.`),
                        formula("Birebir örten oldukları aralıklar", R`$$\cosh : [0, \infty) \to [1, \infty), \qquad \sinh : (-\infty, \infty) \to (-\infty, \infty)$$
                            $$\tanh : (-\infty, \infty) \to (-1, 1), \qquad \coth : (0, \infty) \to (1, \infty)$$
                            $$\text{sech} : [0, \infty) \to (0, 1], \qquad \text{csch} : (0, \infty) \to (0, \infty)$$`),
                        p(R`Bu fonksiyonlar birebir örten olduğundan tersleri vardır. Ters fonksiyonlara <b>argcosh</b> (argüman kosinüs hiperbolik), <b>argsinh</b>, <b>argtanh</b>, <b>argcoth</b>, <b>argsech</b> ve <b>argcsch</b> denir. $\text{argsinh}\, x$ yerine $\sinh^{-1} x$ veya $\text{arcsinh}\, x$ gösterimleri de kullanılır.`),
                        widget("graph", "Hiperbolik ayna", "Mavi fonksiyon, pembe tersi, kesikli çizgi y = x.", {
                            presets: [
                                { label: "sinh ↔ argsinh", fns: [{ expr: "x", dash: true, width: 1.5, color: Cl.gray, trace: false, label: "y = x", noExport: true }, { expr: "sinh(x)", label: "sinh", color: Cl.blue }, { expr: "arcsinh(x)", label: "argsinh", color: Cl.pink }] },
                                { label: "cosh ↔ argcosh", fns: [{ expr: "x", dash: true, width: 1.5, color: Cl.gray, trace: false, label: "y = x", noExport: true }, { expr: "cosh(x)", label: "cosh", color: Cl.blue, xmin: 0 }, { expr: "arccosh(x)", label: "argcosh", color: Cl.pink }] },
                                { label: "tanh ↔ argtanh", fns: [{ expr: "x", dash: true, width: 1.5, color: Cl.gray, trace: false, label: "y = x", noExport: true }, { expr: "tanh(x)", label: "tanh", color: Cl.blue }, { expr: "arctanh(x)", label: "argtanh", color: Cl.pink }] },
                            ],
                            view: { xmin: -4, xmax: 4, ymin: -3.5, ymax: 3.5 }, equal: true, height: 300,
                        }),
                        tip(R`Ters hiperbolik fonksiyonlar logaritmayla da yazılabilir (ileride türev konusunda işe yarar):
                            $$\text{argsinh}\, x = \ln\left(x + \sqrt{x^2 + 1}\right), \qquad \text{argcosh}\, x = \ln\left(x + \sqrt{x^2 - 1}\right) \;(x \geq 1)$$
                            $$\text{argtanh}\, x = \frac12\ln\frac{1 + x}{1 - x} \;(|x| < 1)$$`, "Bilgi"),
                        ex(R`$\text{argsinh}\, 0$ değerini bulunuz.`, [
                            R`$\text{argsinh}\, 0 = u \iff \sinh u = 0$.`,
                            R`$\dfrac{e^u - e^{-u}}{2} = 0 \iff e^u = e^{-u} \iff u = -u \iff u = 0$.`,
                        ], R`$\text{argsinh}\, 0 = 0$.`),
                        ex(R`$\text{argcosh}\, 1$ değerini bulunuz.`, [
                            R`$\text{argcosh}\, 1 = u \iff \cosh u = 1$ ve $u \geq 0$.`,
                            R`$\cosh$'un en küçük değeri $\cosh 0 = 1$'dir ve $[0, \infty)$'da birebirdir.`,
                        ], R`$\text{argcosh}\, 1 = 0$.`),
                        quiz(R`$\text{argtanh}$ fonksiyonunun tanım kümesi nedir?`, [R`$\mathbb{R}$`, R`$(-1, 1)$`, R`$[1, \infty)$`, R`$(0, \infty)$`], 1, R`Tersin tanım kümesi, $\tanh$'ın görüntü kümesidir: $(-1, 1)$.`),
                    ],
                },
            ],
        },
    ];

    global.CHAPTERS = {
        fonksiyonlar: {
            no: 1, id: "fonksiyonlar", title: "Fonksiyonlar",
            intro: "Fonksiyon kavramından başlayıp özel fonksiyonlara, grafik çizim pratiklerine, trigonometrik, üstel, logaritmik ve hiperbolik fonksiyonlara uzanan bölüm.",
            sections,
        },
    };

    global.COURSE = {
        title: "Matematik 1",
        source: "Mustafa Balcı — Matematik 1",
        chapters: [
            { no: 0, title: "Önbilgiler", sub: "Kümeler, sayılar, doğru ve çember" },
            { no: 1, title: "Fonksiyonlar", sub: "7 alt konu · 29 ders", id: "fonksiyonlar" },
            { no: 2, title: "Limit ve Süreklilik", sub: "Limit, sağ-sol limit, süreklilik" },
            { no: 3, title: "Türev", sub: "Türev kavramı ve kuralları" },
            { no: 4, title: "Türevin Uygulamaları", sub: "Maksimum-minimum, eğri çizimi" },
            { no: 5, title: "Belirsiz İntegraller", sub: "İntegral alma yöntemleri" },
            { no: 6, title: "Belirli İntegraller", sub: "Riemann toplamları, ortalama değer" },
            { no: 7, title: "İntegrallerin Uygulamaları", sub: "Alan, hacim, yay uzunluğu" },
            { no: 8, title: "Genelleştirilmiş İntegraller", sub: "Yakınsaklık testleri" },
            { no: 9, title: "Kutupsal Koordinatlar", sub: "Kutupsal eğriler ve alanlar" },
            { no: 10, title: "Diziler ve Seriler", sub: "Yakınsaklık, kuvvet ve Taylor serileri" },
        ],
    };
})(window);
