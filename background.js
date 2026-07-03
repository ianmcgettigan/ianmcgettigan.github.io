import K from "https://cdn.skypack.dev/delaunator@5.0.0";
(function () {
    const i = document.createElement("link").relList;
    if (i && i.supports && i.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) e(a);
    new MutationObserver((a) => {
        for (const l of a)
            if (l.type === "childList")
                for (const d of l.addedNodes) d.tagName === "LINK" && d.rel === "modulepreload" && e(d);
    }).observe(document, { childList: !0, subtree: !0 });
    function u(a) {
        const l = {};
        return (
            a.integrity && (l.integrity = a.integrity),
            a.referrerPolicy && (l.referrerPolicy = a.referrerPolicy),
            a.crossOrigin === "use-credentials"
            ? (l.credentials = "include")
            : a.crossOrigin === "anonymous"
            ? (l.credentials = "omit")
            : (l.credentials = "same-origin"),
            l
        );
    }
    function e(a) {
        if (a.ep) return;
        a.ep = !0;
        const l = u(a);
        fetch(a.href, l);
    }
})();
const j = 30,
    Y = 2e-5,
    w = 0.8,
    S = 1.5,
    x = 0.4,
    J = 4e-4,
    Q = 8,
    s = 400,
    F = [0.412, 1.0, 0.369],
    C = [0.149, 0.635, 0.412],
    L = [0.043, 0.38, 0.125];
let O, m, p, r, P, y, R = 0, T = 0, D, N = 0, g = new Float32Array(0), M = new Float32Array(0), n, B, z, b, E, U;

