(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();function R(u="hero-shader"){const t=document.getElementById(u);if(!t)return;const e=t.getContext("webgl",{alpha:!0,antialias:!0})||t.getContext("experimental-webgl",{alpha:!0,antialias:!0});if(!e)return;const s=`
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,o=`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

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

      float d = distance(st, mouse);
      float mousePush = smoothstep(0.7, 0.0, d) * 0.3;

      float t = uTime * 0.08;

      vec2 p = st * 1.1 - vec2(0.5 * aspect, 0.35);
      p.x += p.y * 0.3;

      vec2 q = vec2(
        fbm(p + vec2(t * 0.2, t * 0.15) + mousePush),
        fbm(p + vec2(t * -0.15, t * 0.25) - mousePush)
      );

      vec2 r = vec2(
        fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.1 * t),
        fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.08 * t)
      );

      float f = fbm(p + 1.2 * r + mousePush * 0.2);

      vec3 colorInk = vec3(0.02, 0.02, 0.02);         // #050505
      vec3 colorDeepBlue = vec3(0.0, 0.06, 0.45);      // Deep subtle blue
      vec3 colorElectric = vec3(0.0, 0.25, 0.75);      // Refined blue
      vec3 colorCyanGlow = vec3(0.15, 0.45, 0.85);     // Soft cyan accent

      float wave = smoothstep(-0.2, 0.8, f + q.x * 0.4);
      float peak = smoothstep(0.3, 0.95, r.y + f * 0.5);
      float silk = smoothstep(0.5, 0.98, length(r) * 0.7);

      vec3 color = mix(colorInk, colorDeepBlue, wave * 0.65);
      color = mix(color, colorElectric, peak * 0.55);
      color = mix(color, colorCyanGlow, silk * 0.45);

      float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      color += (noise - 0.5) * 0.02;

      gl_FragColor = vec4(color, 1.0);
    }
  `;function n(c,v,S){const p=c.createShader(v);return c.shaderSource(p,S),c.compileShader(p),c.getShaderParameter(p,c.COMPILE_STATUS)?p:(c.deleteShader(p),null)}const i=n(e,e.VERTEX_SHADER,s),f=n(e,e.FRAGMENT_SHADER,o);if(!i||!f)return;const r=e.createProgram();if(e.attachShader(r,i),e.attachShader(r,f),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return;const d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const a=e.getAttribLocation(r,"position"),l=e.getUniformLocation(r,"uTime"),y=e.getUniformLocation(r,"uResolution"),h=e.getUniformLocation(r,"uMouse");let m=window.innerWidth*.5,x=window.innerHeight*.5,w=m,b=x;window.addEventListener("mousemove",c=>{w=c.clientX,b=window.innerHeight-c.clientY});function g(){const c=t.parentElement?t.parentElement.clientWidth:window.innerWidth,v=t.parentElement?t.parentElement.clientHeight:window.innerHeight;(t.width!==c||t.height!==v)&&(t.width=c,t.height=v,e.viewport(0,0,c,v))}window.addEventListener("resize",g),g();let A=performance.now(),E;function L(){g();const c=(performance.now()-A)*.001;m+=(w-m)*.06,x+=(b-x)*.06,e.useProgram(r),e.bindBuffer(e.ARRAY_BUFFER,d),e.enableVertexAttribArray(a),e.vertexAttribPointer(a,2,e.FLOAT,!1,0,0),e.uniform1f(l,c),e.uniform2f(y,t.width,t.height),e.uniform2f(h,m,x),e.drawArrays(e.TRIANGLES,0,6),E=requestAnimationFrame(L)}return L(),()=>{cancelAnimationFrame(E),window.removeEventListener("resize",g)}}document.addEventListener("DOMContentLoaded",()=>{try{R("hero-shader")}catch(r){console.warn("WebGL shader initialization skipped:",r)}const u=document.getElementById("mobile-menu-toggle"),t=document.getElementById("mobile-drawer"),e=document.querySelectorAll(".mobile-drawer-link");u&&t&&(u.addEventListener("click",()=>{const r=t.classList.toggle("open");u.setAttribute("aria-expanded",r)}),e.forEach(r=>{r.addEventListener("click",()=>{t.classList.remove("open"),u.setAttribute("aria-expanded","false")})}));const s=document.querySelectorAll(".process-card"),o=document.querySelectorAll(".spine-item");if(s.length>0&&o.length>0){const r={root:null,rootMargin:"-20% 0px -50% 0px",threshold:.2},d=new IntersectionObserver(a=>{a.forEach(l=>{if(l.isIntersecting){const y=l.target.getAttribute("data-stage-index");o.forEach((h,m)=>{m.toString()===y?h.classList.add("active"):h.classList.remove("active")})}})},r);s.forEach((a,l)=>{a.setAttribute("data-stage-index",l.toString()),d.observe(a)}),o.forEach((a,l)=>{a.addEventListener("click",()=>{s[l]&&s[l].scrollIntoView({behavior:"smooth",block:"center"})})})}const n=document.getElementById("lead-form"),i=document.getElementById("form-submit-btn");n&&i&&n.addEventListener("submit",r=>{r.preventDefault();const d=i.innerHTML;i.disabled=!0,i.innerHTML=`
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending Request...
      `,setTimeout(()=>{i.innerHTML=`
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Request Received! We'll reply within 1 business day.
        `,i.style.background="linear-gradient(135deg, #00C853 0%, #009624 100%)",n.reset(),setTimeout(()=>{i.disabled=!1,i.innerHTML=d,i.style.background=""},5e3)},1200)});const f=document.getElementById("back-to-top");f&&f.addEventListener("click",r=>{r.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})})});
