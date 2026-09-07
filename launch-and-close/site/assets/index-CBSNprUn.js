(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();function R(u="hero-shader"){const t=document.getElementById(u);if(!t)return;const e=t.getContext("webgl")||t.getContext("experimental-webgl");if(!e){t.style.display="none";return}const c=`
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,o=`
    precision mediump float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    // Simplex Noise
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

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.x *= uResolution.x / uResolution.y;

      vec2 mouseNorm = uMouse / uResolution.xy;
      mouseNorm.x *= uResolution.x / uResolution.y;

      float distToMouse = distance(st, mouseNorm);
      float mouseInfluence = smoothstep(0.9, 0.0, distToMouse) * 0.6;

      float t = uTime * 0.09;

      // Layered Noise Wave fields
      vec2 q = vec2(0.0);
      q.x = snoise(st + vec2(t * 0.4, t * 0.3) + mouseInfluence * 0.3);
      q.y = snoise(st + vec2(t * -0.2, t * 0.5) - mouseInfluence * 0.3);

      vec2 r = vec2(0.0);
      r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
      r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

      float f = snoise(st + r + mouseInfluence);

      // Color Palette tokens
      vec3 colorInk = vec3(0.019, 0.019, 0.019);         // #050505
      vec3 colorBlueDeep = vec3(0.0, 0.114, 1.0);        // #001DFF
      vec3 colorBlue = vec3(0.0, 0.341, 1.0);            // #0057FF
      vec3 colorElectric = vec3(0.247, 0.663, 1.0);      // #3FA9FF

      // Gradient composition
      vec3 color = mix(colorInk, colorBlueDeep, clamp(f * f * 3.5, 0.0, 1.0));
      color = mix(color, colorBlue, clamp(length(q) * 0.9, 0.0, 1.0));
      color = mix(color, colorElectric, clamp(length(r.x) * 0.6 + mouseInfluence * 0.4, 0.0, 1.0));

      // Subtle grain dither
      float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      color += (noise - 0.5) * 0.035;

      gl_FragColor = vec4(color, 0.95);
    }
  `;function n(s,v,S){const x=s.createShader(v);return s.shaderSource(x,S),s.compileShader(x),s.getShaderParameter(x,s.COMPILE_STATUS)?x:(s.deleteShader(x),null)}const i=n(e,e.VERTEX_SHADER,c),f=n(e,e.FRAGMENT_SHADER,o);if(!i||!f)return;const r=e.createProgram();if(e.attachShader(r,i),e.attachShader(r,f),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return;const d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const l=e.getAttribLocation(r,"position"),a=e.getUniformLocation(r,"uTime"),y=e.getUniformLocation(r,"uResolution"),p=e.getUniformLocation(r,"uMouse");let m=window.innerWidth*.5,g=window.innerHeight*.5,w=m,b=g;window.addEventListener("mousemove",s=>{w=s.clientX,b=window.innerHeight-s.clientY});function h(){const s=t.parentElement?t.parentElement.clientWidth:window.innerWidth,v=t.parentElement?t.parentElement.clientHeight:window.innerHeight;(t.width!==s||t.height!==v)&&(t.width=s,t.height=v,e.viewport(0,0,s,v))}window.addEventListener("resize",h),h();let A=performance.now(),L;function E(){h();const s=(performance.now()-A)*.001;m+=(w-m)*.08,g+=(b-g)*.08,e.useProgram(r),e.bindBuffer(e.ARRAY_BUFFER,d),e.enableVertexAttribArray(l),e.vertexAttribPointer(l,2,e.FLOAT,!1,0,0),e.uniform1f(a,s),e.uniform2f(y,t.width,t.height),e.uniform2f(p,m,g),e.drawArrays(e.TRIANGLES,0,6),L=requestAnimationFrame(E)}return E(),()=>{cancelAnimationFrame(L),window.removeEventListener("resize",h)}}document.addEventListener("DOMContentLoaded",()=>{try{R("hero-shader")}catch(r){console.warn("WebGL shader initialization skipped:",r)}const u=document.getElementById("mobile-menu-toggle"),t=document.getElementById("mobile-drawer"),e=document.querySelectorAll(".mobile-drawer-link");u&&t&&(u.addEventListener("click",()=>{const r=t.classList.toggle("open");u.setAttribute("aria-expanded",r)}),e.forEach(r=>{r.addEventListener("click",()=>{t.classList.remove("open"),u.setAttribute("aria-expanded","false")})}));const c=document.querySelectorAll(".process-card"),o=document.querySelectorAll(".spine-item");if(c.length>0&&o.length>0){const r={root:null,rootMargin:"-20% 0px -50% 0px",threshold:.2},d=new IntersectionObserver(l=>{l.forEach(a=>{if(a.isIntersecting){const y=a.target.getAttribute("data-stage-index");o.forEach((p,m)=>{m.toString()===y?p.classList.add("active"):p.classList.remove("active")})}})},r);c.forEach((l,a)=>{l.setAttribute("data-stage-index",a.toString()),d.observe(l)}),o.forEach((l,a)=>{l.addEventListener("click",()=>{c[a]&&c[a].scrollIntoView({behavior:"smooth",block:"center"})})})}const n=document.getElementById("lead-form"),i=document.getElementById("form-submit-btn");n&&i&&n.addEventListener("submit",r=>{r.preventDefault();const d=i.innerHTML;i.disabled=!0,i.innerHTML=`
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
