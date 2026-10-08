/*
 * MathParser - "2x^2 - 3sin x", "|x-1|", "[x]", "log_2(8)", "f(x)=x^2" gibi yazımları
 * eval kullanmadan hızlı JS fonksiyonlarına çevirir.
 *
 *   const c = MathParser.compile("a*x^2 + 1");
 *   c.fn({ x: 2, a: 3 })  // 13
 *   c.vars                // ["a", "x"]
 */
(function (global) {
    "use strict";

    function powReal(b, e) {
        if (b >= 0 || Number.isInteger(e)) return Math.pow(b, e);
        // Negatif tabanda tek paydalı rasyonel üsler: (-8)^(1/3) = -2
        for (let q = 3; q <= 15; q += 2) {
            const p = e * q;
            if (Math.abs(p - Math.round(p)) < 1e-9) {
                const r = Math.pow(-b, e);
                return Math.abs(Math.round(p)) % 2 === 0 ? r : -r;
            }
        }
        return NaN;
    }

    function nthRoot(x, n) {
        if (x < 0 && Number.isInteger(n) && Math.abs(n) % 2 === 1) return -Math.pow(-x, 1 / n);
        return Math.pow(x, 1 / n);
    }

    function factorial(n) {
        if (!Number.isInteger(n) || n < 0) return NaN;
        if (n > 170) return Infinity;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    const FUNCS = {
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        cot: (x) => 1 / Math.tan(x), sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x),
        arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
        arccot: (x) => Math.PI / 2 - Math.atan(x),
        sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
        coth: (x) => 1 / Math.tanh(x), sech: (x) => 1 / Math.cosh(x), csch: (x) => 1 / Math.sinh(x),
        arcsinh: Math.asinh, arccosh: Math.acosh, arctanh: Math.atanh,
        arccoth: (x) => 0.5 * Math.log((x + 1) / (x - 1)),
        exp: Math.exp, ln: Math.log, sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
        floor: Math.floor, ceil: Math.ceil, round: Math.round, sgn: (x) => (x > 0 ? 1 : x < 0 ? -1 : 0),
        log: (a, b) => (b === undefined ? Math.log10(a) : Math.log(b) / Math.log(a)),
        root: (n, x) => nthRoot(x, n),
        min: Math.min, max: Math.max,
    };
    const ALIASES = {
        asin: "arcsin", acos: "arccos", atan: "arctan", acot: "arccot",
        asinh: "arcsinh", acosh: "arccosh", atanh: "arctanh",
        argsinh: "arcsinh", argcosh: "arccosh", argtanh: "arctanh", argcoth: "arccoth",
        sign: "sgn", tg: "tan", ctg: "cot", cotg: "cot", cosec: "csc", cosech: "csch",
        karekok: "sqrt", tamkisim: "floor", mutlak: "abs",
    };
    const INVERSE = {
        sin: "arcsin", cos: "arccos", tan: "arctan", cot: "arccot",
        sinh: "arcsinh", cosh: "arccosh", tanh: "arctanh", coth: "arccoth",
    };
    const CONSTS = { pi: Math.PI, e: Math.E };

    function normalize(src) {
        return String(src)
            .replace(/²/g, "^2").replace(/³/g, "^3").replace(/¹/g, "^1")
            .replace(/[·×∙⋅]/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-")
            .replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/∛/g, "cbrt")
            .replace(/⟦/g, "[").replace(/⟧/g, "]").replace(/θ/g, "t");
    }

    class ParseError extends Error {}

    function tokenize(src, userFns) {
        const s = normalize(src);
        const isKnown = (w) => w in FUNCS || w in ALIASES || w in CONSTS || (userFns && w in userFns);
        const out = [];
        let i = 0;
        while (i < s.length) {
            const ch = s[i];
            if (/\s/.test(ch)) { i++; continue; }
            if (/[0-9.]/.test(ch)) {
                let j = i;
                while (j < s.length && /[0-9.]/.test(s[j])) j++;
                const txt = s.slice(i, j);
                const v = Number(txt);
                if (!isFinite(v) || (txt.match(/\./g) || []).length > 1) throw new ParseError(`"${txt}" sayısı anlaşılamadı`);
                out.push({ t: "num", v });
                i = j;
                continue;
            }
            if (/[a-zA-Z]/.test(ch)) {
                let j = i;
                while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
                const word = s.slice(i, j);
                // "sinx", "ax", "pix" gibi bitişik yazımları bilinen adlara ayır (en uzun eşleşme)
                let k = 0;
                while (k < word.length) {
                    let found = null;
                    for (let L = Math.min(word.length - k, 9); L >= 2; L--) {
                        const sub = word.slice(k, k + L);
                        if (isKnown(sub)) { found = sub; break; }
                    }
                    if (!found) found = word[k];
                    const name = ALIASES[found] || found;
                    if (userFns && found in userFns) out.push({ t: "ufn", name: found });
                    else if (name in FUNCS) out.push({ t: "fn", name });
                    else if (found in CONSTS) out.push({ t: "const", v: CONSTS[found], name: found });
                    else out.push({ t: "var", name: found });
                    k += found.length;
                }
                i = j;
                continue;
            }
            if ("+-*/^(),|[]_!".includes(ch)) {
                out.push({ t: "op", v: ch });
                i++;
                continue;
            }
            throw new ParseError(`"${ch}" karakteri anlaşılamadı`);
        }
        return out;
    }

    class Parser {
        constructor(tokens, userFns) {
            this.tk = tokens;
            this.i = 0;
            this.vars = new Set();
            this.userFns = userFns || {};
            this.usedFns = new Set();
            this.absDepth = 0;
        }
        peek() { return this.tk[this.i]; }
        next() { return this.tk[this.i++]; }
        isOp(v) { const t = this.peek(); return t && t.t === "op" && t.v === v; }
        expectOp(v, msg) {
            if (!this.isOp(v)) throw new ParseError(msg || `"${v}" bekleniyordu`);
            this.i++;
        }
        startsFactor() {
            const t = this.peek();
            if (!t) return false;
            // "2|x+1|": mutlak değer içinde değilsek "|" yeni bir çarpan açar; içindeysek kapatır
            if (t.t === "op") return t.v === "(" || t.v === "[" || (t.v === "|" && this.absDepth === 0);
            return true;
        }

        parse() {
            if (!this.tk.length) throw new ParseError("İfade boş");
            const e = this.parseExpr();
            if (this.i < this.tk.length) {
                const t = this.peek();
                throw new ParseError(t.t === "op" ? `Beklenmeyen "${t.v}"` : "İfadenin sonu anlaşılamadı");
            }
            return e;
        }
        parseExpr() {
            let l = this.parseTerm();
            while (this.isOp("+") || this.isOp("-")) {
                const op = this.next().v;
                const a = l, b = this.parseTerm();
                l = op === "+" ? (env) => a(env) + b(env) : (env) => a(env) - b(env);
            }
            return l;
        }
        parseTerm() {
            let l = this.parseUnary();
            for (;;) {
                if (this.isOp("*") || this.isOp("/")) {
                    const op = this.next().v;
                    const a = l, b = this.parseUnary();
                    l = op === "*" ? (env) => a(env) * b(env) : (env) => a(env) / b(env);
                } else if (this.startsFactor()) {
                    const a = l, b = this.parsePower();
                    l = (env) => a(env) * b(env);
                } else break;
            }
            return l;
        }
        parseUnary() {
            if (this.isOp("-")) { this.i++; const a = this.parseUnary(); return (env) => -a(env); }
            if (this.isOp("+")) { this.i++; return this.parseUnary(); }
            return this.parsePower();
        }
        parsePower() {
            const base = this.parsePostfix();
            if (this.isOp("^")) {
                this.i++;
                const ex = this.parseUnary();
                return (env) => powReal(base(env), ex(env));
            }
            return base;
        }
        parsePostfix() {
            let p = this.parsePrimary();
            while (this.isOp("!")) { this.i++; const a = p; p = (env) => factorial(a(env)); }
            return p;
        }
        parsePrimary() {
            const t = this.next();
            if (!t) throw new ParseError("İfade yarım kaldı");
            if (t.t === "num") { const v = t.v; return () => v; }
            if (t.t === "const") { const v = t.v; return () => v; }
            if (t.t === "var") {
                const name = t.name;
                this.vars.add(name);
                return (env) => { const v = env[name]; return v === undefined ? NaN : v; };
            }
            if (t.t === "fn") return this.parseCall(t.name);
            if (t.t === "ufn") return this.parseUserCall(t.name);
            if (t.t === "op") {
                if (t.v === "(") { const e = this.parseExpr(); this.expectOp(")", "Kapanmayan parantez: \")\" eksik"); return e; }
                if (t.v === "|") {
                    this.absDepth++;
                    const e = this.parseExpr();
                    this.absDepth--;
                    this.expectOp("|", "Mutlak değer kapanmadı: \"|\" eksik");
                    return (env) => Math.abs(e(env));
                }
                if (t.v === "[") { const e = this.parseExpr(); this.expectOp("]", "Tam kısım kapanmadı: \"]\" eksik"); return (env) => Math.floor(e(env) + 1e-12); }
                throw new ParseError(`Beklenmeyen "${t.v}"`);
            }
            throw new ParseError("İfade anlaşılamadı");
        }
        parseArgsOrImplicit() {
            if (this.isOp("(")) {
                this.i++;
                const args = [this.parseExpr()];
                while (this.isOp(",")) { this.i++; args.push(this.parseExpr()); }
                this.expectOp(")", "Fonksiyon parantezi kapanmadı");
                return args;
            }
            // Parantezsiz: "sin 2x" -> sin(2x); başka bir fonksiyon adında durur
            let a = this.parseUnary();
            while (this.startsFactor() && this.peek().t !== "fn" && this.peek().t !== "ufn" && !this.isOp("(")) {
                const prev = a, b = this.parsePower();
                a = (env) => prev(env) * b(env);
            }
            return [a];
        }
        parseCall(name) {
            let base = null, power = null;
            if (name === "log" && this.isOp("_")) { this.i++; base = this.parsePostfix(); }
            if (this.isOp("^")) {
                // sin^-1 x -> arcsin x ; sin^2 x -> (sin x)^2
                const t1 = this.tk[this.i + 1], t2 = this.tk[this.i + 2];
                if (t1 && t1.t === "op" && t1.v === "-" && t2 && t2.t === "num" && t2.v === 1 && INVERSE[name]) {
                    this.i += 3;
                    name = INVERSE[name];
                } else {
                    this.i++;
                    power = this.parsePostfix();
                }
            }
            const f = FUNCS[name];
            const args = this.parseArgsOrImplicit();
            let call;
            if (base) {
                const b = base, a0 = args[0];
                call = (env) => Math.log(a0(env)) / Math.log(b(env));
            } else if (args.length === 1) {
                const a0 = args[0];
                call = (env) => f(a0(env));
            } else if (args.length === 2) {
                const a0 = args[0], a1 = args[1];
                call = (env) => f(a0(env), a1(env));
            } else {
                call = (env) => f.apply(null, args.map((a) => a(env)));
            }
            if (power) { const c = call, p = power; return (env) => powReal(c(env), p(env)); }
            return call;
        }
        parseUserCall(name) {
            const uf = this.userFns[name];
            this.usedFns.add(name);
            let power = null;
            if (this.isOp("^")) { this.i++; power = this.parsePostfix(); }
            const args = this.parseArgsOrImplicit();
            const a0 = args[0], pname = uf.param, body = uf.fn;
            uf.vars.forEach((v) => { if (v !== pname) this.vars.add(v); });
            const call = (env) => {
                const arg = a0(env);
                const saved = env[pname];
                env[pname] = arg;
                const r = body(env);
                env[pname] = saved;
                return r;
            };
            if (power) { const p = power; return (env) => powReal(call(env), p(env)); }
            return call;
        }
    }

    function compile(src, userFns) {
        const tokens = tokenize(src, userFns);
        const p = new Parser(tokens, userFns);
        const fn = p.parse();
        return { fn, vars: Array.from(p.vars).sort(), usedFns: Array.from(p.usedFns) };
    }

    /* Tek değişkenli hızlı çağrı: f(x) */
    function fx(src, params, userFns) {
        const c = compile(src, userFns);
        const env = Object.assign({}, params || {});
        const f = (x) => { env.x = x; return c.fn(env); };
        f.env = env;
        f.vars = c.vars;
        return f;
    }

    /*
     * Grafik çizicideki bir satırı sınıflandırır:
     *   "f(x) = x^2"  -> { kind: "def", name: "f", param: "x", body: "x^2" }
     *   "y = 2x"      -> { kind: "expr", body: "2x" }
     *   "x = 3"       -> { kind: "vline", body: "3" }
     *   "a = 2"       -> { kind: "param", name: "a", body: "2" }
     *   "2x+1"        -> { kind: "expr", body: "2x+1" }
     */
    function classify(line) {
        const s = normalize(line).trim();
        let m = s.match(/^([a-zA-Z])\s*\(\s*([a-zA-Z])\s*\)\s*=(.*)$/);
        if (m) return { kind: "def", name: m[1], param: m[2], body: m[3] };
        m = s.match(/^y\s*=(.*)$/);
        if (m) return { kind: "expr", body: m[1] };
        m = s.match(/^x\s*=(.*)$/);
        if (m) return { kind: "vline", body: m[1] };
        m = s.match(/^([a-wzA-Z])\s*=\s*([-+]?[0-9.]+)\s*$/);
        if (m) return { kind: "param", name: m[1], body: m[2] };
        return { kind: "expr", body: s };
    }

    /* Sayıyı okunur biçimde: 0.333333 -> "0.3333", 1e-17 -> "0" */
    function fmt(v, digits) {
        if (v === undefined || v === null || isNaN(v)) return "tanımsız";
        if (!isFinite(v)) return v > 0 ? "∞" : "−∞";
        if (Math.abs(v) < 1e-10) return "0";
        const d = digits === undefined ? 4 : digits;
        let s;
        if (Math.abs(v) >= 1e7 || Math.abs(v) < 1e-4) s = v.toExponential(2);
        else s = String(parseFloat(v.toFixed(d)));
        return s.replace("-", "−");
    }

    /* 0.5235987 -> "π/6" gibi; bulamazsa null */
    function piFrac(v) {
        if (!isFinite(v)) return null;
        if (Math.abs(v) < 1e-9) return "0";
        for (const den of [1, 2, 3, 4, 6, 12]) {
            const num = (v / Math.PI) * den;
            const r = Math.round(num);
            if (r !== 0 && Math.abs(num - r) < 1e-7) {
                let g = gcd(Math.abs(r), den);
                const n = r / g, d = den / g;
                const sign = n < 0 ? "−" : "";
                const an = Math.abs(n);
                const top = (an === 1 ? "" : an) + "π";
                return sign + (d === 1 ? top : top + "/" + d);
            }
        }
        return null;
    }
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }

    global.MathParser = { compile, fx, classify, fmt, piFrac, powReal, FUNCS, ParseError };
})(window);
