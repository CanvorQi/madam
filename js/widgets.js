/*
 * Widgets - derslerin içine gömülen etkileşimli araçlar.
 * Her araç: Widgets[name](root, opts)  -> root içine kendi arayüzünü kurar.
 */
(function (global) {
    "use strict";

    const C = Plot.COLORS;
    const fmt = (v, d) => MathParser.fmt(v, d);

    function el(html) {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }
    function tex(s, display) {
        if (global.katex) {
            try { return katex.renderToString(String(s), { throwOnError: false, displayMode: !!display }); } catch (e) { /* düz metne düş */ }
        }
        return String(s);
    }
    function texNum(v, d) {
        if (!isFinite(v)) return isNaN(v) ? "\\text{tanımsız}" : (v > 0 ? "\\infty" : "-\\infty");
        return fmt(v, d).replace("−", "-");
    }
    function signed(v) { return v < 0 ? `- ${texNum(-v)}` : `+ ${texNum(v)}`; }

    function openInGrapher(exprs) {
        location.hash = "#/grafik?e=" + encodeURIComponent(JSON.stringify(exprs));
    }

    function makePlot(root, o) {
        o = o || {};
        const wrap = el(`<div class="plot-wrap" style="height:${o.height || 300}px"><canvas></canvas><div class="plot-tools"></div></div>`);
        root.appendChild(wrap);
        const plot = new Plot(wrap.querySelector("canvas"), o);
        const tools = wrap.querySelector(".plot-tools");
        const btn = (label, title, fn) => {
            const b = el(`<button class="plot-tool" type="button" title="${title}">${label}</button>`);
            b.addEventListener("click", fn);
            tools.appendChild(b);
            return b;
        };
        if (o.zoom !== false) {
            btn("+", "Yakınlaştır", () => plot.zoom(0.75));
            btn("−", "Uzaklaştır", () => plot.zoom(1.33));
            btn("⌂", "Başa dön", () => plot.reset());
        }
        if (o.exprs) btn("↗", "Grafik çizicide aç", () => openInGrapher(o.exprs()));
        return plot;
    }

    function slider(parent, o, onInput) {
        const show = o.format || ((v) => fmt(v, 3));
        const node = el(`<label class="ctrl"><span class="ctrl-label"><span>${o.label}</span><span class="val"></span></span>
            <input type="range" min="${o.min}" max="${o.max}" step="${o.step || 0.1}" value="${o.value}"></label>`);
        const input = node.querySelector("input"), val = node.querySelector(".val");
        const update = () => { val.innerHTML = show(Number(input.value)); };
        input.addEventListener("input", () => { update(); onInput(Number(input.value)); });
        update();
        parent.appendChild(node);
        return {
            node, input,
            get: () => Number(input.value),
            set: (v) => { input.value = v; update(); },
            setRange: (min, max) => { input.min = min; input.max = max; update(); },
        };
    }

    function chips(parent, labels, active, onChange) {
        const row = el(`<div class="chip-row"></div>`);
        const btns = labels.map((lb, i) => {
            const b = el(`<button type="button" class="chip${i === active ? " active" : ""}">${lb}</button>`);
            b.addEventListener("click", () => {
                btns.forEach((x) => x.classList.remove("active"));
                b.classList.add("active");
                onChange(i);
            });
            row.appendChild(b);
            return b;
        });
        parent.appendChild(row);
        return row;
    }

    function textInput(parent, label, value, onChange) {
        const node = el(`<label class="ctrl"><span class="ctrl-label"><span>${label}</span></span><input class="text-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off"></label>`);
        const input = node.querySelector("input");
        input.value = value;
        input.addEventListener("input", () => onChange(input.value, input));
        parent.appendChild(node);
        return input;
    }

    function safeFx(expr, input) {
        try {
            const f = MathParser.fx(expr);
            if (input) input.classList.remove("err");
            return f;
        } catch (e) {
            if (input) input.classList.add("err");
            return null;
        }
    }

    function deriv(f, x) { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); }

    const W = {};

    /* ---------------- Genel grafik: ifadeler + parametre kaydırıcıları ---------------- */
    W.graph = function (root, o) {
        const params = {};
        const pdefs = o.params || {};
        Object.keys(pdefs).forEach((k) => (params[k] = pdefs[k].value));
        let presetIndex = 0;
        let fns = o.presets ? o.presets[0].fns : o.fns;

        if (o.presets) chips(root, o.presets.map((p) => p.label), 0, (i) => {
            presetIndex = i;
            fns = o.presets[i].fns;
            if (o.presets[i].view) plot.setView(o.presets[i].view);
            build();
        });

        const plot = makePlot(root, {
            view: (o.presets && o.presets[0].view) || o.view, piAxis: o.piAxis, equal: o.equal, height: o.height,
            exprs: () => {
                const list = fns.filter((d) => !d.noExport).map((d) => d.expr);
                Object.keys(params).forEach((k) => { if (list.some((e) => e.includes(k))) list.push(`${k} = ${params[k]}`); });
                return list;
            },
        });
        if (o.presets) plot.canvas.parentElement.style.marginTop = "12px";

        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        Object.keys(pdefs).forEach((k) => {
            const d = pdefs[k];
            slider(ctrls, { label: d.label || k, min: d.min, max: d.max, step: d.step, value: d.value, format: d.format }, (v) => {
                params[k] = v;
                render();
            });
        });
        if (!Object.keys(pdefs).length) ctrls.remove();
        const readout = o.readout ? el(`<div class="readout"></div>`) : null;
        if (readout) root.appendChild(readout);

        let compiled = [];
        function build() {
            compiled = fns.map((d) => {
                let f;
                try { f = MathParser.fx(d.expr, params); } catch (e) { f = () => NaN; f.env = {}; }
                return Object.assign({}, d, { f });
            });
            render();
        }
        function render() {
            compiled.forEach((c) => Object.assign(c.f.env, params));
            const items = [];
            (o.shade || []).forEach(([a, b]) => items.push({ type: "shadeX", a, b }));
            compiled.forEach((c, i) => items.push({
                type: "fn", f: c.f, color: c.color || Plot.PALETTE[i % Plot.PALETTE.length],
                label: typeof c.label === "function" ? c.label(params) : c.label,
                dash: c.dash, width: c.width, xmin: c.xmin, xmax: c.xmax, alpha: c.alpha, trace: c.trace,
            }));
            if (o.extras) items.push(...o.extras(params, compiled, presetIndex));
            plot.setItems(items);
            if (readout) readout.innerHTML = o.readout(params, compiled, { tex, fmt, texNum, presetIndex });
        }
        build();
    };

    /* ---------------- Fonksiyon makinesi ---------------- */
    W.machine = function (root, o) {
        const rules = o.rules;
        let ri = 0, f = MathParser.fx(rules[0].expr);
        const pairs = [];
        chips(root, rules.map((r) => tex(r.tex)), 0, (i) => {
            ri = i; f = MathParser.fx(rules[i].expr); pairs.length = 0; run(false);
        });
        const mach = el(`<div class="machine">
            <div class="m-in"><span class="m-lbl">girdi (x)</span><span class="xin"></span></div>
            <span class="m-arrow">➜</span>
            <div class="m-box"><div class="mk"><span class="gear">⚙️</span> Fonksiyon makinesi</div><div class="rule"></div></div>
            <span class="m-arrow">➜</span>
            <div class="m-out"><span class="m-lbl">çıktı f(x)</span><span class="yout"></span></div>
        </div>`);
        root.appendChild(mach);
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sx = slider(ctrls, { label: "Girdi x", min: -4, max: 4, step: 1, value: 2, format: (v) => fmt(v) }, () => run(false));
        const actions = el(`<div class="ex-actions"><button type="button" class="btn small">⚙️ Makineye at</button><button type="button" class="btn small ghost">Eğriyi göster</button></div>`);
        root.appendChild(actions);
        const pairBox = el(`<div class="pair-list"></div>`);
        root.appendChild(pairBox);
        const plot = makePlot(root, { view: o.view || { xmin: -5, xmax: 5, ymin: -3, ymax: 10 }, height: 240, zoom: false });
        plot.canvas.parentElement.style.marginTop = "12px";
        let showCurve = false;
        actions.children[0].addEventListener("click", () => run(true));
        actions.children[1].addEventListener("click", (e) => {
            showCurve = !showCurve;
            e.target.textContent = showCurve ? "Eğriyi gizle" : "Eğriyi göster";
            draw();
        });

        function run(add) {
            const x = sx.get(), y = f(x);
            mach.querySelector(".xin").innerHTML = fmt(x);
            mach.querySelector(".rule").innerHTML = tex(rules[ri].tex);
            const out = mach.querySelector(".m-out");
            out.querySelector(".yout").innerHTML = add ? fmt(y) : "?";
            if (add) {
                out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
                const box = mach.querySelector(".m-box"); box.classList.remove("spin"); void box.offsetWidth; box.classList.add("spin");
                if (!pairs.some((p) => p[0] === x)) pairs.push([x, y]);
            }
            pairBox.innerHTML = pairs.length
                ? `<span style="background:none;color:var(--ink-soft);padding-left:0">Sıralı ikililer:</span>` + pairs.map((p) => `<span>(${fmt(p[0])}, ${fmt(p[1])})</span>`).join("")
                : `<span style="background:none;color:var(--ink-soft);padding-left:0">Bir sayı seç ve makineye at. Her (x, f(x)) ikilisi grafikte bir nokta olur.</span>`;
            draw();
        }
        function draw() {
            const items = [];
            if (showCurve) items.push({ type: "fn", f, color: C.blue, dash: true, width: 2, trace: false });
            pairs.forEach((p) => items.push({ type: "point", x: p[0], y: p[1], color: C.pink, label: `(${fmt(p[0])}, ${fmt(p[1])})` }));
            plot.setItems(items);
        }
        run(false);
    };

    /* ---------------- Ok (eşleme) diyagramı: fonksiyon mu? ---------------- */
    W.mapping = function (root, o) {
        const cases = o.cases;
        let ci = 0;
        chips(root, cases.map((c, i) => `Örnek ${i + 1}`), 0, (i) => { ci = i; draw(false); });
        const holder = el(`<div style="margin-top:12px"></div>`);
        root.appendChild(holder);
        const answers = el(`<div class="answer-row"><button type="button" class="btn small success">✓ Fonksiyondur</button><button type="button" class="btn small" style="background:var(--red);box-shadow:none">✗ Fonksiyon değildir</button></div>`);
        root.appendChild(answers);
        const fb = el(`<div class="q-feedback" style="display:none"></div>`);
        root.appendChild(fb);
        answers.children[0].addEventListener("click", () => answer(true));
        answers.children[1].addEventListener("click", () => answer(false));
        let uid = Math.random().toString(36).slice(2, 8);

        function draw(reveal) {
            const c = cases[ci];
            const n = Math.max(c.A.length, c.B.length);
            const H = 70 + n * 52, W0 = 460;
            const yA = c.A.map((_, i) => 50 + (i + 0.5) * ((H - 70) / c.A.length));
            const yB = c.B.map((_, i) => 50 + (i + 0.5) * ((H - 70) / c.B.length));
            const out = c.A.map((_, i) => c.arrows.filter((a) => a[0] === i).length);
            let svg = `<svg class="mapping-svg" viewBox="0 0 ${W0} ${H}" role="img" aria-label="Eşleme diyagramı">
                <defs><marker id="ah${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>
                <ellipse class="set" cx="110" cy="${(H + 30) / 2}" rx="62" ry="${(H - 50) / 2}"/>
                <ellipse class="set" cx="350" cy="${(H + 30) / 2}" rx="62" ry="${(H - 50) / 2}"/>
                <text class="set-name" x="110" y="24" text-anchor="middle">A</text>
                <text class="set-name" x="350" y="24" text-anchor="middle">B</text>`;
            c.arrows.forEach(([i, j]) => {
                svg += `<path class="arrow" d="M128 ${yA[i]} C 200 ${yA[i]}, 260 ${yB[j]}, 332 ${yB[j]}" marker-end="url(#ah${uid})"/>`;
            });
            c.A.forEach((a, i) => {
                const bad = reveal && out[i] !== 1;
                svg += `<circle class="el${bad ? " lonely" : ""}" cx="110" cy="${yA[i]}" r="17"/><text x="110" y="${yA[i] + 5}" text-anchor="middle">${a}</text>`;
            });
            c.B.forEach((b, j) => {
                svg += `<circle class="el" cx="350" cy="${yB[j]}" r="17"/><text x="350" y="${yB[j] + 5}" text-anchor="middle">${b}</text>`;
            });
            svg += `</svg>`;
            holder.innerHTML = svg;
            if (!reveal) fb.style.display = "none";
        }
        function answer(says) {
            const c = cases[ci];
            const ok = says === c.isFn;
            fb.className = "q-feedback " + (ok ? "ok" : "no");
            fb.innerHTML = (ok ? "<b>Doğru!</b> " : "<b>Tekrar düşün.</b> ") + c.why;
            fb.style.display = "block";
            draw(true);
        }
        draw(false);
    };

    /* ---------------- Dikey doğru testi ---------------- */
    W.vtest = function (root, o) {
        const cases = [
            { label: "y = x²", isFn: true, x: (t) => t, y: (t) => t * t, t0: -3, t1: 3, ys: (c) => [c * c] },
            { label: "Çember x² + y² = 4", isFn: false, x: (t) => 2 * Math.cos(t), y: (t) => 2 * Math.sin(t), t0: 0, t1: 2 * Math.PI, ys: (c) => (Math.abs(c) <= 2 ? (Math.abs(c) === 2 ? [0] : [Math.sqrt(4 - c * c), -Math.sqrt(4 - c * c)]) : []) },
            { label: "x = y²", isFn: false, x: (t) => t * t, y: (t) => t, t0: -3, t1: 3, ys: (c) => (c > 0 ? [Math.sqrt(c), -Math.sqrt(c)] : c === 0 ? [0] : []) },
            { label: "y = sin x", isFn: true, x: (t) => t, y: (t) => Math.sin(t), t0: -6, t1: 6, ys: (c) => [Math.sin(c)] },
        ];
        let ci = 0;
        chips(root, cases.map((c) => c.label), 0, (i) => { ci = i; render(); });
        const plot = makePlot(root, { view: { xmin: -4, xmax: 4, ymin: -3, ymax: 4 }, equal: true, height: 280 });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sc = slider(ctrls, { label: "Dikey doğru: x = c", min: -3.5, max: 3.5, step: 0.1, value: 1 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const c = cases[ci], x0 = sc.get();
            const ys = c.ys(x0);
            const items = [
                { type: "param", x: c.x, y: c.y, t0: c.t0, t1: c.t1, color: C.blue, width: 3 },
                { type: "vline", x: x0, color: C.orange, width: 2.2, label: `x = ${fmt(x0)}` },
            ];
            ys.forEach((y) => items.push({ type: "point", x: x0, y, color: ys.length > 1 ? C.red : C.green }));
            plot.setItems(items);
            const n = ys.length;
            readout.innerHTML = `Dikey doğru eğriyi <b>${n}</b> noktada kesiyor. ` +
                (n > 1 ? `<span class="bad">Bir x'e birden fazla y karşılık geliyor → bu nokta fonksiyon kuralını bozar.</span>`
                    : n === 1 ? `<span class="good">Bu x'e tek bir y karşılık geliyor.</span>`
                        : `Bu x için eğride nokta yok.`) +
                `<br>Sonuç: <b>${c.label}</b> ${c.isFn ? "bir fonksiyon grafiğidir ✓ (her dikey doğru en fazla 1 noktada keser)" : "bir fonksiyon grafiği <u>değildir</u> ✗ (2 noktada kesen dikey doğru var)"}.`;
        }
        render();
    };

    /* ---------------- Fonksiyonlarla dört işlem ---------------- */
    W.ops = function (root, o) {
        const row = el(`<div class="controls" style="margin-top:0"></div>`);
        root.appendChild(row);
        let fsrc = o.f || "x^2", gsrc = o.g || "x-1";
        let f = MathParser.fx(fsrc), g = MathParser.fx(gsrc);
        textInput(row, `<span style="color:${C.blue}">f(x) =</span>`, fsrc, (v, inp) => { const r = safeFx(v, inp); if (r) { f = r; fsrc = v; render(); } });
        textInput(row, `<span style="color:${C.pink}">g(x) =</span>`, gsrc, (v, inp) => { const r = safeFx(v, inp); if (r) { g = r; gsrc = v; render(); } });
        const ops = [
            { l: "f + g", t: "f+g", h: (a, b) => a + b, e: (a, b) => `(${a})+(${b})` },
            { l: "f − g", t: "f-g", h: (a, b) => a - b, e: (a, b) => `(${a})-(${b})` },
            { l: "f · g", t: "f\\cdot g", h: (a, b) => a * b, e: (a, b) => `(${a})*(${b})` },
            { l: "f / g", t: "\\tfrac{f}{g}", h: (a, b) => a / b, e: (a, b) => `(${a})/(${b})` },
        ];
        let oi = 0;
        const chipWrap = el(`<div style="margin-top:12px"></div>`);
        root.appendChild(chipWrap);
        chips(chipWrap, ops.map((x) => x.l), 0, (i) => { oi = i; render(); });
        const plot = makePlot(root, { view: o.view || { xmin: -4, xmax: 4, ymin: -4, ymax: 8 }, height: 290, exprs: () => [fsrc, gsrc, ops[oi].e(fsrc, gsrc)] });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sx = slider(ctrls, { label: "x değeri", min: -3, max: 3, step: 0.5, value: 2 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const op = ops[oi], x0 = sx.get();
            const h = (x) => op.h(f(x), g(x));
            const fx0 = f(x0), gx0 = g(x0), hx0 = op.h(fx0, gx0);
            plot.setItems([
                { type: "fn", f, color: C.blue, dash: true, width: 2, label: "f" },
                { type: "fn", f: g, color: C.pink, dash: true, width: 2, label: "g" },
                { type: "fn", f: h, color: C.green, width: 3.2, label: op.l },
                { type: "vline", x: x0, color: C.gray, width: 1.4 },
                { type: "point", x: x0, y: fx0, color: C.blue },
                { type: "point", x: x0, y: gx0, color: C.pink },
                { type: "point", x: x0, y: hx0, color: C.green, label: `(${fmt(x0)}, ${fmt(hx0)})` },
            ]);
            let extra = "";
            if (oi === 3 && Math.abs(gx0) < 1e-12) extra = ` <span class="bad">g(${fmt(x0)}) = 0 olduğu için bölüm burada tanımsız!</span>`;
            readout.innerHTML = tex(`f(${texNum(x0)}) = ${texNum(fx0)},\\quad g(${texNum(x0)}) = ${texNum(gx0)}`) + "<br>" +
                tex(`(${op.t})(${texNum(x0)}) = ${texNum(hx0)}`) + extra;
        }
        render();
    };

    /* ---------------- Yatay doğru testi: birebir / örten ---------------- */
    W.hline = function (root, o) {
        const presets = o.presets;
        let pi = 0, f = MathParser.fx(presets[0].expr);
        chips(root, presets.map((p) => tex(p.tex)), 0, (i) => {
            pi = i; f = MathParser.fx(presets[i].expr);
            plot.setView(presets[i].view || o.view);
            render();
        });
        const view0 = presets[0].view || o.view || { xmin: -4, xmax: 4, ymin: -4, ymax: 6 };
        const plot = makePlot(root, { view: view0, height: 290, exprs: () => [presets[pi].expr, `y = ${sk.get()}`] });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sk = slider(ctrls, { label: "Yatay doğru: y = k", min: -4, max: 6, step: 0.1, value: 1 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);

        function roots(k) {
            const v = plot.home, N = 4000, out = [];
            let px = null, pv = NaN;
            for (let i = 0; i <= N; i++) {
                const x = v.xmin + ((v.xmax - v.xmin) * i) / N;
                const val = f(x) - k;
                if (!isFinite(val)) { pv = NaN; px = x; continue; }
                if (Math.abs(val) < 1e-9) out.push(x);
                else if (isFinite(pv) && pv !== 0 && Math.sign(val) !== Math.sign(pv)) {
                    let a = px, b = x, fa = pv;
                    for (let j = 0; j < 50; j++) { const m = (a + b) / 2, fm = f(m) - k; if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; }
                    const r = (a + b) / 2;
                    if (Math.abs(f(r) - k) < 1e-3) out.push(r);
                }
                px = x; pv = val;
            }
            return out;
        }
        function render() {
            const k = sk.get(), p = presets[pi];
            const rs = roots(k);
            const items = [
                { type: "fn", f, color: C.blue, width: 3, label: p.label },
                { type: "hline", y: k, color: C.orange, width: 2.2, label: `y = ${fmt(k)}` },
            ];
            rs.forEach((x) => items.push({ type: "point", x, y: k, color: rs.length > 1 ? C.red : C.green }));
            plot.setItems(items);
            const n = rs.length;
            let msg = `<b>y = ${fmt(k)}</b> doğrusu grafiği <b>${n}</b> noktada kesiyor. `;
            if (n > 1) msg += `<span class="bad">Aynı y değerini veren ${n} farklı x var → birebir değil.</span>`;
            else if (n === 1) msg += `<span class="good">Bu y değerini veren tek bir x var.</span>`;
            else msg += `<span class="bad">Bu y değeri hiç alınmıyor (görüntü kümesinde yok).</span>`;
            readout.innerHTML = msg + `<br>${p.verdict}`;
        }
        render();
    };

    /* ---------------- Bileşke fonksiyon zinciri ---------------- */
    W.compose = function (root, o) {
        let fsrc = o.f || "3x-1", gsrc = o.g || "x^2";
        let f = MathParser.fx(fsrc), g = MathParser.fx(gsrc);
        const row = el(`<div class="controls" style="margin-top:0"></div>`);
        root.appendChild(row);
        textInput(row, `<span style="color:${C.blue}">f(x) =</span>`, fsrc, (v, inp) => { const r = safeFx(v, inp); if (r) { f = r; fsrc = v; render(); } });
        textInput(row, `<span style="color:${C.pink}">g(x) =</span>`, gsrc, (v, inp) => { const r = safeFx(v, inp); if (r) { g = r; gsrc = v; render(); } });
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sx = slider(ctrls, { label: "Girdi x", min: -3, max: 3, step: 0.5, value: 2 }, render);
        const chain1 = el(`<div class="machine"></div>`);
        const chain2 = el(`<div class="machine"></div>`);
        root.appendChild(chain1);
        root.appendChild(chain2);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        const plot = makePlot(root, { view: { xmin: -3, xmax: 3, ymin: -3, ymax: 12 }, height: 260, exprs: () => [`g(f(x))`, `f(g(x))`, `f(x)=${fsrc}`, `g(x)=${gsrc}`] });
        plot.canvas.parentElement.style.marginTop = "12px";
        const box = (name, color) => `<div class="m-box" style="min-width:70px;padding:10px 14px;background:${color}"><div class="mk">makine</div>${tex(name)}</div>`;
        const val = (lbl, v, out) => `<div class="${out ? "m-out" : "m-in"}" style="min-width:64px;padding:8px 10px"><span class="m-lbl">${lbl}</span>${fmt(v)}</div>`;
        function render() {
            const x = sx.get();
            const fx = f(x), gfx = g(fx), gx = g(x), fgx = f(gx);
            chain1.innerHTML = `<b style="width:100%;text-align:center;font-size:13px;color:var(--ink-soft)">${tex("(g\\circ f)(x) = g(f(x))")}: önce f, sonra g</b>` +
                val("x", x) + `<span class="m-arrow">➜</span>` + box("f", C.blue) + `<span class="m-arrow">➜</span>` + val("f(x)", fx) + `<span class="m-arrow">➜</span>` + box("g", C.pink) + `<span class="m-arrow">➜</span>` + val("g(f(x))", gfx, true);
            chain2.innerHTML = `<b style="width:100%;text-align:center;font-size:13px;color:var(--ink-soft)">${tex("(f\\circ g)(x) = f(g(x))")}: önce g, sonra f</b>` +
                val("x", x) + `<span class="m-arrow">➜</span>` + box("g", C.pink) + `<span class="m-arrow">➜</span>` + val("g(x)", gx) + `<span class="m-arrow">➜</span>` + box("f", C.blue) + `<span class="m-arrow">➜</span>` + val("f(g(x))", fgx, true);
            const same = Math.abs(gfx - fgx) < 1e-9;
            readout.innerHTML = tex(`(g\\circ f)(${texNum(x)}) = ${texNum(gfx)}`) + ` &nbsp; ve &nbsp; ` + tex(`(f\\circ g)(${texNum(x)}) = ${texNum(fgx)}`) +
                `<br>${same ? `<span class="good">Bu x için sonuçlar eşit.</span> (Başka x'leri de dene!)` : `<span class="bad">Sonuçlar farklı → sıra önemli: genelde f∘g ≠ g∘f.</span>`}`;
            plot.setItems([
                { type: "fn", f: (t) => g(f(t)), color: C.purple, width: 3, label: "g∘f" },
                { type: "fn", f: (t) => f(g(t)), color: C.green, width: 3, label: "f∘g" },
                { type: "vline", x, color: C.gray, width: 1.3 },
                { type: "point", x, y: gfx, color: C.purple },
                { type: "point", x, y: fgx, color: C.green },
            ]);
        }
        render();
    };

    /* ---------------- Ters fonksiyon: y = x'e göre yansıma ---------------- */
    W.inverse = function (root, o) {
        const presets = o.presets;
        let pi = 0, f;
        chips(root, presets.map((p) => tex(p.tex)), 0, (i) => { pi = i; setup(); });
        const plot = makePlot(root, { view: o.view || { xmin: -4, xmax: 5, ymin: -4, ymax: 5 }, equal: true, height: 320 });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sa = slider(ctrls, { label: "Nokta: x = a", min: -2, max: 2, step: 0.1, value: 1 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function setup() {
            const p = presets[pi];
            f = MathParser.fx(p.expr);
            sa.setRange(p.a[0], p.a[1]);
            sa.set(Math.min(Math.max(sa.get(), p.a[0]), p.a[1]));
            render();
        }
        function render() {
            const p = presets[pi], a = sa.get(), b = f(a);
            plot.setItems([
                { type: "fn", f: (x) => x, color: C.gray, dash: true, width: 1.6, label: "y = x", trace: false },
                { type: "fn", f, color: C.blue, width: 3, xmin: p.dom[0], xmax: p.dom[1], label: "f" },
                { type: "param", x: f, y: (t) => t, t0: p.dom[0], t1: p.dom[1], color: C.pink, width: 3, steps: 600 },
                { type: "seg", x1: a, y1: b, x2: b, y2: a, color: C.gray, dash: [4, 4], width: 1.5 },
                { type: "point", x: a, y: b, color: C.blue, label: `(${fmt(a)}, ${fmt(b)})`, labelPos: "nw" },
                { type: "point", x: b, y: a, color: C.pink, label: `(${fmt(b)}, ${fmt(a)})`, labelPos: "se" },
                { type: "text", x: p.invLabelAt[0], y: p.invLabelAt[1], text: "f⁻¹", color: C.pink, font: "800 15px Inter, sans-serif" },
            ]);
            readout.innerHTML = tex(`f(${texNum(a)}) = ${texNum(b)} \\;\\Longrightarrow\\; f^{-1}(${texNum(b)}) = ${texNum(a)}`) +
                `<br>Ters fonksiyon girdi ile çıktının yerini değiştirir: <b>(a, b)</b> noktası <b>(b, a)</b> olur. ${p.inv ? "Kural: " + tex(p.inv) : ""}`;
        }
        setup();
    };

    /* ---------------- Artan / azalan ---------------- */
    W.monotone = function (root, o) {
        const presets = o.presets;
        let pi = 0, f = MathParser.fx(presets[0].expr);
        chips(root, presets.map((p) => tex(p.tex)), 0, (i) => { pi = i; f = MathParser.fx(presets[i].expr); render(); });
        const plot = makePlot(root, { view: o.view || { xmin: -3.5, xmax: 3.5, ymin: -4, ymax: 6 }, height: 290 });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sx = slider(ctrls, { label: "x (noktayı gezdir)", min: -3, max: 3, step: 0.05, value: -1.5 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        root.appendChild(el(`<div class="legend"><span style="color:${C.green}"><i style="background:${C.green}"></i>artan kısım</span><span style="color:${C.red}"><i style="background:${C.red}"></i>azalan kısım</span><span style="color:${C.orange}"><i style="background:${C.orange}"></i>sabit kısım</span></div>`));
        function render() {
            const p = presets[pi], x0 = sx.get(), y0 = f(x0), d = deriv(f, x0);
            const eps = 1e-6;
            plot.setItems([
                { type: "fn", f: (x) => (deriv(f, x) > eps ? f(x) : NaN), color: C.green, width: 3.4, trace: false },
                { type: "fn", f: (x) => (deriv(f, x) < -eps ? f(x) : NaN), color: C.red, width: 3.4, trace: false },
                { type: "fn", f: (x) => (Math.abs(deriv(f, x)) <= eps ? f(x) : NaN), color: C.orange, width: 3.4, trace: false },
                { type: "seg", x1: x0 - 0.6, y1: y0 - 0.6 * d, x2: x0 + 0.6, y2: y0 + 0.6 * d, color: C.gray, width: 1.6, dash: [4, 4] },
                { type: "point", x: x0, y: y0, color: d > eps ? C.green : d < -eps ? C.red : C.orange, label: `(${fmt(x0)}, ${fmt(y0)})` },
            ]);
            const state = d > eps ? `<span class="good">artıyor ↗</span> (sağa gittikçe grafik yükseliyor)` : d < -eps ? `<span class="bad">azalıyor ↘</span> (sağa gittikçe grafik alçalıyor)` : `<b>ne artıyor ne azalıyor</b> (dönüm noktası ya da sabit)`;
            readout.innerHTML = `x = ${fmt(x0)} civarında fonksiyon ${state}.<br>${p.verdict}`;
        }
        render();
    };

    /* ---------------- Tek / çift ---------------- */
    W.parity = function (root, o) {
        const presets = o.presets;
        let pi = 0, f = MathParser.fx(presets[0].expr);
        chips(root, presets.map((p) => tex(p.tex)), 0, (i) => { pi = i; f = MathParser.fx(presets[i].expr); render(); });
        const plot = makePlot(root, { view: { xmin: -4, xmax: 4, ymin: -4, ymax: 5 }, height: 290, equal: true });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sa = slider(ctrls, { label: "a", min: 0.2, max: 2.5, step: 0.1, value: 1.5 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function kind() {
            let even = true, odd = true;
            for (let x = 0.13; x < 3; x += 0.17) {
                const a = f(x), b = f(-x);
                if (!isFinite(a) || !isFinite(b)) continue;
                if (Math.abs(a - b) > 1e-7) even = false;
                if (Math.abs(a + b) > 1e-7) odd = false;
            }
            return even && odd ? "both" : even ? "even" : odd ? "odd" : "none";
        }
        function render() {
            const a = sa.get(), fa = f(a), fma = f(-a), k = kind();
            const items = [
                { type: "fn", f, color: C.blue, width: 3, label: presets[pi].label },
                { type: "point", x: a, y: fa, color: C.green, label: "A(a, f(a))" },
                { type: "point", x: -a, y: fma, color: C.pink, label: "B(−a, f(−a))", labelPos: "nw" },
            ];
            if (k === "even") items.push({ type: "seg", x1: a, y1: fa, x2: -a, y2: fma, color: C.gray, dash: [4, 4], width: 1.5 });
            if (k === "odd") items.push({ type: "seg", x1: a, y1: fa, x2: -a, y2: fma, color: C.gray, dash: [4, 4], width: 1.5 }, { type: "point", x: 0, y: 0, color: C.orange, r: 4 });
            plot.setItems(items);
            const verdict = {
                even: `<span class="good">f(−a) = f(a) → ÇİFT fonksiyon.</span> Grafik y-eksenine göre simetrik (ayna gibi).`,
                odd: `<span class="good">f(−a) = −f(a) → TEK fonksiyon.</span> Grafik orijine göre simetrik (180° döndürünce aynı).`,
                none: `<span class="bad">Ne f(−a) = f(a) ne de f(−a) = −f(a) → ne tek ne çift.</span>`,
                both: `<span class="good">Hem tek hem çift!</span> (Bunu sağlayan tek fonksiyon f(x) = 0'dır.)`,
            }[k];
            readout.innerHTML = tex(`f(${texNum(a)}) = ${texNum(fa)},\\quad f(${texNum(-a)}) = ${texNum(fma)}`) + "<br>" + verdict;
        }
        render();
    };

    /* ---------------- Grafik dönüşümleri ---------------- */
    W.transform = function (root, o) {
        const bases = o.bases || [
            { tex: "x^2", expr: "x^2", a: 1 },
            { tex: "x^3", expr: "x^3", a: 1 },
            { tex: "\\sqrt{x}", expr: "sqrt(x)", a: 1 },
            { tex: "|x|", expr: "abs(x)", a: 1 },
            { tex: "x^2-2x", expr: "x^2-2x", a: 3 },
        ];
        const show = o.controls || ["p", "c", "k"];
        let bi = 0, f = MathParser.fx(bases[0].expr);
        const st = { negf: false, negx: false, mirror: false, p: o.p || 0, c: 1, k: 0 };
        chips(root, bases.map((b) => "f(x) = " + tex(b.tex)), 0, (i) => { bi = i; f = MathParser.fx(bases[i].expr); render(); });
        const formula = el(`<div class="readout" style="text-align:center;font-size:17px"></div>`);
        root.appendChild(formula);
        const plot = makePlot(root, { view: o.view || { xmin: -6, xmax: 6, ymin: -5, ymax: 7 }, height: 310, equal: true, exprs: () => [`f(x)=${bases[bi].expr}`, exprStr()] });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const check = (key, label) => {
            const n = el(`<label class="check"><input type="checkbox"> ${label}</label>`);
            n.querySelector("input").addEventListener("change", (e) => { st[key] = e.target.checked; render(); });
            ctrls.appendChild(n);
        };
        if (show.includes("negf")) check("negf", tex("-f(x)") + "&nbsp;(x-eksenine göre yansıt)");
        if (show.includes("negx")) check("negx", tex("f(-x)") + "&nbsp;(y-eksenine göre yansıt)");
        if (show.includes("mirror")) check("mirror", tex("f(2p-x)") + "&nbsp;(x = p doğrusuna göre yansıt)");
        if (show.includes("p")) slider(ctrls, { label: show.includes("mirror") ? "p" : "p (sağa/sola kaydır)", min: -4, max: 4, step: 0.5, value: st.p }, (v) => { st.p = v; render(); });
        if (show.includes("c")) slider(ctrls, { label: "c (dikey germe)", min: -3, max: 3, step: 0.25, value: 1 }, (v) => { st.c = v; render(); });
        if (show.includes("k")) slider(ctrls, { label: "k (yukarı/aşağı kaydır)", min: -4, max: 4, step: 0.5, value: 0 }, (v) => { st.k = v; render(); });
        const note = el(`<div class="readout"></div>`);
        root.appendChild(note);

        const usesShift = show.includes("p") && !show.includes("mirror");
        function inner(x) {
            if (st.mirror) return 2 * st.p - x;
            let u = usesShift ? x - st.p : x;
            return st.negx ? -u : u;
        }
        function g(x) { return st.k + st.c * (st.negf ? -1 : 1) * f(inner(x)); }
        function innerTex() {
            if (st.mirror) return st.p === 0 ? "-x" : `${texNum(2 * st.p)} - x`;
            let u = "x";
            if (usesShift && st.p !== 0) u = st.p > 0 ? `x - ${texNum(st.p)}` : `x + ${texNum(-st.p)}`;
            if (st.negx) u = u === "x" ? "-x" : `-(${u})`;
            return u;
        }
        function exprStr() {
            const inn = st.mirror ? `${2 * st.p}-x` : `${st.negx ? "-" : ""}(x-(${usesShift ? st.p : 0}))`;
            return `${st.k}+${st.c * (st.negf ? -1 : 1)}*f(${inn})`;
        }
        function render() {
            const coef = st.c * (st.negf ? -1 : 1);
            let t = `f(${innerTex()})`;
            if (coef === -1) t = "-" + t; else if (coef !== 1) t = `${texNum(coef)}\\cdot ` + t;
            if (st.k !== 0) t += ` ${signed(st.k)}`;
            formula.innerHTML = tex(`y = ${t}`);
            const a = bases[bi].a, fa = f(a);
            // A(a, f(a)) noktasının yeni yeri
            let xa;
            if (st.mirror) xa = 2 * st.p - a;
            else xa = (st.negx ? -a : a) + (usesShift ? st.p : 0);
            const ya = st.k + coef * fa;
            plot.setItems([
                { type: "fn", f, color: C.blue, width: 2.2, dash: true, label: "f(x)", alpha: 0.85 },
                { type: "fn", f: g, color: C.pink, width: 3.4 },
                ...(st.mirror ? [{ type: "vline", x: st.p, color: C.orange, width: 1.6, label: `x = ${fmt(st.p)}` }] : []),
                { type: "seg", x1: a, y1: fa, x2: xa, y2: ya, color: C.gray, dash: [3, 4], width: 1.4, arrow: true },
                { type: "point", x: a, y: fa, color: C.blue, label: "A" },
                { type: "point", x: xa, y: ya, color: C.pink, label: "A′" },
            ]);
            note.innerHTML = `A(${fmt(a)}, ${fmt(fa)}) noktası → A′(${fmt(xa)}, ${fmt(ya)}) noktasına gitti. ` + describe();
        }
        function describe() {
            const parts = [];
            if (st.mirror) parts.push(`x = ${fmt(st.p)} doğrusuna göre yansıdı`);
            if (st.negx) parts.push("y-eksenine göre yansıdı");
            if (usesShift && st.p > 0) parts.push(`${fmt(st.p)} birim <b>sağa</b> kaydı`);
            if (usesShift && st.p < 0) parts.push(`${fmt(-st.p)} birim <b>sola</b> kaydı`);
            if (st.negf) parts.push("x-eksenine göre yansıdı");
            if (st.c !== 1 && st.c !== 0) parts.push(`y değerleri ${fmt(Math.abs(st.c))} ile çarpıldı${st.c < 0 ? " (ve ters döndü)" : ""}`);
            if (st.c === 0) parts.push("tüm y değerleri 0 oldu");
            if (st.k > 0) parts.push(`${fmt(st.k)} birim <b>yukarı</b> kaydı`);
            if (st.k < 0) parts.push(`${fmt(-st.k)} birim <b>aşağı</b> kaydı`);
            return parts.length ? "Grafik: " + parts.join(", ") + "." : "Henüz bir değişiklik yok — kaydırıcıları oynat!";
        }
        render();
    };

    /* ---------------- Birim çember ---------------- */
    function exactVal(v) {
        const a = Math.abs(v), s = v < -1e-9 ? "-" : "";
        const eq = (u) => Math.abs(a - u) < 1e-9;
        if (a < 1e-9) return "0";
        if (eq(1)) return s + "1";
        if (eq(0.5)) return s + "\\dfrac{1}{2}";
        if (eq(Math.SQRT2 / 2)) return s + "\\dfrac{\\sqrt2}{2}";
        if (eq(Math.sqrt(3) / 2)) return s + "\\dfrac{\\sqrt3}{2}";
        if (eq(Math.sqrt(3))) return s + "\\sqrt3";
        if (eq(1 / Math.sqrt(3))) return s + "\\dfrac{\\sqrt3}{3}";
        return null;
    }
    function trigTex(deg, fn) {
        const r = (deg * Math.PI) / 180;
        const s = Math.sin(r), c = Math.cos(r);
        let v;
        if (fn === "sin") v = s; else if (fn === "cos") v = c; else { if (Math.abs(c) < 1e-9) return "\\text{tanımsız}"; v = s / c; }
        const special = deg % 30 === 0 || deg % 45 === 0;
        return (special && exactVal(v)) || texNum(v, 4);
    }
    /* "−3π/4" -> "-\dfrac{3\pi}{4}" */
    function piToTex(pf) {
        const neg = pf.startsWith("−");
        const body = pf.replace("−", "").replace("π", "\\pi").replace(/^(\d*)\\pi\/(\d+)$/, (m, n, d) => `\\dfrac{${n}\\pi}{${d}}`);
        return (neg ? "-" : "") + body;
    }
    function radTex(deg) {
        const pf = MathParser.piFrac((deg * Math.PI) / 180);
        return pf ? piToTex(pf) : texNum((deg * Math.PI) / 180, 4);
    }
    W.unitCircle = function (root, o) {
        const wrap = el(`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"></div>`);
        root.appendChild(wrap);
        const a = el(`<div></div>`), b = el(`<div></div>`);
        wrap.appendChild(a); wrap.appendChild(b);
        const p1 = makePlot(a, { view: { xmin: -1.6, xmax: 1.6, ymin: -1.4, ymax: 1.4 }, equal: true, height: 300, zoom: false });
        const p2 = makePlot(b, { view: { xmin: -0.3, xmax: 2 * Math.PI + 0.3, ymin: -1.5, ymax: 1.5 }, piAxis: true, height: 300, zoom: false });
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const st = slider(ctrls, { label: "Açı θ", min: 0, max: 360, step: 1, value: o.value || 30, format: (v) => `${v}°` }, render);
        const quick = el(`<div class="chip-row" style="margin-top:10px"></div>`);
        [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 270, 300, 330].forEach((d) => {
            const c = el(`<button type="button" class="chip">${d}°</button>`);
            c.addEventListener("click", () => { st.set(d); render(); });
            quick.appendChild(c);
        });
        root.appendChild(quick);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const deg = st.get(), t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
            p1.setItems([
                { type: "param", x: Math.cos, y: Math.sin, t0: 0, t1: 2 * Math.PI, color: C.gray, width: 2 },
                { type: "param", x: (u) => 0.28 * Math.cos(u), y: (u) => 0.28 * Math.sin(u), t0: 0, t1: t, color: C.orange, width: 2.4 },
                { type: "seg", x1: 0, y1: 0, x2: c, y2: s, color: C.gray, width: 2 },
                { type: "seg", x1: 0, y1: 0, x2: c, y2: 0, color: C.blue, width: 4, label: "cos θ", labelOffset: [0, s >= 0 ? 14 : -14] },
                { type: "seg", x1: c, y1: 0, x2: c, y2: s, color: C.pink, width: 4, label: "sin θ", labelOffset: [c >= 0 ? 30 : -30, 0] },
                { type: "point", x: c, y: s, color: C.purple, label: "P", labelPos: (s >= 0 ? "n" : "s") + (c >= 0 ? "e" : "w") },
            ]);
            p2.setItems([
                { type: "fn", f: Math.sin, color: C.pink, width: 2.6, label: "sin", xmin: 0, xmax: 2 * Math.PI },
                { type: "fn", f: Math.cos, color: C.blue, width: 2, dash: true, label: "cos", xmin: 0, xmax: 2 * Math.PI },
                { type: "vline", x: t, color: C.gray, width: 1.2 },
                { type: "point", x: t, y: s, color: C.pink },
                { type: "point", x: t, y: c, color: C.blue },
            ]);
            const q = deg === 0 || deg === 90 || deg === 180 || deg === 270 || deg === 360 ? "eksen üzerinde" : deg < 90 ? "I. bölge (cos +, sin +)" : deg < 180 ? "II. bölge (cos −, sin +)" : deg < 270 ? "III. bölge (cos −, sin −)" : "IV. bölge (cos +, sin −)";
            readout.innerHTML = `<div class="readout-grid">
                <div class="ro-cell"><div class="k">Derece</div><div class="v">${deg}°</div></div>
                <div class="ro-cell"><div class="k">Radyan</div><div class="v">${tex(radTex(deg))}</div></div>
                <div class="ro-cell"><div class="k" style="color:${C.blue}">cos θ (yatay)</div><div class="v">${tex(trigTex(deg, "cos"))}</div></div>
                <div class="ro-cell"><div class="k" style="color:${C.pink}">sin θ (dikey)</div><div class="v">${tex(trigTex(deg, "sin"))}</div></div>
                <div class="ro-cell"><div class="k">tan θ</div><div class="v">${tex(trigTex(deg, "tan"))}</div></div>
                <div class="ro-cell"><div class="k">Bölge</div><div class="v" style="font-size:13px">${q}</div></div>
            </div>`;
        }
        render();
    };

    /* ---------------- Açı ölçüsü: derece / radyan / yay ---------------- */
    W.angle = function (root) {
        const plot = makePlot(root, { view: { xmin: -3.6, xmax: 3.6, ymin: -3.3, ymax: 3.3 }, equal: true, height: 300, zoom: false });
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sd = slider(ctrls, { label: "Açı θ", min: 0, max: 360, step: 1, value: 60, format: (v) => `${v}°` }, render);
        const sr = slider(ctrls, { label: "Yarıçap r", min: 1, max: 3, step: 0.5, value: 2 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const deg = sd.get(), r = sr.get(), t = (deg * Math.PI) / 180;
            plot.setItems([
                { type: "param", x: (u) => r * Math.cos(u), y: (u) => r * Math.sin(u), t0: 0, t1: 2 * Math.PI, color: C.gray, width: 1.8 },
                { type: "param", x: (u) => r * Math.cos(u), y: (u) => r * Math.sin(u), t0: 0, t1: t, color: C.pink, width: 5 },
                { type: "param", x: (u) => 0.4 * Math.cos(u), y: (u) => 0.4 * Math.sin(u), t0: 0, t1: t, color: C.orange, width: 2.2 },
                { type: "seg", x1: 0, y1: 0, x2: r, y2: 0, color: C.blue, width: 2.6, label: "r" },
                { type: "seg", x1: 0, y1: 0, x2: r * Math.cos(t), y2: r * Math.sin(t), color: C.blue, width: 2.6 },
                { type: "text", x: (r + 0.45) * Math.cos(t / 2), y: (r + 0.45) * Math.sin(t / 2), text: "s", color: C.pink, font: "800 16px Inter, sans-serif" },
            ]);
            readout.innerHTML = tex(`\\theta = ${deg}^\\circ = ${deg}\\cdot\\frac{\\pi}{180} = ${radTex(deg)} \\approx ${texNum(t, 3)}\\text{ rad}`) +
                "<br>" + tex(`s = r\\cdot\\theta = ${texNum(r)}\\cdot ${texNum(t, 3)} \\approx ${texNum(r * t, 3)}`) +
                (Math.abs(deg - 57) <= 1 ? `<br><span class="good">Yay uzunluğu ≈ yarıçap! İşte bu açı 1 radyan ≈ 57,3°.</span>` : "");
        }
        render();
    };

    /* ---------------- Üçgen: kosinüs / sinüs teoremi ---------------- */
    W.triangle = function (root) {
        const plot = makePlot(root, { view: { xmin: -6, xmax: 8, ymin: -1, ymax: 7 }, equal: true, height: 290, zoom: false });
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sa = slider(ctrls, { label: "a = |BC|", min: 1, max: 8, step: 0.5, value: 3 }, render);
        const sb = slider(ctrls, { label: "b = |AC|", min: 1, max: 8, step: 0.5, value: 5 }, render);
        const sc = slider(ctrls, { label: "C açısı", min: 10, max: 170, step: 5, value: 120, format: (v) => `${v}°` }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const a = sa.get(), b = sb.get(), Cd = sc.get(), Cr = (Cd * Math.PI) / 180;
            const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(Cr));
            const Ad = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
            const Bd = 180 - Cd - Ad;
            const P = { C: [0, 0], B: [a, 0], A: [b * Math.cos(Cr), b * Math.sin(Cr)] };
            const xs = [0, a, P.A[0]], ys = [0, 0, P.A[1]];
            const pad = 1.2;
            plot.setView({ xmin: Math.min(...xs) - pad, xmax: Math.max(...xs) + pad, ymin: -pad, ymax: Math.max(...ys) + pad });
            plot.setItems([
                { type: "seg", x1: 0, y1: 0, x2: a, y2: 0, color: C.blue, width: 3, label: "a", labelOffset: [0, 14] },
                { type: "seg", x1: 0, y1: 0, x2: P.A[0], y2: P.A[1], color: C.green, width: 3, label: "b", labelOffset: [-12, 0] },
                { type: "seg", x1: a, y1: 0, x2: P.A[0], y2: P.A[1], color: C.pink, width: 3.4, label: "c", labelOffset: [12, 0] },
                { type: "param", x: (u) => 0.45 * Math.cos(u), y: (u) => 0.45 * Math.sin(u), t0: 0, t1: Cr, color: C.orange, width: 2 },
                { type: "point", x: 0, y: 0, color: C.gray, r: 4, label: "C", labelPos: "sw" },
                { type: "point", x: a, y: 0, color: C.gray, r: 4, label: "B", labelPos: "se" },
                { type: "point", x: P.A[0], y: P.A[1], color: C.gray, r: 4, label: "A" },
            ]);
            readout.innerHTML = `<b>Kosinüs teoremi:</b> ` + tex(`c^2 = a^2 + b^2 - 2ab\\cos C = ${texNum(a)}^2 + ${texNum(b)}^2 - 2\\cdot ${texNum(a)}\\cdot ${texNum(b)}\\cdot \\cos ${Cd}^\\circ`) +
                `<br>` + tex(`c^2 = ${texNum(c * c, 3)} \\Rightarrow c \\approx ${texNum(c, 3)}`) +
                `<br><b>Açılar:</b> A ≈ ${fmt(Ad, 1)}°, B ≈ ${fmt(Bd, 1)}°, C = ${Cd}° (toplam 180°)` +
                `<br><b>Sinüs teoremi kontrolü:</b> ` + tex(`\\frac{a}{\\sin A} \\approx ${texNum(a / Math.sin((Ad * Math.PI) / 180), 3)},\\; \\frac{b}{\\sin B} \\approx ${texNum(b / Math.sin((Bd * Math.PI) / 180), 3)},\\; \\frac{c}{\\sin C} \\approx ${texNum(c / Math.sin(Cr), 3)}`);
        }
        render();
    };

    /* ---------------- Ters trigonometrik fonksiyonlar ---------------- */
    W.arcfn = function (root, o) {
        const H = Math.PI / 2;
        const defs = {
            sin: { tex: "\\arcsin", f: Math.sin, inv: Math.asin, dom: [-H, H], v: [-1, 1], view: { xmin: -2.2, xmax: 2.2, ymin: -2, ymax: 2 } },
            cos: { tex: "\\arccos", f: Math.cos, inv: Math.acos, dom: [0, Math.PI], v: [-1, 1], view: { xmin: -1.6, xmax: 3.6, ymin: -1.4, ymax: 3.5 } },
            tan: { tex: "\\arctan", f: Math.tan, inv: Math.atan, dom: [-H + 0.001, H - 0.001], v: [-4, 4], view: { xmin: -4.5, xmax: 4.5, ymin: -3, ymax: 3 } },
            cot: { tex: "\\text{arccot}", f: (x) => 1 / Math.tan(x), inv: (x) => H - Math.atan(x), dom: [0.001, Math.PI - 0.001], v: [-4, 4], view: { xmin: -4.5, xmax: 4.5, ymin: -1.5, ymax: 4 } },
        };
        const keys = o.fns || ["sin", "cos", "tan", "cot"];
        let k = keys[0];
        chips(root, keys.map((x) => tex(defs[x].tex)), 0, (i) => { k = keys[i]; plot.setView(defs[k].view); sv.setRange(defs[k].v[0], defs[k].v[1]); sv.set(0.5); render(); });
        const plot = makePlot(root, { view: defs[k].view, equal: true, height: 320 });
        plot.canvas.parentElement.style.marginTop = "12px";
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sv = slider(ctrls, { label: "Değer v", min: defs[k].v[0], max: defs[k].v[1], step: 0.05, value: 0.5 }, render);
        const quick = el(`<div class="chip-row" style="margin-top:10px"></div>`);
        root.appendChild(quick);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        const specials = [-Math.sqrt(3), -1, -Math.sqrt(3) / 2, -Math.SQRT2 / 2, -0.5, 0, 0.5, Math.SQRT2 / 2, Math.sqrt(3) / 2, 1, 1 / Math.sqrt(3), Math.sqrt(3)];
        function fillQuick() {
            quick.innerHTML = "";
            const d = defs[k];
            specials.filter((v) => v >= d.v[0] - 1e-9 && v <= d.v[1] + 1e-9).sort((a, b) => a - b).forEach((v) => {
                const b = el(`<button type="button" class="chip">${tex(exactVal(v) || texNum(v))}</button>`);
                b.addEventListener("click", () => { sv.set(v); render(v); });
                quick.appendChild(b);
            });
        }
        let lastK = null;
        function render(exact) {
            const d = defs[k];
            if (lastK !== k) { fillQuick(); lastK = k; }
            const v = typeof exact === "number" ? exact : sv.get();
            const u = d.inv(v);
            plot.setItems([
                { type: "fn", f: (x) => x, color: C.gray, dash: true, width: 1.5, label: "y = x", trace: false },
                { type: "fn", f: d.f, color: C.blue, width: 1.6, alpha: 0.35, dash: [3, 5], trace: false },
                { type: "fn", f: d.f, color: C.blue, width: 3, xmin: d.dom[0], xmax: d.dom[1], label: k + " (kısıtlı)" },
                { type: "fn", f: d.inv, color: C.pink, width: 3.2, label: "arc" + k },
                { type: "seg", x1: v, y1: u, x2: u, y2: v, color: C.gray, dash: [3, 4], width: 1.3 },
                { type: "point", x: v, y: u, color: C.pink, label: `(${fmt(v, 3)}, ${fmt(u, 3)})` },
                { type: "point", x: u, y: v, color: C.blue },
            ]);
            const pf = MathParser.piFrac(u);
            const valTex = pf ? piToTex(pf) : texNum(u, 4);
            readout.innerHTML = tex(`${d.tex}(${exactVal(v) || texNum(v, 3)}) = ${valTex}`) + ` &nbsp;(${fmt((u * 180) / Math.PI, 2)}°)` +
                `<br>Çünkü ${tex(`\\${k}\\left(${valTex}\\right) = ${exactVal(v) || texNum(v, 3)}`)} ve ${tex(valTex)} izin verilen aralıkta: ${tex(k === "sin" ? "[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]" : k === "cos" ? "[0, \\pi]" : k === "tan" ? "(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})" : "(0, \\pi)")}.`;
        }
        render();
    };

    /* ---------------- Üstel ve logaritma ---------------- */
    W.explog = function (root) {
        const plot = makePlot(root, { view: { xmin: -4, xmax: 6, ymin: -3.5, ymax: 6 }, equal: true, height: 320, exprs: () => ["a^x", "log(a, x)", "y = x", `a = ${sa.get()}`] });
        const ctrls = el(`<div class="controls"></div>`);
        root.appendChild(ctrls);
        const sa = slider(ctrls, { label: "Taban a", min: 0.2, max: 4, step: 0.1, value: 2 }, render);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const a = sa.get();
            if (Math.abs(a - 1) < 1e-9) {
                plot.setItems([{ type: "fn", f: () => 1, color: C.blue, width: 3, label: "y = 1" }]);
                readout.innerHTML = `<span class="bad">a = 1 olamaz!</span> 1'in her kuvveti 1'dir; grafik düz bir çizgi olur ve tersi (logaritması) tanımlanamaz.`;
                return;
            }
            const ex = (x) => Math.pow(a, x), lg = (x) => Math.log(x) / Math.log(a);
            plot.setItems([
                { type: "fn", f: (x) => x, color: C.gray, dash: true, width: 1.5, label: "y = x", trace: false },
                { type: "fn", f: ex, color: C.blue, width: 3, label: `y = ${fmt(a)}^x` },
                { type: "fn", f: lg, color: C.pink, width: 3, label: `y = log${fmt(a)} x` },
                { type: "point", x: 0, y: 1, color: C.blue, label: "(0, 1)", labelPos: "nw" },
                { type: "point", x: 1, y: 0, color: C.pink, label: "(1, 0)", labelPos: "se" },
            ]);
            readout.innerHTML = (a > 1
                ? `<b>a = ${fmt(a)} > 1</b>: iki fonksiyon da <span class="good">artan</span>. Üstel grafik sağa doğru hızla yükselir.`
                : `<b>0 < a = ${fmt(a)} < 1</b>: iki fonksiyon da <span class="bad">azalan</span>. Üstel grafik sağa doğru 0'a yaklaşır.`) +
                `<br>Mavi her zaman (0, 1)'den, pembe her zaman (1, 0)'dan geçer. İkisi y = x'e göre birbirinin aynası — çünkü birbirlerinin tersi!`;
        }
        render();
    };

    W.logcalc = function (root) {
        const row = el(`<div class="controls" style="margin-top:0"></div>`);
        root.appendChild(row);
        const mk = (label, v) => {
            const n = el(`<label class="ctrl"><span class="ctrl-label"><span>${label}</span></span><input class="num-input" type="number" step="any" value="${v}"></label>`);
            row.appendChild(n);
            const i = n.querySelector("input");
            i.addEventListener("input", render);
            return i;
        };
        const ia = mk("Taban a", 2), ib = mk("Sayı b", 32);
        const readout = el(`<div class="readout"></div>`);
        root.appendChild(readout);
        function render() {
            const a = Number(ia.value), b = Number(ib.value);
            if (!(a > 0) || a === 1) { readout.innerHTML = `<span class="bad">Taban pozitif olmalı ve 1 olmamalı.</span>`; return; }
            if (!(b > 0)) { readout.innerHTML = `<span class="bad">Logaritması alınan sayı pozitif olmalı.</span> (Hiçbir pozitif tabanın kuvveti 0 ya da negatif olmaz.)`; return; }
            const r = Math.log(b) / Math.log(a);
            readout.innerHTML = `Soru şu: ${tex(`${texNum(a)}^{\\,?} = ${texNum(b)}`)}<br>Cevap: ${tex(`\\log_{${texNum(a)}} ${texNum(b)} = ${texNum(r, 5)}`)}` +
                `<br>Kontrol: ${tex(`${texNum(a)}^{${texNum(r, 5)}} = ${texNum(Math.pow(a, r), 5)}`)} ✓` +
                `<br><span class="muted">Taban değiştirme ile: ${tex(`\\log_{${texNum(a)}} ${texNum(b)} = \\frac{\\ln ${texNum(b)}}{\\ln ${texNum(a)}} = \\frac{${texNum(Math.log(b), 4)}}{${texNum(Math.log(a), 4)}}`)}</span>`;
        }
        render();
    };

    W._helpers = { el, tex, texNum, fmt, makePlot, slider, chips, exactVal, radTex };
    global.Widgets = W;
})(window);
