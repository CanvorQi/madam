/*
 * Bölüm 0 - Önbilgiler: çoktan seçmeli testler + kitap problemlerinin çözümleri
 * (s. 12-13, 19, 27-28, 31, 32-33).
 */
(function (global) {
    "use strict";

    const R = String.raw;
    const mc = (q, options, correct, why) => ({ q, options, correct, why });
    const part = (l, q, a, s, graph) => ({ l, q, a, s: s || [], graph });

    const tests = [
        {
            id: "test-0-1", title: "Test · Kümeler, Sayılar, Üslü-Köklü", sections: ["0.1", "0.2", "0.3"],
            desc: "Küme işlemleri, sayı kümeleri, aralıklar, mutlak değer, tam kısım, üs ve kök kuralları.",
            questions: [
                mc(R`$A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$ ise $A \cap B$ nedir?`, [R`$\{3, 4\}$`, R`$\{1, 2, 3, 4, 5\}$`, R`$\{1, 2\}$`, R`$\{5\}$`], 0, R`Ortak elemanlar 3 ve 4.`),
                mc(R`$s(A) = 10$, $s(B) = 7$, $s(A \cap B) = 3$ ise $s(A \cup B)$ kaçtır?`, ["14", "17", "20", "10"], 0, R`$10 + 7 - 3 = 14$.`),
                mc(R`$s(A) = 3$, $s(B) = 4$ ise $s(A \times B)$ kaçtır?`, ["12", "7", "81", "64"], 0, R`$s(A\times B) = s(A)\cdot s(B)$.`),
                mc("Aşağıdakilerden hangisi irrasyoneldir?", [R`$\sqrt{2}$`, R`$0{,}25$`, R`$-3$`, R`$\frac47$`], 0, R`$\sqrt2$ kesir olarak yazılamaz; diğerleri rasyonel.`),
                mc(R`$|x - 3| < 2$ eşitsizliğinin çözüm kümesi nedir?`, [R`$(1, 5)$`, R`$(-\infty, 1) \cup (5, \infty)$`, R`$[1, 5]$`, R`$(-5, -1)$`], 0, R`$-2 < x - 3 < 2 \Rightarrow 1 < x < 5$.`),
                mc(R`$\llbracket -2{,}5 \rrbracket$ kaçtır?`, ["−3", "−2", "2", "−2,5"], 0, R`$-3 \le -2{,}5 < -2$.`),
                mc(R`$2^{-3}$ kaçtır?`, [R`$\frac18$`, "−8", "−6", R`$-\frac18$`], 0, R`$\frac{1}{2^3}$. Negatif üs işareti değil, ters çevirmeyi gösterir.`),
                mc(R`$27^{\frac23}$ kaçtır?`, ["9", "18", "3", "81"], 0, R`$(\sqrt[3]{27})^2 = 9$.`),
                mc(R`$\sqrt{50} - \sqrt{8}$ kaçtır?`, [R`$3\sqrt2$`, R`$\sqrt{42}$`, R`$7\sqrt2$`, R`$2\sqrt3$`], 0, R`$5\sqrt2 - 2\sqrt2 = 3\sqrt2$.`),
                mc(R`$[-1, 4)$ aralığında kaç <b>tam sayı</b> vardır?`, ["5", "4", "6", "3"], 0, R`$-1, 0, 1, 2, 3$ (4 dahil değil).`),
            ],
        },
        {
            id: "test-0-2", title: "Test · İkinci Dereceden Denklemler", sections: ["0.4"],
            desc: "Diskriminant, kökler, parabol, işaret tablosu, yüksek dereceli denklemler.",
            questions: [
                mc(R`$x^2 - 5x + 6 = 0$ denkleminin kökleri nelerdir?`, ["2 ve 3", "−2 ve −3", "1 ve 6", "−1 ve −6"], 0, R`$(x-2)(x-3) = 0$.`),
                mc(R`$2x^2 - 3x + 5 = 0$ denkleminin kaç reel kökü vardır?`, ["0", "1", "2", "Sonsuz"], 0, R`$\Delta = 9 - 40 < 0$.`),
                mc(R`$y = x^2 - 4x + 1$ parabolünün tepe noktası nedir?`, [R`$(2, -3)$`, R`$(-2, 13)$`, R`$(4, 1)$`, R`$(2, 1)$`], 0, R`$x_0 = -\frac{b}{2a} = 2$, $y_0 = -3$.`),
                mc(R`$x^2 - 9 < 0$ eşitsizliğinin çözüm kümesi nedir?`, [R`$(-3, 3)$`, R`$(3, \infty)$`, R`$(-\infty, -3)\cup(3, \infty)$`, R`$\varnothing$`], 0, R`Kökler arası, $a > 0$ olduğundan negatif.`),
                mc(R`$x^2 - 2x + 1 > 0$ eşitsizliğinin çözüm kümesi nedir?`, [R`$\mathbb{R}\setminus\{1\}$`, R`$\mathbb{R}$`, R`$\varnothing$`, R`$(1, \infty)$`], 0, R`$(x - 1)^2 > 0$: sadece $x = 1$'de sıfır.`),
                mc(R`$3x^2 - 6x - 2 = 0$ denkleminin kökleri toplamı kaçtır?`, ["2", "−2", R`$-\frac23$`, "6"], 0, R`$x_1 + x_2 = -\frac ba = \frac63 = 2$.`),
                mc(R`$x^4 - 5x^2 + 4 = 0$ denkleminin kaç reel kökü vardır?`, ["4", "2", "1", "0"], 0, R`$x^2 = 1$ veya $4$: $\pm1, \pm2$.`),
                mc(R`$x^3 - 2x^2 - x + 2 = 0$ denkleminin köklerinden biri hangisidir?`, ["2", "3", "−2", "0"], 0, R`$8 - 8 - 2 + 2 = 0$.`),
                mc(R`$x^2 + 4x + m = 0$ denkleminin çift (eşit) kökü olması için $m$ kaç olmalıdır?`, ["4", "−4", "2", "16"], 0, R`$\Delta = 16 - 4m = 0 \Rightarrow m = 4$.`),
                mc(R`$y = ax^2 + bx + c$ parabolünün kolları aşağı doğru ise…`, [R`$a < 0$`, R`$a > 0$`, R`$c < 0$`, R`$\Delta < 0$`], 0, R`Kolların yönünü baş katsayı $a$ belirler.`),
            ],
        },
        {
            id: "test-0-3", title: "Test · Doğru ve Çember", sections: ["0.5", "0.6"],
            desc: "Uzaklık, orta nokta, eğim, doğru denklemi, noktanın doğruya uzaklığı, çember.",
            questions: [
                mc(R`$A(1, 2)$ ile $B(4, 6)$ arasındaki uzaklık kaçtır?`, ["5", "7", "25", R`$\sqrt7$`], 0, R`$\sqrt{3^2 + 4^2} = 5$.`),
                mc(R`$(2, -1)$ ve $(6, 5)$ noktalarının orta noktası nedir?`, [R`$(4, 2)$`, R`$(8, 4)$`, R`$(2, 3)$`, R`$(4, 3)$`], 0, R`$\left(\frac{2+6}{2}, \frac{-1+5}{2}\right)$.`),
                mc(R`$(1, 1)$ ve $(3, 7)$'den geçen doğrunun eğimi kaçtır?`, ["3", R`$\frac13$`, "6", "−3"], 0, R`$\frac{6}{2} = 3$.`),
                mc(R`Eğimi 2 olan doğruya dik bir doğrunun eğimi kaçtır?`, [R`$-\frac12$`, R`$\frac12$`, "−2", "2"], 0, R`$m_1 m_2 = -1$.`),
                mc(R`$2x - 3y + 6 = 0$ doğrusunun eğimi kaçtır?`, [R`$\frac23$`, R`$-\frac23$`, R`$\frac32$`, "−2"], 0, R`$-\frac ab = \frac23$.`),
                mc(R`$(0, 2)$'den geçen ve eğimi 3 olan doğru hangisidir?`, [R`$y = 3x + 2$`, R`$y = 2x + 3$`, R`$y = 3x - 2$`, R`$3y = x + 2$`], 0, R`$y = mx + n$.`),
                mc(R`Orijinin $3x + 4y - 10 = 0$ doğrusuna uzaklığı kaçtır?`, ["2", "10", "5", "1"], 0, R`$\frac{10}{5} = 2$.`),
                mc(R`$(x - 1)^2 + (y + 2)^2 = 9$ çemberinin merkezi ve yarıçapı nedir?`, [R`$(1, -2),\ 3$`, R`$(-1, 2),\ 3$`, R`$(1, -2),\ 9$`, R`$(-1, 2),\ 9$`], 0, R`$a = 1$, $b = -2$, $r = \sqrt9$.`),
                mc(R`$x^2 + y^2 - 6x + 8y = 0$ çemberinin merkezi nedir?`, [R`$(3, -4)$`, R`$(-3, 4)$`, R`$(6, -8)$`, R`$(-6, 8)$`], 0, R`$\left(-\frac D2, -\frac E2\right) = (3, -4)$; yarıçap 5.`),
                mc(R`Yarıçapı 5 olan çemberin merkezinin bir doğruya uzaklığı 5 ise doğru çembere…`, ["teğettir", "iki noktada keser", "kesmez", "merkezden geçer"], 0, R`$\ell = r$.`),
            ],
        },
    ];

    const problemSets = [
        /* ------------------------- 0.1–0.3 ------------------------- */
        {
            id: "problemler-0-3", title: "Problemler · 0.1–0.3 Kümeler, Sayılar, Üslü-Köklü", page: "12–13", sections: ["0.1", "0.2", "0.3"],
            problems: [
                { no: 1, q: R`$A, B, C$ herhangi üç küme olsun. Aşağıdaki eşitliklerin doğruluğunu gösteriniz.`, note: R`Kitapta (d) ve ikinci (e) şıkları baskı hatalıdır; doğruları aşağıda yazılmıştır (dağılma özellikleri).`, parts: [
                    part("a", R`$A \setminus A = \varnothing$`, "Doğru", [R`Hem $A$'da olup hem $A$'da olmayan eleman yok.`]),
                    part("b", R`$A \setminus \varnothing = A$`, "Doğru", [R`$\varnothing$'de eleman olmadığından $A$'dan hiçbir şey çıkmaz.`]),
                    part("c", R`$A \cap B = B \cap A$`, "Doğru", [R`“$x \in A$ ve $x \in B$” ile “$x \in B$ ve $x \in A$” aynı şey.`]),
                    part("d", R`$A \cup B = B \cup A$`, "Doğru", [R`“veya” bağlacı sıradan bağımsız.`]),
                    part("e", R`$A \cup (B \cup C) = (A \cup B) \cup C$`, "Doğru", [R`İki taraf da “$A$, $B$ veya $C$'den en az birinde olanlar”.`]),
                    part("ç", R`$A \cap (B \cap C) = (A \cap B) \cap C$`, "Doğru", [R`İki taraf da “üçünde birden olanlar”.`]),
                    part("d₂", R`$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$`, "Doğru (kesişimin dağılması)", [R`$x \in A$ ve ($x \in B$ veya $x \in C$) $\iff$ ($x \in A$ ve $x \in B$) veya ($x \in A$ ve $x \in C$).`]),
                    part("e₂", R`$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$`, "Doğru (birleşimin dağılması)", [R`$x \in A$ veya ($x \in B$ ve $x \in C$) $\iff$ ($x \in A$ veya $x \in B$) ve ($x \in A$ veya $x \in C$).`]),
                    part("f", R`$A^t \setminus B^t = B \setminus A$`, "Doğru", [R`$A^t \setminus B^t = A^t \cap B$: $A$'da olmayan ama $B$'de olanlar, yani $B \setminus A$.`]),
                    part("g", R`$A \setminus (B \cap C) = (A \setminus B) \cup (A \setminus C)$`, "Doğru (De Morgan)", [R`$x \in A$ ve $x \notin B \cap C$ $\iff$ $x \in A$ ve ($x \notin B$ veya $x \notin C$).`]),
                    part("h", R`$(A \cap B) \times C = (A \times C) \cap (B \times C)$`, "Doğru", [R`$(x, y)$: $x \in A \cap B$, $y \in C$ $\iff$ $(x, y) \in A\times C$ ve $(x, y) \in B \times C$.`]),
                    part("ı", R`$(A \cup B) \times C = (A \times C) \cup (B \times C)$`, "Doğru", [R`Benzer şekilde “veya” ile.`]),
                ] },
                { no: 2, q: "Aşağıdaki önermelerin doğruluğunu gösteriniz.", parts: [
                    part("a", R`$A \cap B = A \iff A \subset B$`, "Doğru", [R`($\Rightarrow$) $x \in A = A \cap B \Rightarrow x \in B$. ($\Leftarrow$) $A \subset B$ ise $A$'nın her elemanı ortak eleman: $A \cap B = A$.`]),
                    part("b", R`$A \cup B = B \iff A \subset B$`, "Doğru", [R`($\Rightarrow$) $x \in A \subset A \cup B = B$. ($\Leftarrow$) $A$'nın elemanları zaten $B$'de; birleşim $B$'yi büyütmez.`]),
                    part("c", R`$A \subset B \iff A^t \supset B^t$`, "Doğru", [R`$x \notin B \Rightarrow x \notin A$ (çünkü $A$'da olsaydı $B$'de de olurdu).`]),
                    part("ç", R`$A \cap B = \varnothing \iff B \subset A^t$`, "Doğru", [R`Ortak eleman yok $\iff$ $B$'nin her elemanı $A$'nın dışında.`]),
                    part("d", R`$A \subset C$ ve $B \subset C \iff A \cup B \subset C$`, "Doğru", [R`$A\cup B$'nin her elemanı $A$'da ya da $B$'de, ikisi de $C$'de.`]),
                    part("e", R`$C \subset A$ ve $C \subset B \iff C \subset A \cap B$`, "Doğru", [R`$C$'nin her elemanı hem $A$'da hem $B$'de.`]),
                    part("f", R`$A \times B = \varnothing \iff A = \varnothing$ veya $B = \varnothing$`, "Doğru", [R`İkisi de boş değilse $a \in A$, $b \in B$ seçilir ve $(a, b) \in A \times B$ olur.`]),
                    part("g", R`$(A \setminus B)^t = (B \setminus A)^t \iff A = B$`, "Doğru", [R`Tümleyenler eşit $\iff$ $A \setminus B = B \setminus A$. Bu iki küme ayrık olduğundan eşitlik ancak ikisi de boşsa olur: $A \subset B$ ve $B \subset A$.`]),
                ] },
                { no: 3, q: R`$a$ ve $b$ pozitif iki sayı olsun. $\dfrac ab + \dfrac ba \ge 2$ olduğunu gösteriniz.`,
                    a: R`Eşitlik ancak $a = b$ iken`, s: [R`$\frac ab + \frac ba - 2 = \frac{a^2 + b^2 - 2ab}{ab} = \frac{(a - b)^2}{ab}$.`, R`Pay bir kare ($\ge 0$), payda pozitif → ifade $\ge 0$.`] },
                { no: 4, q: R`Her çift sayının karesinin çift, her tek sayının karesinin tek sayı olduğunu gösteriniz.`,
                    a: "Cebirsel açılım", s: [R`Çift: $(2m)^2 = 4m^2 = 2(2m^2)$ → çift.`, R`Tek: $(2m + 1)^2 = 4m^2 + 4m + 1 = 2(2m^2 + 2m) + 1$ → tek.`] },
                { no: 5, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$|1 - x| = 2$`, R`$x = -1$ veya $x = 3$`, [R`$1 - x = 2$ veya $1 - x = -2$.`]),
                    part("b", R`$|x + 1| = |x + 3|$`, R`$x = -2$`, [R`$x + 1 = x + 3$ imkânsız; $x + 1 = -(x + 3) \Rightarrow 2x = -4$. (−1 ile −3'ün tam ortası!)`]),
                    part("c", R`$|2x| = |x - 2|$`, R`$x = -2$ veya $x = \frac23$`, [R`$2x = x - 2$ veya $2x = -(x - 2)$.`]),
                    part("d", R`$|x - 1| + |x| = 1$`, R`$[0, 1]$`, [R`$0 \le x \le 1$ için $(1 - x) + x = 1$: her $x$ sağlar. Dışarıda toplam 1'den büyük.`, R`(Geometrik: 0'a ve 1'e uzaklıkların toplamı 1 → nokta aralarında.)`]),
                    part("e", R`$|3x - 1| = 3x - 1$`, R`$x \ge \frac13$`, [R`$|u| = u \iff u \ge 0$.`]),
                    part("f", R`$|2x - 4| = 4 - 2x$`, R`$x \le 2$`, [R`$|u| = -u \iff u \le 0$: $2x - 4 \le 0$.`]),
                ] },
                { no: 6, q: "Aşağıdaki eşitsizlikleri çözünüz.", parts: [
                    part("a", R`$|x - 1| \le 3$`, R`$[-2, 4]$`, [R`$-3 \le x - 1 \le 3$.`]),
                    part("b", R`$|x + 1| > 2$`, R`$(-\infty, -3) \cup (1, \infty)$`, [R`$x + 1 < -2$ veya $x + 1 > 2$.`]),
                    part("c", R`$|x - 1| > |x|$`, R`$x < \frac12$`, [R`İki taraf da negatif değil, kareleri al: $x^2 - 2x + 1 > x^2 \Rightarrow x < \frac12$.`]),
                    part("d", R`$|x| + |x - 1| \ge 1$`, R`$\mathbb{R}$ (her $x$)`, [R`Üçgen eşitsizliği: $|x| + |1 - x| \ge |x + 1 - x| = 1$.`]),
                    part("e", R`$|5x - 4| < 2x + 1$`, R`$\left(\frac37, \frac53\right)$`, [R`$-(2x + 1) < 5x - 4 < 2x + 1$.`, R`Sağ: $3x < 5 \Rightarrow x < \frac53$. Sol: $7x > 3 \Rightarrow x > \frac37$.`]),
                    part("f", R`$|3x + 12| > 0$`, R`$\mathbb{R}\setminus\{-4\}$`, [R`Mutlak değer sadece içi sıfırken 0.`]),
                ] },
                { no: 7, q: "Aşağıdaki denklemleri çözünüz.", note: "Kitapta iki şık (d) olarak etiketlenmiş; ikincisini (e) olarak aldık.", parts: [
                    part("a", R`$\llbracket x \rrbracket = 3$`, R`$[3, 4)$`),
                    part("b", R`$\llbracket -2x \rrbracket = -2$`, R`$\left(\frac12, 1\right]$`, [R`$-2 \le -2x < -1 \Rightarrow \frac12 < x \le 1$ (−2 ile bölünce yön döner).`]),
                    part("c", R`$\llbracket -x + 2 \rrbracket = 1$`, R`$(0, 1]$`, [R`$1 \le 2 - x < 2 \Rightarrow 0 < x \le 1$.`]),
                    part("d", R`$\llbracket x + 1 \rrbracket = x$`, "Çözüm yok", [R`Sol taraf tam sayı → $x$ tam sayı olmalı. O zaman $\llbracket x + 1 \rrbracket = x + 1 \neq x$.`]),
                    part("e", R`$\llbracket x - 1 \rrbracket = x$`, "Çözüm yok", [R`Aynı şekilde $x$ tam sayı olmalı; $x - 1 \neq x$.`]),
                    part("f", R`$\llbracket x + 3 \rrbracket = 2\llbracket x \rrbracket - 3$`, R`$[6, 7)$`, [R`Teorem 0.4: $\llbracket x \rrbracket + 3 = 2\llbracket x \rrbracket - 3 \Rightarrow \llbracket x \rrbracket = 6$.`]),
                ] },
                { no: 8, q: "Aşağıdaki eşitsizlikleri çözünüz.", parts: [
                    part("a", R`$\llbracket 2x \rrbracket > 3$`, R`$[2, \infty)$`, [R`Tam sayı olduğu için $\llbracket 2x \rrbracket \ge 4 \iff 2x \ge 4$.`]),
                    part("b", R`$\llbracket x + 3 \rrbracket \le 2$`, R`$(-\infty, 0)$`, [R`$x + 3 < 3$.`]),
                    part("c", R`$\llbracket 1 - 3x \rrbracket \ge 4$`, R`$(-\infty, -1]$`, [R`$1 - 3x \ge 4$.`]),
                    part("d", R`$\llbracket x + 4 \rrbracket < 5$`, R`$(-\infty, 1)$`, [R`$\llbracket x + 4 \rrbracket \le 4 \iff x + 4 < 5$.`]),
                    part("e", R`$\llbracket 2x \rrbracket \ge 2x$`, R`$x = \frac k2$, $k \in \mathbb{Z}$`, [R`Her zaman $\llbracket 2x \rrbracket \le 2x$; büyük-eşit ancak eşitse, yani $2x$ tam sayıysa.`]),
                    part("f", R`$\llbracket 3x \rrbracket < 3x$`, R`$x \neq \frac k3$`, [R`$3x$ tam sayı değilse kesin küçüktür.`]),
                ] },
                { no: 9, q: "Toplamları rasyonel olan iki irrasyonel sayı bulunuz.", a: R`Örn. $\sqrt2$ ve $-\sqrt2$ (toplam 0); ya da $\sqrt2$ ve $1 - \sqrt2$ (toplam 1)` },
                { no: 10, q: "Çarpımları rasyonel olan iki irrasyonel sayı bulunuz.", a: R`Örn. $\sqrt2\cdot\sqrt2 = 2$; ya da $\sqrt2\cdot\sqrt8 = 4$` },
                { no: 11, q: "Aşağıdaki ifadeleri sadeleştiriniz.", parts: [
                    part("a", R`$\sqrt{4\cdot16\cdot36}$`, "48", [R`$2\cdot4\cdot6$.`]),
                    part("b", R`$\sqrt{-0{,}00001}$`, "Reel sayı değil", [R`Negatif sayının karekökü reel değildir. (Beşinci kök olsaydı: $\sqrt[5]{-0{,}00001} = -0{,}1$.)`]),
                    part("c", R`$(8a^6)^{4/3}$`, R`$16a^8$`, [R`$8^{4/3} = (\sqrt[3]8)^4 = 16$, $(a^6)^{4/3} = a^8$.`]),
                    part("d", R`$(32)^{-4/5}(16)^{5/4}$`, "2", [R`$2^{5\cdot(-4/5)}\cdot2^{4\cdot5/4} = 2^{-4}\cdot2^5$.`]),
                    part("e", R`$\sqrt{\sqrt{12} - \sqrt3}$`, R`$\sqrt[4]{3}$`, [R`$\sqrt{12} = 2\sqrt3$; $2\sqrt3 - \sqrt3 = \sqrt3$; $\sqrt{\sqrt3} = 3^{1/4}$.`]),
                ] },
                { no: 12, q: R`“$a < b$ ve $b < c \Rightarrow a < c$ dir.” önermesinin doğruluğunu gösteriniz.`, a: "Geçişme özelliği", s: [R`$b - a > 0$ ve $c - b > 0$. Toplam: $c - a = (c - b) + (b - a) > 0$.`] },
                { no: 13, q: R`“$a^2 + b^2 = 0 \iff a = 0$ ve $b = 0$ dır.” önermesinin doğruluğunu gösteriniz.`, a: "Kareler negatif olamaz", s: [R`$a^2 \ge 0$, $b^2 \ge 0$. Toplam 0 ise ikisi de 0 olmalı. Tersi açık.`] },
                { no: 14, q: R`$|a - 10| < 2$ ve $|b - 6| < 1$ eşitsizliğini sağlayan $a$ ve $b$ sayıları veriliyor. Aşağıdaki sayıların sınırları için ne söylenebilir?`, note: R`Önce: $8 < a < 12$ ve $5 < b < 7$ (hepsi pozitif).`, parts: [
                    part("a", R`$a + b$`, R`$13 < a + b < 19$`),
                    part("b", R`$a - b$`, R`$1 < a - b < 7$`, [R`En küçük: $8 - 7$; en büyük: $12 - 5$.`]),
                    part("c", R`$a^2 - b^2$`, R`$15 < a^2 - b^2 < 119$`, [R`$64 < a^2 < 144$, $25 < b^2 < 49$: $64 - 49$ ile $144 - 25$.`]),
                    part("d", R`$a^2 + ab + 1$`, R`$105 < \ldots < 229$`, [R`$64 + 40 + 1$ ile $144 + 84 + 1$.`]),
                    part("e", R`$a^3 - b^3$`, R`$169 < \ldots < 1603$`, [R`$512 - 343$ ile $1728 - 125$.`]),
                    part("f", R`$a^2 + ab + b^2$`, R`$129 < \ldots < 277$`, [R`$64 + 40 + 25$ ile $144 + 84 + 49$.`]),
                ] },
                { no: 15, q: "Aşağıdaki komşulukları mutlak değer yardımıyla yazınız.", parts: [
                    part("a", "1'in 2-komşuluğu", R`$|x - 1| < 2$, yani $(-1, 3)$`),
                    part("b", R`$-2$'nin $\frac{1}{10}$-komşuluğu`, R`$|x + 2| < \frac{1}{10}$, yani $(-2{,}1;\ -1{,}9)$`),
                ] },
                { no: 16, q: R`$x^3 = 2$ olacak şekilde bir $x$ rasyonel sayısının var olmadığını gösteriniz.`, a: R`$\sqrt[3]2$ irrasyoneldir`, s: [R`$x = \frac pq$ (aralarında asal) olsun: $p^3 = 2q^3$ → $p^3$ çift → $p$ çift, $p = 2k$.`, R`$8k^3 = 2q^3 \Rightarrow q^3 = 4k^3$ → $q$ çift. İkisi de çift: çelişki.`] },
            ],
        },

        /* ---------------------------- 0.4 ---------------------------- */
        {
            id: "problemler-0-4", title: "Problemler · 0.4 İkinci Dereceden Denklem ve Eşitsizlikler", page: "19", sections: ["0.4"],
            problems: [
                { no: 1, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$x^2 - 9 = 0$`, R`$\pm3$`), part("b", R`$4x^2 - 1 = 0$`, R`$\pm\frac12$`),
                    part("c", R`$x^2 + 4x = 0$`, R`$0, -4$`, [R`$x(x + 4) = 0$.`]), part("d", R`$2x - x^2 = 0$`, R`$0, 2$`, [R`$x(2 - x) = 0$.`]),
                    part("e", R`$x^2 - 3x + 2 = 0$`, R`$1, 2$`), part("f", R`$t^2 + 5t + 6 = 0$`, R`$-2, -3$`),
                    part("g", R`$4m^2 - 5m + 6 = 0$`, "Reel kök yok", [R`$\Delta = 25 - 96 = -71 < 0$.`]),
                ] },
                { no: 2, q: "Aşağıdaki denklemlerin çözüm kümesini bulunuz.", parts: [
                    part("a", R`$\sqrt{2x - 3} + x = 3$`, R`$\{2\}$`, [R`$\sqrt{2x - 3} = 3 - x$ → $3 - x \ge 0$ şartı.`, R`Kare al: $2x - 3 = 9 - 6x + x^2 \Rightarrow x^2 - 8x + 12 = 0 \Rightarrow x = 2, 6$.`, R`$x = 6$ şartı bozar ($3 - 6 < 0$). Kontrol $x = 2$: $1 + 2 = 3$ ✓`]),
                    part("b", R`$\sqrt{3x + 1} + x = \sqrt{4x}$`, R`$\varnothing$`, [R`$\sqrt{4x} = 2\sqrt x$ ve $1 + x \ge 2\sqrt x$ (çünkü $(1 - \sqrt x)^2 \ge 0$).`, R`$\sqrt{3x + 1} \ge 1$ olduğundan sol taraf $\ge 1 + x \ge 2\sqrt x$. Eşitlik için hem $x = 0$ hem $x = 1$ gerekirdi — imkânsız.`]),
                    part("c", R`$x^4 - 16 = 0$`, R`$\{-2, 2\}$`, [R`$(x^2 - 4)(x^2 + 4) = 0$; $x^2 = -4$ reel değil.`]),
                    part("ç", R`$x^4 + 3x^2 - 4 = 0$`, R`$\{-1, 1\}$`, [R`$(x^2 + 4)(x^2 - 1) = 0$.`]),
                    part("d", R`$4^x - 3\cdot2^x + 2 = 0$`, R`$\{0, 1\}$`, [R`$u = 2^x$: $u^2 - 3u + 2 = 0 \Rightarrow u = 1, 2$.`]),
                ] },
                { no: 3, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$\frac3x + \frac12 = \frac{x}{x + 4}$`, R`$x = 12$ veya $x = -2$`, [R`$2x(x + 4)$ ile çarp: $6(x + 4) + x(x + 4) = 2x^2 \Rightarrow x^2 - 10x - 24 = 0$.`, R`$(x - 12)(x + 2) = 0$; ikisi de yasak değerler (0, −4) değil.`]),
                    part("b", R`$\frac{1}{x + 2} - \frac{2}{x - 1} = \frac{3}{x^2 - 1}$`, R`$x = \frac{-9 \pm \sqrt{37}}{2}$`, [R`$(x + 2)(x^2 - 1)$ ile çarp: $(x^2 - 1) - 2(x + 2)(x + 1) = 3(x + 2)$.`, R`$-x^2 - 9x - 11 = 0 \Rightarrow x^2 + 9x + 11 = 0$.`]),
                    part("c", R`$x + \frac1x = a + \frac1a$`, R`$x = a$ veya $x = \frac1a$`, [R`$x - a = \frac1a - \frac1x = \frac{x - a}{ax}$ → $(x - a)\left(1 - \frac{1}{ax}\right) = 0$.`]),
                ] },
                { no: 4, q: "Aşağıdaki denklem sistemlerini çözünüz.", parts: [
                    part("a", R`$x^2 + y^2 = 38$, $\;xy = 96$`, "Reel çözüm yok", [R`$(x - y)^2 = x^2 + y^2 - 2xy = 38 - 192 < 0$ — imkânsız.`, R`(Kitapta sayı baskı hatalı olabilir; örn. $x^2 + y^2 = 208$ olsaydı $(x, y) = (12, 8), (8, 12), \ldots$ çıkardı.)`]),
                    part("b", R`$x^2 + xy = 10$, $\;y^2 + xy = 15$`, R`$(2, 3)$ ve $(-2, -3)$`, [R`$x(x + y) = 10$, $y(x + y) = 15$. Topla: $(x + y)^2 = 25 \Rightarrow x + y = \pm5$.`, R`$x = \frac{10}{\pm5} = \pm2$, $y = \frac{15}{\pm5} = \pm3$.`]),
                ] },
                { no: 5, q: R`$x^2 + (m - 1)x + m = 0$ denkleminin köklerinden biri 2 olduğuna göre, diğeri kaçtır?`, a: R`$-\frac13$`, s: [R`$x = 2$ koy: $4 + 2(m - 1) + m = 0 \Rightarrow m = -\frac23$.`, R`Kökler çarpımı $= m = -\frac23 \Rightarrow 2\cdot x_2 = -\frac23$.`] },
                { no: 6, q: "Aşağıdaki eşitsizliklerin çözüm kümelerini bulunuz.", parts: [
                    part("a", R`$x(x - 3) > 0$`, R`$(-\infty, 0) \cup (3, \infty)$`),
                    part("b", R`$x^2 + 13x + 40 < 0$`, R`$(-8, -5)$`, [R`$(x + 5)(x + 8) < 0$.`]),
                    part("c", R`$x^2 - 4x + 4 > 0$`, R`$\mathbb{R}\setminus\{2\}$`, [R`$(x - 2)^2 > 0$.`]),
                    part("d", R`$\dfrac{x^2 - 3x - 4}{x^2 - 9x} \le 0$`, R`$[-1, 0) \cup [4, 9)$`, [R`$\frac{(x - 4)(x + 1)}{x(x - 9)}$; kritik noktalar $-1, 0, 4, 9$.`, R`İşaret: $+, -, +, -, +$. Payın kökleri dahil, paydanınkiler hariç.`]),
                ] },
                { no: 7, q: R`$2 < x^2 - 4x - 3 < 18$ eşitsizliğinin çözüm kümesini bulunuz.`, a: R`$(-3, -1) \cup (5, 7)$`, s: [R`$x^2 - 4x - 5 > 0 \Rightarrow (x - 5)(x + 1) > 0 \Rightarrow x < -1$ veya $x > 5$.`, R`$x^2 - 4x - 21 < 0 \Rightarrow (x - 7)(x + 3) < 0 \Rightarrow -3 < x < 7$.`, R`Kesişim.`] },
                { no: 8, q: R`$|x^2 - 3x - 4| < 6$ eşitsizliğinin çözüm kümesini bulunuz.`, a: R`$(-2, 1) \cup (2, 5)$`, s: [R`$-6 < x^2 - 3x - 4 < 6$.`, R`$x^2 - 3x + 2 > 0 \Rightarrow x < 1$ veya $x > 2$.`, R`$x^2 - 3x - 10 < 0 \Rightarrow -2 < x < 5$.`] },
                { no: 9, q: R`Her $x \in \mathbb{R}$ için $x^2 - 2(4m - 1)x + 15m^2 - 2m - 7 > 0$ olması için $m$ ne olmalıdır?`, a: R`$2 < m < 4$`, s: [R`Kollar yukarı; her yerde pozitif olması için $\Delta < 0$.`, R`$\frac\Delta4 = (4m - 1)^2 - (15m^2 - 2m - 7) = m^2 - 6m + 8 < 0 \Rightarrow (m - 2)(m - 4) < 0$.`] },
                { no: 10, q: R`$(m + 1)x^2 - 4x - 2(2m + 1) = 0$ denkleminin farklı ve gerçek iki kökünün olması için $m$ ne olmalıdır?`, a: R`$m \neq -1$ (her diğer reel $m$)`, s: [R`İkinci dereceden olması için $m \neq -1$.`, R`$\Delta = 16 + 8(m + 1)(2m + 1) > 0 \iff 2m^2 + 3m + 3 > 0$.`, R`$2m^2 + 3m + 3$'ün diskriminantı $9 - 24 < 0$: her zaman pozitif.`] },
                { no: 11, q: "Aşağıda denklemleri verilen eğrilerin (parabollerin) grafiğini çiziniz.", parts: [
                    part("a", R`$y = x^2 - 5x - 6$`, R`Kökler $-1, 6$; y-kesen $-6$; tepe $\left(\frac52, -\frac{49}{4}\right)$`, [], ["x^2-5x-6"]),
                    part("b", R`$y = -2x^2 + 4x$`, R`Kökler $0, 2$; tepe $(1, 2)$; kollar aşağı`, [], ["-2x^2+4x"]),
                    part("c", R`$y = 4x^2 - 4x + 1$`, R`$(2x - 1)^2$: x-eksenine $\frac12$'de teğet; y-kesen 1`, [], ["4x^2-4x+1"]),
                ] },
                { no: 12, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$x^3 - 5x^2 + 4x = 0$`, R`$0, 1, 4$`, [R`$x(x - 1)(x - 4) = 0$.`]),
                    part("b", R`$x^3 - 3x + 2 = 0$`, R`$1$ (çift kök), $-2$`, [R`$x = 1$ kök; $(x - 1)(x^2 + x - 2) = (x - 1)^2(x + 2)$.`]),
                    part("c", R`$x^3 - x^2 - 3x - 1 = 0$`, R`$-1,\ 1 \pm \sqrt2$`, [R`$x = -1$: $-1 - 1 + 3 - 1 = 0$ ✓. Bölüm $x^2 - 2x - 1$.`]),
                ] },
                { no: 13, q: R`$x^3 - x - 1 = 0$ denkleminin rasyonel kökünün olmadığını gösteriniz.`, a: "Gauss teoremi", s: [R`Rasyonel kök varsa 1'i bölen bir tam sayıdır: $\pm1$.`, R`$f(1) = -1 \neq 0$, $f(-1) = -1 \neq 0$.`] },
                { no: 14, q: "Aşağıdaki denklemleri, denklemin başında belirtilen bilinmeyene göre çözünüz.", parts: [
                    part("a", R`$t$; $\;\frac12gt^2 - v_0t - S_0 = 0$`, R`$t = \dfrac{v_0 \pm \sqrt{v_0^2 + 2gS_0}}{g}$`, [R`$a = \frac g2$, $b = -v_0$, $c = -S_0$ ile kök formülü.`]),
                    part("b", R`$R$; $\;w = \dfrac{mgR^2}{(x + R)^2}$ $(R > 0, x > 0)$`, R`$R = \dfrac{x\sqrt w}{\sqrt{mg} - \sqrt w}$`, [R`Pozitifler için karekök al: $\sqrt w\,(x + R) = R\sqrt{mg}$.`, R`$R(\sqrt{mg} - \sqrt w) = x\sqrt w$. ($mg > w$ olmalı.)`]),
                    part("c", R`$r$; $\;S = \pi r^2 + 2\pi r\ell$`, R`$r = -\ell + \sqrt{\ell^2 + \frac S\pi}$`, [R`$\pi r^2 + 2\pi\ell r - S = 0$; yarıçap pozitif olduğundan + işaretli kök.`]),
                ] },
            ],
        },

        /* ---------------------------- 0.5 ---------------------------- */
        {
            id: "problemler-0-5", title: "Problemler · 0.5 Doğrunun Analitik İncelenmesi", page: "27–28", sections: ["0.5"],
            problems: [
                { no: 1, q: R`Düzlemde $A(3, 2)$, $B(5, 4)$ noktalarından eşit uzaklıkta bulunan noktaların geometrik yerini bulunuz.`, a: R`$x + y - 7 = 0$ (AB'nin orta dikmesi)`, s: [R`$(x - 3)^2 + (y - 2)^2 = (x - 5)^2 + (y - 4)^2$.`, R`Sadeleştir: $4x + 4y - 28 = 0$.`], graph: ["7-x"] },
                { no: 2, q: R`Düzlemde $A(3, 2)$, $B(1, 4)$, $C(5, 2)$ noktalarından eşit uzaklıkta bulunan bir nokta bulunuz.`, a: R`$P(4, 5)$`, s: [R`$AC$'nin orta dikmesi: $x = 4$. $AB$'nin orta dikmesi: $y = x + 1$.`, R`Kesişim $(4, 5)$. Kontrol: $|PA|^2 = |PB|^2 = |PC|^2 = 10$.`] },
                { no: 3, q: R`Köşeleri $A(5, 4)$, $B(1, 0)$, $C(-2, 3)$ olan üçgenin bir diküçgen olduğunu gösteriniz.`, a: "B açısı dik", s: [R`$m_{AB} = \frac{4}{4} = 1$, $m_{BC} = \frac{3}{-3} = -1$; çarpım $-1$.`, R`(Pisagor: $|AB|^2 + |BC|^2 = 32 + 18 = 50 = |AC|^2$.)`] },
                { no: 4, q: "Aşağıda iki noktası verilen doğruların eğimlerini bulunuz.", parts: [
                    part("a", R`$A(-1, 2),\ B(-2, -1)$`, "3"), part("b", R`$A(2, -1),\ B(-2, 1)$`, R`$-\frac12$`),
                    part("c", R`$A(5, 2),\ B(5, 6)$`, "Tanımsız (dikey doğru)", [R`$\Delta x = 0$.`]),
                ] },
                { no: 5, q: "Aşağıda bir noktası ve eğimi verilen doğruların denklemini yazınız.", parts: [
                    part("a", R`$A(-1, 1),\ m = 1$`, R`$y = x + 2$`), part("b", R`$A(-2, 2),\ m = \frac12$`, R`$x - 2y + 6 = 0$`, [R`$y - 2 = \frac12(x + 2)$.`]),
                ] },
                { no: 6, q: "Aşağıda iki noktası verilen doğruların denklemini yazınız.", parts: [
                    part("a", R`$A(-1, 3),\ B(1, 5)$`, R`$y = x + 4$`), part("b", R`$A(2, 3),\ B(-1, 9)$`, R`$y = -2x + 7$`, [R`$m = \frac{6}{-3} = -2$.`]),
                ] },
                { no: 7, q: "Aşağıda verilen doğruların eksenleri kestiği noktaları bulup grafiklerini çiziniz.", parts: [
                    part("a", R`$3x + 4y = 12$`, R`$(4, 0)$ ve $(0, 3)$`, [R`$\frac x4 + \frac y3 = 1$.`], ["(12-3x)/4"]),
                    part("b", R`$\sqrt2x - \sqrt3y = \sqrt6$`, R`$(\sqrt3, 0)$ ve $(0, -\sqrt2)$`, [R`$y = 0$: $x = \frac{\sqrt6}{\sqrt2} = \sqrt3$; $x = 0$: $y = -\frac{\sqrt6}{\sqrt3} = -\sqrt2$.`], ["(sqrt(2)x-sqrt(6))/sqrt(3)"]),
                ] },
                { no: 8, q: R`$A(1, 2)$ noktasından geçen ve $x + 2y = 3$ doğrusuna paralel olan doğrunun denklemini yazınız.`, a: R`$x + 2y - 5 = 0$`, s: [R`Paralel doğru: $x + 2y = k$; $A$'yı koy: $k = 1 + 4 = 5$.`] },
                { no: 9, q: R`$A(-2, 4)$ noktasından geçen ve $y = 2x - 3$ doğrusuna dik olan doğrunun denklemini yazınız.`, a: R`$x + 2y - 6 = 0$`, s: [R`Dik eğim $-\frac12$: $y - 4 = -\frac12(x + 2)$.`] },
                { no: 10, q: R`$A(1, 2)$ ve $x + 2y = 3$, $2x - 3y = -1$ doğrularının kesim noktasından geçen doğrunun denklemini yazınız.`, a: R`$x = 1$`, s: [R`Kesişim: $x = 3 - 2y \Rightarrow 6 - 7y = -1 \Rightarrow y = 1, x = 1$.`, R`$(1, 1)$ ve $(1, 2)$ aynı apsiste: dikey doğru.`] },
                { no: 11, q: R`$ax + by + c_1 = 0$ ve $ax + by + c_2 = 0$ doğrularından eşit uzaklıkta bulunan noktaların geometrik yerinin $ax + by + \frac{c_1 + c_2}{2} = 0$ olduğunu gösteriniz. Bundan yararlanarak $3x + 4y - 2 = 0$, $6x + 8y + 3 = 0$ doğrularından eşit uzaklıktaki noktaların geometrik yerini bulunuz.`,
                    a: R`$12x + 16y - 1 = 0$`, s: [R`$|ax + by + c_1| = |ax + by + c_2|$; $c_1 \ne c_2$ olduğundan $ax + by + c_1 = -(ax + by + c_2)$ → $ax + by + \frac{c_1 + c_2}{2} = 0$.`, R`İkinci doğruyu $3x + 4y + \frac32 = 0$ yaz: $c_1 = -2$, $c_2 = \frac32$.`, R`$3x + 4y - \frac14 = 0$.`] },
                { no: 12, q: R`$A(2, 3)$ noktasından geçen ve orijinden 2 birim uzaklıkta bulunan doğruların denklemini bulunuz.`, a: R`$x = 2$ ve $5x - 12y + 26 = 0$`, s: [R`Dikey doğru $x = 2$ orijine 2 uzaklıkta ✓.`, R`Diğerleri: $mx - y + 3 - 2m = 0$; $\frac{|3 - 2m|}{\sqrt{m^2 + 1}} = 2 \Rightarrow 9 - 12m = 4 \Rightarrow m = \frac{5}{12}$.`] },
                { no: 13, q: "Aşağıda denklemleri verilen doğru çiftlerinin, eğer varsa, kesim noktalarının koordinatlarını bulunuz.", note: "Kitapta bu problemin doğru çiftleri basılmamış.", a: "Yöntem: iki denklemi ortak çöz", s: [R`Denklemlerden birinde bir bilinmeyeni yalnız bırakıp diğerine yaz (ya da yok etme yöntemi).`, R`Eğimler eşit ve doğrular farklıysa paraleldir, kesişmezler.`] },
                { no: 14, q: R`Köşeleri $A(1, 1)$, $B(4, 2)$, $C(6, 4)$, $D(3, 3)$ olan paralelkenarın alanını bulunuz.`, a: R`4 br²`, s: [R`$|AB| = \sqrt{10}$; $AB$ doğrusu $x - 3y + 2 = 0$.`, R`Yükseklik: $D$'nin $AB$'ye uzaklığı $\frac{|3 - 9 + 2|}{\sqrt{10}} = \frac{4}{\sqrt{10}}$.`, R`Alan $= \sqrt{10}\cdot\frac{4}{\sqrt{10}} = 4$.`] },
                { no: 15, q: "Aşağıda verilen noktaların karşılarında denklemleri yazılı doğrulara olan uzaklığını bulunuz.", parts: [
                    part("a", R`$A(2, -1)$; $\;4x + 3y + 10 = 0$`, "3", [R`$\frac{|8 - 3 + 10|}{5}$.`]),
                    part("b", R`$B(0, 3)$; $\;5x - 12y - 29 = 0$`, "5", [R`$\frac{|-36 - 29|}{13}$.`]),
                    part("c", R`$C(-2, 3)$; $\;2x - y - 3 = 0$`, R`$2\sqrt5$`, [R`$\frac{|-4 - 3 - 3|}{\sqrt5} = \frac{10}{\sqrt5}$.`]),
                    part("d", R`$D(1, -2)$; $\;x - 2y - 5 = 0$`, "0 (nokta doğru üzerinde)", [R`$1 + 4 - 5 = 0$.`]),
                ] },
                { no: 16, q: "Aşağıda denklemleri verilen paralel doğru çiftleri arasındaki uzaklığı bulunuz.", parts: [
                    part("a", R`$3x - 4y - 10 = 0$; $\;6x - 8y + 5 = 0$`, R`$2{,}5$`, [R`$6x - 8y - 20 = 0$: $\frac{25}{10}$.`]),
                    part("b", R`$5x - 12y + 26 = 0$; $\;5x - 12y - 13 = 0$`, "3", [R`$\frac{39}{13}$.`]),
                    part("c", R`$4x - 3y + 15 = 0$; $\;8x - 6y + 25 = 0$`, R`$0{,}5$`, [R`$8x - 6y + 30 = 0$: $\frac{5}{10}$.`]),
                    part("d", R`$24x - 10y + 39 = 0$; $\;12x - 5y - 26 = 0$`, R`$3{,}5$`, [R`$24x - 10y - 52 = 0$: $\frac{91}{26}$.`]),
                ] },
                { no: 17, q: R`$3x + 4y + 4 = 0$ ve $5x - 12y + 13 = 0$ doğrularının oluşturduğu açıların açıortaylarının denklemlerini yazınız.`, a: R`$14x + 112y - 13 = 0$ ve $64x - 8y + 117 = 0$`, s: [R`Açıortay: iki doğruya eşit uzaklıktaki noktalar: $\frac{3x + 4y + 4}{5} = \pm\frac{5x - 12y + 13}{13}$.`, R`$+$: $39x + 52y + 52 = 25x - 60y + 65$. $\;-$: $39x + 52y + 52 = -25x + 60y - 65$.`] },
                { no: 18, q: R`$A(-2, -1)$, $B(m, 2)$, $C(1, 4)$ noktalarının aynı doğru üzerinde olması için $m$ ne olmalıdır?`, a: R`$m = -\frac15$`, s: [R`$m_{AC} = \frac53 = m_{AB} = \frac{3}{m + 2} \Rightarrow m + 2 = \frac95$.`] },
                { no: 19, q: R`$3x - 3y + m - 1 = 0$ ile $x + 3y = 9$ doğruları $Oy$-ekseni üzerinde kesişiyorlar. Bu doğruların eksenlerle kesim noktaları $A, B, C$ olduğuna göre $ABC$ üçgeninin alanı kaç br²'dir?`, a: "18 br²", s: [R`İkinci doğru $Oy$'yi $(0, 3)$'te keser; birincisi de geçmeli: $-9 + m - 1 = 0 \Rightarrow m = 10$.`, R`Birinci doğru $y = x + 3$: $(-3, 0)$; ikinci: $(9, 0)$.`, R`Taban $12$, yükseklik $3$: $\frac12\cdot12\cdot3$.`] },
                { no: 20, q: R`$3x - y + 1 = 0$ ve $x + 2y + 5 = 0$ doğruları, $y = x$ doğrusuna paralel bir $d$ doğrusu üzerinde kesişiyorlar. $d$'nin denklemini bulunuz.`, a: R`$y = x - 1$`, s: [R`Kesişim: $y = 3x + 1 \Rightarrow 7x + 7 = 0 \Rightarrow (-1, -2)$.`, R`Eğim 1: $y + 2 = x + 1$.`] },
                { no: 21, q: R`$(a - 1)x + 3y = 0$ ve $2x - ay = 4$ doğruları dik kesiştiğine göre kesim noktasının koordinatlarını bulunuz.`, a: R`$(1, 1)$`, s: [R`Eğimler $-\frac{a - 1}{3}$ ve $\frac2a$; çarpım $-1$: $2(a - 1) = 3a \Rightarrow a = -2$.`, R`Doğrular $y = x$ ve $x + y = 2$.`] },
                { no: 22, q: R`$A(a - 3, a + 4)$, $B(a + 1, a)$ noktaları veriliyor. $[AB]$'nin orta noktası II. bölgede ise $A$ noktası hangi bölgededir?`, a: "II. bölge", s: [R`Orta nokta $(a - 1, a + 2)$: $a - 1 < 0$ ve $a + 2 > 0 \Rightarrow -2 < a < 1$.`, R`$A$: $a - 3 \in (-5, -2)$ negatif, $a + 4 \in (2, 5)$ pozitif.`] },
                { no: 23, q: R`$y = a(a - 1)x + 4$ doğrusunun eğim açısının geniş açı olması için $a$ ne olmalıdır?`, a: R`$0 < a < 1$`, s: [R`Geniş açı → eğim negatif: $a(a - 1) < 0$.`] },
                { no: 24, q: R`$5x + 12y = 10$ doğrusundan 5 birim uzakta bulunan noktaların geometrik yerinin denklemi nedir?`, a: R`$5x + 12y - 75 = 0$ ve $5x + 12y + 55 = 0$`, s: [R`$\frac{|5x + 12y - 10|}{13} = 5 \Rightarrow 5x + 12y - 10 = \pm65$. İki paralel doğru.`] },
                { no: 25, q: R`$A(3, 2)$ noktasından geçen ve eksenleri $(a, 0)$, $(0, b)$ noktalarında kesen doğru için $(a - 3)(b - 2)$ çarpımı nedir?`, a: "6", s: [R`$\frac xa + \frac yb = 1$'e $A$'yı koy: $\frac3a + \frac2b = 1 \Rightarrow 3b + 2a = ab$.`, R`$ab - 2a - 3b + 6 = 6 \Rightarrow (a - 3)(b - 2) = 6$.`] },
                { no: 26, q: R`Kenar orta noktaları $D(-1, 3)$ ($BC$), $E(3, -5)$ ($AC$), $F(2, 4)$ ($AB$) olan bir $ABC$ üçgeninin köşelerinin koordinatlarını bulunuz.`, a: R`$A(6, -4)$, $B(-2, 12)$, $C(0, -6)$`, s: [R`$A = E + F - D$, $B = F + D - E$, $C = D + E - F$ (orta noktalar paralelkenar kuralı).`, R`Kontrol: $B$ ile $C$'nin ortası $(-1, 3) = D$ ✓.`] },
                { no: 27, q: R`$x + y = 7$, $x - 2y + 2 = 0$, $mx + y + 5 = 0$ doğrularının aynı noktadan geçmesi için $m$ ne olmalıdır?`, a: R`$m = -2$`, s: [R`İlk ikisinin kesişimi $(4, 3)$; üçüncüye koy: $4m + 8 = 0$.`] },
                { no: 28, q: R`$y = 4x$ doğrusu üzerinde, $A(4, 1)$ ve $B(-2, 3)$'ten eşit uzaklıkta bulunan noktanın koordinatlarını bulunuz.`, a: R`$(-1, -4)$`, s: [R`$AB$'nin orta dikmesi: orta nokta $(1, 2)$, eğim 3: $y = 3x - 1$.`, R`$4x = 3x - 1 \Rightarrow x = -1$. Kontrol: uzaklık kareleri ikisine de 50.`] },
                { no: 29, q: R`$y = -x + 2$ doğrusu üzerinde, $A(5, 5)$'e en yakın noktanın koordinatlarını bulunuz.`, a: R`$(1, 1)$`, s: [R`En yakın nokta dikmenin ayağı: $A$'dan geçen dik doğru $y = x$.`, R`$x = -x + 2 \Rightarrow x = 1$.`] },
                { no: 30, q: R`$x - y + 2 = 0$ ve $\sqrt3x - y - 1 = 0$ doğrularının oluşturduğu dar açının ölçüsü kaç derecedir?`, a: R`$15^\circ$`, s: [R`Eğimler $1 = \tan45^\circ$ ve $\sqrt3 = \tan60^\circ$.`, R`Fark $60^\circ - 45^\circ$.`] },
            ],
        },

        /* ---------------------------- 0.6 ---------------------------- */
        {
            id: "problemler-0-6", title: "Problemler · 0.6 Çemberin Analitik İncelenmesi", page: "31", sections: ["0.6"],
            problems: [
                { no: 1, q: R`Merkezi $M(2, -1)$ olan ve $P(5, 3)$ noktasından geçen çemberin denklemini yazınız.`, a: R`$(x - 2)^2 + (y + 1)^2 = 25$`, s: [R`$r = |MP| = \sqrt{9 + 16} = 5$.`] },
                { no: 2, q: R`Merkezi $M(-3, 3)$'te olan ve koordinat eksenlerine teğet olan çemberin denklemini yazınız.`, a: R`$(x + 3)^2 + (y - 3)^2 = 9$`, s: [R`Eksenlere uzaklık 3 = yarıçap.`] },
                { no: 3, q: R`Merkezi $y = 8 - 3x$ doğrusu üzerinde bulunan ve koordinat eksenlerine teğet olan çemberlerin denklemlerini yazınız.`, a: R`$(x - 2)^2 + (y - 2)^2 = 4$ ve $(x - 4)^2 + (y + 4)^2 = 16$`, s: [R`Eksenlere teğet → $|a| = |b| = r$.`, R`$b = a$: $a = 8 - 3a \Rightarrow a = 2$. $\;b = -a$: $-a = 8 - 3a \Rightarrow a = 4$.`] },
                { no: 4, q: R`$A(2, 2)$, $B(3, 1)$ noktalarından geçen ve merkezi $y = -x + 3$ doğrusu üzerinde bulunan çemberin denklemini yazınız.`, a: R`$(x - 2)^2 + (y - 1)^2 = 1$`, s: [R`Merkez $AB$'nin orta dikmesinde: $y = x - 1$.`, R`$x - 1 = -x + 3 \Rightarrow (2, 1)$; $r = |MA| = 1$.`] },
                { no: 5, q: R`$(m + 2)x^2 + (2m + 1)y^2 + (m - 1)xy + 6x - 12y - 6(m + 1) = 0$ denklemi bir çember belirttiğine göre bu çemberin merkezini ve yarıçapını bulunuz.`, a: R`Merkez $(-1, 2)$, $r = 3$`, s: [R`Çemberde $xy$ terimi olmaz: $m = 1$. ($x^2$, $y^2$ katsayıları da 3'e eşitlenir ✓)`, R`$3x^2 + 3y^2 + 6x - 12y - 12 = 0 \Rightarrow x^2 + y^2 + 2x - 4y - 4 = 0$.`, R`$r = \frac12\sqrt{4 + 16 + 16} = 3$.`] },
                { no: 6, q: R`$3x - 4y + 5 = 0$ ve $-6x + 8y - 5 = 0$ doğrularına teğet olan çemberlerin yarıçapı kaç birimdir?`, a: R`$\frac14$`, s: [R`Doğrular paralel ($3x - 4y + \frac52 = 0$). Aralarındaki uzaklık $\frac{|5 - 5/2|}{5} = \frac12$ = çap.`] },
                { no: 7, q: R`Merkezi $y = -2x$ doğrusu üzerinde bulunan ve $4x - 3y + 10 = 0$, $4x - 3y - 30 = 0$ doğrularına teğet olan çemberin denklemini bulunuz.`, a: R`$(x - 1)^2 + (y + 2)^2 = 16$`, s: [R`Paralel doğrular arası uzaklık $\frac{40}{5} = 8$ → $r = 4$.`, R`Merkez orta doğruda: $4x - 3y - 10 = 0$ ile $y = -2x$: $10x = 10 \Rightarrow (1, -2)$.`] },
                { no: 8, q: R`Denklemi $y = 3x$ olan doğruya orijinde teğet olan ve $A(0, 6)$ noktasından geçen çemberin denklemini yazınız.`, a: R`$(x + 9)^2 + (y - 3)^2 = 90$`, s: [R`Merkez, orijinde teğete dik doğru üzerinde: $y = -\frac x3$, merkez $(a, -\frac a3)$.`, R`$|MO| = |MA|$: $\frac{a^2}{9} = \left(\frac a3 + 6\right)^2 - a^2 + a^2 \Rightarrow 4a = -36 \Rightarrow a = -9$.`] },
                { no: 9, q: R`$A(3, 0)$ ve $B(-5, 0)$ noktalarından geçen ve yarıçapı 4 birim olan çemberin denklemini yazınız.`, a: R`$(x + 1)^2 + y^2 = 16$`, s: [R`$|AB| = 8 = 2r$: $AB$ bir çap, merkez orta nokta $(-1, 0)$.`] },
                { no: 10, q: R`Merkezi orijinde olan ve $3x - 4y + 10 = 0$ doğrusuna teğet olan çemberin denklemini bulunuz.`, a: R`$x^2 + y^2 = 4$`, s: [R`$r = \frac{10}{5} = 2$.`] },
                { no: 11, q: R`Yarıçapı $r = \sqrt5$ birim olan ve $x - 2y = 1$ doğrusuna $P(3, 1)$ noktasında teğet olan çemberin denklemini yazınız.`, a: R`$(x - 4)^2 + (y + 1)^2 = 5$ veya $(x - 2)^2 + (y - 3)^2 = 5$`, s: [R`Merkez $P$'den dikme doğrultusunda ($(1, -2)$ vektörü, boyu $\sqrt5$): $P \pm (1, -2)$.`] },
                { no: 12, q: R`Merkezi $M(3, -1)$ olan ve $2x - 5y + 18 = 0$ doğrusundan 6 birimlik bir kiriş ayıran çemberin denklemini yazınız.`, a: R`$(x - 3)^2 + (y + 1)^2 = 38$`, s: [R`Merkezin doğruya uzaklığı $d = \frac{|6 + 5 + 18|}{\sqrt{29}} = \sqrt{29}$.`, R`Kirişin yarısı 3: $r^2 = d^2 + 9 = 38$.`] },
                { no: 13, q: R`$A(1, 0)$ noktasından geçen ve $2x + y + 2 = 0$, $2x + y - 18 = 0$ doğrularına teğet olan çemberlerin denklemlerini yazınız.`, a: R`$(x - 5)^2 + (y + 2)^2 = 20$ ve $\left(x - \frac95\right)^2 + \left(y - \frac{22}{5}\right)^2 = 20$`, s: [R`Doğrular arası uzaklık $\frac{20}{\sqrt5} = 4\sqrt5$ → $r = 2\sqrt5$.`, R`Merkez orta doğruda: $2x + y - 8 = 0$, $(a, 8 - 2a)$.`, R`$(a - 1)^2 + (8 - 2a)^2 = 20 \Rightarrow 5a^2 - 34a + 45 = 0 \Rightarrow a = 5$ veya $\frac95$.`] },
                { no: 14, q: R`$3x + 4y - 35 = 0$, $3x - 4y - 35 = 0$, $x - 1 = 0$ doğrularına teğet olan çemberin denklemini yazınız.`, a: R`İç teğet çember: $(x - 5)^2 + y^2 = 16$`, s: [R`Üç doğru $(1, 8)$, $(1, -8)$, $(\frac{35}{3}, 0)$ köşeli bir üçgen oluşturur; şekil x-eksenine göre simetrik → merkez $(a, 0)$.`, R`$|a - 1| = \frac{|3a - 35|}{5}$: $a = 5$, $r = 4$ (iç teğet çember).`, R`Dış teğet çemberler de var: $(x + 15)^2 + y^2 = 256$ ve $\left(x - \frac{35}{3}\right)^2 + \left(y \mp \frac{40}{3}\right)^2 = \frac{1024}{9}$.`] },
                { no: 15, q: R`Merkezi $M(-1, 3)$ olan çembere, üzerindeki $P(0, 1)$ noktasından çizilen teğetin denklemini yazınız.`, a: R`$x - 2y + 2 = 0$`, s: [R`$MP$'nin eğimi $\frac{1 - 3}{0 + 1} = -2$; teğet buna dik: eğim $\frac12$.`, R`$y - 1 = \frac12x$.`] },
                { no: 16, q: R`$y = kx$ doğrusu ile $x^2 + y^2 - 10x + 16 = 0$ çemberi veriliyor. (a) Doğrunun çemberi iki noktada kesmesi, (b) teğet olması, (c) kesmemesi için $k$ ne olmalıdır?`, note: R`Çember: merkez $(5, 0)$, $r = \frac12\sqrt{100 - 64} = 3$. Uzaklık $\ell = \frac{|5k|}{\sqrt{k^2 + 1}}$.`, parts: [
                    part("a", "İki noktada kesmesi", R`$|k| < \frac34$`, [R`$\ell < 3 \Rightarrow 25k^2 < 9k^2 + 9 \Rightarrow k^2 < \frac{9}{16}$.`]),
                    part("b", "Teğet olması", R`$k = \pm\frac34$`),
                    part("c", "Kesmemesi", R`$|k| > \frac34$`),
                ] },
            ],
        },

        /* ----------------------- Bölüm Problemleri ----------------------- */
        {
            id: "bolum-problemleri-0", title: "Bölüm Problemleri · Önbilgiler", page: "32–33", whole: true, sections: ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6"],
            problems: [
                { no: 1, q: R`$a < b$ olsun. $a < \frac{a + b}{2} < b$ olduğunu gösteriniz. (Aritmetik ortalama)`, a: "Ortalama iki sayının arasındadır", s: [R`$a = \frac{a + a}{2} < \frac{a + b}{2} < \frac{b + b}{2} = b$.`] },
                { no: 2, q: R`$x$ sıfırdan farklı bir rasyonel sayı ve $y$ irrasyonel olsun. $x - y$, $x + y$, $xy$, $\frac xy$, $\frac yx$ sayılarının irrasyonel olduğunu gösteriniz.`, a: "Olmayana ergi", s: [R`Örneğin $x + y = r$ rasyonel olsaydı $y = r - x$ rasyonel olurdu — çelişki.`, R`Diğerleri: $y = x - r$, $y = \frac rx$, $y = \frac xr$, $y = rx$ ile aynı çelişki. ($x \neq 0$ şartı bölme için.)`] },
                { no: 3, q: "İki irrasyonel sayının toplamı ve çarpımı daima irrasyonel midir?", a: "Hayır", s: [R`$\sqrt2 + (-\sqrt2) = 0$ ve $\sqrt2\cdot\sqrt2 = 2$ rasyoneldir.`] },
                { no: 4, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$|x - 2|^2 - |x - 2| = 6$`, R`$x = 5$ veya $x = -1$`, [R`$u = |x - 2| \ge 0$: $u^2 - u - 6 = 0 \Rightarrow u = 3$ ($u = -2$ olamaz).`]),
                    part("b", R`$|x + 2| = |2x|$`, R`$x = 2$ veya $x = -\frac23$`),
                ] },
                { no: 5, q: "Aşağıdaki denklemleri çözünüz.", parts: [
                    part("a", R`$\llbracket 2x \rrbracket = 2\llbracket x \rrbracket + 1$`, R`Kesir kısmı $\ge \frac12$ olan tüm $x$: $\bigcup_n [n + \frac12, n + 1)$`, [R`$x = n + k$ ($0 \le k < 1$): $\llbracket 2x \rrbracket = 2n + \llbracket 2k \rrbracket$. Şart $\llbracket 2k \rrbracket = 1 \iff k \ge \frac12$.`]),
                    part("b", R`$\llbracket x + 3 \rrbracket = 2\llbracket x \rrbracket + 5$`, R`$[-2, -1)$`, [R`$\llbracket x \rrbracket + 3 = 2\llbracket x \rrbracket + 5 \Rightarrow \llbracket x \rrbracket = -2$.`]),
                    part("c", R`$\llbracket x^2 - 3x \rrbracket = -2$`, R`$\left(\frac{3 - \sqrt5}{2}, 1\right] \cup \left[2, \frac{3 + \sqrt5}{2}\right)$`, [R`$-2 \le x^2 - 3x < -1$.`, R`$x^2 - 3x + 2 \ge 0 \Rightarrow x \le 1$ veya $x \ge 2$; $x^2 - 3x + 1 < 0 \Rightarrow \frac{3 - \sqrt5}{2} < x < \frac{3 + \sqrt5}{2}$.`]),
                    part("d", R`$\llbracket x + \llbracket x + \llbracket x \rrbracket \rrbracket \rrbracket = 6$`, R`$[2, 3)$`, [R`İçten dışa Teorem 0.4: $\llbracket x + \llbracket x \rrbracket \rrbracket = 2\llbracket x \rrbracket$, sonra $3\llbracket x \rrbracket = 6$.`]),
                    part("e", R`$\llbracket \frac{x + 1}{3} \rrbracket = 4$`, R`$[11, 14)$`, [R`$4 \le \frac{x + 1}{3} < 5$.`]),
                    part("f", R`$\llbracket \frac{x + 1}{x} \rrbracket = 3$`, R`$\left(\frac13, \frac12\right]$`, [R`$\llbracket 1 + \frac1x \rrbracket = 1 + \llbracket \frac1x \rrbracket = 3 \Rightarrow 2 \le \frac1x < 3$.`]),
                ] },
                { no: 6, q: R`Hangi rasyonel $x$ sayıları için $\sqrt{x^2 + x + 3}$ rasyoneldir?`, a: R`$x = \dfrac{t^2 - 3}{1 - 2t}$ ($t$ rasyonel, $t \neq \frac12$)`, s: [R`$\sqrt{x^2 + x + 3} = x + t$ yaz ($t$ rasyonel). Kare: $x + 3 = 2tx + t^2 \Rightarrow x(1 - 2t) = t^2 - 3$.`, R`Örnekler: $t = 0 \Rightarrow x = -3$ ($\sqrt9 = 3$); $t = -1 \Rightarrow x = -\frac23$ ($\sqrt{25/9} = \frac53$).`] },
                { no: 7, q: "Aşağıdaki eşitsizliklerin çözüm kümesini bulunuz.", parts: [
                    part("a", R`$|x^2 - 5x + 4| > x^2 - 5x + 4$`, R`$(1, 4)$`, [R`$|u| > u \iff u < 0$: $(x - 1)(x - 4) < 0$.`]),
                    part("b", R`$|2x - 3| - |x + 1| > 0$`, R`$\left(-\infty, \frac23\right) \cup (4, \infty)$`, [R`$(2x - 3)^2 > (x + 1)^2 \Rightarrow 3x^2 - 14x + 8 > 0 \Rightarrow (3x - 2)(x - 4) > 0$.`]),
                    part("c", R`$|x^2 - 3x| > |x|^2 - |3x|$`, R`$(-\infty, 0) \cup (0, 3)$`, [R`$x \ge 0$: sağ taraf $x^2 - 3x$; $|u| > u \iff u < 0 \Rightarrow 0 < x < 3$.`, R`$x < 0$: sol $x^2 - 3x$, sağ $x^2 + 3x$; $-3x > 3x$ her negatif $x$ için doğru.`]),
                ] },
                { no: 8, q: "Aşağıdaki önermelerin doğruluğunu gösteriniz.", parts: [
                    part("a", R`$a < b \Rightarrow -a > -b$`, "Doğru", [R`$-1$ ile çarp (Teorem 0.1-4).`]),
                    part("b", R`$0 < a < b$ ve $0 < c < d \Rightarrow ac < bd$`, "Doğru", [R`$ac < bc$ ($c > 0$) ve $bc < bd$ ($b > 0$).`]),
                    part("c", R`$0 < a < 1 \Rightarrow \sqrt[n]a > a$`, R`Doğru ($n \ge 2$)`, [R`$r = \sqrt[n]a \in (0, 1)$; $r^n < r$ yani $a < \sqrt[n]a$.`]),
                ] },
                { no: 9, q: R`$x^3 - x - 1 = 0$ denkleminin 1 ile 2 arasında bir irrasyonel köke sahip olduğunu gösteriniz.`, a: "İşaret değişimi + Gauss", s: [R`$f(1) = -1 < 0$, $f(2) = 5 > 0$: grafik sürekli olduğundan arada x-eksenini keser.`, R`Rasyonel kök olsaydı $\pm1$ olurdu (0.4 Problem 13); ikisi de kök değil. O hâlde kök irrasyonel.`], graph: ["x^3-x-1"] },
                { no: 10, q: "Köşe koordinatları tam sayılar olan bir eşkenar üçgenin bulunmadığını gösteriniz.", a: "Alan hem rasyonel hem irrasyonel çıkar — çelişki", s: [R`Köşeler tam sayıysa alan (koordinatlarla) $\frac{\text{tam sayı}}{2}$, yani rasyonel.`, R`Kenar $s$ için $s^2$ tam sayı; eşkenar üçgen alanı $\frac{\sqrt3}{4}s^2$ irrasyonel.`] },
                { no: 11, q: R`$|a + b| = |a| + |b| \iff ab \ge 0$ önermesinin doğruluğunu gösteriniz.`, a: "Kare al", s: [R`$(a + b)^2 = a^2 + 2ab + b^2$, $(|a| + |b|)^2 = a^2 + 2|ab| + b^2$.`, R`Eşit $\iff ab = |ab| \iff ab \ge 0$.`] },
                { no: 12, q: R`$0 < a < b \Rightarrow a < \sqrt{ab} < \frac{a + b}{2}$ önermesinin doğruluğunu gösteriniz. (Geometrik ortalama)`, a: "Doğru", s: [R`$a = \sqrt{a\cdot a} < \sqrt{ab}$.`, R`$\frac{a + b}{2} - \sqrt{ab} = \frac{(\sqrt b - \sqrt a)^2}{2} > 0$.`] },
                { no: 13, q: R`$0 < a < b$ ve $\frac1h = \frac12\left(\frac1a + \frac1b\right)$ olsun. $a < h < b$ olduğunu gösteriniz. (Harmonik ortalama)`, a: "Doğru", s: [R`$\frac1b < \frac1a$; $\frac1h$ bunların aritmetik ortalaması: $\frac1b < \frac1h < \frac1a$.`, R`Pozitiflerde ters çevirince yön döner: $a < h < b$.`] },
                { no: 14, q: R`$0 < a < b$ olsun. $\sqrt b - \sqrt a < \sqrt{b - a}$ olduğunu gösteriniz.`, a: "Kare al", s: [R`İki taraf pozitif. Kare: $b + a - 2\sqrt{ab} < b - a \iff a < \sqrt{ab} \iff \sqrt a < \sqrt b$ ✓`] },
                { no: 15, q: "Bir üçgenin iki kenarının orta noktasını birleştiren doğru parçasının üçüncü kenara paralel ve uzunluğunun üçüncü kenarın yarısına eşit olduğunu gösteriniz.", a: "Koordinat/vektör ile", s: [R`$D$, $AB$'nin; $E$, $AC$'nin orta noktası: $E - D = \frac{A + C}{2} - \frac{A + B}{2} = \frac{C - B}{2}$.`, R`Yani $\overrightarrow{DE} = \frac12\overrightarrow{BC}$: aynı yön (paralel), yarı uzunluk.`] },
                { no: 16, q: R`Her $a, b \in \mathbb{R}$ için $|a - b| = \max\{a, b\} - \min\{a, b\}$ olduğunu gösteriniz.`, a: "İki durum", s: [R`$a \ge b$: $|a - b| = a - b = \max - \min$. $a < b$: $|a - b| = b - a$ ✓`] },
                { no: 17, q: R`$\max\{a, b\} = \frac{(a + b) + |a - b|}{2}$ ve $\min\{a, b\} = \frac{(a + b) - |a - b|}{2}$ olduğunu gösteriniz.`, a: "İki durum", s: [R`$a \ge b$: $\frac{a + b + a - b}{2} = a$ ve $\frac{a + b - a + b}{2} = b$ ✓ (diğer durum simetrik).`] },
                { no: 18, q: R`Her $a, b, c \in \mathbb{R}$ için $ab + bc + ac \le a^2 + b^2 + c^2$ olduğunu gösteriniz.`, a: "Kareler toplamı", s: [R`$2(a^2 + b^2 + c^2) - 2(ab + bc + ca) = (a - b)^2 + (b - c)^2 + (c - a)^2 \ge 0$.`] },
                { no: 19, q: R`$n > 1$ için $M = \max\{a, a^2, \ldots, a^n\}$, $m = \min\{a, a^2, \ldots, a^n\}$ olsun. $a$'nın aşağıdaki değerleri için $M$ ve $m$'yi bulunuz.`, parts: [
                    part("1", R`$0 < a < 1$`, R`$M = a$, $m = a^n$`, [R`Kuvvet arttıkça küçülür.`]),
                    part("2", R`$a > 1$`, R`$M = a^n$, $m = a$`),
                    part("3", R`$-1 < a < 0$`, R`$M = a^2$, $m = a$`, [R`Tek kuvvetler negatif, çiftler pozitif; mutlak değerler küçülür. En büyük pozitif $a^2$, en küçük (en negatif) $a$.`]),
                    part("4", R`$a < -1$`, R`$n$ çift: $M = a^n$, $m = a^{n-1}$; $\;n$ tek: $M = a^{n-1}$, $m = a^n$`, [R`Mutlak değerler büyür; en büyük üslü terim belirleyici.`]),
                ] },
                { no: 20, q: R`Merkezi orijinde, yarıçapı $\frac52$ olan çemberin üzerinde ve iç bölgesinde koordinatları tam sayı olan kaç nokta vardır?`, a: "21", s: [R`$x^2 + y^2 \le 6{,}25 \Rightarrow x^2 + y^2 \le 6$.`, R`$x = 0$: $y \in \{-2..2\}$ → 5; $x = \pm1$: 5'er → 10; $x = \pm2$: $y \in \{-1, 0, 1\}$ → 6.`] },
                { no: 21, q: R`$B = \{(x, y) : x \ge 0,\ 0 \le y \le 100 - x\}$ kümesi üzerinde koordinatları tam sayı olan kaç nokta vardır?`, a: "5151", s: [R`$x = 0, 1, \ldots, 100$ için $y$'nin $101 - x$ değeri var.`, R`$101 + 100 + \cdots + 1 = \frac{101\cdot102}{2}$.`] },
                { no: 22, q: "Aşağıdaki önermelerin doğruluğunu gösteriniz.", parts: [
                    part("a", "Bir çift sayının karesi de çifttir.", R`$(2m)^2 = 2(2m^2)$`), part("b", "Bir tek sayının karesi de tektir.", R`$(2m+1)^2 = 2(2m^2 + 2m) + 1$`),
                    part("c", "Bir çift sayının kübü de çifttir.", R`$(2m)^3 = 2(4m^3)$`), part("d", "Bir tek sayının kübü de tektir.", R`$(2m+1)^3 = 2(4m^3 + 6m^2 + 3m) + 1$`),
                ] },
                { no: 23, q: R`Her $a, b \in \mathbb{R}$ için $\big||a| - |b|\big| \le |a + b| \le |a| + |b|$ olduğunu gösteriniz. Eşitlikler hangi durumlarda vardır?`, a: R`Sağdaki eşitlik $ab \ge 0$, soldaki $ab \le 0$ iken`, s: [R`Sağ: $(a + b)^2 = a^2 + 2ab + b^2 \le a^2 + 2|ab| + b^2$.`, R`Sol: $|a| = |(a + b) - b| \le |a + b| + |b|$ → $|a| - |b| \le |a + b|$; $a$ ile $b$'yi değiştirerek diğer işaret.`] },
                { no: 24, q: R`$ab \ne 0$ ve $|a| \ne |b|$ dir. $\dfrac{x - a}{b} + \dfrac{x - b}{a} = \dfrac{b}{x - a} + \dfrac{a}{x - b}$ denklemini çözünüz.`, note: R`Kitapta ikinci kesrin paydası da “$b$” basılmış; problemin klasik (ve $|a| \neq |b|$ şartını anlamlı kılan) hâli $\frac{x - b}{a}$'dır.`,
                    a: R`$x = 0$, $x = a + b$, $x = \dfrac{a^2 + b^2}{a + b}$`, s: [R`$u = \frac{x - a}{b}$, $v = \frac{x - b}{a}$: denklem $u + v = \frac1u + \frac1v = \frac{u + v}{uv}$.`, R`$(u + v)\left(1 - \frac{1}{uv}\right) = 0 \Rightarrow u + v = 0$ veya $uv = 1$.`, R`$u + v = 0$: $a(x - a) + b(x - b) = 0 \Rightarrow x = \frac{a^2 + b^2}{a + b}$ ($a + b \ne 0$ çünkü $|a| \ne |b|$).`, R`$uv = 1$: $(x - a)(x - b) = ab \Rightarrow x^2 - (a + b)x = 0 \Rightarrow x = 0$ veya $a + b$.`] },
                { no: 25, q: R`$|xy - ab| \le |x|\,|y - a| + |a|\,|x - b|$ olduğunu gösteriniz.`, a: "Ekle-çıkar + üçgen eşitsizliği", s: [R`$xy - ab = x(y - a) + a(x - b)$ (çünkü $xy - xa + xa - ab$).`, R`Üçgen eşitsizliği: $|xy - ab| \le |x||y - a| + |a||x - b|$.`] },
                { no: 26, q: R`$(x - 1)^{x^2 - 3x - 4} = 1$ denklemini çözünüz.`, a: R`$x \in \{-1, 0, 2, 4\}$`, s: [R`Üs 0 (taban $\neq 0$): $x^2 - 3x - 4 = 0 \Rightarrow x = 4, -1$.`, R`Taban 1: $x = 2$.`, R`Taban $-1$ ve üs çift: $x = 0$ → üs $-4$ çift ✓.`] },
                { no: 27, q: R`$\overline{xx}$ ve $\overline{yy}$ iki basamaklı birer sayıdır. $\dfrac{\sqrt{\overline{xx}}}{\sqrt{\overline{yy}}} + \dfrac{\sqrt{\overline{yy}}}{\sqrt{\overline{xx}}} = \dfrac{5}{\sqrt6}$ olduğuna göre $x$ ve $y$ nedir?`, a: R`$\frac xy = \frac32$ veya $\frac23$: $(3, 2), (6, 4), (9, 6)$ ve tersleri`, s: [R`$\overline{xx} = 11x$, $\overline{yy} = 11y$: $\sqrt{\frac xy} + \sqrt{\frac yx} = \frac{5}{\sqrt6}$.`, R`$t = \sqrt{\frac xy}$: $t + \frac1t = \frac5{\sqrt6} \Rightarrow t = \frac{3}{\sqrt6}$ veya $\frac{2}{\sqrt6}$.`, R`$t^2 = \frac32$ veya $\frac23$.`] },
            ],
        },
    ];

    global.PRACTICE = global.PRACTICE || { tests: [], problemSets: [] };
    tests.forEach((t) => (t.chapter = "onbilgiler"));
    problemSets.forEach((s) => (s.chapter = "onbilgiler"));
    global.PRACTICE.tests.push(...tests);
    global.PRACTICE.problemSets.push(...problemSets);
})(window);
