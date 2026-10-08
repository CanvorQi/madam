/*
 * Plot - canvas üzerinde koordinat sistemi + fonksiyon grafikleri.
 *
 *   const p = new Plot(canvas, { view: { xmin: -5, xmax: 5, ymin: -4, ymax: 4 }, interactive: true });
 *   p.setItems([{ type: "fn", f: (x) => x * x, color: "#00aff0", label: "y = x²" }]);
 *
 * Öğe tipleri: fn, param, point, hline, vline, seg, shadeX, text
 */
(function (global) {
    "use strict";

    const COLORS = {
        blue: "#00aff0", pink: "#ff4f8b", green: "#1fa957", purple: "#7c4dff", orange: "#f08c00",
        teal: "#00a3a3", red: "#e5484d", gray: "#8fa9ba",
    };
    const PALETTE = [COLORS.blue, COLORS.pink, COLORS.green, COLORS.purple, COLORS.orange, COLORS.teal];

    const instances = new Set();

    function cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function niceStep(raw) {
        const p = Math.pow(10, Math.floor(Math.log10(raw)));
        const n = raw / p;
        return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * p;
    }

    function tickLabel(v, step) {
        if (Math.abs(v) < step * 1e-6) return "0";
        const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
        return Number(v.toFixed(Math.min(dec, 8))).toString().replace("-", "−");
    }

    function piLabel(k, den) {
        // k * π / den
        const g = (a, b) => (b ? g(b, a % b) : a);
        const d0 = g(Math.abs(k), den) || 1;
        const n = k / d0, d = den / d0;
        if (n === 0) return "0";
        const sign = n < 0 ? "−" : "";
        const an = Math.abs(n);
        return sign + (an === 1 ? "" : an) + "π" + (d === 1 ? "" : "/" + d);
    }

    class Plot {
        constructor(canvas, opts) {
            opts = opts || {};
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.home = Object.assign({ xmin: -6, xmax: 6, ymin: -4, ymax: 4 }, opts.view || {});
            this.view = Object.assign({}, this.home);
            this.equal = !!opts.equal;
            this.piAxis = !!opts.piAxis;
            this.interactive = !!opts.interactive;
            this.traceEnabled = opts.trace !== false;
            this.items = [];
            this.trace = null;
            this.onView = opts.onView || null;
            this.w = 0; this.h = 0;
            this._pointers = new Map();
            this._bind();
            this._ro = new ResizeObserver(() => this.resize());
            this._ro.observe(canvas.parentElement || canvas);
            instances.add(this);
            this.resize();
        }

        destroy() {
            this._ro.disconnect();
            instances.delete(this);
        }

        setItems(items) { this.items = items || []; this.draw(); }
        setView(v) { this.home = Object.assign({}, v); this.view = Object.assign({}, v); this._fixAspect(); this.draw(); }
        reset() { this.view = Object.assign({}, this.home); this._fixAspect(); this.draw(); this._emit(); }

        zoom(factor, cx, cy) {
            const v = this.view;
            if (cx === undefined) { cx = (v.xmin + v.xmax) / 2; cy = (v.ymin + v.ymax) / 2; }
            const nw = (v.xmax - v.xmin) * factor, nh = (v.ymax - v.ymin) * factor;
            if (nw < 1e-6 || nw > 1e7) return;
            const fx = (cx - v.xmin) / (v.xmax - v.xmin), fy = (cy - v.ymin) / (v.ymax - v.ymin);
            v.xmin = cx - nw * fx; v.xmax = v.xmin + nw;
            v.ymin = cy - nh * fy; v.ymax = v.ymin + nh;
            this.draw();
            this._emit();
        }

        _emit() { if (this.onView) this.onView(this.view); }

        resize() {
            const el = this.canvas;
            const w = el.clientWidth, h = el.clientHeight;
            if (!w || !h) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
            el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.w = w; this.h = h;
            this._fixAspect();
            this.draw();
        }

        _fixAspect() {
            if (!this.equal || !this.w) return;
            const v = this.view;
            const ux = (v.xmax - v.xmin) / this.w;
            const uy = (v.ymax - v.ymin) / this.h;
            if (Math.abs(ux - uy) / ux < 1e-6) return;
            // Daha geniş olan aralığı koru, diğerini genişlet
            if (ux > uy) {
                const cy = (v.ymin + v.ymax) / 2, hh = (ux * this.h) / 2;
                v.ymin = cy - hh; v.ymax = cy + hh;
            } else {
                const cx = (v.xmin + v.xmax) / 2, hw = (uy * this.w) / 2;
                v.xmin = cx - hw; v.xmax = cx + hw;
            }
        }

        X(x) { const v = this.view; return ((x - v.xmin) / (v.xmax - v.xmin)) * this.w; }
        Y(y) { const v = this.view; return this.h - ((y - v.ymin) / (v.ymax - v.ymin)) * this.h; }
        ix(px) { const v = this.view; return v.xmin + (px / this.w) * (v.xmax - v.xmin); }
        iy(py) { const v = this.view; return v.ymin + ((this.h - py) / this.h) * (v.ymax - v.ymin); }

        /* ---------- Etkileşim ---------- */
        _bind() {
            const c = this.canvas;
            c.addEventListener("pointerdown", (e) => {
                if (e.pointerType === "mouse" && e.button !== 0) return;
                this._pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
                this._moved = false;
                this._down = { x: e.offsetX, y: e.offsetY };
                if (this.interactive) c.setPointerCapture(e.pointerId);
            });
            c.addEventListener("pointermove", (e) => {
                const prev = this._pointers.get(e.pointerId);
                if (!prev) {
                    if (e.pointerType === "mouse") this._setTrace(e.offsetX);
                    return;
                }
                const cur = { x: e.offsetX, y: e.offsetY };
                if (this._down && Math.hypot(cur.x - this._down.x, cur.y - this._down.y) > 4) this._moved = true;
                if (!this.interactive) { this._pointers.set(e.pointerId, cur); if (e.pointerType === "mouse") this._setTrace(cur.x); return; }
                if (this._pointers.size === 1) {
                    const dx = this.ix(prev.x) - this.ix(cur.x), dy = this.iy(prev.y) - this.iy(cur.y);
                    const v = this.view;
                    v.xmin += dx; v.xmax += dx; v.ymin += dy; v.ymax += dy;
                    this._pointers.set(e.pointerId, cur);
                    this.trace = null;
                    this.draw();
                    this._emit();
                } else if (this._pointers.size === 2) {
                    const pts = Array.from(this._pointers.values());
                    const other = pts.find((p) => p !== prev);
                    const d0 = Math.hypot(prev.x - other.x, prev.y - other.y);
                    const d1 = Math.hypot(cur.x - other.x, cur.y - other.y);
                    this._pointers.set(e.pointerId, cur);
                    if (d0 > 10 && d1 > 10) {
                        const mx = (cur.x + other.x) / 2, my = (cur.y + other.y) / 2;
                        this.zoom(d0 / d1, this.ix(mx), this.iy(my));
                    }
                }
            });
            const up = (e) => {
                const had = this._pointers.has(e.pointerId);
                this._pointers.delete(e.pointerId);
                if (had && !this._moved && e.type === "pointerup") this._setTrace(e.offsetX);
            };
            c.addEventListener("pointerup", up);
            c.addEventListener("pointercancel", up);
            c.addEventListener("pointerleave", (e) => {
                if (e.pointerType === "mouse" && this.trace) { this.trace = null; this.draw(); }
            });
            c.addEventListener("wheel", (e) => {
                if (!this.interactive) return;
                e.preventDefault();
                const f = Math.exp(e.deltaY * 0.0015);
                this.zoom(f, this.ix(e.offsetX), this.iy(e.offsetY));
            }, { passive: false });
            c.addEventListener("dblclick", () => { if (this.interactive) this.reset(); });
        }

        _setTrace(px) {
            if (!this.traceEnabled) return;
            const it = this.items.find((i) => i.type === "fn" && i.trace !== false && !i.hidden);
            if (!it) return;
            const x = this.ix(px);
            const y = it.f(x);
            this.trace = isFinite(y) ? { x, y, color: it.color } : null;
            this.draw();
        }

        /* ---------- Çizim ---------- */
        draw() {
            if (!this.w) return;
            const ctx = this.ctx;
            const theme = {
                bg: cssVar("--white") || "#fff",
                grid: cssVar("--plot-grid"),
                major: cssVar("--plot-grid-major"),
                axis: cssVar("--plot-axis"),
                text: cssVar("--plot-text"),
                ink: cssVar("--ink"),
            };
            this.theme = theme;
            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, this.w, this.h);

            for (const it of this.items) if (it.type === "shadeX" && !it.hidden) this._shadeX(it);
            this._grid();
            for (const it of this.items) {
                if (it.hidden) continue;
                switch (it.type) {
                    case "fn": this._fn(it); break;
                    case "param": this._param(it); break;
                    case "hline": this._line(it, true); break;
                    case "vline": this._line(it, false); break;
                    case "seg": this._seg(it); break;
                }
            }
            for (const it of this.items) {
                if (it.hidden) continue;
                if (it.type === "point") this._point(it);
                else if (it.type === "text") this._text(it);
            }
            for (const it of this.items) if (it.type === "fn" && it.label && !it.hidden) this._fnLabel(it);
            if (this.trace) this._traceMark();
        }

        _grid() {
            const ctx = this.ctx, v = this.view, t = this.theme;
            const xs = this.piAxis ? null : niceStep((v.xmax - v.xmin) / Math.max(4, this.w / 90));
            const ys = niceStep((v.ymax - v.ymin) / Math.max(3, this.h / 70));
            ctx.lineWidth = 1;

            // x ekseni adımları
            let xTicks = [];
            if (this.piAxis) {
                const spanPi = (v.xmax - v.xmin) / Math.PI;
                const target = spanPi / Math.max(4, this.w / 90);
                let den = 1, mult = 1;
                const cand = [[1, 4], [1, 2], [1, 1], [2, 1], [4, 1], [8, 1]];
                for (const [m, d] of cand) { mult = m; den = d; if (m / d >= target) break; }
                const stepVal = (mult / den) * Math.PI;
                const k0 = Math.ceil(v.xmin / stepVal), k1 = Math.floor(v.xmax / stepVal);
                for (let k = k0; k <= k1; k++) xTicks.push({ v: k * stepVal, label: piLabel(k * mult, den) });
            } else {
                const k0 = Math.ceil(v.xmin / xs), k1 = Math.floor(v.xmax / xs);
                for (let k = k0; k <= k1; k++) xTicks.push({ v: k * xs, label: tickLabel(k * xs, xs) });
            }
            const yTicks = [];
            {
                const k0 = Math.ceil(v.ymin / ys), k1 = Math.floor(v.ymax / ys);
                for (let k = k0; k <= k1; k++) yTicks.push({ v: k * ys, label: tickLabel(k * ys, ys) });
            }

            // ara çizgiler
            if (!this.piAxis) {
                ctx.strokeStyle = t.grid;
                ctx.beginPath();
                const mx = xs / 5;
                for (let x = Math.ceil(v.xmin / mx) * mx; x <= v.xmax; x += mx) { const p = Math.round(this.X(x)) + 0.5; ctx.moveTo(p, 0); ctx.lineTo(p, this.h); }
                const my = ys / 5;
                for (let y = Math.ceil(v.ymin / my) * my; y <= v.ymax; y += my) { const p = Math.round(this.Y(y)) + 0.5; ctx.moveTo(0, p); ctx.lineTo(this.w, p); }
                ctx.stroke();
            }
            // ana çizgiler
            ctx.strokeStyle = t.major;
            ctx.beginPath();
            for (const tk of xTicks) { const p = Math.round(this.X(tk.v)) + 0.5; ctx.moveTo(p, 0); ctx.lineTo(p, this.h); }
            for (const tk of yTicks) { const p = Math.round(this.Y(tk.v)) + 0.5; ctx.moveTo(0, p); ctx.lineTo(this.w, p); }
            ctx.stroke();

            // eksenler
            const ax = this.Y(0), ay = this.X(0);
            ctx.strokeStyle = t.axis;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            if (ax >= 0 && ax <= this.h) { ctx.moveTo(0, ax); ctx.lineTo(this.w, ax); }
            if (ay >= 0 && ay <= this.w) { ctx.moveTo(ay, 0); ctx.lineTo(ay, this.h); }
            ctx.stroke();
            // ok uçları
            ctx.fillStyle = t.axis;
            if (ax >= 0 && ax <= this.h) this._arrowHead(this.w - 1, ax, 0);
            if (ay >= 0 && ay <= this.w) this._arrowHead(ay, 1, -Math.PI / 2);

            // etiketler
            ctx.fillStyle = t.text;
            ctx.font = "600 11.5px Inter, system-ui, sans-serif";
            const labelY = Math.min(Math.max(ax + 4, 4), this.h - 16);
            ctx.textAlign = "center"; ctx.textBaseline = "top";
            for (const tk of xTicks) {
                if (Math.abs(tk.v) < 1e-12) continue;
                const px = this.X(tk.v);
                if (px < 12 || px > this.w - 12) continue;
                this._haloText(tk.label, px, labelY);
            }
            const labelX = Math.min(Math.max(ay - 6, 26), this.w - 4);
            ctx.textAlign = "right"; ctx.textBaseline = "middle";
            for (const tk of yTicks) {
                if (Math.abs(tk.v) < 1e-12) continue;
                const py = this.Y(tk.v);
                if (py < 10 || py > this.h - 10) continue;
                this._haloText(tk.label, labelX, py);
            }
            if (ax >= 0 && ax <= this.h && ay >= 0 && ay <= this.w) {
                ctx.textAlign = "right"; ctx.textBaseline = "top";
                this._haloText("0", ay - 5, ax + 4);
            }
            ctx.font = "italic 700 13px Inter, system-ui, sans-serif";
            ctx.fillStyle = t.axis;
            if (ax >= 0 && ax <= this.h) { ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("x", this.w - 6, ax - 5); }
            if (ay >= 0 && ay <= this.w) { ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("y", ay + 7, 4); }
        }

        _haloText(txt, x, y) {
            const ctx = this.ctx;
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.theme.bg;
            ctx.strokeText(txt, x, y);
            ctx.restore();
            ctx.fillText(txt, x, y);
        }

        _arrowHead(x, y, ang) {
            const ctx = this.ctx;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(ang);
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(-8, -4); ctx.lineTo(-8, 4); ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        _isJump(f, x0, y0, x1, y1) {
            for (let i = 0; i < 40; i++) {
                const xm = (x0 + x1) / 2;
                if (xm === x0 || xm === x1) break;
                const ym = f(xm);
                if (!isFinite(ym)) return true;
                if (Math.abs(ym - y0) > Math.abs(y1 - ym)) { x1 = xm; y1 = ym; } else { x0 = xm; y0 = ym; }
            }
            return Math.abs(this.Y(y1) - this.Y(y0)) > 1;
        }

        _edge(f, xa, xb) {
            // xa'da f tanımlı, xb'de değil (ya da tersi): sınırı ikiye bölerek bul
            const okA = isFinite(f(xa));
            for (let i = 0; i < 40; i++) {
                const xm = (xa + xb) / 2;
                if (isFinite(f(xm)) === okA) xa = xm; else xb = xm;
            }
            return okA ? xa : xb;
        }

        _stroke(it) {
            const ctx = this.ctx;
            ctx.strokeStyle = it.color || COLORS.blue;
            ctx.lineWidth = it.width || 2.6;
            ctx.lineJoin = "round"; ctx.lineCap = "round";
            ctx.setLineDash(it.dash ? (Array.isArray(it.dash) ? it.dash : [7, 6]) : []);
            ctx.globalAlpha = it.alpha === undefined ? 1 : it.alpha;
        }
        _endStroke() { this.ctx.setLineDash([]); this.ctx.globalAlpha = 1; }

        _fn(it) {
            const ctx = this.ctx, f = it.f, v = this.view;
            const a = Math.max(v.xmin, it.xmin === undefined ? -Infinity : it.xmin);
            const b = Math.min(v.xmax, it.xmax === undefined ? Infinity : it.xmax);
            if (!(b > a)) return;
            const n = Math.max(2, Math.ceil(((b - a) / (v.xmax - v.xmin)) * this.w * 1.5));
            const clampY = (y) => Math.max(-5000, Math.min(this.h + 5000, this.Y(y)));
            this._stroke(it);
            ctx.beginPath();
            let px = null, py = null, pen = false;
            for (let i = 0; i <= n; i++) {
                const x = a + ((b - a) * i) / n;
                const y = f(x);
                const ok = isFinite(y);
                if (!ok) {
                    if (pen && px !== null) {
                        const xe = this._edge(f, px, x), ye = f(xe);
                        if (isFinite(ye)) ctx.lineTo(this.X(xe), clampY(ye));
                    }
                    pen = false; px = x; py = null;
                    continue;
                }
                if (!pen) {
                    if (px !== null && py === null) {
                        const xe = this._edge(f, x, px), ye = f(xe);
                        if (isFinite(ye)) { ctx.moveTo(this.X(xe), clampY(ye)); pen = true; }
                    }
                    if (!pen) { ctx.moveTo(this.X(x), clampY(y)); pen = true; }
                    else ctx.lineTo(this.X(x), clampY(y));
                } else if (Math.abs(this.Y(y) - this.Y(py)) > 2 && this._isJump(f, px, py, x, y)) {
                    ctx.moveTo(this.X(x), clampY(y));
                } else {
                    ctx.lineTo(this.X(x), clampY(y));
                }
                px = x; py = y;
            }
            ctx.stroke();
            this._endStroke();
        }

        _param(it) {
            const ctx = this.ctx;
            const n = it.steps || 400;
            this._stroke(it);
            ctx.beginPath();
            let pen = false, prev = null;
            for (let i = 0; i <= n; i++) {
                const t = it.t0 + ((it.t1 - it.t0) * i) / n;
                const x = it.x(t), y = it.y(t);
                if (!isFinite(x) || !isFinite(y)) { pen = false; continue; }
                const sx = this.X(x), sy = Math.max(-5000, Math.min(this.h + 5000, this.Y(y)));
                if (pen && prev && Math.hypot(sx - prev[0], sy - prev[1]) > this.h * 0.8) pen = false;
                if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
                prev = [sx, sy];
            }
            if (it.fill) { ctx.fillStyle = it.fill; ctx.fill(); }
            ctx.stroke();
            this._endStroke();
        }

        _line(it, horizontal) {
            const ctx = this.ctx;
            this._stroke(Object.assign({ width: 1.8, dash: true }, it));
            ctx.beginPath();
            if (horizontal) { const y = this.Y(it.y); ctx.moveTo(0, y); ctx.lineTo(this.w, y); }
            else { const x = this.X(it.x); ctx.moveTo(x, 0); ctx.lineTo(x, this.h); }
            ctx.stroke();
            this._endStroke();
            if (it.label) {
                ctx.fillStyle = it.color || this.theme.ink;
                ctx.font = "700 12.5px Inter, system-ui, sans-serif";
                if (horizontal) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; this._haloText(it.label, 8, this.Y(it.y) - 4); }
                else { ctx.textAlign = "left"; ctx.textBaseline = "top"; this._haloText(it.label, this.X(it.x) + 6, 8); }
            }
        }

        _seg(it) {
            const ctx = this.ctx;
            this._stroke(Object.assign({ width: 2.2 }, it));
            const x1 = this.X(it.x1), y1 = this.Y(it.y1), x2 = this.X(it.x2), y2 = this.Y(it.y2);
            ctx.beginPath();
            ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.stroke();
            this._endStroke();
            if (it.arrow) {
                ctx.fillStyle = it.color || COLORS.blue;
                this._arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1));
            }
            if (it.label) {
                ctx.fillStyle = it.color || this.theme.ink;
                ctx.font = "700 12.5px Inter, system-ui, sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                const ox = it.labelOffset ? it.labelOffset[0] : 0, oy = it.labelOffset ? it.labelOffset[1] : -12;
                this._haloText(it.label, (x1 + x2) / 2 + ox, (y1 + y2) / 2 + oy);
            }
        }

        _shadeX(it) {
            const ctx = this.ctx;
            const x1 = this.X(Math.max(it.a, this.view.xmin - 1)), x2 = this.X(Math.min(it.b, this.view.xmax + 1));
            ctx.fillStyle = it.color || "rgba(0,175,240,.12)";
            ctx.fillRect(x1, 0, x2 - x1, this.h);
        }

        _point(it) {
            const ctx = this.ctx;
            if (!isFinite(it.x) || !isFinite(it.y)) return;
            const x = this.X(it.x), y = this.Y(it.y), r = it.r || 5.5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = it.color || COLORS.blue;
            ctx.fillStyle = it.open ? this.theme.bg : (it.color || COLORS.blue);
            ctx.fill();
            ctx.stroke();
            if (it.label) {
                ctx.fillStyle = it.labelColor || this.theme.ink;
                ctx.font = "700 12.5px Inter, system-ui, sans-serif";
                const pos = it.labelPos || "ne";
                const dx = pos.includes("w") ? -9 : 9, dy = pos.includes("s") ? 9 : -9;
                ctx.textAlign = dx < 0 ? "right" : "left";
                ctx.textBaseline = dy < 0 ? "bottom" : "top";
                this._haloText(it.label, x + dx, y + dy);
            }
        }

        _text(it) {
            const ctx = this.ctx;
            ctx.fillStyle = it.color || this.theme.ink;
            ctx.font = it.font || "700 13px Inter, system-ui, sans-serif";
            ctx.textAlign = it.align || "center";
            ctx.textBaseline = it.baseline || "middle";
            this._haloText(it.text, this.X(it.x), this.Y(it.y));
        }

        _fnLabel(it) {
            const ctx = this.ctx, v = this.view;
            const fracs = it.labelAt !== undefined ? [it.labelAt] : [0.86, 0.75, 0.65, 0.92, 0.55, 0.3, 0.15];
            for (const fr of fracs) {
                const x = v.xmin + (v.xmax - v.xmin) * fr;
                if (it.xmin !== undefined && x < it.xmin) continue;
                if (it.xmax !== undefined && x > it.xmax) continue;
                const y = it.f(x);
                if (!isFinite(y)) continue;
                const py = this.Y(y);
                if (py < 18 || py > this.h - 18) continue;
                ctx.font = "700 13px Inter, system-ui, sans-serif";
                ctx.fillStyle = it.color;
                ctx.textAlign = "left"; ctx.textBaseline = "bottom";
                this._haloText(it.label, Math.min(this.X(x) + 6, this.w - ctx.measureText(it.label).width - 6), py - 7);
                return;
            }
        }

        _traceMark() {
            const ctx = this.ctx, t = this.trace;
            const x = this.X(t.x), y = this.Y(t.y);
            if (y < -10 || y > this.h + 10) return;
            ctx.strokeStyle = t.color; ctx.globalAlpha = .45; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x, this.Y(0));
            ctx.moveTo(x, y); ctx.lineTo(this.X(0), y);
            ctx.stroke();
            ctx.setLineDash([]); ctx.globalAlpha = 1;
            this._point({ x: t.x, y: t.y, color: t.color, r: 5 });
            const label = `(${MathParser.fmt(t.x, 3)}, ${MathParser.fmt(t.y, 3)})`;
            ctx.font = "700 12.5px Inter, system-ui, sans-serif";
            const tw = ctx.measureText(label).width + 16;
            let bx = x + 10, by = y - 34;
            if (bx + tw > this.w - 4) bx = x - tw - 10;
            if (by < 4) by = y + 12;
            ctx.fillStyle = this.theme.ink;
            ctx.globalAlpha = .9;
            this._roundRect(bx, by, tw, 24, 8);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = this.theme.bg;
            ctx.textAlign = "left"; ctx.textBaseline = "middle";
            ctx.fillText(label, bx + 8, by + 12);
        }

        _roundRect(x, y, w, h, r) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }
    }

    Plot.COLORS = COLORS;
    Plot.PALETTE = PALETTE;
    Plot.redrawAll = () => instances.forEach((p) => p.draw());
    Plot.prune = () => instances.forEach((p) => { if (!document.body.contains(p.canvas)) p.destroy(); });

    global.Plot = Plot;
})(window);
