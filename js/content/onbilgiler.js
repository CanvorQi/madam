/*
 * Bölüm 0 - Önbilgiler (Matematik 1, Mustafa Balcı, s. 1-33)
 * Kümeler, sayılar, üslü-köklü sayılar, ikinci derece denklemler, doğru ve çember.
 */
(function (global) {
    "use strict";

    const R = String.raw;
    const T = (s) => Widgets._helpers.tex(s);
    const F = (v, d) => MathParser.fmt(v, d);
    const N = (v, d) => F(v, d).replace("−", "-");
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

    // ax^2+bx+c için kökler
    function quadRoots(a, b, c) {
        if (Math.abs(a) < 1e-12) return Math.abs(b) < 1e-12 ? [] : [-c / b];
        const D = b * b - 4 * a * c;
        if (D < -1e-12) return [];
        if (Math.abs(D) <= 1e-12) return [-b / (2 * a)];
        const s = Math.sqrt(D);
        return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, v) => u - v);
    }
    const circle = (cx, cy, r, color, extra) => Object.assign({ type: "param", x: (t) => cx + r * Math.cos(t), y: (t) => cy + r * Math.sin(t), t0: 0, t1: 2 * Math.PI, color, width: 3 }, extra || {});

    const sections = [
        /* =========================== 0.1 =========================== */
        {
            no: "0.1", title: "Kümeler", page: 1,
            lessons: [
                {
                    id: "kume-nedir", title: "Küme, Eleman ve Alt Küme",
                    summary: "Nesnelerin iyi tanımlanmış topluluğu.",
                    blocks: [
                        simple(R`Küme, <b>iyi tanımlanmış</b> nesnelerin bir torbası gibidir. Torbadaki her şeye <b>eleman</b> denir. “Sınıftaki öğrenciler” bir kümedir; “sınıftaki uzun boylular” değildir, çünkü “uzun” kişiden kişiye değişir.`),
                        p(R`Kümeler genellikle büyük harflerle ($A, B, C, \ldots$), elemanlar küçük harflerle ($a, b, x, \ldots$) gösterilir.
                            <ul>
                                <li>$a$, $A$ kümesinin elemanı ise $a \in A$; değilse $b \notin A$ yazılır.</li>
                                <li><b>Liste yöntemi:</b> elemanlar küme parantezi içine yazılır: $\{1, 2, 3\}$.</li>
                                <li><b>Ortak özellik yöntemi:</b> $\{x : x \text{ Türk alfabesinin bir harfi}\}$. Buradaki “:” işareti “öyle ki” diye okunur.</li>
                                <li><b>Venn diyagramı:</b> kümeyi kapalı bir eğrinin içinde noktalarla göstermek.</li>
                            </ul>`),
                        def("Alt küme", R`$A$ kümesinin her elemanı $B$ kümesinin de bir elemanı ise $A$ kümesi $B$'nin bir <b>alt kümesi</b>dir ve $A \subset B$ yazılır:
                            $$A \subset B \iff [\,x \in A \Rightarrow x \in B\,]$$`),
                        ex(R`$A = \{1, 3, 5, 7, 9\}$ ve $B = \{0, 1, 2, \ldots, 9\}$ ise $A \subset B$ midir?`, [
                            R`$A$'nın elemanlarını tek tek kontrol et: $1, 3, 5, 7, 9$'un hepsi $B$'de var.`,
                        ], R`Evet, $A \subset B$.`),
                        def("Eşit küme, özalt küme, boş küme", R`<ul>
                            <li>$A \subset B$ ve $B \subset A$ ise $A$ ile $B$ <b>eşittir</b>: $A = B$ (aynı elemanlardan oluşurlar).</li>
                            <li>$A \subset B$ ve $A \neq B$ ise $A$, $B$'nin bir <b>özalt kümesi</b>dir.</li>
                            <li>Hiç elemanı olmayan kümeye <b>boş küme</b> denir: $\varnothing$.</li>
                        </ul>`),
                        tip(R`Boş küme <b>her kümenin</b> alt kümesidir. Çünkü $\varnothing$'de olup da başka bir kümede olmayan bir eleman bulamazsın — zaten hiç elemanı yok!`, "İlginç bilgi"),
                        widget("venn", "Venn diyagramı", "İşlem seç: mavi boyalı bölge sonucu gösterir. (Sonraki dersin işlemlerine buradan da bakabilirsin.)", { A: [1, 2, 3, 4], B: [3, 4, 5, 6], universe: [1, 2, 3, 4, 5, 6, 7, 8] }),
                        quiz(R`$A = \{2, 4\}$ ve $B = \{1, 2, 3, 4\}$ için hangisi doğrudur?`, [R`$A \subset B$`, R`$B \subset A$`, R`$A = B$`, R`$A \cap B = \varnothing$`], 0, R`$A$'nın her elemanı (2 ve 4) $B$'de var. Tersi doğru değil: $1 \in B$ ama $1 \notin A$.`),
                        quiz(R`Boş küme ile ilgili hangisi doğrudur?`, ["Her kümenin alt kümesidir", "Hiçbir kümenin alt kümesi değildir", "{0} kümesine eşittir", "Bir elemanı vardır"], 0, R`$\{0\}$ boş değildir, bir elemanı (0) vardır!`),
                    ],
                },
                {
                    id: "kume-islemleri", title: "Küme İşlemleri",
                    summary: "Birleşim, kesişim, fark, tümleyen ve kartezyen çarpım.",
                    blocks: [
                        simple(R`Kümelerle de işlem yapılır: <b>birleşim</b> “ya da” demek (iki torbayı tek torbaya boşalt), <b>kesişim</b> “ve” demek (ikisinde de olanlar), <b>fark</b> “ama değil” demek.`),
                        def("Birleşim ve kesişim", R`$$A \cup B = \{x : x \in A \text{ veya } x \in B\}, \qquad A \cap B = \{x : x \in A \text{ ve } x \in B\}$$
                            Buradan $A \subset A \cup B$, $B \subset A \cup B$ ve $A \cap B \subset A$, $A \cap B \subset B$ olur. $A \cap B = \varnothing$ ise $A$ ve $B$ kümelerine <b>ayrık</b> denir.`),
                        def("Fark ve tümleyen", R`$A$'da olup $B$'de bulunmayan elemanların kümesine $B$'nin $A$'ya göre <b>tümleyeni</b> (fark kümesi) denir:
                            $$A \setminus B = \{x : x \in A \text{ ve } x \notin B\}$$
                            Tüm kümeleri içine alan sabit kümeye <b>evrensel küme</b> ($E$) denir. $A$'nın $E$'ye göre tümleyeni: $A^t = \{x : x \notin A\}$.`),
                        widget("venn", "Küme işlemleri laboratuvarı", "Her işlemi seç ve boyalı bölgeyi incele. Birleşimde eleman sayısı formülü de gösterilir.", { A: [1, 2, 3, 4, 5], B: [4, 5, 6, 7], universe: [1, 2, 3, 4, 5, 6, 7, 8, 9] }),
                        formula("Eleman sayısı", R`Sonlu bir kümenin eleman sayısı $s(A)$ ile gösterilir.
                            $$s(A \cup B) = s(A) + s(B) - s(A \cap B)$$
                            $$\begin{aligned} s(A \cup B \cup C) = {} & s(A) + s(B) + s(C) \\ & - s(A \cap B) - s(A \cap C) - s(B \cap C) \\ & + s(A \cap B \cap C) \end{aligned}$$`),
                        tip(R`Neden $s(A \cap B)$ çıkarılıyor? Ortak elemanlar hem $s(A)$'da hem $s(B)$'de sayıldı; bir kez fazla sayılmış oldu.`),
                        ex(R`Bir sınıfta 20 kişi futbol, 15 kişi basketbol oynuyor; 8 kişi ikisini de oynuyor. En az bir spor yapan kaç kişi var?`, [
                            R`$s(F) = 20$, $s(B) = 15$, $s(F \cap B) = 8$.`,
                            R`$s(F \cup B) = 20 + 15 - 8$.`,
                        ], R`$27$ kişi.`),
                        def("Kartezyen çarpım", R`$A$ ve $B$ kümelerinin kartezyen çarpımı, $a \in A$ ve $b \in B$ olmak üzere tüm <b>sıralı ikililerin</b> kümesidir:
                            $$A \times B = \{(a, b) : a \in A \text{ ve } b \in B\}, \qquad s(A \times B) = s(A)\cdot s(B)$$`),
                        ex(R`$A = \{1, 2\}$, $B = \{x, y, z\}$ ise $A \times B$ nedir?`, [
                            R`Her $a \in A$'yı her $b \in B$ ile eşle.`,
                            R`$\{(1,x), (1,y), (1,z), (2,x), (2,y), (2,z)\}$`,
                        ], R`6 eleman: $s(A\times B) = 2\cdot 3 = 6$. Koordinat düzlemi de aslında $\mathbb{R}\times\mathbb{R}$'dir!`),
                        quiz(R`$A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$ ise $A \setminus B$ nedir?`, [R`$\{1, 2\}$`, R`$\{5\}$`, R`$\{3, 4\}$`, R`$\{1, 2, 5\}$`], 0, R`$A$'da olup $B$'de olmayanlar: 1 ve 2.`),
                        quiz(R`$s(A) = 7$, $s(B) = 5$, $s(A \cup B) = 10$ ise $s(A \cap B)$ kaçtır?`, ["2", "3", "12", "0"], 0, R`$10 = 7 + 5 - s(A\cap B) \Rightarrow s(A \cap B) = 2$.`),
                    ],
                },
            ],
        },

        /* =========================== 0.2 =========================== */
        {
            no: "0.2", title: "Sayılar", page: 4,
            lessons: [
                {
                    id: "sayi-kumeleri", title: "Sayı Kümeleri",
                    summary: "N ⊂ Z ⊂ Q ⊂ R",
                    blocks: [
                        simple(R`Sayılar ihtiyaçtan doğdu: Saymak için <b>doğal sayılar</b>, borç için <b>negatifler</b> (tam sayılar), paylaştırmak için <b>kesirler</b> (rasyoneller), karenin köşegenini ölçmek için de <b>irrasyonel</b> sayılar gerekti. Hepsi birlikte <b>reel sayılar</b>dır.`),
                        def("Sayı kümeleri", R`<ul>
                            <li><b>Doğal sayılar:</b> $\mathbb{N} = \{1, 2, 3, \ldots\}$ <span class="muted">(bazı kaynaklar 0'ı da katar)</span></li>
                            <li><b>Tam sayılar:</b> $\mathbb{Z} = \{\ldots, -2, -1, 0, 1, 2, \ldots\}$ — $x + m = n$ tipi denklemleri çözebilmek için.</li>
                            <li><b>Rasyonel sayılar:</b> $\mathbb{Q} = \left\{\frac pq : p, q \in \mathbb{Z},\ q \neq 0\right\}$ — $qx = p$ tipi denklemler için.</li>
                            <li><b>İrrasyonel sayılar:</b> rasyonel olmayan reel sayılar ($\sqrt2, \pi, \ldots$).</li>
                            <li><b>Reel sayılar:</b> rasyonel ve irrasyonel sayıların hepsi, $\mathbb{R}$.</li>
                        </ul>
                        $$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$$`),
                        widget("numclass", "Bu sayı hangi kümede?", "Bir sayı seç: hangi kümelere ait olduğunu iç içe kutularda gör."),
                        p(R`İki tam sayının $\pm1$'den başka ortak böleni yoksa bu sayılara <b>aralarında asal</b> denir. Her rasyonel sayı, payı ve paydası aralarında asal bir kesir olarak yazılabilir. Ayrıca $\frac pq = \frac{cp}{cq}$ olduğundan her rasyonel sayının sonsuz çoklukta yazılışı vardır ($\frac12 = \frac24 = \frac36 = \cdots$).`),
                        ex(R`$\sqrt2$ sayısının rasyonel olmadığını gösteriniz.`, [
                            R`Tersini kabul edelim: $\sqrt2 = \frac pq$, $p$ ile $q$ aralarında asal.`,
                            R`Kare al: $2 = \frac{p^2}{q^2} \Rightarrow 2q^2 = p^2$. Sol taraf çift → $p^2$ çift → $p$ çift. $p = 2r$ yazalım.`,
                            R`$2q^2 = 4r^2 \Rightarrow q^2 = 2r^2$ → $q^2$ çift → $q$ de çift.`,
                            R`Hem $p$ hem $q$ çift: ikisini de 2 böler. Ama aralarında asal kabul etmiştik — <b>çelişki</b>!`,
                        ], R`$\sqrt2$ rasyonel değildir; irrasyoneldir. (Bu yönteme “olmayana ergi” denir.)`),
                        tip(R`Her reel sayıya sayı doğrusu üzerinde tek bir nokta, her noktaya da tek bir reel sayı karşılık gelir. Bu yüzden elemanları reel sayılar olan kümelere <b>lineer nokta kümeleri</b> denir.`),
                        quiz("Aşağıdakilerden hangisi irrasyoneldir?", [R`$\sqrt{3}$`, R`$\sqrt{16}$`, R`$0{,}25$`, R`$-\frac{7}{2}$`], 0, R`$\sqrt{16} = 4$ tam sayı; $0{,}25 = \frac14$; $-\frac72$ kesir. $\sqrt3$ ise kesir olarak yazılamaz.`),
                        quiz(R`$-5$ sayısı hangi kümede <b>değildir</b>?`, [R`$\mathbb{N}$`, R`$\mathbb{Z}$`, R`$\mathbb{Q}$`, R`$\mathbb{R}$`], 0, R`Doğal sayılar pozitiftir.`),
                    ],
                },
                {
                    id: "araliklar", title: "Aralıklar ve Eşitsizlikler",
                    summary: "Sayı doğrusunun parçaları.",
                    blocks: [
                        simple(R`Aralık, sayı doğrusunun bir <b>parçası</b>dır. Köşeli parantez “uç nokta dahil”, normal parantez “uç nokta hariç” demektir. Sayı doğrusunda dahil olan uç <b>dolu</b>, hariç olan uç <b>boş</b> nokta ile çizilir.`),
                        def("Aralıklar", R`$a < b$ iki reel sayı olsun.
                            $$(a, b) = \{x \in \mathbb{R} : a < x < b\} \quad \text{açık aralık}$$
                            $$[a, b] = \{x \in \mathbb{R} : a \le x \le b\} \quad \text{kapalı aralık}$$
                            $$(a, b] = \{x : a < x \le b\}, \quad [a, b) = \{x : a \le x < b\} \quad \text{yarı açık aralıklar}$$
                            Boyları sabit olup $b - a$'ya eşittir. Boyu sonlu olmayan aralıklara <b>sonsuz aralık</b> denir: $[c, +\infty)$, $(-\infty, c)$, $(-\infty, \infty)$…`),
                        widget("interval", "Aralık çizici", "Aralık türünü seç ve uç noktaları kaydır. Gösterimin ve küme yazılışının nasıl değiştiğine bak."),
                        warn(R`$\infty$ bir sayı değildir; bu yüzden sonsuz tarafında <b>her zaman normal parantez</b> kullanılır: $[2, \infty)$ doğru, $[2, \infty]$ yanlış.`),
                        formula("Teorem 0.1 — Eşitsizlik kuralları", R`<ol>
                            <li>$a < b \Rightarrow a + c < b + c$ <span class="muted">(her iki tarafa aynı sayı eklenebilir)</span></li>
                            <li>$a < b \Rightarrow a - c < b - c$</li>
                            <li>$a < b$ ve $c > 0 \Rightarrow a\cdot c < b\cdot c$</li>
                            <li>$a < b$ ve $c < 0 \Rightarrow a\cdot c > b\cdot c$ <span class="muted">(negatifle çarpınca yön döner!)</span></li>
                            <li>$a < b$ ve $a\cdot b > 0 \Rightarrow \frac1a > \frac1b$</li>
                        </ol>`),
                        ex(R`$-2x + 3 > 7$ eşitsizliğini çözünüz.`, [
                            R`Her iki taraftan 3 çıkar: $-2x > 4$.`,
                            R`$-2$'ye böl — negatif sayı, yön değişir: $x < -2$.`,
                        ], R`Çözüm kümesi $(-\infty, -2)$.`),
                        quiz(R`$\{x \in \mathbb{R} : -1 < x \le 4\}$ hangi aralıktır?`, [R`$(-1, 4]$`, R`$[-1, 4)$`, R`$[-1, 4]$`, R`$(-1, 4)$`], 0, R`$-1$ dahil değil → normal parantez; $4$ dahil → köşeli.`),
                        quiz(R`$a < b$ ise aşağıdakilerden hangisi <b>kesinlikle</b> doğrudur?`, [R`$-3a > -3b$`, R`$a^2 < b^2$`, R`$\frac1a > \frac1b$`, R`$2a > 2b$`], 0, R`Negatif sayıyla çarpınca yön değişir. $a^2 < b^2$ yanlış olabilir ($a = -5, b = 1$); $\frac1a > \frac1b$ için $ab > 0$ şartı gerekir.`),
                    ],
                },
                {
                    id: "mutlak-deger-esitsizlik", title: "Mutlak Değer ve Eşitsizlikler",
                    summary: "Sıfıra uzaklık.",
                    blocks: [
                        simple(R`Mutlak değer, bir sayının <b>sıfıra (orijine) uzaklığıdır</b>. Uzaklık negatif olamaz: $|-5| = 5$, $|5| = 5$. Benzer şekilde $|x - a|$, $x$ ile $a$ arasındaki uzaklıktır.`),
                        def("Tanım", R`$$|a| = \begin{cases} a, & a \ge 0 \\ -a, & a < 0 \end{cases}$$
                            Her $a$ için $|a| \ge 0$ ve $|a|^2 = a^2$ olduğundan $|a| = \sqrt{a^2}$ yazılabilir (cebirsel tanım).`),
                        formula("Teorem 0.2 — Mutlak değerin özellikleri", R`Her $a, b \in \mathbb{R}$ için:
                            <ol>
                                <li>$|a| \ge 0$</li>
                                <li>$-|a| \le a \le |a|$</li>
                                <li>$\big||a| - |b|\big| \le |a + b| \le |a| + |b|$ <span class="muted">(üçgen eşitsizliği)</span></li>
                                <li>$|a\cdot b| = |a|\cdot|b|$</li>
                                <li>$\left|\frac ab\right| = \frac{|a|}{|b|}$ $\;(b \ne 0)$</li>
                            </ol>`),
                        formula("Teorem 0.3 — Eşitsizlik çözme anahtarı", R`Her pozitif $p$ için:
                            <ol>
                                <li>$|u| = p \Rightarrow u = p$ veya $u = -p$</li>
                                <li>$|u| < p \Rightarrow -p < u < p$ <span class="muted">(“içeride kal”)</span></li>
                                <li>$|u| > p \Rightarrow u < -p$ veya $u > p$ <span class="muted">(“dışarı çık”)</span></li>
                            </ol>`),
                        ex(R`$|2x - 1| \le 5$ eşitsizliğini çözünüz.`, [
                            R`Teorem 0.3: $-5 \le 2x - 1 \le 5$.`,
                            R`Her tarafa 1 ekle: $-4 \le 2x \le 6$.`,
                            R`2'ye böl: $-2 \le x \le 3$.`,
                        ], R`Çözüm kümesi $C = [-2, 3]$ kapalı aralığıdır.`),
                        widget("graph", "Eşitsizliği grafikte gör", "y = |2x − 1| eğrisinin y = 5 doğrusunun altında (ya da üstünde) kaldığı x'ler çözüm kümesidir: mavi bant.", {
                            fns: [{ expr: "abs(2x-1)", label: "y = |2x − 1|" }, { expr: "5", label: "y = 5", color: Cl.orange, dash: true, width: 2, trace: false }],
                            shade: [[-2, 3]],
                            view: { xmin: -5, xmax: 6, ymin: -2, ymax: 9 }, height: 270,
                            extras: () => [{ type: "point", x: -2, y: 5, color: Cl.pink, label: "x = −2", labelPos: "nw" }, { type: "point", x: 3, y: 5, color: Cl.pink, label: "x = 3" }],
                        }),
                        quiz(R`$|x + 2| > 3$ eşitsizliğinin çözüm kümesi nedir?`, [R`$(-\infty, -5) \cup (1, \infty)$`, R`$(-5, 1)$`, R`$(1, \infty)$`, R`$(-\infty, -1) \cup (5, \infty)$`], 0, R`“Dışarı çık”: $x + 2 < -3$ veya $x + 2 > 3$ → $x < -5$ veya $x > 1$.`),
                        quiz(R`$|3 - 7|$ kaçtır?`, ["4", "−4", "10", "−10"], 0, R`$|-4| = 4$.`),
                    ],
                },
                {
                    id: "komsuluk-tam-kisim", title: "Komşuluk ve Tam Kısım",
                    summary: "Bir noktanın çevresi ve tam kısmı.",
                    blocks: [
                        simple(R`Bir noktanın <b>komşuluğu</b>, o noktanın sağına ve soluna eşit mesafede uzanan küçük bir aralıktır — tıpkı evinin etrafındaki mahalle gibi. İleride limit konusunun temel taşı olacak!`),
                        def(R`$\varepsilon$-komşuluğu`, R`$\varepsilon$ pozitif bir sayı olsun.
                            $$K = \{x \in \mathbb{R} : |x - a| < \varepsilon\} = (a - \varepsilon,\ a + \varepsilon)$$
                            kümesine $a$ noktasının <b>$\varepsilon$-komşuluğu</b> denir.`),
                        widget("graph", "Komşuluk", "a merkezi ve ε yarıçapını değiştir. Mavi bant, a'ya ε'dan daha yakın olan tüm x'lerdir.", {
                            fns: [],
                            params: { a: { label: "Merkez a", min: -3, max: 3, step: 0.5, value: 2 }, e: { label: "Yarıçap ε", min: 0.1, max: 2.5, step: 0.1, value: 1 } },
                            view: { xmin: -6, xmax: 6, ymin: -1.5, ymax: 1.5 }, height: 170,
                            extras: (pr) => [
                                { type: "shadeX", a: pr.a - pr.e, b: pr.a + pr.e },
                                { type: "seg", x1: pr.a - pr.e, y1: 0, x2: pr.a + pr.e, y2: 0, color: Cl.pink, width: 6 },
                                { type: "point", x: pr.a, y: 0, color: Cl.blue, label: "a" },
                                { type: "point", x: pr.a - pr.e, y: 0, color: Cl.pink, open: true, label: "a − ε", labelPos: "sw" },
                                { type: "point", x: pr.a + pr.e, y: 0, color: Cl.pink, open: true, label: "a + ε", labelPos: "se" },
                            ],
                            readout: (pr) => T(`K = \\{x : |x - ${N(pr.a)}| < ${N(pr.e)}\\} = (${N(pr.a - pr.e)},\\ ${N(pr.a + pr.e)})`),
                        }),
                        ex(R`2 sayısının $\frac{1}{100}$ komşuluğunu bulunuz.`, [
                            R`$K = \left(2 - \frac{1}{100},\ 2 + \frac{1}{100}\right)$`,
                        ], R`$K = \left(\frac{199}{100}, \frac{201}{100}\right)$`),
                        def("Tam kısım", R`Bir $a$ reel sayısından büyük olmayan tam sayıların en büyüğüne $a$'nın <b>tam kısmı</b> denir ve $\llbracket a \rrbracket$ ile gösterilir. Örnekler: $\llbracket 3{,}4 \rrbracket = 3$, $\llbracket 5 \rrbracket = 5$, $\llbracket -3{,}6 \rrbracket = -4$, $\llbracket \sqrt2 \rrbracket = 1$.`),
                        p(R`Her $a$ sayısı, tam kısmı ile $0 \le k < 1$ olan bir <b>kesir kısmının</b> toplamıdır: $a = \llbracket a \rrbracket + k$. Örneğin $3{,}41 = 3 + 0{,}41$, $\;-3{,}6 = -4 + 0{,}4$.`),
                        ex(R`$4\cdot\llbracket 3{,}6 \rrbracket$ ve $\llbracket 4\cdot(3{,}6) \rrbracket$ sayılarını hesaplayınız. Her $n$ tam sayısı için $n\llbracket a \rrbracket = \llbracket n\cdot a \rrbracket$ eşitliği doğru mudur?`, [
                            R`$4\cdot\llbracket 3{,}6 \rrbracket = 4\cdot3 = 12$`,
                            R`$\llbracket 4\cdot 3{,}6 \rrbracket = \llbracket 14{,}4 \rrbracket = 14$`,
                        ], R`$12 \neq 14$: eşitlik her zaman doğru değildir.`),
                        formula("Teorem 0.4", R`<ol>
                            <li>Her $a, b \in \mathbb{R}$ için $\llbracket a + b \rrbracket \ge \llbracket a \rrbracket + \llbracket b \rrbracket$</li>
                            <li>Her $a \in \mathbb{R}$, $m \in \mathbb{Z}$ için $\llbracket a + m \rrbracket = \llbracket a \rrbracket + m$ <span class="muted">(tam sayı dışarı çıkabilir)</span></li>
                        </ol>`),
                        ex(R`$\llbracket 2x + 3 \rrbracket < 8$ eşitsizliğinin çözüm kümesini bulunuz.`, [
                            R`Teorem 0.4 (2): $\llbracket 2x \rrbracket + 3 < 8 \Rightarrow \llbracket 2x \rrbracket < 5$.`,
                            R`Tam kısım tam sayı olduğundan $\llbracket 2x \rrbracket \le 4$, yani $2x < 5$.`,
                        ], R`$x < \frac52$. (Kitapta “$\le 8$” ile çözülüp $x < 3$ bulunmuş; “$< 8$” için doğru cevap $x < \frac52$'dir.)`),
                        quiz(R`$\llbracket -0{,}2 \rrbracket$ kaçtır?`, ["0", "−1", "−0,2", "1"], 1, R`$-0{,}2$'den büyük olmayan en büyük tam sayı $-1$.`),
                        quiz(R`3'ün 0,5-komşuluğu hangisidir?`, [R`$(2{,}5;\ 3{,}5)$`, R`$[2{,}5;\ 3{,}5]$`, R`$(2;\ 4)$`, R`$(3;\ 3{,}5)$`], 0, R`$|x - 3| < 0{,}5$ — açık aralık.`),
                    ],
                },
            ],
        },

        /* =========================== 0.3 =========================== */
        {
            no: "0.3", title: "Üslü ve Köklü Çokluklar", page: 9,
            lessons: [
                {
                    id: "uslu-sayilar", title: "Üslü Sayılar",
                    summary: "Tekrarlı çarpmanın kısa yazılışı.",
                    blocks: [
                        simple(R`$3^4$, “3'ü 4 kez kendisiyle çarp” demektir: $3\cdot3\cdot3\cdot3 = 81$. Negatif üs ise “ters çevir” demektir: $5^{-2} = \frac{1}{5^2}$.`),
                        def("Tanım", R`$a$ herhangi bir sayı ve $n$ pozitif tam sayı olsun. $\underbrace{a\cdot a\cdots a}_{n \text{ tane}}$ çarpımına $a$'nın <b>$n$-inci kuvveti</b> denir, $a^n$ ile gösterilir. $a \neq 0$ için:
                            $$a^{-n} = \frac{1}{a^n}, \qquad a^0 = 1$$`),
                        ex(R`$3^4$, $(-2)^3$, $5^{-2}$ ve $8^0$ değerlerini bulunuz.`, [
                            R`$3^4 = 3\cdot3\cdot3\cdot3 = 81$`,
                            R`$(-2)^3 = (-2)(-2)(-2) = -8$ <span class="muted">(tek kuvvet → işaret kalır)</span>`,
                            R`$5^{-2} = \frac{1}{5^2} = \frac{1}{25}$`,
                            R`$8^0 = 1$`,
                        ], R`$81,\ -8,\ \frac{1}{25},\ 1$`),
                        formula("Teorem 0.5 — Üs kuralları", R`$a, b \in \mathbb{R}^+$ ve $m, n \in \mathbb{N}$ için:
                            $$a^m\cdot a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}$$
                            $$(a^m)^n = a^{m\cdot n}, \qquad (a\cdot b)^n = a^n\cdot b^n$$`),
                        warn(R`$(-2)^2 = 4$ ama $-2^2 = -4$! Parantez yoksa üs sadece 2'ye uygulanır, eksi sonra gelir.`, "Sık yapılan hata"),
                        widget("graph", "Üssün etkisi", "y = aⁿ yerine y = xⁿ grafiğine bak: n'yi değiştir, negatif üslerde grafiğin nasıl ters çevrildiğini gör (n = −1 → 1/x).", {
                            fns: [{ expr: "x^n", label: (pr) => `y = x^${pr.n}` }],
                            params: { n: { min: -3, max: 4, step: 1, value: 2 } },
                            view: { xmin: -3, xmax: 3, ymin: -3, ymax: 4 }, height: 260,
                            readout: (pr) => pr.n === 0 ? `n = 0: ${T("x^0 = 1")} (x ≠ 0) — yatay bir doğru.` : pr.n < 0 ? `n = ${pr.n}: ${T(`x^{${pr.n}} = \\frac{1}{x^{${-pr.n}}}`)} — x = 0'da tanımsız.` : `n = ${pr.n}: ${T(`x^{${pr.n}}`)}`,
                        }),
                        quiz(R`$2^3\cdot 2^{-5}$ kaçtır?`, [R`$\frac14$`, R`$4$`, R`$-4$`, R`$2^{-15}$`], 0, R`$2^{3 + (-5)} = 2^{-2} = \frac14$.`),
                        quiz(R`$(-3)^2 - 3^2$ kaçtır?`, ["0", "18", "−18", "−6"], 0, R`$9 - 9 = 0$.`),
                    ],
                },
                {
                    id: "koklu-sayilar", title: "Köklü Sayılar ve Rasyonel Üsler",
                    summary: "Kuvvetin tersi: kök.",
                    blocks: [
                        simple(R`Kök, kuvvet almanın <b>tersidir</b>. $\sqrt{9}$ sorusu: “Karesi 9 olan pozitif sayı hangisi?” → 3. $\sqrt[3]{8}$: “Küpü 8 olan sayı?” → 2.`),
                        def("Karekök ve n-inci kök", R`$a \ge 0$ ise karesi $a$ olan bir tek pozitif (veya sıfır) sayı vardır: $\sqrt a$. Örneğin $\sqrt4 = 2$, $\sqrt{16} = 4$, $\sqrt0 = 0$. Genel olarak $n$-inci kuvveti $a$ olan sayı $\sqrt[n]{a}$ ile gösterilir: $\sqrt[3]{8} = 2$, $\sqrt[5]{0} = 0$, $\sqrt[4]{16} = 2$.`),
                        warn(R`$(-2)^2 = 4$ olduğu hâlde $\sqrt4 \neq -2$'dir, çünkü karekök <b>pozitif tanımlıdır</b>. Ayrıca negatif sayıların karekökü reel sayı olamaz.`),
                        formula("Teorem 0.6 — Kök kuralları", R`$a, b \in \mathbb{R}^+$ ve $m, n \in \mathbb{N}$ için:
                            $$\sqrt[n]{a^n} = a, \qquad \sqrt[n]{ab} = \sqrt[n]{a}\cdot\sqrt[n]{b}, \qquad \sqrt[n]{\frac ab} = \frac{\sqrt[n]a}{\sqrt[n]b}, \qquad \sqrt[m]{\sqrt[n]{a}} = \sqrt[mn]{a}$$`),
                        tip(R`$n$ <b>tek</b> ise negatif sayıların da kökü vardır: $\sqrt[3]{-8} = -2$, $\sqrt[5]{-32} = -2$, $\sqrt[7]{-1} = -1$.`),
                        widget("graph", "Kök fonksiyonları", "n'yi değiştir: çift n'lerde grafik sadece x ≥ 0'da var, tek n'lerde negatif x'lerde de var.", {
                            fns: [{ expr: "root(n, x)", label: (pr) => `y = ${pr.n === 2 ? "√x" : pr.n + "√x"}` }],
                            params: { n: { min: 2, max: 7, step: 1, value: 2 } },
                            view: { xmin: -8, xmax: 10, ymin: -3, ymax: 4 }, height: 250,
                            readout: (pr) => pr.n % 2 === 0 ? `n = ${pr.n} çift → negatif sayıların ${pr.n}. kökü reel değil.` : `n = ${pr.n} tek → ${T(`\\sqrt[${pr.n}]{-x} = -\\sqrt[${pr.n}]{x}`)}`,
                        }),
                        def("Rasyonel üs", R`$r = \frac mn$ rasyonel sayı ($n > 0$) olmak üzere:
                            $$a^{\frac mn} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m, \qquad a^{\frac1n} = \sqrt[n]{a}$$
                            Üs kuralları rasyonel üsler için de geçerlidir: $a^r a^s = a^{r+s}$, $(a^r)^s = a^{rs}$…`),
                        ex(R`$8^{\frac53}$ ve $4^{-\frac32}$ ifadelerini hesaplayınız.`, [
                            R`$8^{\frac53} = \left(\sqrt[3]{8}\right)^5 = 2^5 = 32$`,
                            R`$4^{-\frac32} = \left(\sqrt4\right)^{-3} = 2^{-3} = \frac18$`,
                        ], R`$32$ ve $\frac18$. İpucu: önce kökü al, sayı küçülür, hesap kolaylaşır.`),
                        ex(R`$0 < a < b$ için $\sqrt a < \sqrt b$ olduğunu gösteriniz.`, [
                            R`$A = \sqrt a$, $B = \sqrt b$ diyelim; $A, B > 0$.`,
                            R`$B^2 - A^2 = b - a > 0$ ve $B^2 - A^2 = (B - A)(B + A)$.`,
                            R`$B + A > 0$ olduğundan $B - A > 0$ olmalı.`,
                        ], R`$\sqrt b > \sqrt a$.`),
                        ex(R`$(32)^{\frac16}\cdot 2^{-\frac13}$ işleminin sonucunu bulunuz.`, [
                            R`$32 = 2^5$: $(2^5)^{\frac16}\cdot 2^{-\frac13} = 2^{\frac56}\cdot2^{-\frac13}$`,
                            R`Üsleri topla: $\frac56 - \frac13 = \frac56 - \frac26 = \frac12$.`,
                        ], R`$2^{\frac12} = \sqrt2$.`),
                        quiz(R`$27^{\frac23}$ kaçtır?`, ["9", "18", "3", "81"], 0, R`$\left(\sqrt[3]{27}\right)^2 = 3^2 = 9$.`),
                        quiz(R`$\sqrt{12}\cdot\sqrt{3}$ kaçtır?`, ["6", R`$\sqrt{15}$`, "36", "4"], 0, R`$\sqrt{36} = 6$.`),
                    ],
                },
            ],
        },

        /* =========================== 0.4 =========================== */
        {
            no: "0.4", title: "İkinci Dereceden Denklem ve Eşitsizlikler", page: 14,
            lessons: [
                {
                    id: "ikinci-derece-denklem", title: "İkinci Dereceden Denklemler",
                    summary: "Diskriminant ve kök formülü.",
                    blocks: [
                        simple(R`$ax^2 + bx + c = 0$ denkleminin köklerini bulmak için sihirli bir sayı var: <b>diskriminant</b> $\Delta = b^2 - 4ac$. Bu sayı pozitifse iki kök, sıfırsa bir (çift) kök, negatifse reel kök yok.`),
                        def("Kök formülü", R`$a, b, c$ sabit reel sayılar ($a \ne 0$) olmak üzere $ax^2 + bx + c = 0$ denkleminin kökleri, $\Delta = b^2 - 4ac$ olmak üzere
                            $$x_1 = \frac{-b + \sqrt\Delta}{2a}, \qquad x_2 = \frac{-b - \sqrt\Delta}{2a}$$
                            <ol>
                                <li>$\Delta > 0$ ise kökler farklı reel sayılardır.</li>
                                <li>$\Delta = 0$ ise kökler reel ve eşittir.</li>
                                <li>$\Delta < 0$ ise kökler reel değildir.</li>
                            </ol>`),
                        ex(R`$x^2 - 4x - 5 = 0$ denkleminin köklerini bulunuz.`, [
                            R`$a = 1$, $b = -4$, $c = -5$.`,
                            R`$\Delta = 16 - 4\cdot1\cdot(-5) = 36 > 0$: iki farklı kök.`,
                            R`$x_1 = \frac{4 + 6}{2} = 5$, $\quad x_2 = \frac{4 - 6}{2} = -1$.`,
                        ], R`Kökler $5$ ve $-1$. Kontrol: $(x - 5)(x + 1) = x^2 - 4x - 5$ ✓`),
                        widget("graph", "Diskriminant laboratuvarı", "Katsayıları değiştir: Δ'nın işaretine göre parabolün x-eksenini kaç noktada kestiğini izle.", {
                            fns: [{ expr: "a*x^2+b*x+c", label: "y = ax² + bx + c" }],
                            params: { a: { min: -3, max: 3, step: 0.5, value: 1 }, b: { min: -6, max: 6, step: 0.5, value: -4 }, c: { min: -6, max: 6, step: 0.5, value: -5 } },
                            view: { xmin: -4, xmax: 7, ymin: -10, ymax: 8 }, height: 280,
                            extras: (pr) => quadRoots(pr.a, pr.b, pr.c).map((r) => ({ type: "point", x: r, y: 0, color: Cl.pink, label: `x = ${F(r, 3)}` })),
                            readout: (pr) => {
                                if (pr.a === 0) return `a = 0 olunca denklem ikinci dereceden olmaz.`;
                                const D = pr.b * pr.b - 4 * pr.a * pr.c, rs = quadRoots(pr.a, pr.b, pr.c);
                                const s = D > 1e-12 ? `<span class="good">Δ > 0: iki farklı reel kök</span>` : Math.abs(D) <= 1e-12 ? `<b>Δ = 0: çift (eşit) kök</b> — parabol x-eksenine teğet` : `<span class="bad">Δ < 0: reel kök yok</span> — parabol x-eksenini kesmez`;
                                return `${T(`\\Delta = (${N(pr.b)})^2 - 4\\cdot(${N(pr.a)})\\cdot(${N(pr.c)}) = ${N(D)}`)} → ${s}${rs.length ? ": " + rs.map((r) => F(r, 3)).join(" ve ") : ""}`;
                            },
                        }),
                        formula("Kökler ve katsayılar", R`$x_1 + x_2 = -\frac ba, \qquad x_1\cdot x_2 = \frac ca$`),
                        quiz(R`$x^2 - 5x + 6 = 0$ denkleminin kökleri nelerdir?`, ["2 ve 3", "−2 ve −3", "1 ve 6", "−1 ve 6"], 0, R`$(x - 2)(x - 3) = 0$.`),
                        quiz(R`$2x^2 - 3x + 5 = 0$ denkleminin kaç reel kökü vardır?`, ["0", "1", "2", "3"], 0, R`$\Delta = 9 - 40 = -31 < 0$.`),
                    ],
                },
                {
                    id: "parabol-cizimi", title: "Parabol Çizimi",
                    summary: "y = ax² + bx + c grafiği üç adımda.",
                    blocks: [
                        simple(R`$y = ax^2 + bx + c$ grafiği bir <b>paraboldür</b> (U şekli). Çizmek için üç şey yeter: y-eksenini kestiği yer, x-eksenini kestiği yerler ve tepe noktası.`),
                        formula("Üç adım", R`<ol>
                            <li>$x = 0$ için $y = c$: eğri y-eksenini $c$'de keser.</li>
                            <li>$y = 0$ için $ax^2 + bx + c = 0$ çözülür. $\Delta > 0$ ise x-eksenini $x_1$, $x_2$'de keser; $\Delta = 0$ ise teğettir; $\Delta < 0$ ise kesmez.</li>
                            <li>$x_0 = \dfrac{x_1 + x_2}{2} = -\dfrac{b}{2a}$ apsisli nokta <b>tepe noktasıdır</b>.</li>
                        </ol>
                        $a > 0$ ise kollar <b>yukarı</b>, $a < 0$ ise <b>aşağı</b> doğrudur.`),
                        ex(R`$y = x^2 - 6x + 8$ eğrisini çiziniz.`, [
                            R`$x = 0$ için $y = 8$: y-eksenini 8'de keser.`,
                            R`$y = 0$: $\Delta = 36 - 32 = 4 > 0$; $x_1 = \frac{6 + 2}{2} = 4$, $x_2 = \frac{6 - 2}{2} = 2$.`,
                            R`Tepe: $x_0 = \frac{6}{2} = 3$, $y_0 = 9 - 18 + 8 = -1$.`,
                        ], R`Kolları yukarı, tepe noktası $(3, -1)$, kökleri 2 ve 4 olan parabol.`),
                        ex(R`$y = -x^2 + 4x - 4$ eğrisini çiziniz.`, [
                            R`$x = 0$ için $y = -4$.`,
                            R`$\Delta = 16 - 16 = 0$: $x_1 = x_2 = \frac{-4}{-2} = 2$. Eğri x-eksenine $x = 2$'de teğettir.`,
                        ], R`Kolları aşağı (a = −1 < 0), tepe noktası $(2, 0)$.`),
                        widget("graph", "Parabol çizici", "Hazır örneklerden birini seç: üç adımın sonucu grafikte işaretli.", {
                            presets: [
                                { label: "y = x² − 6x + 8", fns: [{ expr: "x^2-6x+8", label: "y = x² − 6x + 8" }] },
                                { label: "y = −x² + 4x − 4", fns: [{ expr: "-x^2+4x-4", label: "y = −x² + 4x − 4" }] },
                                { label: "y = x² + 2x + 3", fns: [{ expr: "x^2+2x+3", label: "y = x² + 2x + 3" }] },
                            ],
                            view: { xmin: -4, xmax: 7, ymin: -6, ymax: 9 }, height: 280,
                            extras: (pr, c, pi) => {
                                const q = [[1, -6, 8], [-1, 4, -4], [1, 2, 3]][pi];
                                const x0 = -q[1] / (2 * q[0]), y0 = q[0] * x0 * x0 + q[1] * x0 + q[2];
                                return [
                                    { type: "point", x: 0, y: q[2], color: Cl.orange, label: `(0, ${F(q[2])})`, labelPos: "nw" },
                                    { type: "point", x: x0, y: y0, color: Cl.purple, label: `tepe (${F(x0)}, ${F(y0)})`, labelPos: q[0] > 0 ? "se" : "ne" },
                                    ...quadRoots(q[0], q[1], q[2]).map((r) => ({ type: "point", x: r, y: 0, color: Cl.pink })),
                                ];
                            },
                            readout: (pr, c, h) => ["Δ = 4 > 0: x-eksenini 2 ve 4'te keser.", "Δ = 0: x-eksenine x = 2'de teğet.", "Δ = 4 − 12 = −8 < 0: x-eksenini kesmez; tepe (−1, 2)."][h.presetIndex],
                        }),
                        quiz(R`$y = x^2 - 4x + 1$ parabolünün tepe noktası nedir?`, [R`$(2, -3)$`, R`$(-2, 13)$`, R`$(4, 1)$`, R`$(2, 1)$`], 0, R`$x_0 = \frac{4}{2} = 2$, $y_0 = 4 - 8 + 1 = -3$.`),
                    ],
                },
                {
                    id: "isaret-tablosu", title: "İşaret Tablosu ve Eşitsizlikler",
                    summary: "Parabol nerede pozitif, nerede negatif?",
                    blocks: [
                        simple(R`$ax^2 + bx + c$ ifadesinin işaretini bulmak için grafiği düşün: Parabol x-ekseninin <b>üstündeyse</b> ifade pozitif, <b>altındaysa</b> negatif. Kural kısaca: <b>köklerin dışında $a$ ile aynı, köklerin arasında $a$'nın tersi</b>.`),
                        table(R`<table class="mtable">
                            <tr><th>Durum</th><th>İşaret</th></tr>
                            <tr><td>$\Delta > 0$ (kökler $x_1 < x_2$)</td><td>$x < x_1$ ve $x > x_2$: $a$ ile aynı; $\;x_1 < x < x_2$: $a$'nın tersi</td></tr>
                            <tr><td>$\Delta = 0$</td><td>$x \neq -\frac{b}{2a}$ için $a$ ile aynı (kökte 0)</td></tr>
                            <tr><td>$\Delta < 0$</td><td>Her $x$ için $a$ ile aynı</td></tr>
                        </table>`),
                        ex(R`$x^2 - 3x - 10 < 0$ eşitsizliğini çözünüz.`, [
                            R`$\Delta = 9 + 40 = 49 > 0$; $x_1 = \frac{3 + 7}{2} = 5$, $x_2 = \frac{3 - 7}{2} = -2$.`,
                            R`İşaret tablosu: $x < -2$: $+$; $\;-2 < x < 5$: $-$; $\;x > 5$: $+$.`,
                            R`İstenen negatif kısım: köklerin arası.`,
                        ], R`Çözüm kümesi $C = (-2, 5)$ açık aralığıdır.`),
                        widget("graph", "İşaret haritası", "Kırmızı bant ifadenin negatif, yeşil bant pozitif olduğu x'ler.", {
                            fns: [{ expr: "a*x^2+b*x+c", label: "f(x)" }],
                            params: { a: { min: -2, max: 2, step: 0.5, value: 1 }, b: { min: -5, max: 5, step: 0.5, value: -3 }, c: { min: -10, max: 6, step: 0.5, value: -10 } },
                            view: { xmin: -5, xmax: 8, ymin: -14, ymax: 10 }, height: 280,
                            extras: (pr) => {
                                if (pr.a === 0) return [];
                                const rs = quadRoots(pr.a, pr.b, pr.c);
                                const pts = [-1e6, ...rs, 1e6], items = [];
                                for (let i = 0; i < pts.length - 1; i++) {
                                    const m = Math.abs(pts[i]) > 1e5 ? pts[i + 1] - 1 : Math.abs(pts[i + 1]) > 1e5 ? pts[i] + 1 : (pts[i] + pts[i + 1]) / 2;
                                    const v = pr.a * m * m + pr.b * m + pr.c;
                                    items.push({ type: "shadeX", a: pts[i], b: pts[i + 1], color: v < 0 ? "rgba(229,72,77,.14)" : "rgba(31,169,87,.12)" });
                                }
                                rs.forEach((r) => items.push({ type: "point", x: r, y: 0, color: Cl.pink, label: F(r, 3) }));
                                return items;
                            },
                            readout: (pr) => {
                                if (pr.a === 0) return "a ≠ 0 olmalı.";
                                const rs = quadRoots(pr.a, pr.b, pr.c), sa = pr.a > 0 ? "+" : "−", sn = pr.a > 0 ? "−" : "+";
                                if (rs.length === 2) return `Kökler ${F(rs[0], 3)} ve ${F(rs[1], 3)}. Dışarıda <b>${sa}</b> (a ile aynı), arada <b>${sn}</b> (a'nın tersi).`;
                                if (rs.length === 1) return `Çift kök ${F(rs[0], 3)}. Bu nokta dışında her yerde <b>${sa}</b>.`;
                                return `Reel kök yok: her yerde <b>${sa}</b> (a'nın işareti).`;
                            },
                        }),
                        quiz(R`$x^2 - 9 < 0$ eşitsizliğinin çözüm kümesi nedir?`, [R`$(-3, 3)$`, R`$(-\infty, -3) \cup (3, \infty)$`, R`$(3, \infty)$`, R`$\varnothing$`], 0, R`Kökler $\pm3$; $a = 1 > 0$, negatif kısım köklerin arası.`),
                        quiz(R`$-x^2 + 2x - 5$ ifadesi için hangisi doğrudur?`, ["Her x için negatiftir", "Her x için pozitiftir", "İki kökü vardır", "x = 1'de sıfırdır"], 0, R`$\Delta = 4 - 20 < 0$ ve $a = -1 < 0$: her yerde $a$'nın işareti, yani negatif.`),
                    ],
                },
                {
                    id: "yuksek-dereceli", title: "Yüksek Dereceli Denklemler",
                    summary: "Çarpanlara ayırma, değişken değiştirme, Gauss teoremi.",
                    blocks: [
                        simple(R`Üçüncü veya daha yüksek dereceli denklemleri çözmek için üç yol var: <b>çarpanlara ayırmak</b>, yeni değişkenle <b>ikinci dereceye indirmek</b>, ya da <b>Gauss teoremiyle</b> bir kök tahmin edip bölmek.`),
                        ex(R`$x^3 - 4x^2 - x + 4 = 0$ denklemini çözünüz.`, [
                            R`Gruplayalım: $(x^3 - x) - (4x^2 - 4) = 0 \Rightarrow x(x^2 - 1) - 4(x^2 - 1) = 0$.`,
                            R`$(x^2 - 1)(x - 4) = 0 \Rightarrow (x + 1)(x - 1)(x - 4) = 0$.`,
                        ], R`$x_1 = -1$, $x_2 = 1$, $x_3 = 4$.`),
                        ex(R`$x^4 - 10x^2 + 9 = 0$ denklemini çözünüz.`, [
                            R`$x^2 = y$ dersek: $y^2 - 10y + 9 = 0 \Rightarrow y_1 = 1$, $y_2 = 9$.`,
                            R`$x^2 = 1$ veya $x^2 = 9$.`,
                        ], R`$x_1 = -1$, $x_2 = 1$, $x_3 = -3$, $x_4 = 3$.`),
                        def("Teorem 0.7 — Gauss Teoremi", R`$a_1, a_2, \ldots, a_n$ tam sayılar olmak üzere
                            $$x^n + a_1x^{n-1} + a_2x^{n-2} + \cdots + a_{n-1}x + a_n = 0$$
                            denkleminin bir rasyonel kökü varsa, bu kök $a_n$ sayısını <b>bölen bir tam sayıdır</b>.`),
                        ex(R`$x^3 - 3x^2 - 2x + 4 = 0$ denkleminin çözüm kümesini bulunuz.`, [
                            R`Rasyonel kök varsa 4'ü böler: $\pm1, \pm2, \pm4$ adaylar.`,
                            R`$x = 1$: $1 - 3 - 2 + 4 = 0$ ✓. Yani $(x - 1)$ bir çarpan.`,
                            R`Polinom bölmesi: $x^3 - 3x^2 - 2x + 4 = (x - 1)(x^2 - 2x - 4)$.`,
                            R`$x^2 - 2x - 4 = 0$: $\Delta = 20$, $x = \frac{2 \pm 2\sqrt5}{2} = 1 \pm \sqrt5$.`,
                        ], R`$\{1,\ 1 - \sqrt5,\ 1 + \sqrt5\}$`),
                        ex(R`$4x^4 + 4x^3 - 9x^2 - x + 2 = 0$ denklemini çözünüz.`, [
                            R`2'nin bölenlerini dene: $x = 1$: $4 + 4 - 9 - 1 + 2 = 0$ ✓; $x = -1$: $4 - 4 - 9 + 1 + 2 = -6$ ✗; $x = -2$ ✓, $x = 2$ ✗.`,
                            R`$(x - 1)(x + 2) = x^2 + x - 2$ ile böl: bölüm $4x^2 - 1$.`,
                            R`$4x^2 - 1 = 0 \Rightarrow x = \pm\frac12$.`,
                        ], R`$C = \left\{-2, -\frac12, \frac12, 1\right\}$. (Baş katsayı 1 olmadığı için kesirli kökler de çıkabildi.)`),
                        widget("graph", "Kökleri grafikte gör", "Denklemin kökleri, grafiğin x-eksenini kestiği noktalardır.", {
                            presets: [
                                { label: "x³ − 4x² − x + 4", fns: [{ expr: "x^3-4x^2-x+4", label: "y" }], view: { xmin: -3, xmax: 6, ymin: -12, ymax: 10 } },
                                { label: "x⁴ − 10x² + 9", fns: [{ expr: "x^4-10x^2+9", label: "y" }], view: { xmin: -4.5, xmax: 4.5, ymin: -20, ymax: 15 } },
                                { label: "x³ − 3x² − 2x + 4", fns: [{ expr: "x^3-3x^2-2x+4", label: "y" }], view: { xmin: -3, xmax: 5, ymin: -10, ymax: 10 } },
                                { label: "4x⁴ + 4x³ − 9x² − x + 2", fns: [{ expr: "4x^4+4x^3-9x^2-x+2", label: "y" }], view: { xmin: -3, xmax: 2, ymin: -6, ymax: 8 } },
                            ],
                            view: { xmin: -3, xmax: 6, ymin: -12, ymax: 10 }, height: 280,
                            extras: (pr, c, pi) => [[-1, 1, 4], [-3, -1, 1, 3], [1 - Math.sqrt(5), 1, 1 + Math.sqrt(5)], [-2, -0.5, 0.5, 1]][pi].map((r) => ({ type: "point", x: r, y: 0, color: Cl.pink, label: F(r, 3) })),
                        }),
                        quiz(R`$x^3 - 2x^2 - x + 2 = 0$ denkleminin köklerinden biri hangisidir?`, ["2", "3", "−2", "0"], 0, R`$8 - 8 - 2 + 2 = 0$. (Gauss: adaylar $\pm1, \pm2$.)`),
                        quiz(R`$x^4 - 5x^2 + 4 = 0$ denkleminin kaç reel kökü vardır?`, ["4", "2", "0", "1"], 0, R`$x^2 = 1$ veya $x^2 = 4$ → $\pm1, \pm2$.`),
                    ],
                },
            ],
        },

        /* =========================== 0.5 =========================== */
        {
            no: "0.5", title: "Doğrunun Analitik İncelenmesi", page: 20,
            lessons: [
                {
                    id: "iki-nokta", title: "İki Nokta Arası Uzaklık ve Orta Nokta",
                    summary: "Pisagor'un koordinat düzlemindeki hâli.",
                    blocks: [
                        simple(R`Düzlemdeki iki nokta arasındaki uzaklığı bulmak için yatay ve dikey farkları bir dik üçgenin dik kenarları gibi düşün; uzaklık bu üçgenin <b>hipotenüsüdür</b> (Pisagor). Orta nokta ise koordinatların <b>ortalamasıdır</b>.`),
                        def("Teorem 0.8 — İki nokta arası uzaklık", R`$A(x_1, y_1)$ ve $B(x_2, y_2)$ noktaları arasındaki uzaklık
                            $$|AB| = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$`),
                        def("Orta nokta", R`$[AB]$ doğru parçasının orta noktası $C(\bar x, \bar y)$:
                            $$\bar x = \frac{x_1 + x_2}{2}, \qquad \bar y = \frac{y_1 + y_2}{2}$$`),
                        widget("graph", "Uzaklık ve orta nokta", "A ve B noktalarını kaydırıcılarla taşı. Kesikli çizgiler Pisagor üçgeninin dik kenarları.", {
                            fns: [],
                            params: { a: { label: "A'nın x'i", min: -5, max: 5, step: 1, value: 1 }, b: { label: "A'nın y'si", min: -5, max: 5, step: 1, value: 5 }, c: { label: "B'nin x'i", min: -5, max: 5, step: 1, value: 5 }, d: { label: "B'nin y'si", min: -5, max: 5, step: 1, value: 8 } },
                            view: { xmin: -6, xmax: 7, ymin: -6, ymax: 9 }, equal: true, height: 300,
                            extras: (pr) => [
                                { type: "seg", x1: pr.a, y1: pr.b, x2: pr.c, y2: pr.b, color: Cl.orange, dash: [5, 5], width: 2, label: `Δx = ${F(pr.c - pr.a)}`, labelOffset: [0, 14] },
                                { type: "seg", x1: pr.c, y1: pr.b, x2: pr.c, y2: pr.d, color: Cl.green, dash: [5, 5], width: 2, label: `Δy = ${F(pr.d - pr.b)}`, labelOffset: [34, 0] },
                                { type: "seg", x1: pr.a, y1: pr.b, x2: pr.c, y2: pr.d, color: Cl.blue, width: 3 },
                                { type: "point", x: pr.a, y: pr.b, color: Cl.blue, label: "A" },
                                { type: "point", x: pr.c, y: pr.d, color: Cl.blue, label: "B" },
                                { type: "point", x: (pr.a + pr.c) / 2, y: (pr.b + pr.d) / 2, color: Cl.pink, label: "C (orta)", labelPos: "nw" },
                            ],
                            readout: (pr) => {
                                const dx = pr.c - pr.a, dy = pr.d - pr.b, d2 = dx * dx + dy * dy;
                                const r = Math.sqrt(d2), nice = Math.abs(r - Math.round(r)) < 1e-9;
                                return T(`|AB| = \\sqrt{(${N(dx)})^2 + (${N(dy)})^2} = \\sqrt{${d2}}${nice ? " = " + Math.round(r) : " \\approx " + N(r, 3)}`) + "<br>" +
                                    T(`C = \\left(\\frac{${N(pr.a)} + ${N(pr.c)}}{2},\\ \\frac{${N(pr.b)} + ${N(pr.d)}}{2}\\right) = (${N((pr.a + pr.c) / 2)},\\ ${N((pr.b + pr.d) / 2)})`);
                            },
                        }),
                        ex(R`$A(5, 8)$, $B(1, 5)$ noktaları arasındaki uzaklığı hesaplayınız.`, [
                            R`$|AB| = \sqrt{(5 - 1)^2 + (8 - 5)^2} = \sqrt{16 + 9}$`,
                        ], R`$\sqrt{25} = 5$ birim.`),
                        ex(R`Uç noktaları $A(2, 5)$, $B(4, 3)$ olan $[AB]$'nin orta noktasını bulunuz.`, [
                            R`$\bar x = \frac{2 + 4}{2} = 3$, $\bar y = \frac{5 + 3}{2} = 4$.`,
                        ], R`$C(3, 4)$.`),
                        quiz(R`$A(1, 2)$ ile $B(4, 6)$ arasındaki uzaklık kaçtır?`, ["5", "7", R`$\sqrt{7}$`, "25"], 0, R`$\sqrt{9 + 16} = 5$.`),
                    ],
                },
                {
                    id: "egim", title: "Eğim; Paralel ve Dik Doğrular",
                    summary: "Doğrunun ne kadar dik olduğu.",
                    blocks: [
                        simple(R`Eğim, bir doğrunun ne kadar <b>dik</b> olduğunu söyler: Sağa doğru 1 adım gidince kaç adım yükseliyorsun? “<b>Yükselen / yatay giden</b>” oranı. Pozitif eğim yokuş yukarı, negatif eğim yokuş aşağıdır.`),
                        def("Eğim", R`Bir $d$ doğrusunun $Ox$-ekseni ile pozitif yönde yaptığı açıya <b>eğim açısı</b> ($\theta$), bu açının tanjantına <b>eğim</b> denir: $m = \tan\theta$. Doğru üzerindeki iki nokta $P(x_1, y_1)$, $Q(x_2, y_2)$ ise
                            $$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta y}{\Delta x}$$
                            Eğim, seçilen noktalardan bağımsızdır.`),
                        widget("graph", "Eğim açısı", "Eğim açısını değiştir. Dar açıda eğim pozitif, geniş açıda negatif; 90°'de tanımsız (dikey doğru).", {
                            fns: [],
                            params: { t: { label: "Eğim açısı θ", min: 0, max: 180, step: 5, value: 45, format: (v) => `${v}°` } },
                            view: { xmin: -5, xmax: 5, ymin: -4, ymax: 4 }, equal: true, height: 280,
                            extras: (pr) => {
                                const th = (pr.t * Math.PI) / 180, items = [];
                                if (pr.t === 90) items.push({ type: "vline", x: 0, color: Cl.blue, width: 3, dash: false });
                                else items.push({ type: "fn", f: (x) => Math.tan(th) * x, color: Cl.blue, width: 3 });
                                items.push({ type: "param", x: (u) => 0.9 * Math.cos(u), y: (u) => 0.9 * Math.sin(u), t0: 0, t1: th, color: Cl.orange, width: 2.4 });
                                if (pr.t !== 90 && pr.t !== 0 && pr.t !== 180) {
                                    const m = Math.tan(th), x0 = 1.5, x1 = 3;
                                    items.push({ type: "seg", x1: x0, y1: m * x0, x2: x1, y2: m * x0, color: Cl.green, dash: [4, 4], width: 2, label: "Δx", labelOffset: [0, m > 0 ? 14 : -14] });
                                    items.push({ type: "seg", x1: x1, y1: m * x0, x2: x1, y2: m * x1, color: Cl.pink, dash: [4, 4], width: 2, label: "Δy", labelOffset: [18, 0] });
                                }
                                return items;
                            },
                            readout: (pr) => {
                                if (pr.t === 90) return `θ = 90°: ${T("\\tan 90^\\circ")} tanımsız → <b>dikey doğrunun eğimi tanımsızdır</b> (Δx = 0).`;
                                const m = Math.tan((pr.t * Math.PI) / 180);
                                const kind = pr.t === 0 || pr.t === 180 ? "<b>yatay doğru</b>, eğim 0" : pr.t < 90 ? `<span class="good">dar açı → pozitif eğim</span>` : `<span class="bad">geniş açı → negatif eğim</span>`;
                                return T(`m = \\tan ${pr.t}^\\circ \\approx ${N(m, 3)}`) + " — " + kind;
                            },
                        }),
                        def("Paralel ve dik doğrular", R`Düşey olmayan $d_1$ ve $d_2$ doğrularının eğimleri $m_1$ ve $m_2$ olsun.
                            $$d_1 \parallel d_2 \iff m_1 = m_2, \qquad d_1 \perp d_2 \iff m_1\cdot m_2 = -1$$`),
                        tip(R`Dik doğrunun eğimini bulmak için: eğimi <b>ters çevir ve işaretini değiştir</b>. $m = \frac23$ ise dik doğrunun eğimi $-\frac32$.`),
                        quiz(R`$(1, 1)$ ve $(3, 7)$ noktalarından geçen doğrunun eğimi kaçtır?`, ["3", R`$\frac13$`, "6", "−3"], 0, R`$\frac{7 - 1}{3 - 1} = \frac62 = 3$.`),
                        quiz(R`Eğimi 4 olan bir doğruya dik olan doğrunun eğimi kaçtır?`, [R`$-\frac14$`, R`$\frac14$`, "−4", "4"], 0, R`$4\cdot m = -1 \Rightarrow m = -\frac14$.`),
                    ],
                },
                {
                    id: "dogru-denklemi", title: "Doğrunun Denklemi",
                    summary: "Bir nokta ve eğim, ya da iki nokta yeter.",
                    blocks: [
                        simple(R`Bir doğruyu tanımlamak için ya <b>bir noktası ve eğimi</b>, ya da <b>iki noktası</b> yeterlidir. Denklem, doğru üzerindeki her $(x, y)$ noktasının sağladığı kuraldır.`),
                        formula("Doğru denklemi biçimleri", R`<ul>
                            <li><b>Nokta-eğim:</b> $A(x_0, y_0)$'dan geçen, eğimi $m$: $\;y - y_0 = m(x - x_0)$</li>
                            <li><b>Eğim-kesen:</b> $y = mx + n$ ($x$'in katsayısı eğim, $n$ y-eksenini kestiği yer)</li>
                            <li><b>Genel:</b> $ax + by + c = 0$; eğimi $m = -\frac ab$</li>
                            <li><b>İki nokta:</b> $\dfrac{y - y_1}{y_1 - y_2} = \dfrac{x - x_1}{x_1 - x_2}$</li>
                            <li><b>Eksenleri kesen:</b> eksenleri $(p, 0)$ ve $(0, q)$'da kesiyorsa $\;\dfrac xp + \dfrac yq = 1$</li>
                        </ul>`),
                        widget("graph", "y = mx + n", "Eğimi ve y-eksenini kestiği yeri değiştir.", {
                            fns: [{ expr: "m*x+n", label: (pr) => `y = ${F(pr.m)}x ${pr.n < 0 ? "− " + F(-pr.n) : "+ " + F(pr.n)}` }],
                            params: { m: { label: "Eğim m", min: -4, max: 4, step: 0.25, value: 2 }, n: { label: "y-kesen n", min: -5, max: 5, step: 0.5, value: 1 } },
                            view: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, equal: true, height: 280,
                            extras: (pr) => [{ type: "point", x: 0, y: pr.n, color: Cl.orange, label: `(0, ${F(pr.n)})`, labelPos: "nw" }, ...(pr.m !== 0 ? [{ type: "point", x: -pr.n / pr.m, y: 0, color: Cl.pink, label: `(${F(-pr.n / pr.m, 3)}, 0)`, labelPos: "se" }] : [])],
                        }),
                        ex(R`$A(1, 3)$ noktasından geçen ve $Ox$-ekseni ile pozitif yönde $45^\circ$ açı yapan doğrunun denklemini yazınız.`, [
                            R`Eğim $m = \tan45^\circ = 1$.`,
                            R`$y - 3 = 1\cdot(x - 1)$.`,
                        ], R`$y = x + 2$.`),
                        ex(R`$3x + 4y + 5 = 0$ doğrusunun eğimini bulunuz.`, [
                            R`$y$'yi yalnız bırak: $y = -\frac34x - \frac54$.`,
                        ], R`$m = -\frac34$ (ya da doğrudan $-\frac ab = -\frac34$).`),
                        ex(R`$A(2, -3)$'ten geçen ve $2x + 4y + 5 = 0$'a paralel olan doğrunun denklemini yazınız.`, [
                            R`Verilen doğrunun eğimi $-\frac24 = -\frac12$; paralel doğru da aynı eğimde.`,
                            R`$y + 3 = -\frac12(x - 2)$.`,
                        ], R`$x + 2y + 4 = 0$.`),
                        ex(R`$A(1, 4)$'ten geçen ve $3x + 2y + 4 = 0$'a dik olan doğrunun denklemini yazınız.`, [
                            R`Verilen eğim $m_1 = -\frac32$; dik doğrunun eğimi $\frac23$.`,
                            R`$y - 4 = \frac23(x - 1)$.`,
                        ], R`$2x - 3y + 10 = 0$.`),
                        ex(R`$A(1, 3)$, $B(2, 5)$'ten geçen doğrunun denklemini yazınız. Bu doğru $Ox$-eksenini hangi noktada keser?`, [
                            R`$\frac{y - 3}{3 - 5} = \frac{x - 1}{1 - 2} \Rightarrow y = 2x + 1$.`,
                            R`$y = 0$: $0 = 2x + 1 \Rightarrow x = -\frac12$.`,
                        ], R`$y = 2x + 1$; $\left(-\frac12, 0\right)$ noktasında keser.`),
                        ex(R`Eksenleri $A$ ve $B$ noktalarında kesen $d$ doğrusu için $|OA| = 4|OB|$'dir ve doğru $K(2, 1)$'den geçmektedir. Denklemini bulunuz.`, [
                            R`$B$'nin ordinatı $q$ ise $A$'nın apsisi $4q$: $\frac{x}{4q} + \frac yq = 1 \Rightarrow x + 4y = 4q$.`,
                            R`$K(2, 1)$: $2 + 4 = 4q \Rightarrow q = \frac32$.`,
                        ], R`$x + 4y = 6$.`),
                        quiz(R`$2x - 3y + 6 = 0$ doğrusunun eğimi kaçtır?`, [R`$\frac23$`, R`$-\frac23$`, R`$\frac32$`, "2"], 0, R`$-\frac ab = -\frac{2}{-3} = \frac23$.`),
                        quiz(R`$(0, 2)$'den geçen ve eğimi 3 olan doğru hangisidir?`, [R`$y = 3x + 2$`, R`$y = 2x + 3$`, R`$y = 3x - 2$`, R`$y = -3x + 2$`], 0, R`Eğim-kesen biçimi: $m = 3$, $n = 2$.`),
                    ],
                },
                {
                    id: "nokta-dogru-uzaklik", title: "Noktanın Doğruya Uzaklığı",
                    summary: "En kısa yol: dik inmek.",
                    blocks: [
                        simple(R`Bir noktadan bir doğruya olan uzaklık, noktadan doğruya inilen <b>dikmenin</b> uzunluğudur — en kısa yol her zaman dik gitmektir.`),
                        def("Uzaklık formülü", R`$A(x_0, y_0)$ noktasının $ax + by + c = 0$ doğrusuna uzaklığı
                            $$\ell = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}$$`),
                        widget("graph", "Dikme ve uzaklık", "A noktasını taşı. Doğru: 3x + 4y − 6 = 0 (kitaptaki örnek).", {
                            fns: [{ expr: "(6-3x)/4", label: "3x + 4y − 6 = 0", color: Cl.blue }],
                            params: { u: { label: "A'nın x'i", min: -4, max: 6, step: 0.5, value: 2 }, v: { label: "A'nın y'si", min: -4, max: 6, step: 0.5, value: 5 } },
                            view: { xmin: -5, xmax: 7, ymin: -4, ymax: 7 }, equal: true, height: 300,
                            extras: (pr) => {
                                const k = (3 * pr.u + 4 * pr.v - 6) / 25, hx = pr.u - 3 * k, hy = pr.v - 4 * k;
                                return [
                                    { type: "seg", x1: pr.u, y1: pr.v, x2: hx, y2: hy, color: Cl.pink, width: 2.6, dash: [5, 4] },
                                    { type: "point", x: pr.u, y: pr.v, color: Cl.pink, label: "A" },
                                    { type: "point", x: hx, y: hy, color: Cl.orange, label: "H", labelPos: "se" },
                                ];
                            },
                            readout: (pr) => {
                                const top = 3 * pr.u + 4 * pr.v - 6;
                                return T(`\\ell = \\frac{|3\\cdot ${N(pr.u)} + 4\\cdot ${N(pr.v)} - 6|}{\\sqrt{9 + 16}} = \\frac{${N(Math.abs(top))}}{5} = ${N(Math.abs(top) / 5, 3)}`) + (Math.abs(top) < 1e-9 ? ` — <span class="good">A doğrunun üzerinde!</span>` : "");
                            },
                        }),
                        ex(R`$A(2, 5)$ noktasının $3x + 4y - 6 = 0$ doğrusuna uzaklığını hesaplayınız.`, [
                            R`$\ell = \frac{|3\cdot2 + 4\cdot5 - 6|}{\sqrt{9 + 16}} = \frac{|20|}{5}$`,
                        ], R`$4$ birim.`),
                        def("Paralel iki doğru arası uzaklık", R`$ax + by + c_1 = 0$ ve $ax + by + c_2 = 0$ doğruları arasındaki uzaklık
                            $$\ell = \frac{|c_1 - c_2|}{\sqrt{a^2 + b^2}}$$
                            <span class="muted">Dikkat: önce $x$ ve $y$'nin katsayılarını eşitle!</span>`),
                        ex(R`$3x - 4y + 10 = 0$ ve $6x - 8y - 5 = 0$ doğruları arasındaki uzaklığı hesaplayınız.`, [
                            R`Katsayıları eşitle: ilk denklemi 2 ile çarp: $6x - 8y + 20 = 0$.`,
                            R`$\ell = \frac{|20 - (-5)|}{\sqrt{36 + 64}} = \frac{25}{10}$`,
                        ], R`$2{,}5$ birim.`),
                        ex(R`Köşeleri $A(-4, 6)$, $B(1, 1)$, $C(-7, 7)$ olan üçgenin alanını bulunuz.`, [
                            R`$BC$ doğrusu: $\frac{y - 7}{7 - 1} = \frac{x + 7}{-7 - 1} \Rightarrow 3x + 4y - 7 = 0$.`,
                            R`Yükseklik $h$ = A'nın $BC$'ye uzaklığı: $\frac{|-12 + 24 - 7|}{5} = 1$.`,
                            R`$|BC| = \sqrt{8^2 + 6^2} = 10$.`,
                        ], R`Alan $= \frac12\cdot10\cdot1 = 5$ br².`),
                        quiz(R`Orijinin $3x + 4y - 10 = 0$ doğrusuna uzaklığı kaçtır?`, ["2", "10", "5", R`$\frac{10}{7}$`], 0, R`$\frac{|0 + 0 - 10|}{5} = 2$.`),
                    ],
                },
            ],
        },

        /* =========================== 0.6 =========================== */
        {
            no: "0.6", title: "Çemberin Analitik İncelenmesi", page: 29,
            lessons: [
                {
                    id: "cember-denklemi", title: "Çemberin Denklemi",
                    summary: "Merkezden eşit uzaklıktaki noktalar.",
                    blocks: [
                        simple(R`Çember, bir <b>merkezden</b> aynı uzaklıktaki (yarıçap) tüm noktalardır. Denklemi doğrudan uzaklık formülünden gelir: “$P$ ile merkez arasındaki uzaklık $= r$”.`),
                        def("Standart denklem", R`$M(a, b)$ merkezli, $r$ yarıçaplı çember üzerindeki her $P(x, y)$ için $|PM| = r$:
                            $$(x - a)^2 + (y - b)^2 = r^2$$
                            Merkez orijindeyse $x^2 + y^2 = r^2$ (<b>merkezil çember</b>); $r = 1$ ise <b>birim çember</b>.`),
                        def("Genel denklem", R`Kareler açılırsa $x^2 + y^2 + Dx + Ey + F = 0$ biçimi elde edilir ($D = -2a$, $E = -2b$, $F = a^2 + b^2 - r^2$). Buna göre
                            $$M(a, b) = \left(-\frac D2,\ -\frac E2\right), \qquad r = \frac12\sqrt{D^2 + E^2 - 4F}$$`),
                        widget("graph", "Çember çizici", "Merkezi ve yarıçapı değiştir; iki denklem biçimini de gör.", {
                            fns: [],
                            params: { a: { label: "Merkez a", min: -4, max: 4, step: 1, value: -1 }, b: { label: "Merkez b", min: -4, max: 4, step: 1, value: 3 }, r: { label: "Yarıçap r", min: 1, max: 6, step: 1, value: 5 } },
                            view: { xmin: -8, xmax: 8, ymin: -5, ymax: 9 }, equal: true, height: 300,
                            extras: (pr) => [circle(pr.a, pr.b, pr.r, Cl.blue), { type: "seg", x1: pr.a, y1: pr.b, x2: pr.a + pr.r, y2: pr.b, color: Cl.orange, width: 2, label: "r", labelOffset: [0, -12] }, { type: "point", x: pr.a, y: pr.b, color: Cl.pink, label: "M" }],
                            readout: (pr) => {
                                const sx = pr.a === 0 ? "x^2" : `(x ${pr.a > 0 ? "-" : "+"} ${Math.abs(pr.a)})^2`, sy = pr.b === 0 ? "y^2" : `(y ${pr.b > 0 ? "-" : "+"} ${Math.abs(pr.b)})^2`;
                                const D = -2 * pr.a, E = -2 * pr.b, Fv = pr.a * pr.a + pr.b * pr.b - pr.r * pr.r;
                                const term = (v, s) => (v === 0 ? "" : ` ${v > 0 ? "+" : "-"} ${Math.abs(v)}${s}`);
                                return `Standart: ${T(`${sx} + ${sy} = ${pr.r * pr.r}`)}<br>Genel: ${T(`x^2 + y^2${term(D, "x")}${term(E, "y")}${term(Fv, "")} = 0`)}`;
                            },
                        }),
                        ex(R`$C(-1, 3)$ merkezli, $r = 5$ birim yarıçaplı çemberin denklemini yazınız.`, [
                            R`$a = -1$, $b = 3$, $r = 5$.`,
                        ], R`$(x + 1)^2 + (y - 3)^2 = 25$.`),
                        ex(R`$x^2 + y^2 - 4x + 10y + 20 = 0$ çemberinin merkezini ve yarıçapını bulunuz.`, [
                            R`$D = -4$, $E = 10$, $F = 20$: $a = -\frac D2 = 2$, $b = -\frac E2 = -5$.`,
                            R`$r = \frac12\sqrt{16 + 100 - 80} = \frac12\sqrt{36} = 3$.`,
                        ], R`Merkez $M(2, -5)$, yarıçap $r = 3$.`),
                        tip(R`Bir denklemin çember belirtmesi için $x^2$ ile $y^2$'nin katsayıları <b>eşit</b> olmalı, $xy$ terimi <b>olmamalı</b> ve $D^2 + E^2 - 4F > 0$ olmalıdır.`),
                        quiz(R`$x^2 + y^2 - 6x + 8y = 0$ çemberinin yarıçapı kaçtır?`, ["5", "25", "10", R`$\sqrt{14}$`], 0, R`Merkez $(3, -4)$; $r = \frac12\sqrt{36 + 64 - 0} = 5$.`),
                        quiz(R`$(x - 1)^2 + (y + 2)^2 = 9$ çemberinin merkezi nedir?`, [R`$(1, -2)$`, R`$(-1, 2)$`, R`$(1, 2)$`, R`$(-1, -2)$`], 0, R`$(x - a)$ ve $(y - b)$ içinde işaretler ters: $a = 1$, $b = -2$.`),
                    ],
                },
                {
                    id: "cember-dogru", title: "Çember ve Doğru",
                    summary: "Keser mi, teğet mi, kesmez mi?",
                    blocks: [
                        simple(R`Bir doğrunun çembere göre durumunu anlamak için <b>merkezin doğruya uzaklığını</b> ($\ell$) yarıçapla ($r$) karşılaştır: uzaklık küçükse doğru çemberin içinden geçer, eşitse teğettir, büyükse dışarıda kalır.`),
                        formula("Üç durum", R`<ol>
                            <li>$\ell < r$ ise doğru çemberi <b>iki noktada keser</b>.</li>
                            <li>$\ell = r$ ise doğru çembere <b>teğettir</b>.</li>
                            <li>$\ell > r$ ise doğru çemberi <b>kesmez</b>.</li>
                        </ol>`),
                        widget("graph", "Doğru çemberi kesiyor mu?", "Doğrunun eğimini ve kesenini değiştir. Çember: x² + y² + 2x − 4y − 11 = 0 (merkez (−1, 2), r = 4).", {
                            fns: [{ expr: "k*x+n", label: "doğru", color: Cl.pink }],
                            params: { k: { label: "Eğim k", min: -3, max: 3, step: 0.25, value: 0.75 }, n: { label: "y-kesen n", min: -10, max: 10, step: 0.25, value: -4.75 } },
                            view: { xmin: -8, xmax: 7, ymin: -5, ymax: 8 }, equal: true, height: 300,
                            extras: (pr) => {
                                const d = (pr.k * -1 - 2 + pr.n) / Math.sqrt(pr.k * pr.k + 1);
                                const t = d / Math.sqrt(pr.k * pr.k + 1), hx = -1 - pr.k * t, hy = 2 + t;
                                return [circle(-1, 2, 4, Cl.blue), { type: "point", x: -1, y: 2, color: Cl.blue, label: "M" }, { type: "seg", x1: -1, y1: 2, x2: hx, y2: hy, color: Cl.orange, dash: [5, 4], width: 2, label: "ℓ" }, { type: "point", x: hx, y: hy, color: Cl.orange, r: 4 }];
                            },
                            readout: (pr) => {
                                const l = Math.abs(pr.k * -1 - 2 + pr.n) / Math.sqrt(pr.k * pr.k + 1);
                                const st = Math.abs(l - 4) < 0.02 ? `<b>ℓ ≈ r → teğet</b>` : l < 4 ? `<span class="good">ℓ < r → iki noktada keser</span>` : `<span class="bad">ℓ > r → kesmez</span>`;
                                const nTerm = pr.n < 0 ? `- ${N(-pr.n)}` : `+ ${N(pr.n)}`;
                                return `${T(`\\ell = \\frac{|${N(pr.k)}\\cdot(-1) - 2 ${nTerm}|}{\\sqrt{(${N(pr.k)})^2 + 1}} \\approx ${N(l, 3)}`)}, ${T("r = 4")} → ${st}`;
                            },
                        }),
                        ex(R`$x^2 + y^2 + 2x - 4y - 11 = 0$ çemberinin $3x - 4y - 19 = 0$ doğrusuna en yakın noktasının bu doğruya uzaklığı kaç birimdir?`, [
                            R`Tam kareye tamamla: $(x + 1)^2 + (y - 2)^2 = 16$: merkez $M(-1, 2)$, $r = 4$.`,
                            R`$|MH| = \frac{|3(-1) - 4\cdot2 - 19|}{\sqrt{9 + 16}} = \frac{30}{5} = 6$.`,
                            R`En yakın nokta $P$, $MH$ üzerinde çemberin kestiği yer: $|PH| = |MH| - r$.`,
                        ], R`$6 - 4 = 2$ birim.`),
                        ex(R`$y = 4$ doğrusunun $x^2 + y^2 - 6x + 1 - m = 0$ çemberine teğet olması için $m$ ne olmalıdır?`, [
                            R`Merkez $M(3, 0)$; $y = 4$'e uzaklığı $\ell = 4$. Teğet için $r = 4$.`,
                            R`$r = \frac12\sqrt{36 + 0 - 4(1 - m)} = \frac12\sqrt{32 + 4m} = 4$.`,
                            R`$\sqrt{32 + 4m} = 8 \Rightarrow 32 + 4m = 64$.`,
                        ], R`$m = 8$.`),
                        quiz(R`Yarıçapı 5 olan bir çemberin merkezinin bir doğruya uzaklığı 3 ise doğru çemberi…`, ["iki noktada keser", "teğettir", "kesmez", "merkezden geçer"], 0, R`$\ell = 3 < 5 = r$.`),
                    ],
                },
            ],
        },
    ];

    global.CHAPTERS = global.CHAPTERS || {};
    global.CHAPTERS.onbilgiler = {
        no: 0, id: "onbilgiler", title: "Önbilgiler",
        intro: "Orta öğretimden bilinen temel konuların kısa özeti: kümeler, sayılar, üslü ve köklü ifadeler, ikinci dereceden denklemler, doğru ve çember.",
        sections,
    };
})(window);