const Z = () => {
    n.bindBuffer(n.ARRAY_BUFFER, B);
    n.bufferData(n.ARRAY_BUFFER, g, n.STATIC_DRAW);
    n.vertexAttribPointer(b, 2, n.FLOAT, !1, 0, 0);
    n.bindBuffer(n.ARRAY_BUFFER, z);
    n.bufferData(n.ARRAY_BUFFER, M, n.STATIC_DRAW);
    n.vertexAttribPointer(E, 3, n.FLOAT, !1, 0, 0);
    n.drawArrays(n.TRIANGLES, 0, g.length / 2);
},
    q = () => {
        const t = window.devicePixelRatio || 1;
        O.width = m = Math.round(window.innerWidth * t);
        O.height = p = Math.round(window.innerHeight * t);
        n.viewport(0, 0, m, p);
        n.uniform2f(U, m, p);
    },
    $ = (t, i) => {
        const u = m + 2 * s,
            e = p + 2 * s,
            a = i + 2 * s,
            l = u * e,
            d = Math.ceil(Y * l) + 4,
            h = r.length / 2,
            f = new Float32Array(2 * d),
            A = new Float32Array(2 * d);
        let o = 8;
        for (let c = 8; c < 2 * h && !(!(r[c] < -400 || m + s < r[c] || r[c + 1] < -400 || p + s < r[c + 1]) && (f[o] = r[c], f[o + 1] = r[c + 1], A[o] = P[c], A[o + 1] = P[c + 1], o += 2, o === 2 * d)); c += 2) {}
        if (m > t && p > i) {
            const c = u * (p - i),
                v = (m - t) * a,
                H = c / (c + v);
            for (; o < 2 * d; o += 2) {
                Math.random() < H ? ((f[o] = u * Math.random() - s), (f[o + 1] = (p - i) * Math.random() + i + s)) : ((f[o] = (m - t) * Math.random() + t + s), (f[o + 1] = a * Math.random() - s));
                const _ = 2 * Math.PI * Math.random(),
                    V = (S - w) * Math.random() + w;
                A[o] = V * Math.cos(_);
                A[o + 1] = V * Math.sin(_);
            }
        } else if (m > t)
            for (; o < 2 * d; o += 2) {
                f[o] = (m - t) * Math.random() + t + s;
                f[o + 1] = e * Math.random() - s;
                const c = 2 * Math.PI * Math.random(),
                    v = (S - w) * Math.random() + w;
                A[o] = v * Math.cos(c);
                A[o + 1] = v * Math.sin(c);
            }
        else
            for (; o < 2 * d; o += 2) {
                f[o] = u * Math.random() - s;
                f[o + 1] = (p - i) * Math.random() + i + s;
                const c = 2 * Math.PI * Math.random(),
                    v = (S - w) * Math.random() + w;
                A[o] = v * Math.cos(c);
                A[o + 1] = v * Math.sin(c);
            }
        r = f;
        P = A;
        y = void 0;
    },
    k = () => {
        const t = m + 2 * s,
            i = p + 2 * s,
            u = t * i,
            e = Math.ceil(Y * u) + 4;
        r = new Float32Array(2 * e);
        P = new Float32Array(2 * e);
        for (let a = 8; a < 2 * e; a += 2) {
            r[a] = t * Math.random() - s;
            r[a + 1] = i * Math.random() - s;
            const l = 2 * Math.PI * Math.random(),
                d = (S - w) * Math.random() + w;
            P[a] = d * Math.cos(l);
            P[a + 1] = d * Math.sin(l);
        }
        G();
    },
    G = () => {
        r[0] = 0;
        r[1] = 0;
        r[2] = m + s;
        r[3] = 0;
        r[4] = 0;
        r[5] = p + s;
        r[6] = m + s;
        r[7] = p + s;
    },
    ee = (t) => {
        if (((t = t > 0 ? t % 4 : (t % 4) + 4), (t = Math.min(t, 4 - t)), t < 1)) return [(1 - t) * F[0] + t * C[0], (1 - t) * F[1] + t * C[1], (1 - t) * F[2] + t * C[2]];
        {
            const i = t - 1;
            return [(1 - i) * C[0] + i * L[0], (1 - i) * C[1] + i * L[1], (1 - i) * C[2] + i * L[2]];
        }
    },
    te = () => {
        const t = m + 2 * s,
            i = p + 2 * s;
        for (let e = 8; e < r.length; e += 2) (r[e] += P[e] * (1 + x * R)), (r[e + 1] += P[e + 1] * (1 + x * R)), r[e] < -400 ? (r[e] += t) : r[e] > m + s && (r[e] -= t), r[e + 1] < -400 ? (r[e + 1] += i) : r[e + 1] > p + s && (r[e + 1] -= i);
        (T += Q), R == D ? (N += 1) : (D = R), N >= 3 && (R = 0), y ? y.update() : (y = new K(r));
        const u = y.triangles;
        g.length !== 2 * u.length && (g = new Float32Array(2 * u.length));
        M.length !== 3 * u.length && (M = new Float32Array(3 * u.length));
        for (let e = 0; 3 * e < u.length; e++) {
            const a = u[3 * e],
                l = u[3 * e + 1],
                d = u[3 * e + 2];
            (g[6 * e] = r[2 * a]),
                (g[6 * e + 1] = r[2 * a + 1]),
                (g[6 * e + 2] = r[2 * l]),
                (g[6 * e + 3] = r[2 * l + 1]),
                (g[6 * e + 4] = r[2 * d]),
                (g[6 * e + 5] = r[2 * d + 1]);
            const h = (g[6 * e] + g[6 * e + 2] + g[6 * e + 4]) / 3,
                f = (g[6 * e + 1] + g[6 * e + 3] + g[6 * e + 5]) / 3,
                A = (3 * h + f) / (3 * m + p),
                [o, c, v] = ee(A + J * T);
            (M[9 * e] = o),
                (M[9 * e + 1] = c),
                (M[9 * e + 2] = v),
                (M[9 * e + 3] = o),
                (M[9 * e + 4] = c),
                (M[9 * e + 5] = v),
                (M[9 * e + 6] = o),
                (M[9 * e + 7] = c),
                (M[9 * e + 8] = v);
        }
    },
    oe = () => {
        if ((history.replaceState(null, "", "/"), (O = document.getElementById("canvas")), (n = O.getContext("webgl") || O.getContext("experimental-webgl")), !n)) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        const t = `
            attribute vec2 aVertexPosition;
            attribute vec3 aVertexColor;
            uniform vec2 uResolution;
            varying vec3 vColor;
            void main(void) {
              vec2 zeroToOne = aVertexPosition / uResolution;
              vec2 zeroToTwo = zeroToOne * 2.0;
              vec2 clipSpace = zeroToTwo - 1.0;
              gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
              vColor = aVertexColor;
            }
          `,
            i = `
            precision mediump float;
            varying vec3 vColor;
            void main(void) {
              gl_FragColor = vec4(vColor, 1.0);
            }
          `,
            u = (h, f, A) => {
                var o = h.createShader(A);
                return h.shaderSource(o, f), h.compileShader(o), h.getShaderParameter(o, h.COMPILE_STATUS) ? o : (console.error("Error compiling shader:", h.getShaderInfoLog(o)), h.deleteShader(o), null);
            },
            e = (h, f, A) => {
                const o = h.createProgram();
                return h.attachShader(o, f), h.attachShader(o, A), h.linkProgram(o), h.getProgramParameter(o, h.LINK_STATUS) ? o : (console.error("Error linking program:", h.getProgramInfoLog(o)), h.deleteProgram(o), null);
            },
            a = u(n, t, n.VERTEX_SHADER),
            l = u(n, i, n.FRAGMENT_SHADER),
            d = e(n, a, l);
        n.useProgram(d);
        b = n.getAttribLocation(d, "aVertexPosition");
        E = n.getAttribLocation(d, "aVertexColor");
        U = n.getUniformLocation(d, "uResolution");
        B = n.createBuffer();
        z = n.createBuffer();
        n.enableVertexAttribArray(b);
        n.enableVertexAttribArray(E);
        q();
        k();
        requestAnimationFrame(W);
    },
    W = (t) => {
        X(t);
        requestAnimationFrame(W);
    };
let I = 0;
const X = (t) => {
    !n || t - I < j || ((I = t), te(), Z());
},
    re = () => {
        I = 0;
        X(document.timeline.currentTime);
    },
    ne = () => {
        const t = m,
            i = p;
        q();
        $(t, i);
        G();
        re();
    },
    ae = (t) => {
        R = -Math.sign(t.wheelDelta) * Math.sqrt(Math.abs(t.wheelDeltaY));
        T += R;
    };
window.addEventListener("load", oe);
window.addEventListener("resize", ne);
window.addEventListener("wheel", ae);
