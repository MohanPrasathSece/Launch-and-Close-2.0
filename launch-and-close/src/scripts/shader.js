// Interactive WebGL Liquid Gradient Shader for Launch & Close Hero
export function initHeroShader(canvasId = 'hero-shader') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: true }) || 
             canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
  if (!gl) {
    return;
  }

  // Vertex Shader
  const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment Shader (Rich Silk/Fluid Blue Waves with Smooth Interactive Ripple and Grain)
  const fsSource = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    // Simplex Noise & FBM
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float total = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 4; i++) {
        total += amp * snoise(p);
        p *= 2.02;
        amp *= 0.5;
      }
      return total;
    }

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      float aspect = uResolution.x / uResolution.y;
      st.x *= aspect;

      vec2 mouse = uMouse / uResolution.xy;
      mouse.x *= aspect;

      // Distance to cursor
      float d = distance(st, mouse);
      float mousePush = smoothstep(0.7, 0.0, d) * 0.45;

      float t = uTime * 0.12;

      // Diagonal flowing wave coordinates
      vec2 p = st * 1.3 - vec2(0.5 * aspect, 0.4);
      p.x += p.y * 0.35; // diagonal shear for elegant silk ribbons

      // Layered displacement
      vec2 q = vec2(
        fbm(p + vec2(t * 0.3, t * 0.2) + mousePush),
        fbm(p + vec2(t * -0.2, t * 0.4) - mousePush)
      );

      vec2 r = vec2(
        fbm(p + 1.2 * q + vec2(1.7, 9.2) + 0.15 * t),
        fbm(p + 1.2 * q + vec2(8.3, 2.8) + 0.12 * t)
      );

      float f = fbm(p + 1.5 * r + mousePush * 0.3);

      // Color Palette tokens
      vec3 colorInk = vec3(0.02, 0.02, 0.025);          // Deep base
      vec3 colorDeepBlue = vec3(0.0, 0.08, 0.65);       // Royal Blue #001DFF
      vec3 colorElectric = vec3(0.0, 0.34, 1.0);        // Primary Blue #0057FF
      vec3 colorCyanGlow = vec3(0.24, 0.66, 1.0);       // Light Electric #3FA9FF
      vec3 colorHighlight = vec3(0.55, 0.82, 1.0);      // Bright Silk Highlight

      // Color Blending matching screenshot
      float wave = smoothstep(-0.3, 0.9, f + q.x * 0.5);
      float peak = smoothstep(0.2, 0.95, r.y + f * 0.6);
      float silk = smoothstep(0.4, 0.98, length(r) * 0.8 + mousePush * 0.5);

      vec3 color = mix(colorInk, colorDeepBlue, wave * 0.85);
      color = mix(color, colorElectric, peak * 0.9);
      color = mix(color, colorCyanGlow, silk * 0.85);
      color += colorHighlight * (smoothstep(0.7, 1.0, silk) * 0.4);

      // Ambient top-left and right lighting
      float ambientTop = smoothstep(1.2, 0.0, length(st - vec2(0.3 * aspect, 0.85))) * 0.4;
      float ambientRight = smoothstep(1.3, 0.0, length(st - vec2(0.85 * aspect, 0.4))) * 0.55;
      color += colorCyanGlow * ambientTop;
      color += colorElectric * ambientRight;

      // Subtle grain dither
      float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      color += (noise - 0.5) * 0.03;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posLocation = gl.getAttribLocation(program, 'position');
  const uTimeLoc = gl.getUniformLocation(program, 'uTime');
  const uResLoc = gl.getUniformLocation(program, 'uResolution');
  const uMouseLoc = gl.getUniformLocation(program, 'uMouse');

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = window.innerHeight - e.clientY;
  });

  function resize() {
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  let startTime = performance.now();
  let animId;

  function render() {
    resize();
    const time = (performance.now() - startTime) * 0.001;

    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uTimeLoc, time);
    gl.uniform2f(uResLoc, canvas.width, canvas.height);
    gl.uniform2f(uMouseLoc, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
