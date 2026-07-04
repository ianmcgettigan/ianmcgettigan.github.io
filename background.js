(() => {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
  });
  if (!gl) return; 

  const VERT = `
    attribute vec2 aPos;
    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const FRAG = `
    precision highp float;

    uniform vec2  uRes;
    uniform float uTime;
    uniform vec2  uMouse;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),                 hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.03;
        a *= 0.5;
      }
      return v;
    }

    float beam(float x, float center, float width, float seed, float t) {
      float d = abs(x - center) / width;
      float core = exp(-d * d * 3.0);
      float gate = 0.55 + 0.45 * noise(vec2(seed * 17.0, t * 0.35));
      return core * gate;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      float aspect = uRes.x / uRes.y;
      vec2 p = vec2(uv.x * aspect, uv.y);
      float t = uTime;

      vec2 drift = vec2(t * 0.010, t * -0.004);
      float q = fbm(p * 1.6 + drift);
      float m = fbm(p * 1.6 + drift + 0.4 * vec2(q, -q) + uMouse * 0.06);
      float mist = smoothstep(0.10, 0.92, m);

      vec3 base    = vec3(0.018, 0.058, 0.036);  
      vec3 emerald = vec3(0.055, 0.215, 0.125); 
      vec3 gold    = vec3(0.480, 0.400, 0.210);

      vec3 col = base;
      col += emerald * mist * 0.80;
      col += gold * pow(mist, 3.0) * 0.12;

      float sx = p.x + (1.0 - uv.y) * 0.28;
      float fall = pow(uv.y, 2.2); // brighter near the top, gone at the floor
      float shafts = 0.0;
      shafts += beam(sx, 0.22 * aspect, 0.050, 1.0, t);
      shafts += beam(sx, 0.55 * aspect, 0.030, 2.0, t) * 0.7;
      shafts += beam(sx, 0.82 * aspect, 0.065, 3.0, t) * 0.85;
      col += vec3(0.10, 0.22, 0.14) * shafts * fall * (0.35 + 0.65 * mist);
      col += gold * shafts * fall * mist * 0.06;

      vec2 c = uv - vec2(0.5, 0.42);
      c.x *= aspect * 0.85;
      float vig = smoothstep(1.15, 0.25, length(c));
      col *= 0.50 + 0.50 * vig;

      float g = hash(gl_FragCoord.xy + fract(t) * vec2(13.7, 71.3));
      col += (g - 0.5) * 0.028;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  window.addEventListener("resize", resize);
  resize();

  let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const FRAME_MS = 1000 / 30;
  let last = 0;
  const draw = (now) => {
    mouseX += (targetX - mouseX) * 0.02;
    mouseY += (targetY - mouseY) * 0.02;
    gl.uniform1f(uTime, now / 1000);
    gl.uniform2f(uMouse, mouseX, -mouseY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    draw(120000); 
    window.addEventListener("resize", () => draw(120000));
    return;
  }

  const loop = (now) => {
    if (now - last >= FRAME_MS) {
      last = now;
      draw(now);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
