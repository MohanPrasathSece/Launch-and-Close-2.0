(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();function T(d="hero-shader"){const t=document.getElementById(d);if(!t)return;const e=t.getContext("webgl",{alpha:!0,antialias:!0})||t.getContext("experimental-webgl",{alpha:!0,antialias:!0});if(!e)return;const l=`
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
  `;function n(c,v,S){const f=c.createShader(v);return c.shaderSource(f,S),c.compileShader(f),c.getShaderParameter(f,c.COMPILE_STATUS)?f:(console.warn(c.getShaderInfoLog(f)),c.deleteShader(f),null)}const i=n(e,e.VERTEX_SHADER,l),h=n(e,e.FRAGMENT_SHADER,o);if(!i||!h)return;const r=e.createProgram();if(e.attachShader(r,i),e.attachShader(r,h),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return;const u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const s=e.getAttribLocation(r,"position"),a=e.getUniformLocation(r,"uTime"),y=e.getUniformLocation(r,"uResolution"),p=e.getUniformLocation(r,"uMouse");let m=window.innerWidth*.5,g=window.innerHeight*.5,b=m,w=g;window.addEventListener("mousemove",c=>{b=c.clientX,w=window.innerHeight-c.clientY});function x(){const c=t.parentElement?t.parentElement.clientWidth:window.innerWidth,v=t.parentElement?t.parentElement.clientHeight:window.innerHeight;(t.width!==c||t.height!==v)&&(t.width=c,t.height=v,e.viewport(0,0,c,v))}window.addEventListener("resize",x),x();let A=performance.now(),L;function E(){x();const c=(performance.now()-A)*.001;m+=(b-m)*.06,g+=(w-g)*.06,e.useProgram(r),e.bindBuffer(e.ARRAY_BUFFER,u),e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),e.uniform1f(a,c),e.uniform2f(y,t.width,t.height),e.uniform2f(p,m,g),e.drawArrays(e.TRIANGLES,0,6),L=requestAnimationFrame(E)}return E(),()=>{cancelAnimationFrame(L),window.removeEventListener("resize",x)}}document.addEventListener("DOMContentLoaded",()=>{try{T("hero-shader")}catch(r){console.warn("WebGL shader initialization skipped:",r)}const d=document.getElementById("mobile-menu-toggle"),t=document.getElementById("mobile-drawer"),e=document.querySelectorAll(".mobile-drawer-link");d&&t&&(d.addEventListener("click",()=>{const r=t.classList.toggle("open");d.setAttribute("aria-expanded",r)}),e.forEach(r=>{r.addEventListener("click",()=>{t.classList.remove("open"),d.setAttribute("aria-expanded","false")})}));const l=document.querySelectorAll(".process-card"),o=document.querySelectorAll(".spine-item");if(l.length>0&&o.length>0){const r={root:null,rootMargin:"-20% 0px -50% 0px",threshold:.2},u=new IntersectionObserver(s=>{s.forEach(a=>{if(a.isIntersecting){const y=a.target.getAttribute("data-stage-index");o.forEach((p,m)=>{m.toString()===y?p.classList.add("active"):p.classList.remove("active")})}})},r);l.forEach((s,a)=>{s.setAttribute("data-stage-index",a.toString()),u.observe(s)}),o.forEach((s,a)=>{s.addEventListener("click",()=>{l[a]&&l[a].scrollIntoView({behavior:"smooth",block:"center"})})})}const n=document.getElementById("lead-form"),i=document.getElementById("form-submit-btn");n&&i&&n.addEventListener("submit",r=>{r.preventDefault();const u=i.innerHTML,s=new FormData(n);i.disabled=!0,i.innerHTML=`
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending Request...
      `;try{fetch("https://api.leadconnectorhq.com/widget/form/BeMJU7AZJ6HAkTePUNPj",{method:"POST",body:s,mode:"no-cors"}).catch(()=>{})}catch{}setTimeout(()=>{i.innerHTML=`
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Request Received! We'll reply within 1 business day.
        `,i.style.background="linear-gradient(135deg, #00C853 0%, #009624 100%)",n.reset(),setTimeout(()=>{i.disabled=!1,i.innerHTML=u,i.style.background=""},6e3)},1e3)});const h=document.getElementById("back-to-top");h&&h.addEventListener("click",r=>{r.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})})});
