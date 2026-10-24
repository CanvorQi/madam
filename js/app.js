/*
 * Madam Matematik - uygulama kabuğu: yönlendirme (hash), sayfalar, ilerleme, tema, PWA.
 * Sayfalar: #/  ·  #/konu/:id  ·  #/ders/:id  ·  #/grafik[?e=...]
 */
(function () {
    "use strict";

    const view = document.getElementById("view");
    const H = Widgets._helpers;

    /* ---------------- Depolama (localStorage erişilemezse sessizce geç) ---------------- */
    const store = {
        get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* yok say */ } },
    };
    let progress = store.get("madam_progress", {});

    /* ---------------- Ders listesi ---------------- */
    const chapters = Object.values(CHAPTERS).sort((a, b) => a.no - b.no);
    const lessons = [];
    chapters.forEach((ch) => ch.sections.forEach((s) => s.lessons.forEach((l, i) => lessons.push(Object.assign({}, l, { chapter: ch, section: s, idxInSection: i })))));
    const lessonById = {};
    lessons.forEach((l, i) => { l.index = i; lessonById[l.id] = l; });
    const chapterLessons = (ch) => lessons.filter((l) => l.chapter === ch);

    const doneCount = (ch) => (ch ? chapterLessons(ch) : lessons).filter((l) => progress[l.id]).length;
    const pct = (ch) => Math.round((doneCount(ch) / (ch ? chapterLessons(ch) : lessons).length) * 100);

    function esc(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function toast(msg) {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(toast._t);
        toast._t = setTimeout(() => t.classList.remove("show"), 2200);
    }

    function renderMath(el) {
        if (typeof window.renderMathInElement !== "function") return;
        try {
            renderMathInElement(el, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                ],
                throwOnError: false,
                ignoredClasses: ["no-math"],
            });
        } catch (e) { /* KaTeX yoksa düz metin kalır */ }
    }

    /* ---------------- Ana sayfa ---------------- */
    function pageHome() {
        const last = lessonById[store.get("madam_last", "")];
        const next = last || lessons.find((l) => !progress[l.id]) || lessons[0];
        return `
        <section class="hero">
            <svg class="hero-art" viewBox="0 0 200 160" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" aria-hidden="true">
                <path d="M10 80 H190 M100 10 V150" stroke-width="3"/>
                <path d="M10 120 C 50 120, 60 20, 100 20 S 150 120, 190 120"/>
                <path d="M20 150 Q 100 -40 180 150" stroke-dasharray="8 10"/>
            </svg>
            <h1>Matematiği en basit hâliyle öğren</h1>
            <p>Her konu önce “basitçe” anlatılır, sonra tanım, adım adım örnek, oynayabileceğin bir grafik ve kısa bir test gelir.</p>
            <div class="hero-actions">
                <a class="btn" href="#/ders/${next.id}">${last ? "▶ Kaldığın yerden devam et" : "▶ Derse başla"}</a>
                <a class="btn ghost" href="#/grafik">📈 Grafik çizici</a>
            </div>
        </section>
        <div class="stat-row">
            <div class="stat-box"><div class="num">${doneCount()}</div><div class="lbl">tamamlanan ders</div></div>
            <div class="stat-box"><div class="num">${lessons.length}</div><div class="lbl">ders · ${chapters.length} bölüm</div></div>
            <div class="stat-box"><div class="num">%${pct()}</div><div class="lbl">ilerleme</div></div>
        </div>
        ${last ? `<div class="card" style="margin-top:16px">
            <h2 class="section-title">Kaldığın yer</h2>
            <a class="lesson-row${progress[last.id] ? " done" : ""}" href="#/ders/${last.id}">
                <div class="lesson-check">${progress[last.id] ? "✓" : last.idxInSection + 1}</div>
                <div><div class="lt">${esc(last.title)}</div><div class="ls">${esc(last.chapter.title)} · ${last.section.no} ${esc(last.section.title)}</div></div>
                <span class="arrow">›</span>
            </a></div>` : ""}
        <a class="card lesson-row" href="#/testler" style="margin-top:16px;padding:18px 20px">
            <div class="chapter-no" style="background:var(--green);color:#fff">🎯</div>
            <div><div class="lt">Testler ve kitap problemleri</div><div class="ls">${PRACTICE.tests.length} çoktan seçmeli test · kitaptaki ${PRACTICE.problemSets.filter((s) => !s.exam).reduce((a, s) => a + s.problems.length, 0)} problemin adım adım çözümü</div></div>
            <span class="arrow">›</span>
        </a>
        ${PRACTICE.problemSets.filter((s) => s.exam).map((s) => `<a class="card lesson-row" href="#/problemler/${s.id}" style="margin-top:16px;padding:18px 20px">
            <div class="chapter-no" style="background:var(--orange);color:#fff">📝</div>
            <div><div class="lt">Geçmiş sınav: ${esc(s.title)}</div><div class="ls">${s.problems.length} soru · adım adım çözümler ve ilgili dersler</div></div>
            <span class="arrow">›</span>
        </a>`).join("")}
        <div class="card" style="margin-top:16px">
            <h2 class="section-title">Konular · ${esc(COURSE.title)}</h2>
            ${chapterGrid()}
        </div>
        <div class="card">
            <h2 class="section-title">Her derste</h2>
            <div class="chapter-grid">
                <div class="chapter-card"><div class="chapter-no" style="background:var(--orange-pale);color:var(--orange)">💡</div><div><div class="ct">Basitçe</div><div class="cs">Konunun özü, günlük dille</div></div></div>
                <div class="chapter-card"><div class="chapter-no">📘</div><div><div class="ct">Tanım ve kurallar</div><div class="cs">Kitaptaki resmî hâliyle</div></div></div>
                <div class="chapter-card"><div class="chapter-no" style="background:var(--purple-pale);color:var(--purple)">🧪</div><div><div class="ct">Etkileşimli araç</div><div class="cs">Kaydır, dokun, gör</div></div></div>
                <div class="chapter-card"><div class="chapter-no" style="background:var(--green-pale);color:var(--green)">🎯</div><div><div class="ct">Adım adım örnek + test</div><div class="cs">Kendini hemen dene</div></div></div>
            </div>
        </div>
        <div class="card">
            <h2 class="section-title">Telefona / tablete ekle</h2>
            <p class="muted" style="margin:0">Android (Chrome): menü ⋮ → <b>Ana ekrana ekle</b> ya da <b>Uygulamayı yükle</b>. iPhone/iPad (Safari): paylaş ⎋ → <b>Ana Ekrana Ekle</b>. Eklendikten sonra uygulama gibi tam ekran açılır ve bir kez açılan dersler internetsiz de çalışır.</p>
            <div class="ex-actions"><button class="btn small" type="button" data-install hidden>📲 Şimdi yükle</button></div>
        </div>`;
    }

    /* ---------------- Bölüm listesi ve bölüm sayfası ---------------- */
    function chapterGrid() {
        return `<div class="chapter-grid">${COURSE.chapters.map((c) => {
            const ch = CHAPTERS[c.id];
            if (!ch) return `<div class="chapter-card locked" title="Yakında"><div class="chapter-no">${c.no}</div><div><div class="ct">${esc(c.title)}</div><div class="cs">Yakında</div></div></div>`;
            const p = pct(ch);
            return `<a class="chapter-card available" href="#/konu/${c.id}"><div class="chapter-no">${c.no}</div><div style="flex:1;min-width:0"><div class="ct">${esc(c.title)}</div><div class="cs">${esc(c.sub)}</div>
                <div class="progress-bar" style="height:5px;margin-top:6px"><span style="width:${p}%"></span></div></div></a>`;
        }).join("")}</div>`;
    }

    function pageChapters() {
        return `
        <div class="page-head">
            <div class="crumbs"><a href="#/">Ana Sayfa</a> › <span>Konular</span></div>
            <h1>${esc(COURSE.title)}</h1>
            <p>${esc(COURSE.source)} kitabının bölümleri. Hazır olanlara dokunup başla; diğerleri yakında eklenecek.</p>
        </div>
        <div class="card">${chapterGrid()}</div>`;
    }

    function pageChapter(id) {
        const chapter = CHAPTERS[id];
        if (!chapter) return pageNotFound();
        const secs = chapter.sections.map((s) => {
            const d = s.lessons.filter((l) => progress[l.id]).length;
            const rows = s.lessons.map((l, i) => `
                <a class="lesson-row${progress[l.id] ? " done" : ""}" href="#/ders/${l.id}">
                    <div class="lesson-check">${progress[l.id] ? "✓" : i + 1}</div>
                    <div><div class="lt">${esc(l.title)}</div><div class="ls">${l.summary}</div></div>
                    <span class="arrow">›</span>
                </a>`).join("");
            return `<div class="card section-block">
                <div class="section-head"><span class="section-num">${s.no}</span><h2>${esc(s.title)}</h2>
                <span class="pill ${d === s.lessons.length ? "green" : "gray"}">${d}/${s.lessons.length}</span></div>
                <div class="lesson-list">${rows}</div>
                ${practiceLinks(s.no) ? `<div class="section-title" style="margin:14px 0 6px">Kendini sına</div><div class="lesson-list">${practiceLinks(s.no)}</div>` : ""}</div>`;
        }).join("");
        return `
        <div class="page-head">
            <div class="crumbs"><a href="#/konular">Konular</a> › <span>Bölüm ${chapter.no}</span></div>
            <h1>${chapter.no}. ${esc(chapter.title)}</h1>
            <p>${esc(chapter.intro)}</p>
            <div class="ex-actions"><a class="btn small ghost" href="#/ozet/${chapter.id}">📄 Formül özeti (kopya kâğıdı)</a></div>
            <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
                <div class="progress-bar" style="flex:1"><span style="width:${pct(chapter)}%"></span></div>
                <b style="color:var(--blue-deep);font-family:Sora,sans-serif">%${pct(chapter)}</b>
            </div>
        </div>
        ${secs}
        ${problemSets.filter((s) => s.whole && s.chapter === chapter.id).map((s) => `<div class="card"><div class="section-title">Bölüm sonu</div><div class="lesson-list">
            <a class="lesson-row" href="#/problemler/${s.id}"><div class="lesson-check" style="border-color:var(--purple);color:var(--purple)">📚</div><div><div class="lt">${esc(s.title)}</div><div class="ls">Kitap s. ${s.page} · ${s.problems.length} problem · ${solvedCount(s)} çözüldü</div></div><span class="arrow">›</span></a></div></div>`).join("")}`;
    }

    /* ---------------- Formül özeti (kopya kâğıdı) ---------------- */
    function pageSummary(id) {
        const chapter = CHAPTERS[id];
        if (!chapter) return pageNotFound();
        const kinds = { def: ["📘", "Tanım"], formula: ["🧮", "Formül"], table: ["📊", "Tablo"] };
        const secs = chapter.sections.map((s) => {
            const items = [];
            s.lessons.forEach((l) => l.blocks.forEach((b) => {
                if (!kinds[b.t]) return;
                const title = b.title || kinds[b.t][1];
                items.push(`<div class="sum-item sum-${b.t}">
                    <div class="sum-title">${kinds[b.t][0]} ${title}<a class="sum-src no-print" href="#/ders/${l.id}" title="Derse git">${esc(l.title)} ›</a></div>
                    <div class="sum-body">${b.html}</div></div>`);
            }));
            return items.length ? `<section class="sum-section"><h2 class="sum-head"><span class="section-num">${s.no}</span> ${esc(s.title)}</h2><div class="sum-grid">${items.join("")}</div></section>` : "";
        }).join("");
        return `
        <div class="page-head no-print">
            <div class="crumbs"><a href="#/konu/${chapter.id}">${chapter.no}. ${esc(chapter.title)}</a> › <span>Formül özeti</span></div>
            <h1>Formül Özeti · ${esc(chapter.title)}</h1>
            <p>Bölümdeki tüm tanım, formül ve tabloların bir arada hâli. Her kutudaki bağlantı ilgili derse götürür.</p>
            <div class="ex-actions"><button type="button" class="btn small" data-print>🖨️ Yazdır / PDF kaydet</button></div>
        </div>
        <div class="print-only sum-print-head"><b>${esc(COURSE.title)} · ${chapter.no}. ${esc(chapter.title)}</b> — Formül özeti</div>
        <div class="summary">${secs}</div>`;
    }

    /* ---------------- Ders sayfası ---------------- */
    let widgetQueue = [];

    function box(cls, icon, title, html) {
        return `<div class="box ${cls}"><div class="box-title">${icon} ${title}</div><div>${html}</div></div>`;
    }

    function renderBlock(b, bi) {
        switch (b.t) {
            case "p": return `<div class="card">${b.html.trim().startsWith("<") ? b.html : `<p>${b.html}</p>`}</div>`;
            case "simple": return box("simple", "💡", "Basitçe", b.html);
            case "def": return box("def", "📘", b.title || "Tanım", b.html);
            case "formula": return box("formula", "🧮", b.title || "Formül", b.html);
            case "tip": return box("tip", "✅", b.title || "İpucu", b.html);
            case "warn": return box("warn", "⚠️", b.title || "Dikkat", b.html);
            case "table": return `<div class="card"><div class="table-wrap">${b.html}</div></div>`;
            case "example": {
                const steps = b.steps.map((s, i) => `<div class="ex-step" hidden><span class="sn">${i + 1}</span><div class="sb">${s}</div></div>`).join("");
                return `<div class="card example" data-example>
                    <div class="box-title" style="color:var(--blue-deep)">✏️ Örnek</div>
                    <div class="ex-q">${b.q}</div>
                    <div class="ex-steps">${steps}<div class="ex-answer" hidden><b>Sonuç:</b> ${b.answer}</div></div>
                    <div class="ex-actions">
                        <button type="button" class="btn small" data-step>Çözümü adım adım göster</button>
                        <button type="button" class="btn small ghost" data-all>Tamamını göster</button>
                    </div></div>`;
            }
            case "quiz": {
                const opts = b.options.map((o, i) => `<button type="button" class="q-opt" data-i="${i}">${o.replace(/\$([^$]+)\$/g, (m, x) => `$\\displaystyle ${x}$`)}</button>`).join("");
                return `<div class="card quiz" data-quiz data-correct="${b.correct}">
                    <div class="box-title" style="color:var(--green)">🎯 Kendini dene</div>
                    <div class="q-text">${b.q}</div>
                    <div class="q-options">${opts}</div>
                    <div class="q-feedback ok" hidden><b>Doğru! 🎉</b> ${b.why || ""}</div>
                    <div class="q-feedback no" hidden><b>Olmadı.</b> Doğru cevap: <b>${b.options[b.correct]}</b>. ${b.why || ""}</div>
                </div>`;
            }
            case "widget":
                widgetQueue.push({ id: `w${bi}`, name: b.name, opts: b.opts });
                return `<div class="card widget">
                    <div class="widget-head"><span class="wi">🧪</span><span class="wt">${esc(b.title)}</span></div>
                    <div class="widget-body">${b.desc ? `<p class="widget-desc">${b.desc}</p>` : ""}<div data-widget="w${bi}"></div></div>
                </div>`;
        }
        return "";
    }

    function pageLesson(id) {
        const l = lessonById[id];
        if (!l) return pageNotFound();
        store.set("madam_last", id);
        widgetQueue = [];
        const prev = lessons[l.index - 1], next = lessons[l.index + 1];
        const body = l.blocks.map(renderBlock).join("");
        const done = !!progress[l.id];
        return `
        <div class="lesson-hero">
            <div class="crumbs"><a href="#/konu/${l.chapter.id}">${l.chapter.no}. ${esc(l.chapter.title)}</a> › <span>${l.section.no} ${esc(l.section.title)}</span></div>
            <h1>${esc(l.title)}</h1>
            <p class="lead">${l.summary} <span class="pill gray" style="margin-left:4px">Ders ${l.idxInSection + 1}/${l.section.lessons.length}</span> <span class="pill gray">Kitap s. ${l.section.page}+</span></p>
        </div>
        <div class="lesson-body">${body}
            ${l.idxInSection === l.section.lessons.length - 1 && practiceLinks(l.section.no) ? `<div class="card"><div class="box-title" style="color:var(--green)">🎯 ${l.section.no} bitti — kendini sına</div><div class="lesson-list">${practiceLinks(l.section.no)}</div></div>` : ""}
            <div class="card lesson-done-bar">
                <div><b>${done ? "Bu dersi tamamladın ✓" : "Bu dersi bitirdin mi?"}</b><div class="muted" style="font-size:13px">İlerlemen bu cihazda saklanır.</div></div>
                <button type="button" class="btn ${done ? "ghost" : "success"}" data-done>${done ? "Tamamlanmadı olarak işaretle" : "✓ Anladım, tamamla"}</button>
            </div>
            <div class="lesson-nav">
                ${prev ? `<a class="btn ghost nav-prev" href="#/ders/${prev.id}"><span><span class="nl">‹ Önceki</span>${esc(prev.title)}</span></a>` : "<span></span>"}
                ${next ? `<a class="btn nav-next" href="#/ders/${next.id}"><span><span class="nl">${next.chapter === l.chapter ? "Sonraki ›" : `Sonraki bölüm: ${esc(next.chapter.title)} ›`}</span>${esc(next.title)}</span></a>` : `<a class="btn nav-next" href="#/konu/${l.chapter.id}">Bölüm özeti ›</a>`}
            </div>
        </div>`;
    }

    function bindLesson(id) {
        view.querySelectorAll("[data-example]").forEach((ex) => {
            const steps = Array.from(ex.querySelectorAll(".ex-step"));
            const ans = ex.querySelector(".ex-answer");
            const bStep = ex.querySelector("[data-step]"), bAll = ex.querySelector("[data-all]");
            let shown = 0;
            const finish = () => { ans.hidden = false; bStep.hidden = true; bAll.hidden = true; };
            bStep.addEventListener("click", () => {
                if (shown < steps.length) { steps[shown++].hidden = false; bStep.textContent = shown < steps.length ? "Sonraki adım ›" : "Sonucu göster"; }
                else finish();
            });
            bAll.addEventListener("click", () => { steps.forEach((s) => (s.hidden = false)); finish(); });
        });
        view.querySelectorAll("[data-quiz]").forEach((q) => {
            const correct = Number(q.dataset.correct);
            q.querySelectorAll(".q-opt").forEach((b) => b.addEventListener("click", () => {
                const i = Number(b.dataset.i);
                q.querySelectorAll(".q-opt").forEach((x) => {
                    x.disabled = true;
                    if (Number(x.dataset.i) === correct) x.classList.add("correct");
                });
                if (i !== correct) b.classList.add("wrong");
                q.querySelector(i === correct ? ".q-feedback.ok" : ".q-feedback.no").hidden = false;
            }));
        });
        const doneBtn = view.querySelector("[data-done]");
        if (doneBtn) doneBtn.addEventListener("click", () => {
            if (progress[id]) delete progress[id]; else progress[id] = true;
            store.set("madam_progress", progress);
            if (progress[id]) {
                toast("Harika! Ders tamamlandı ✓");
                const next = lessons[lessonById[id].index + 1];
                if (next) { location.hash = "#/ders/" + next.id; return; }
            }
            route();
        });
        widgetQueue.forEach((w) => {
            const host = view.querySelector(`[data-widget="${w.id}"]`);
            if (!host || !Widgets[w.name]) return;
            try { Widgets[w.name](host, w.opts || {}); } catch (e) {
                host.innerHTML = `<p class="muted">Bu araç yüklenemedi.</p>`;
                console.error(e);
            }
        });
    }

    /* ---------------- Testler ve kitap problemleri ---------------- */
    const tests = PRACTICE.tests, problemSets = PRACTICE.problemSets;
    let testScores = store.get("madam_tests", {});
    let solved = store.get("madam_solved", {});
    const solvedCount = (set) => set.problems.filter((p) => solved[`${set.id}#${p.no}`]).length;
    const graphLink = (exprs) => "#/grafik?e=" + encodeURIComponent(JSON.stringify(exprs));
    const practiceFor = (secNo) => ({
        tests: tests.filter((t) => t.sections.includes(secNo)),
        sets: problemSets.filter((s) => s.sections.includes(secNo) && !s.whole),
    });

    function practiceLinks(secNo) {
        const { tests: ts, sets } = practiceFor(secNo);
        return ts.map((t) => `<a class="lesson-row" href="#/test/${t.id}"><div class="lesson-check" style="border-color:var(--green);color:var(--green)">🎯</div><div><div class="lt">${esc(t.title)}</div><div class="ls">${t.questions.length} soru · çoktan seçmeli${testScores[t.id] ? ` · en iyi ${testScores[t.id].best}/${t.questions.length}` : ""}</div></div><span class="arrow">›</span></a>`).join("") +
            sets.map((s) => `<a class="lesson-row" href="#/problemler/${s.id}"><div class="lesson-check" style="border-color:var(--purple);color:var(--purple)">📚</div><div><div class="lt">${esc(s.title)}</div><div class="ls">Kitap s. ${s.page} · ${s.problems.length} problem · ${solvedCount(s)} çözüldü</div></div><span class="arrow">›</span></a>`).join("");
    }

    function pagePractice() {
        const grouped = (list, render) => chapters.map((ch) => {
            const items = list.filter((x) => x.chapter === ch.id);
            return items.length ? `<div class="section-title" style="margin:14px 0 4px">${ch.no}. ${esc(ch.title)}</div>${items.map(render).join("")}` : "";
        }).join("");
        const tcards = grouped(tests, (t) => {
            const sc = testScores[t.id];
            return `<a class="lesson-row" href="#/test/${t.id}">
                <div class="lesson-check" style="${sc ? "background:var(--green);border-color:var(--green);color:#fff" : ""}">${sc ? sc.best : "🎯"}</div>
                <div><div class="lt">${esc(t.title)}</div><div class="ls">${esc(t.desc)}</div></div>
                <span class="pill ${sc ? "green" : "gray"}" style="margin-left:auto;white-space:nowrap">${sc ? `en iyi ${sc.best}/${t.questions.length}` : `${t.questions.length} soru`}</span></a>`;
        });
        const pcards = grouped(problemSets, (s) => {
            const n = solvedCount(s);
            return `<a class="lesson-row${n === s.problems.length ? " done" : ""}" href="#/problemler/${s.id}">
                <div class="lesson-check">${n === s.problems.length ? "✓" : "📚"}</div>
                <div><div class="lt">${esc(s.title)}</div><div class="ls">Kitap s. ${s.page}</div></div>
                <span class="pill ${n ? "green" : "gray"}" style="margin-left:auto;white-space:nowrap">${n}/${s.problems.length}</span></a>`;
        });
        const exams = tests.filter((t) => t.exam).map((t) => {
            const sc = testScores[t.id];
            return `<a class="lesson-row" href="#/test/${t.id}">
                <div class="lesson-check" style="${sc ? "background:var(--green);border-color:var(--green);color:#fff" : ""}">${sc ? sc.best : "🎯"}</div>
                <div><div class="lt">${esc(t.title)}</div><div class="ls">${esc(t.desc)}</div></div>
                <span class="pill ${sc ? "green" : "gray"}" style="margin-left:auto;white-space:nowrap">${sc ? `en iyi ${sc.best}/${t.questions.length}` : `${t.questions.length} soru`}</span></a>`;
        }).join("") + problemSets.filter((s) => s.exam).map((s) => {
            const n = solvedCount(s);
            return `<a class="lesson-row${n === s.problems.length ? " done" : ""}" href="#/problemler/${s.id}">
                <div class="lesson-check">${n === s.problems.length ? "✓" : "📝"}</div>
                <div><div class="lt">${esc(s.title)}</div><div class="ls">${s.problems.length} soru · çözümlü</div></div>
                <span class="pill ${n ? "green" : "gray"}" style="margin-left:auto;white-space:nowrap">${n}/${s.problems.length}</span></a>`;
        }).join("");
        return `
        <div class="page-head">
            <div class="crumbs"><a href="#/">Ana Sayfa</a> › <span>Testler</span></div>
            <h1>Testler ve Problemler</h1>
            <p>Çoktan seçmeli testlerle kendini dene; kitaptaki tüm problemlerin adım adım çözümlerine bak.</p>
        </div>
        ${exams ? `<div class="card"><div class="section-head"><span class="section-num" style="background:var(--orange)">📝</span><h2>Geçmiş sınavlar</h2></div>
            <p class="muted" style="margin:0 0 10px;font-size:14px">Gerçek sınav sorularının çözümleri ve aynı tarzda prova testi.</p>
            <div class="lesson-list">${exams}</div></div>` : ""}
        <div class="card"><div class="section-head"><span class="section-num">🎯</span><h2>Çoktan seçmeli testler</h2></div>
            <p class="muted" style="margin:0 0 10px;font-size:14px">Her test 10 soru. Bitirince puanını ve her sorunun açıklamasını görürsün.</p>
            <div class="lesson-list">${tcards}</div></div>
        <div class="card"><div class="section-head"><span class="section-num" style="background:var(--purple)">📚</span><h2>Kitap problemleri</h2></div>
            <p class="muted" style="margin:0 0 10px;font-size:14px">Matematik 1 kitabındaki problemler. Önce kendin dene, sonra çözümü aç.</p>
            <div class="lesson-list">${pcards}</div></div>`;
    }

    function pageTest(id) {
        const t = tests.find((x) => x.id === id);
        if (!t) return pageNotFound();
        const sc = testScores[t.id];
        // Şıklar her açılışta karışır; data-i orijinal indeksi tutar
        const shuffled = (n) => {
            const a = Array.from({ length: n }, (_, i) => i);
            for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
            return a;
        };
        const big = (o) => o.replace(/\$([^$]+)\$/g, (m, x) => `$\\displaystyle ${x}$`);
        const qs = t.questions.map((q, qi) => `
            <div class="card quiz" data-q="${qi}">
                <div class="box-title" style="color:var(--blue-deep)">Soru ${qi + 1} <span class="q-mark" style="margin-left:auto"></span></div>
                <div class="q-text">${q.q}</div>
                <div class="q-options">${shuffled(q.options.length).map((oi, pos) => `<button type="button" class="q-opt" data-i="${oi}"><span class="q-letter">${"ABCD"[pos]}</span> ${big(q.options[oi])}</button>`).join("")}</div>
                <div class="q-feedback" hidden><b>Açıklama:</b> ${q.why}</div>
            </div>`).join("");
        return `
        <div class="page-head">
            <div class="crumbs"><a href="#/testler">Testler</a> › <span>${esc(t.title)}</span></div>
            <h1>${esc(t.title)}</h1>
            <p>${esc(t.desc)}${sc ? ` <span class="pill green">En iyi: ${sc.best}/${t.questions.length}</span>` : ""}</p>
        </div>
        <div id="testResult"></div>
        <div class="lesson-body">${qs}
            <div class="card lesson-done-bar">
                <div><b data-answered>0 / ${t.questions.length} cevaplandı</b><div class="muted" style="font-size:13px">Boş bıraktıkların yanlış sayılır.</div></div>
                <button type="button" class="btn success" data-finish>Testi bitir</button>
            </div>
        </div>`;
    }

    function bindTest(id) {
        const t = tests.find((x) => x.id === id);
        if (!t) return;
        const answers = new Array(t.questions.length).fill(null);
        let finished = false;
        const answeredEl = view.querySelector("[data-answered]");
        view.querySelectorAll("[data-q]").forEach((card) => {
            const qi = Number(card.dataset.q);
            card.querySelectorAll(".q-opt").forEach((b) => b.addEventListener("click", () => {
                if (finished) return;
                answers[qi] = Number(b.dataset.i);
                card.querySelectorAll(".q-opt").forEach((x) => x.classList.toggle("selected", x === b));
                answeredEl.textContent = `${answers.filter((a) => a !== null).length} / ${t.questions.length} cevaplandı`;
            }));
        });
        view.querySelector("[data-finish]").addEventListener("click", (e) => {
            if (finished) { route(); return; }
            finished = true;
            let score = 0;
            view.querySelectorAll("[data-q]").forEach((card) => {
                const qi = Number(card.dataset.q), q = t.questions[qi], a = answers[qi];
                const ok = a === q.correct;
                if (ok) score++;
                card.querySelectorAll(".q-opt").forEach((x) => {
                    x.disabled = true;
                    const i = Number(x.dataset.i);
                    if (i === q.correct) x.classList.add("correct");
                    else if (i === a) x.classList.add("wrong");
                });
                const fb = card.querySelector(".q-feedback");
                fb.className = "q-feedback " + (ok ? "ok" : "no");
                fb.hidden = false;
                card.querySelector(".q-mark").innerHTML = ok ? `<span class="pill green">✓ Doğru</span>` : `<span class="pill" style="background:var(--red-pale);color:var(--red)">${a === null ? "Boş" : "✗ Yanlış"}</span>`;
            });
            const n = t.questions.length, prev = testScores[t.id];
            testScores[t.id] = { best: Math.max(score, prev ? prev.best : 0), last: score };
            store.set("madam_tests", testScores);
            const pctv = Math.round((score / n) * 100);
            const msg = pctv === 100 ? "Mükemmel! Hepsi doğru 🎉" : pctv >= 70 ? "Çok iyi! Yanlışlarının açıklamalarına bir göz at." : pctv >= 40 ? "Fena değil. Yanlış yaptığın konuların derslerine dönmek iyi olur." : "Konuları tekrar edip yeniden dene — açıklamalar yardımcı olacak.";
            const res = view.querySelector("#testResult");
            res.innerHTML = `<div class="card" style="margin-bottom:16px;text-align:center">
                <div class="section-title">Sonuç</div>
                <div style="font-family:Sora,sans-serif;font-weight:800;font-size:44px;color:${pctv >= 70 ? "var(--green)" : pctv >= 40 ? "var(--orange)" : "var(--red)"}">${score} / ${n}</div>
                <div class="progress-bar" style="max-width:320px;margin:8px auto"><span style="width:${pctv}%"></span></div>
                <p style="margin:8px 0 14px">${msg}</p>
                <div class="ex-actions" style="justify-content:center"><button type="button" class="btn" data-retry>↻ Tekrar çöz</button><a class="btn ghost" href="#/testler">Testlere dön</a></div></div>`;
            res.querySelector("[data-retry]").addEventListener("click", () => route());
            e.target.textContent = "↻ Tekrar çöz";
            res.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function pageProblems(id) {
        const set = problemSets.find((x) => x.id === id);
        if (!set) return pageNotFound();
        const solBlock = (p) => {
            if (p.parts) {
                return p.parts.map((pt) => `<div class="ex-step"><span class="sn" style="width:auto;padding:0 8px;border-radius:12px">${pt.l}</span><div class="sb">
                    <div><b>Cevap:</b> ${pt.a}</div>
                    ${pt.s && pt.s.length ? `<div class="muted" style="margin-top:4px">${pt.s.join("<br>")}</div>` : ""}
                    ${pt.graph ? `<a class="btn small ghost" style="margin-top:8px" href="${graphLink(pt.graph)}">📈 Grafikte aç</a>` : ""}
                </div></div>`).join("");
            }
            return `<div class="ex-answer"><b>Cevap:</b> ${p.a}</div>` +
                (p.s || []).map((s, i) => `<div class="ex-step"><span class="sn">${i + 1}</span><div class="sb">${s}</div></div>`).join("");
        };
        const cards = set.problems.map((p) => {
            const key = `${set.id}#${p.no}`, isSolved = !!solved[key];
            const partsQ = p.parts ? `<div class="part-grid">${p.parts.map((pt) => `<div><b>(${pt.l})</b> ${pt.q}</div>`).join("")}</div>` : "";
            return `<div class="card problem${isSolved ? " solved" : ""}" data-key="${key}">
                <div class="box-title" style="color:var(--purple)">Problem ${p.no}
                    <button type="button" class="solve-toggle" data-solve>${isSolved ? "✓ Çözdüm" : "Çözdüm olarak işaretle"}</button></div>
                <div class="q-text">${p.q}</div>${partsQ}
                <div class="ex-actions">
                    <button type="button" class="btn small" data-show>💡 Çözümü göster</button>
                    ${p.graph ? `<a class="btn small ghost" href="${graphLink(p.graph)}">📈 Grafikte aç</a>` : ""}
                </div>
                <div class="ex-steps" data-sol hidden>
                    ${p.note ? `<div class="box warn" style="padding:10px 14px"><div class="box-title" style="margin-bottom:4px">⚠️ Not</div>${p.note}</div>` : ""}
                    ${solBlock(p)}
                </div>
            </div>`;
        }).join("");
        const n = solvedCount(set);
        return `
        <div class="page-head">
            <div class="crumbs"><a href="#/testler">Testler</a> › <span>${set.exam ? "Geçmiş sınavlar" : "Kitap problemleri"}</span></div>
            <h1>${esc(set.title)}</h1>
            <p>${set.source ? esc(set.source) : `Matematik 1, s. ${set.page}`}. Önce kendin çöz, sonra çözümü aç ve kontrol et.</p>
            <div style="display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap">
                <div class="progress-bar" style="flex:1;min-width:160px"><span data-pbar style="width:${Math.round((n / set.problems.length) * 100)}%"></span></div>
                <b style="color:var(--blue-deep);font-family:Sora,sans-serif" data-pcount>${n}/${set.problems.length} çözüldü</b>
                <button type="button" class="btn small ghost" data-allsol>Tüm çözümleri aç</button>
            </div>
        </div>
        <div class="lesson-body">${cards}</div>`;
    }

    function bindProblems(id) {
        const set = problemSets.find((x) => x.id === id);
        if (!set) return;
        const refresh = () => {
            const n = solvedCount(set);
            view.querySelector("[data-pcount]").textContent = `${n}/${set.problems.length} çözüldü`;
            view.querySelector("[data-pbar]").style.width = `${Math.round((n / set.problems.length) * 100)}%`;
        };
        view.querySelectorAll(".problem").forEach((card) => {
            const sol = card.querySelector("[data-sol]"), btn = card.querySelector("[data-show]");
            btn.addEventListener("click", () => {
                sol.hidden = !sol.hidden;
                btn.textContent = sol.hidden ? "💡 Çözümü göster" : "Çözümü gizle";
            });
            card.querySelector("[data-solve]").addEventListener("click", (e) => {
                const key = card.dataset.key;
                if (solved[key]) delete solved[key]; else solved[key] = true;
                store.set("madam_solved", solved);
                card.classList.toggle("solved", !!solved[key]);
                e.target.textContent = solved[key] ? "✓ Çözdüm" : "Çözdüm olarak işaretle";
                refresh();
            });
        });
        let allOpen = false;
        view.querySelector("[data-allsol]").addEventListener("click", (e) => {
            allOpen = !allOpen;
            view.querySelectorAll(".problem").forEach((card) => {
                card.querySelector("[data-sol]").hidden = !allOpen;
                card.querySelector("[data-show]").textContent = allOpen ? "Çözümü gizle" : "💡 Çözümü göster";
            });
            e.target.textContent = allOpen ? "Tüm çözümleri kapat" : "Tüm çözümleri aç";
        });
    }

    /* ---------------- Grafik & hesap sayfası ---------------- */
    const EXAMPLES = ["x^2", "sin(x)", "a*x^2+b*x+c", "f(x)=x^2-2x", "f(x-3)+1", "f'(x)", "2^x", "ln(x)", "[x]", "|x|", "log(2, 32)", "x = 2",
        "(x-1)^2+(y+2)^2=9", "x^2+y^2-4x+6y-3=0", "3x+4y=12", "A=(5,4)", "x^2/9+y^2/4=1"];
    const DEFAULT_GRAPH = { rows: ["f(x) = x^2 - 2x", "f(x - 3) + 1", "sin(pi/6)"], params: {}, pi: false };

    function pageGraph() {
        return `
        <div class="grapher">
            <div class="card grapher-panel">
                <div style="display:flex;align-items:center;gap:8px">
                    <h2 style="margin:0;font-size:19px;flex:1">Grafik &amp; Hesap</h2>
                    <button type="button" class="btn small ghost" data-clear title="Hepsini sil">Temizle</button>
                </div>
                <div id="exprList" style="display:flex;flex-direction:column;gap:10px"></div>
                <button type="button" class="btn small ghost" data-add>＋ Yeni ifade</button>
                <div id="paramBox" class="param-box" hidden></div>
                <div id="tanBox" class="param-box" hidden>
                    <div style="display:flex;align-items:center;gap:8px"><b style="flex:1">📐 Teğet ve türev</b><button type="button" class="expr-del" data-tan-close title="Kapat">×</button></div>
                    <div class="muted" data-tan-hint style="font-size:13px">Grafikte bir eğriye dokun (ya da tıkla): o noktadaki teğet çizilir.</div>
                    <div data-tan-ctrl hidden style="display:flex;flex-direction:column;gap:8px">
                        <div class="param-row"><span class="pn">x₀</span><input type="range" data-tan-x><span class="pv" data-tan-xv></span></div>
                        <label class="check"><input type="checkbox" data-tan-deriv> f′(x) grafiğini de göster</label>
                        <div class="readout" data-tan-out style="margin-top:0"></div>
                    </div>
                </div>
                <div>
                    <div class="section-title" style="margin:6px 0 8px">Örnekler (dokun, eklensin)</div>
                    <div class="chip-row" id="exampleRow">${EXAMPLES.map((e) => `<button type="button" class="chip" data-ex="${esc(e)}">${esc(e)}</button>`).join("")}</div>
                </div>
                <details class="help-box">
                    <summary>Nasıl yazılır?</summary>
                    <table>
                        <tr><td><code>x^2</code>, <code>2x</code>, <code>3(x+1)</code></td><td>üs, çarpma (∗ yazmasan da olur)</td></tr>
                        <tr><td><code>sqrt(x)</code>, <code>root(3, x)</code></td><td>karekök, küpkök</td></tr>
                        <tr><td><code>|x|</code> ya da <code>abs(x)</code></td><td>mutlak değer</td></tr>
                        <tr><td><code>[x]</code></td><td>tam kısım ⟦x⟧</td></tr>
                        <tr><td><code>sgn(x)</code></td><td>işaret fonksiyonu</td></tr>
                        <tr><td><code>sin cos tan cot sec csc</code></td><td>trigonometrik (radyan)</td></tr>
                        <tr><td><code>arcsin arccos arctan arccot</code></td><td>ters trigonometrik</td></tr>
                        <tr><td><code>sinh cosh tanh</code>, <code>arcsinh</code>…</td><td>hiperbolik</td></tr>
                        <tr><td><code>e^x</code>, <code>ln(x)</code>, <code>log(x)</code>, <code>log(2, x)</code></td><td>üstel, doğal log, 10 tabanı, 2 tabanı</td></tr>
                        <tr><td><code>pi</code>, <code>e</code></td><td>π ve e sayıları</td></tr>
                        <tr><td><code>f(x) = …</code></td><td>fonksiyon tanımla, alttaki satırlarda <code>f(x-2)</code> gibi kullan</td></tr>
                        <tr><td><code>a = 2</code></td><td>parametre; a'lı ifadelerde kaydırıcı çıkar</td></tr>
                        <tr><td><code>x = 3</code></td><td>dikey doğru</td></tr>
                        <tr><td><code>f'(x)</code>, <code>f''(x)</code></td><td>tanımlı f'nin 1. ve 2. türevi</td></tr>
                        <tr><td><code>(x-1)^2+(y+2)^2=9</code></td><td>çember: merkez ve yarıçap otomatik bulunur</td></tr>
                        <tr><td><code>x^2+y^2-4x+6y-3=0</code></td><td>genel denklemli çember</td></tr>
                        <tr><td><code>3x+4y=12</code></td><td>genel denklemli doğru (her türlü x, y denklemi çizilir)</td></tr>
                        <tr><td><code>A=(5,4)</code></td><td>nokta; çembere göre konumu ve teğetleri hesaplanır</td></tr>
                        <tr><td><b>f′</b> düğmesi</td><td>teğet aracı: eğriye dokun, teğeti ve eğimi gör</td></tr>
                        <tr><td><code>log(2, 32)</code></td><td>x yoksa sonucu hesaplar → 5</td></tr>
                    </table>
                    <p style="margin:8px 0 0">Ondalık için nokta kullan: <code>2.5</code>. Grafiği sürükle, tekerlek / iki parmakla yakınlaştır, çift tıkla başa dön.</p>
                </details>
            </div>
            <div class="card grapher-canvas">
                <div class="plot-wrap interactive"><canvas></canvas>
                    <div class="plot-tools">
                        <button class="plot-tool" type="button" data-z="in" title="Yakınlaştır">+</button>
                        <button class="plot-tool" type="button" data-z="out" title="Uzaklaştır">−</button>
                        <button class="plot-tool" type="button" data-z="home" title="Başa dön">⌂</button>
                        <button class="plot-tool" type="button" data-z="pi" title="x eksenini π cinsinden göster">π</button>
                        <button class="plot-tool" type="button" data-z="tan" title="Teğet aracı: eğriye dokun">f′</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function bindGraph(query) {
        const st = store.get("madam_grapher", DEFAULT_GRAPH);
        if (!Array.isArray(st.rows)) st.rows = DEFAULT_GRAPH.rows.slice();
        st.params = st.params || {};
        const fromLesson = query.get("e");
        if (fromLesson) {
            try {
                const list = JSON.parse(fromLesson);
                if (Array.isArray(list) && list.length) { st.rows = list.map(String); st.params = {}; }
            } catch (e) { /* bozuk bağlantı: kayıtlı listeyle devam */ }
            history.replaceState(null, "", "#/grafik");
        }
        let rows = st.rows.map((text, i) => ({ id: i + 1, text, visible: true }));
        let nextId = rows.length + 1;

        const list = view.querySelector("#exprList");
        const paramBox = view.querySelector("#paramBox");
        const canvas = view.querySelector(".grapher-canvas canvas");
        const plot = new Plot(canvas, { view: { xmin: -8, xmax: 8, ymin: -6, ymax: 6 }, interactive: true, equal: true, piAxis: !!st.pi });
        const piBtn = view.querySelector('[data-z="pi"]');
        piBtn.classList.toggle("on", !!st.pi);

        const colorOf = (i) => Plot.PALETTE[i % Plot.PALETTE.length];
        const save = () => store.set("madam_grapher", { rows: rows.map((r) => r.text), params: st.params, pi: plot.piAxis });

        function buildRows(focusId) {
            list.innerHTML = "";
            rows.forEach((r, i) => {
                const node = H.el(`<div class="expr-row" data-id="${r.id}">
                    <button type="button" class="expr-dot${r.visible ? "" : " off"}" style="color:${colorOf(i)}" title="Göster / gizle"></button>
                    <div class="expr-main"><input class="text-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="ör. x^2 - 1"><div class="expr-msg"></div></div>
                    <button type="button" class="expr-del" title="Sil">×</button></div>`);
                const input = node.querySelector("input");
                input.value = r.text;
                input.addEventListener("input", () => { r.text = input.value; update(); });
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { e.preventDefault(); addRow("", rows.indexOf(r) + 1); }
                });
                node.querySelector(".expr-dot").addEventListener("click", (e) => { r.visible = !r.visible; e.target.classList.toggle("off", !r.visible); update(); });
                node.querySelector(".expr-del").addEventListener("click", () => { rows = rows.filter((x) => x !== r); buildRows(); update(); });
                list.appendChild(node);
                if (r.id === focusId) setTimeout(() => input.focus(), 0);
            });
        }
        function addRow(text, at) {
            const r = { id: nextId++, text, visible: true };
            if (at === undefined) rows.push(r); else rows.splice(at, 0, r);
            buildRows(text ? undefined : r.id);
            update();
        }

        let paramKeys = "";
        function buildParams(names) {
            const key = names.join(",");
            if (key === paramKeys) return;
            paramKeys = key;
            paramBox.hidden = !names.length;
            paramBox.innerHTML = names.length ? `<div class="section-title" style="margin:0">Parametreler</div>` : "";
            names.forEach((n) => {
                const p = st.params[n];
                const node = H.el(`<div class="param-row"><span class="pn">${esc(n)}</span><input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}"><span class="pv">${MathParser.fmt(p.value, 2)}</span></div>`);
                const input = node.querySelector("input");
                input.addEventListener("input", () => {
                    p.value = Number(input.value);
                    node.querySelector(".pv").textContent = MathParser.fmt(p.value, 2);
                    // "a = 2" satırı varsa onu da güncelle
                    const r = rows.find((x) => { const c = MathParser.classify(x.text); return c.kind === "param" && c.name === n; });
                    if (r) {
                        r.text = `${n} = ${p.value}`;
                        const inp = list.querySelector(`[data-id="${r.id}"] input`);
                        if (inp) inp.value = r.text;
                    }
                    update(true);
                });
                paramBox.appendChild(node);
            });
        }

        /* ---------- Analitik geometri yardımcıları ---------- */
        const G = (v) => MathParser.fmt(v, 3);
        const near = (u, v, tol) => Math.abs(u - v) <= (tol || 1e-7) * (1 + Math.abs(u) + Math.abs(v));
        const radText = (r) => {
            const r2 = r * r;
            if (Math.abs(r - Math.round(r)) < 1e-9) return G(r);
            if (Math.abs(r2 - Math.round(r2)) < 1e-9) return `√${Math.round(r2)} ≈ ${G(r)}`;
            return G(r);
        };
        // [[katsayı, "x"], ...] → "2x − 3" gibi okunur ifade
        function poly(terms) {
            let out = "";
            terms.forEach(([v, s]) => {
                if (Math.abs(v) < 1e-12) return;
                const c = (s && Math.abs(Math.abs(v) - 1) < 1e-12 ? "" : G(Math.abs(v))) + s;
                out += out ? (v < 0 ? " − " : " + ") + c : (v < 0 ? "−" : "") + c;
            });
            return out || "0";
        }
        const sq = (name, c) => (Math.abs(c) < 1e-12 ? `${name}²` : `(${name} ${c > 0 ? "−" : "+"} ${G(Math.abs(c))})²`);
        const stdCircle = (a, b, r) => `${sq("x", a)} + ${sq("y", b)} = ${G(r * r)}`;
        const genCircle = (a, b, r) => `${poly([[1, "x²"], [1, "y²"], [-2 * a, "x"], [-2 * b, "y"], [a * a + b * b - r * r, ""]])} = 0`;
        function lineText(A, B, C) {
            if (Math.abs(B) < 1e-12) return `dikey doğru x = ${G(-C / A)} (eğim tanımsız)`;
            const m = -A / B, n = -C / B;
            return `y = ${poly([[m, "x"], [n, ""]])} · eğim m = ${G(m)}`;
        }
        function lineItem(A, B, C, color, dash, width) {
            if (Math.abs(B) < 1e-12) return { type: "vline", x: -C / A, color, width: width || 2, dash: dash ? [6, 5] : false };
            return { type: "fn", f: (x) => -(A * x + C) / B, color, width: width || 2, dash: dash ? [6, 5] : false, trace: false };
        }
        const circleItem = (a, b, r, color) => ({ type: "param", x: (t) => a + r * Math.cos(t), y: (t) => b + r * Math.sin(t), t0: 0, t1: 2 * Math.PI, color, width: 2.8, steps: 360 });

        // F(x, y)'yi Ax² + Bxy + Cy² + Dx + Ey + F₀ olarak tanımaya çalış
        function quadFit(F) {
            const c0 = F(0, 0), fx1 = F(1, 0), fxm = F(-1, 0), fy1 = F(0, 1), fym = F(0, -1);
            const A = (fx1 + fxm - 2 * c0) / 2, D = (fx1 - fxm) / 2, C = (fy1 + fym - 2 * c0) / 2, E = (fy1 - fym) / 2;
            const B = (F(1, 1) - F(1, -1) - F(-1, 1) + F(-1, -1)) / 4;
            if (![c0, A, B, C, D, E].every(isFinite)) return null;
            const Q = (x, y) => A * x * x + B * x * y + C * y * y + D * x + E * y + c0;
            const scale = 1 + Math.abs(A) + Math.abs(B) + Math.abs(C) + Math.abs(D) + Math.abs(E) + Math.abs(c0);
            for (const [x, y] of [[0.7, -1.3], [2.1, 0.4], [-1.7, 2.2], [3.3, -2.9], [-4.1, -3.6]]) {
                const v = F(x, y);
                if (!isFinite(v) || Math.abs(v - Q(x, y)) > 1e-7 * (scale + Math.abs(v))) return null;
            }
            const z = (v) => Math.abs(v) < 1e-9 * scale;
            if (z(A) && z(B) && z(C)) return z(D) && z(E) ? null : { kind: "line", A: D, B: E, C: c0 };
            if (z(B) && near(A, C, 1e-9) && !z(A)) {
                const a = -D / (2 * A), b = -E / (2 * A), r2 = a * a + b * b - c0 / A;
                if (r2 > 1e-9 * scale) return { kind: "circle", a, b, r: Math.sqrt(r2) };
                if (r2 > -1e-9 * scale) return { kind: "pointc", a, b };
                return { kind: "empty" };
            }
            const disc = B * B - 4 * A * C;
            return { kind: "conic", type: Math.abs(disc) < 1e-9 * scale * scale ? "Parabol" : disc < 0 ? "Elips" : "Hiperbol", disc };
        }
        // y = f(x) bir doğru mu? (Ax + By + C = 0 biçiminde döndürür)
        function asLine(f) {
            const y0 = f(0), y1 = f(1), ym = f(-1), y3 = f(3.7);
            if (![y0, y1, ym, y3].every(isFinite)) return null;
            const m = y1 - y0;
            if (!near(y0 - ym, m, 1e-9) || !near(y3, y0 + 3.7 * m, 1e-9)) return null;
            return { A: m, B: -1, C: y0 };
        }
        const lineName = (l) => l.r.text.trim();
        const dot = (x, y) => ({ type: "point", x, y, color: "#0b2a3c", r: 4 });

        function analyzeCircles(circles, lines, points, items, msgs) {
            circles.forEach((ci, idx) => {
                const { a, b, rad } = ci, tol = 1e-6 * (1 + rad), out = [];
                lines.forEach((l) => {
                    const nrm = l.A * l.A + l.B * l.B, s = l.A * a + l.B * b + l.C, d = Math.abs(s) / Math.sqrt(nrm);
                    const hx = a - (l.A * s) / nrm, hy = b - (l.B * s) / nrm;
                    let txt = `↔ ${lineName(l)}: merkeze uzaklık ℓ = ${G(d)}`;
                    if (d < rad - tol) {
                        const h = Math.sqrt(rad * rad - d * d), ux = -l.B / Math.sqrt(nrm), uy = l.A / Math.sqrt(nrm);
                        const p1 = [hx + h * ux, hy + h * uy], p2 = [hx - h * ux, hy - h * uy];
                        txt += ` < r → iki noktada keser: (${G(p1[0])}, ${G(p1[1])}), (${G(p2[0])}, ${G(p2[1])}) · kiriş = ${G(2 * h)}`;
                        if (ci.r.visible && l.r.visible) items.push(dot(...p1), dot(...p2));
                    } else if (Math.abs(d - rad) <= tol) {
                        txt += ` = r → teğet, değme noktası (${G(hx)}, ${G(hy)})`;
                        if (ci.r.visible && l.r.visible) items.push(dot(hx, hy));
                    } else txt += ` > r → kesmez (en kısa uzaklık ${G(d - rad)})`;
                    out.push(txt);
                });
                points.forEach((p) => {
                    const dx = p.x - a, dy = p.y - b, e = Math.hypot(dx, dy);
                    let txt = `• ${p.name}: |${p.name.length < 4 ? p.name : "P"}M| = ${G(e)}`;
                    if (Math.abs(e - rad) <= tol) {
                        const A = dx, B = dy, C = -A * a - B * b - rad * rad;
                        txt += ` = r → çember üzerinde; teğet: ${lineText(A, B, C).split(" · ")[0]}`;
                        if (ci.r.visible && p.r.visible) items.push(lineItem(A, B, C, Plot.COLORS.orange, true));
                    } else if (e < rad) txt += ` < r → çemberin içinde (teğet çizilemez)`;
                    else {
                        const al = Math.acos(rad / e), ph = Math.atan2(dy, dx);
                        txt += ` > r → dışında; teğet uzunluğu √(|PM|² − r²) = ${G(Math.sqrt(e * e - rad * rad))}`;
                        if (ci.r.visible && p.r.visible) [ph + al, ph - al].forEach((t) => {
                            const tx = a + rad * Math.cos(t), ty = b + rad * Math.sin(t);
                            const A = ty - p.y, B = p.x - tx, C = -(A * p.x + B * p.y);
                            items.push(lineItem(A, B, C, Plot.COLORS.orange, true), dot(tx, ty));
                        });
                    }
                    out.push(txt);
                });
                circles.forEach((cj, j) => {
                    if (j >= idx) return;
                    const d = Math.hypot(cj.a - a, cj.b - b), r1 = cj.rad, r2 = rad;
                    let txt = `○ ${lineName(cj)} ile: merkezler arası d = ${G(d)}`;
                    if (d < tol && Math.abs(r1 - r2) <= tol) txt += " → aynı çember";
                    else if (d < tol) txt += " → eş merkezli (kesişmez)";
                    else if (d > r1 + r2 + tol) txt += ` > r₁ + r₂ → dışarıda, kesişmez`;
                    else if (Math.abs(d - (r1 + r2)) <= tol) txt += ` = r₁ + r₂ → dıştan teğet`;
                    else if (d < Math.abs(r1 - r2) - tol) txt += ` < |r₁ − r₂| → biri diğerinin içinde`;
                    else if (Math.abs(d - Math.abs(r1 - r2)) <= tol) txt += ` = |r₁ − r₂| → içten teğet`;
                    else {
                        const aa = (d * d + r1 * r1 - r2 * r2) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - aa * aa));
                        const ux = (a - cj.a) / d, uy = (b - cj.b) / d, mx = cj.a + aa * ux, my = cj.b + aa * uy;
                        const p1 = [mx - h * uy, my + h * ux], p2 = [mx + h * uy, my - h * ux];
                        txt += ` → iki noktada kesişir: (${G(p1[0])}, ${G(p1[1])}), (${G(p2[0])}, ${G(p2[1])})`;
                        if (ci.r.visible && cj.r.visible) items.push(dot(...p1), dot(...p2));
                    }
                    out.push(txt);
                });
                if (out.length) msgs[ci.r.id].t += "\n" + out.join("\n");
            });
        }

        /* ---------- Teğet aracı ---------- */
        let fnCurves = {};
        const tan = { on: false, rowId: null, x0: 0, deriv: false };
        const tanBox = view.querySelector("#tanBox"), tanBtn = view.querySelector('[data-z="tan"]');
        const tanX = tanBox.querySelector("[data-tan-x]"), tanXv = tanBox.querySelector("[data-tan-xv]");
        const tanOut = tanBox.querySelector("[data-tan-out]");
        // Görünüm genişliğine göre "yuvarlak" adım: 16 birimlik görünümde 0,1
        const snapStep = () => Math.pow(10, Math.floor(Math.log10((plot.view.xmax - plot.view.xmin) / 50)));
        const snap = (v, s) => Number((Math.round(v / s) * s).toFixed(10));
        function setTanRange() {
            const v = plot.view, s = snapStep();
            tanX.min = snap(v.xmin, s); tanX.max = snap(v.xmax, s); tanX.step = s;
            tanX.value = tan.x0;
        }
        function drawTangent(items) {
            const cur = tan.on && tan.rowId !== null ? fnCurves[tan.rowId] : null;
            tanBox.querySelector("[data-tan-hint]").hidden = !!cur;
            tanBox.querySelector("[data-tan-ctrl]").hidden = !cur;
            if (!cur) return;
            const f = cur.f, x0 = tan.x0, y0 = f(x0);
            tanXv.textContent = G(x0);
            if (tan.deriv) {
                items.push({ type: "fn", f: (x) => { const h = 1e-5 * Math.max(1, Math.abs(x)); return (f(x + h) - f(x - h)) / (2 * h); }, color: cur.color, width: 2, dash: [7, 5], label: "f′(x)", trace: false });
            }
            if (!isFinite(y0)) { tanOut.innerHTML = `<span class="bad">x₀ = ${G(x0)} noktasında fonksiyon tanımsız.</span>`; return; }
            const h = 1e-5 * Math.max(1, Math.abs(x0)), m = (f(x0 + h) - f(x0 - h)) / (2 * h);
            const hs = 1e-6 * Math.max(1, Math.abs(x0)), dl = (y0 - f(x0 - hs)) / hs, dr = (f(x0 + hs) - y0) / hs;
            items.push({ type: "point", x: x0, y: y0, color: Plot.COLORS.orange, label: `(${G(x0)}, ${G(y0)})` });
            if (!isFinite(dl) || !isFinite(dr) || Math.abs(dl - dr) > 1e-3 * (1 + Math.abs(dl) + Math.abs(dr))) {
                tanOut.innerHTML = `<span class="bad">Bu noktada türev yok:</span> soldan eğim ≈ ${G(dl)}, sağdan eğim ≈ ${G(dr)} — farklı (köşe noktası). Tek bir teğet çizilemez.`;
                return;
            }
            const n = y0 - m * x0;
            items.push({ type: "fn", f: (x) => y0 + m * (x - x0), color: Plot.COLORS.orange, width: 2.4, trace: false });
            items.push({ type: "seg", x1: x0, y1: y0, x2: x0 + 1, y2: y0, color: Plot.COLORS.green, dash: [4, 4], width: 2, label: "1", labelOffset: [0, m >= 0 ? 12 : -12] });
            items.push({ type: "seg", x1: x0 + 1, y1: y0, x2: x0 + 1, y2: y0 + m, color: Plot.COLORS.pink, dash: [4, 4], width: 2, label: `m = ${G(m)}`, labelOffset: [40, 0] });
            const deg = (Math.atan(m) * 180) / Math.PI;
            const texN = (v) => G(v).replace("−", "-");
            const eq = "y = " + poly([[m, "x"], [n, ""]]).replace(/−/g, "-");
            tanOut.innerHTML = `<b>${esc(cur.text)}</b><br>` +
                H.tex(`f(${texN(x0)}) = ${texN(y0)},\\quad f'(${texN(x0)}) \\approx ${texN(m)}`) + "<br>" +
                `Teğet: ${H.tex(eq)}<br>Eğim açısı θ = arctan m ≈ ${G(deg)}° ` +
                (Math.abs(m) < 1e-6 ? `<span class="good">(yatay teğet: tepe/çukur adayı)</span>` : m > 0 ? `<span class="good">(artan)</span>` : `<span class="bad">(azalan)</span>`);
        }
        plot.onTap = (x, y, px, py) => {
            if (!tan.on) return false;
            let best = null, bestD = Infinity;
            Object.keys(fnCurves).forEach((id) => {
                const yy = fnCurves[id].f(x);
                if (!isFinite(yy)) return;
                const d = Math.abs(plot.Y(yy) - py);
                if (d < bestD) { bestD = d; best = id; }
            });
            if (best === null || bestD > 60) { toast("Teğet için bir eğrinin üzerine dokun"); return true; }
            tan.rowId = Number(best); tan.x0 = snap(x, snapStep());
            setTanRange();
            update(true);
            return true;
        };
        tanBtn.addEventListener("click", () => {
            tan.on = !tan.on;
            tanBtn.classList.toggle("on", tan.on);
            tanBox.hidden = !tan.on;
            if (tan.on) toast("Teğet aracı açık: bir eğriye dokun");
            update(true);
        });
        tanBox.querySelector("[data-tan-close]").addEventListener("click", () => tanBtn.click());
        tanX.addEventListener("input", () => { tan.x0 = snap(Number(tanX.value), Number(tanX.step)); update(true); });
        tanBox.querySelector("[data-tan-deriv]").addEventListener("change", (e) => { tan.deriv = e.target.checked; update(true); });

        function update(fromSlider) {
            const userFns = {};
            const env = {};
            const msgs = {};
            const compiled = [];
            const free = new Set();
            const defined = new Set();

            rows.forEach((r) => {
                if (!r.text.trim()) { msgs[r.id] = { t: "", c: "" }; return; }
                const c = MathParser.classify(r.text);
                if (c.kind === "param") {
                    defined.add(c.name);
                    const v = Number(c.body);
                    if (!st.params[c.name]) st.params[c.name] = { value: v, min: Math.min(-5, v), max: Math.max(5, v), step: 0.1 };
                    else if (!fromSlider) {
                        const p = st.params[c.name];
                        p.value = v; p.min = Math.min(p.min, v); p.max = Math.max(p.max, v);
                    }
                    msgs[r.id] = { t: "parametre (aşağıdaki kaydırıcıyla değiştir)", c: "" };
                }
            });

            rows.forEach((r, i) => {
                if (!r.text.trim()) return;
                const c = MathParser.classify(r.text);
                if (c.kind === "param") return;
                try {
                    let comp;
                    if (c.kind === "implicit") {
                        const L = MathParser.compile(c.lhs, userFns), Rr = MathParser.compile(c.rhs, userFns);
                        comp = { L, R: Rr, vars: Array.from(new Set([...L.vars, ...Rr.vars])) };
                    } else if (c.kind === "point") {
                        const X = MathParser.compile(c.xs, userFns), Y = MathParser.compile(c.ys, userFns);
                        comp = { X, Y, vars: Array.from(new Set([...X.vars, ...Y.vars])) };
                    } else comp = MathParser.compile(c.body, userFns);
                    const own = c.kind === "def" ? c.param : "x";
                    comp.vars.forEach((v) => { if (v !== own && v !== "x" && v !== "y") free.add(v); });
                    if (c.kind === "def") {
                        userFns[c.name] = { fn: comp.fn, param: c.param, vars: comp.vars };
                        msgs[r.id] = { t: `${c.name} fonksiyonu tanımlandı — alt satırlarda ${c.name}(…) olarak kullanabilirsin`, c: "" };
                    }
                    compiled.push({ r, i, c, comp });
                } catch (e) {
                    msgs[r.id] = { t: e instanceof MathParser.ParseError ? e.message : "İfade anlaşılamadı", c: "err" };
                }
            });

            const names = Array.from(free).filter((n) => !userFns[n]).sort();
            names.forEach((n) => { if (!st.params[n]) st.params[n] = { value: 1, min: -5, max: 5, step: 0.1 }; });
            const shown = Array.from(new Set([...names, ...defined])).sort();
            shown.forEach((n) => (env[n] = st.params[n].value));
            buildParams(shown);

            const items = [];
            const circles = [], lines = [], points = [];
            fnCurves = {};
            compiled.forEach(({ r, i, c, comp }) => {
                const color = colorOf(i);
                if (c.kind === "point") {
                    const px = comp.X.fn(env), py = comp.Y.fn(env);
                    const nm = c.name || `(${G(px)}, ${G(py)})`;
                    msgs[r.id] = { t: `Nokta ${c.name ? c.name : ""}(${G(px)}, ${G(py)})`, c: "" };
                    if (isFinite(px) && isFinite(py)) {
                        points.push({ r, x: px, y: py, name: nm, color });
                        if (r.visible) items.push({ type: "point", x: px, y: py, color, label: c.name || "" });
                    }
                    return;
                }
                if (c.kind === "implicit") {
                    const Fxy = (x, y) => { env.x = x; env.y = y; return comp.L.fn(env) - comp.R.fn(env); };
                    const q = quadFit(Fxy);
                    if (q && q.kind === "circle") {
                        circles.push({ r, a: q.a, b: q.b, rad: q.r, color, msg: [] });
                        msgs[r.id] = { t: `Çember · merkez M(${G(q.a)}, ${G(q.b)}), yarıçap r = ${radText(q.r)}\nStandart: ${stdCircle(q.a, q.b, q.r)}\nGenel: ${genCircle(q.a, q.b, q.r)}`, c: "" };
                        if (r.visible) items.push(circleItem(q.a, q.b, q.r, color), { type: "point", x: q.a, y: q.b, color, r: 3.5 });
                    } else if (q && q.kind === "line") {
                        lines.push({ r, A: q.A, B: q.B, C: q.C, color });
                        msgs[r.id] = { t: `Doğru · ${lineText(q.A, q.B, q.C)}`, c: "" };
                        if (r.visible) items.push(lineItem(q.A, q.B, q.C, color, false, 2.8));
                    } else if (q && q.kind === "pointc") {
                        msgs[r.id] = { t: `Yarıçap 0: tek nokta (${G(q.a)}, ${G(q.b)})`, c: "" };
                        if (r.visible) items.push({ type: "point", x: q.a, y: q.b, color });
                    } else if (q && q.kind === "empty") {
                        msgs[r.id] = { t: "Bu denklemi sağlayan reel nokta yok (r² < 0)", c: "err" };
                    } else {
                        msgs[r.id] = { t: q && q.kind === "conic" ? `${q.type} (ikinci dereceden eğri; B² − 4AC ${q.type === "Parabol" ? "=" : q.type === "Elips" ? "<" : ">"} 0)` : "Kapalı eğri: F(x, y) = 0", c: "" };
                        if (r.visible) items.push({ type: "implicit", F: Fxy, color });
                    }
                    return;
                }
                const own = c.kind === "def" ? c.param : "x";
                const usesX = comp.vars.includes(own);
                if (c.kind === "vline") {
                    const v = comp.fn(env);
                    msgs[r.id] = msgs[r.id] || { t: `dikey doğru x = ${MathParser.fmt(v)}`, c: "" };
                    lines.push({ r, A: 1, B: 0, C: -v, color });
                    if (r.visible) items.push({ type: "vline", x: v, color, width: 2.4, dash: false });
                    return;
                }
                if (!usesX && c.kind !== "def" && !/^\s*y\s*=/.test(r.text)) {
                    const v = comp.fn(env);
                    const pf = MathParser.piFrac(v);
                    msgs[r.id] = { t: "= " + MathParser.fmt(v, 6) + (pf && pf !== "0" && !/^-?\d+$/.test(String(v)) ? `  (${pf})` : ""), c: "val" };
                    return;
                }
                const f = (x) => { env[own] = x; return comp.fn(env); };
                if (r.visible) items.push({ type: "fn", f, color, width: 2.8 });
                if (!msgs[r.id]) msgs[r.id] = { t: "", c: "" };
                if (r.visible) fnCurves[r.id] = { f, color, text: r.text.trim() };
                const ln = c.kind === "expr" ? asLine(f) : null;
                if (ln) lines.push({ r, A: ln.A, B: ln.B, C: ln.C, color });
            });

            analyzeCircles(circles, lines, points, items, msgs);
            drawTangent(items);

            rows.forEach((r) => {
                const node = list.querySelector(`[data-id="${r.id}"]`);
                if (!node) return;
                const m = msgs[r.id] || { t: "", c: "" };
                const msg = node.querySelector(".expr-msg");
                msg.textContent = m.t;
                msg.className = "expr-msg " + m.c;
                node.querySelector("input").classList.toggle("err", m.c === "err");
            });
            plot.setItems(items);
            save();
        }

        view.querySelector("[data-add]").addEventListener("click", () => addRow(""));
        view.querySelector("[data-clear]").addEventListener("click", () => { rows = []; st.params = {}; addRow(""); });
        view.querySelectorAll("[data-ex]").forEach((b) => b.addEventListener("click", () => {
            const empty = rows.find((r) => !r.text.trim());
            if (empty) { empty.text = b.dataset.ex; buildRows(); update(); } else addRow(b.dataset.ex);
            toast(`“${b.dataset.ex}” eklendi`);
        }));
        view.querySelector('[data-z="in"]').addEventListener("click", () => plot.zoom(0.7));
        view.querySelector('[data-z="out"]').addEventListener("click", () => plot.zoom(1.4));
        view.querySelector('[data-z="home"]').addEventListener("click", () => plot.reset());
        piBtn.addEventListener("click", () => { plot.piAxis = !plot.piAxis; piBtn.classList.toggle("on", plot.piAxis); plot.draw(); save(); });

        if (!rows.length) rows.push({ id: nextId++, text: "", visible: true });
        buildRows();
        update();
    }

    function pageNotFound() {
        return `<div class="card empty-note"><h2>Sayfa bulunamadı</h2><p>Aradığın sayfa yok ya da taşınmış.</p><a class="btn" href="#/">Ana sayfaya dön</a></div>`;
    }

    /* ---------------- Yönlendirme ---------------- */
    function parseHash() {
        const raw = (location.hash || "#/").slice(1);
        const [path, qs] = raw.split("?");
        const parts = path.split("/").filter(Boolean);
        return { parts, query: new URLSearchParams(qs || "") };
    }

    function route() {
        const { parts, query } = parseHash();
        const page = parts[0] || "home";
        let html, after = null, navKey = page;
        if (page === "home") html = pageHome();
        else if (page === "konular") { html = pageChapters(); navKey = "konu"; }
        else if (page === "konu") html = pageChapter(parts[1]);
        else if (page === "ozet") {
            html = pageSummary(parts[1]); navKey = "konu";
            after = () => { const b = view.querySelector("[data-print]"); if (b) b.addEventListener("click", () => window.print()); };
        }
        else if (page === "ders") { html = pageLesson(parts[1]); after = () => bindLesson(parts[1]); navKey = "konu"; }
        else if (page === "grafik") { html = pageGraph(); after = () => bindGraph(query); }
        else if (page === "testler") html = pagePractice();
        else if (page === "test") { html = pageTest(parts[1]); after = () => bindTest(parts[1]); navKey = "testler"; }
        else if (page === "problemler") { html = pageProblems(parts[1]); after = () => bindProblems(parts[1]); navKey = "testler"; }
        else html = pageNotFound();

        view.classList.add("page-fade");
        view.classList.toggle("wide", page === "grafik");
        view.innerHTML = html;
        renderMath(view);
        if (after) after();
        Plot.prune();
        requestAnimationFrame(() => view.classList.remove("page-fade"));
        window.scrollTo(0, 0);

        document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === navKey));
        updateSidebar();
        syncInstallButtons();
        document.title = page === "ders" && lessonById[parts[1]] ? `${lessonById[parts[1]].title} · Madam` : page === "grafik" ? "Grafik & Hesap · Madam" : navKey === "testler" ? "Testler · Madam" : "Madam Matematik";
    }

    function updateSidebar() {
        const el = document.getElementById("sidebarProgress");
        el.innerHTML = `<div class="sp-label">Toplam ilerleme</div><div class="sp-value">%${pct()}</div><div class="progress-bar"><span style="width:${pct()}%"></span></div>
            <div class="muted" style="font-size:12px;margin:6px 0 12px">${doneCount()} / ${lessons.length} ders tamamlandı</div>
            ${chapters.map((ch) => `<a href="#/konu/${ch.id}" style="display:block;margin-top:8px;color:var(--ink-soft);font-size:12px;font-weight:700">${ch.no}. ${esc(ch.title)} <span style="float:right">${doneCount(ch)}/${chapterLessons(ch).length}</span>
                <div class="progress-bar" style="height:5px;margin-top:4px"><span style="width:${pct(ch)}%"></span></div></a>`).join("")}`;
    }

    /* ---------------- Tema ---------------- */
    function applyThemeIcons() {
        const dark = document.documentElement.getAttribute("data-theme") === "dark";
        document.querySelectorAll("[data-theme-toggle]").forEach((b) => (b.textContent = dark ? "☀️" : "🌙"));
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", dark ? "#182530" : "#00aff0");
    }
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("madam_theme", next); } catch (e) { /* yok say */ }
        applyThemeIcons();
        Plot.redrawAll();
    }));

    /* ---------------- PWA: service worker + yükleme ---------------- */
    let installEvt = null;
    function syncInstallButtons() {
        document.querySelectorAll("[data-install]").forEach((b) => {
            b.hidden = !installEvt;
            if (!b._bound) {
                b._bound = true;
                b.addEventListener("click", async () => {
                    if (!installEvt) return;
                    installEvt.prompt();
                    try { await installEvt.userChoice; } catch (e) { /* yok say */ }
                    installEvt = null;
                    syncInstallButtons();
                });
            }
        });
    }
    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; syncInstallButtons(); });
    window.addEventListener("appinstalled", () => { installEvt = null; syncInstallButtons(); toast("Uygulama yüklendi 🎉"); });
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
        window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { /* çevrimdışı destek olmadan devam */ }));
    }

    window.addEventListener("hashchange", route);
    applyThemeIcons();
    route();
})();
