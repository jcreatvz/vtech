// Many Thin Light — Originkit. Adapted from the user-supplied shader for this static site.
const FRAG=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uScale;
uniform vec2 uApex;
uniform float uDirMode;
uniform float uDensity;
uniform float uGap;
uniform float uBend;
uniform float uSpeed;
uniform float uJitter;
uniform float uFront;
uniform vec2 uDash;
uniform float uPeriod;
uniform float uDashW;
uniform float uGuideW;
uniform float uGuideA;
uniform float uDotted;
uniform float uDotGap;
uniform float uGlowR;
uniform float uGlowA;
uniform float uFanRays;
uniform float uFanW;
uniform float uFanA;
uniform float uFanGap;
uniform float uHaze;
uniform vec3 uGuideCol;
uniform vec3 uHazeCol;
uniform vec2 uIntro;
uniform float uLead;
uniform float uFade;
uniform float uCycle;
uniform float uEmitEnd;
uniform float uBoost;
uniform float uSeed;
uniform float uGrain;
uniform float uVignette;
out vec4 outColor;

uint hu(uint x) {
    x ^= x >> 16u; x *= 0x7feb352du; x ^= x >> 15u; x *= 0x846ca68bu; x ^= x >> 16u;
    return x;
}
float hf(float a, float b) {
    uint x = hu(uint(int(a)) ^ hu(uint(int(b)) + uint(int(uSeed)) * 0x9e3779b9u));
    return float(x >> 8u) * (1.0 / 16777216.0);
}

struct Tr { float guide; float core; float glow; float along; float on; };

Tr track(float k, float aa, float s, float aas, float tt, float zone, float hwC, float hwG, float gR, float offStep, float V, float lenMul) {
    Tr o;
    float id = floor(k + 0.5);
    float lid = id + zone * 4096.0;
    float px = abs(k - id) / max(aa, 1e-5);
    float m = smoothstep(0.35, 0.9, aa);
    float cS = clamp(max(hwC, 0.5) + 0.5 - px, 0.0, 1.0) * min(1.0, hwC * 2.0);
    float core = mix(cS, min(1.0, 2.0 * hwC * aa), m);
    float gS = clamp(max(hwG, 0.5) + 0.5 - px, 0.0, 1.0) * min(1.0, hwG * 2.0);
    float guide = mix(gS, min(1.0, 2.0 * hwG * aa), m);
    float glow = mix(exp(-px * px / max(gR * gR, 1e-4)), min(1.0, 1.77 * gR * aa), m);

    float r1 = hf(lid, 1.0);
    float r2 = hf(lid, 2.0);
    float r3 = hf(lid, 3.0);
    float r4 = hf(lid, 4.0);
    float r5 = hf(lid, 5.0);
    float Vk = max(V * (1.0 + uJitter * (2.0 * r1 - 1.0)), 1e-4);
    float sp = s - Vk * tt;
    float aspect = uRes.x / max(uRes.y, 1.0);
    float per = max(uPeriod * aspect * mix(0.75, 1.25, r2), 1e-3);
    float uu = sp / per + r3 * 9.0;
    float cell = floor(uu);
    float loc = (uu - cell) * per;
    float c1 = hf(lid, cell * 4.0 + 11.0);
    float c2 = hf(lid, cell * 4.0 + 12.0);
    float c3 = hf(lid, cell * 4.0 + 13.0);
    float len = min(mix(uDash.x, uDash.y, c2 * c2) * aspect * lenMul, per * 0.9);
    float o0 = c3 * (per - len);
    float ea = max(aas, 1e-5);
    float inside = step(c1, uDensity) * clamp((loc - o0) / ea, 0.0, 1.0) * clamp((o0 + len - loc) / ea, 0.0, 1.0);
    float along = clamp((loc - o0) / max(len, 1e-4), 0.0, 1.0);

    float dotted = step(r4, uDotted);
    float dg = max(uDotGap * max(uScale, 0.05), 1e-4);
    float df = fract(sp / dg);
    float dAA = ea / dg;
    float dots = smoothstep(0.0, dAA + 1e-4, df) * (1.0 - smoothstep(0.3, 0.3 + dAA + 1e-4, df));
    dots = mix(dots, 0.3, smoothstep(0.15, 0.4, dAA));
    inside *= mix(1.0, dots, dotted);
    guide *= mix(1.0, mix(0.5, 1.0, dots), dotted);

    float off = id * offStep;
    float tOn = zone < 0.5 ? abs(off) / max(off > 0.0 ? uIntro.x : uIntro.y, 1e-3) : abs(off) * 0.3;
    float Vf = max(Vk * uFront, 1e-4);
    float te = tt - s / Vf;
    float tc = uCycle > 0.0 ? mod(te, uCycle) : te;
    float live = step(tOn, tc) * step(tc, uEmitEnd);
    float on = smoothstep(tOn, tOn + uFade, tc) * (1.0 - smoothstep(uEmitEnd, uEmitEnd + uFade, tc));
    float lb = mix(0.65, 1.0, r5);

    o.guide = guide * on * lb;
    o.core = core * inside * live * lb;
    o.glow = glow * inside * live * lb;
    o.along = along;
    o.on = on;
    return o;
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    vec2 res = uRes;
    if (uDirMode > 0.5 && uDirMode < 1.5) {
        fc.x = res.x - fc.x;
    } else if (uDirMode > 1.5 && uDirMode < 2.5) {
        fc = vec2(fc.y, res.x - fc.x);
        res = res.yx;
    } else if (uDirMode > 2.5) {
        fc = vec2(res.y - fc.y, fc.x);
        res = res.yx;
    }
    float H = max(res.y, 1.0);
    float aspect = res.x / H;
    vec2 P = fc / H;
    vec2 A = vec2(uApex.x * aspect, 1.0 - uApex.y);
    vec2 p = P - A;
    float sc = max(uScale, 0.05);
    float gap = max(uGap * sc, 1e-4);
    float V = uSpeed * aspect;
    float tt = uTime + uLead;

    float d = max(-p.x, 1e-5);
    float v = p.y / (1.0 + uBend / d);
    float k = v / gap;
    float s = P.x + abs(p.y - v);
    float r = length(p);
    float aa = fwidth(k);
    float aas = fwidth(s);

    float hwC = 0.5 * uDashW * sc * H;
    float hwG = 0.5 * uGuideW * sc * H;
    float gR = uGlowR * sc * H;
    Tr tr = track(k, aa, s, aas, tt, 0.0, hwC, hwG, gR, gap, V, 1.0);

    vec2 uv = fc / res;
    vec2 mm = uv - uMouse;
    mm.x *= aspect;
    float hov = 1.0 + uHover * 0.9 * exp(-dot(mm, mm) * 14.0);
    float tg = uCycle > 0.0 ? mod(tt, uCycle) : tt;
    float bloom = uBoost * smoothstep(0.6, 1.6, tg) * (1.0 - smoothstep(2.4, 3.2, tg));
    float boost = 1.0 + bloom;

    float a = tr.along;
    vec3 dc = mix(uGuideCol, uBase, smoothstep(0.0, 0.45, a));
    dc = mix(dc, uAccent, smoothstep(0.5, 1.0, a));
    float di = (0.35 + 0.65 * a) * boost * hov;
    vec3 col = vec3(0.0);
    col += dc * tr.core * di * 1.4;
    col += uAccent * tr.core * smoothstep(0.88, 1.0, a) * 0.6 * hov;
    col += uBase * tr.glow * uGlowA * di;
    col += uGuideCol * uGuideA * tr.guide * boost;

    float wallZone = smoothstep(0.0, 0.05, p.x);
    float wall = smoothstep(0.0, 0.015, p.x) * exp(-p.x * 2.0);
    col += mix(uGuideCol, uBase, 0.6) * uFanA * tr.on * wallZone * (0.14 + 0.18 * wall) * boost * (0.5 + 0.5 * uFanW);
    float hz = (0.15 + 0.6 * exp(-d / 0.2)) * smoothstep(0.0, 0.3, abs(p.y)) + 0.7 * wallZone * smoothstep(0.0, 0.08, r);
    col += uHazeCol * hz * uHaze * tr.on * boost;
    float hot = exp(-d / 0.05) * exp(-abs(p.y) * 3.0) + wallZone * exp(-r * 2.5);
    col += uAccent * bloom * 0.45 * hot * tr.on;

    col = uBg + col;
    col *= 1.0 - uVignette * smoothstep(0.3, 0.95, length(uv - 0.5) * 1.414);
    col += (hf(floor(gl_FragCoord.x) + floor(gl_FragCoord.y) * 4099.0, floor(uTime * 30.0) + 77.0) - 0.5) * uGrain * 0.2;
    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
const VERT=`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
const section=document.querySelector('#contact-cta');
const canvas=document.querySelector('#consultation-light');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
if(gl) init();
function init(){
 let program,buffer;const shaders=[];
 try{
  const compile=(type,source)=>{const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader compilation failed');return shader;};
  program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,VERT));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader linking failed');
  shaders.forEach(s=>gl.deleteShader(s));gl.useProgram(program);
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 }catch(error){shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);return;}
 const cache=new Map();const u=name=>{if(!cache.has(name))cache.set(name,gl.getUniformLocation(program,name));return cache.get(name);};
 const one={uDirMode:3,uDensity:.8875,uGap:.009,uBend:.05,uSpeed:1.55,uJitter:.15,uFront:.6,uPeriod:.45,uDashW:.004,uGuideW:.0012,uGuideA:1.1,uDotted:.3,uDotGap:.009,uGlowR:.006,uGlowA:.9,uFanRays:20,uFanW:.4,uFanA:1.7,uFanGap:8*Math.PI/180,uHaze:1.2,uLead:.12,uFade:.3,uCycle:7.5,uEmitEnd:6.6,uBoost:1.6,uSeed:7,uGrain:0,uVignette:0,uScale:1};
 for(const [name,value] of Object.entries(one))gl.uniform1f(u(name),value);
 gl.uniform2f(u('uApex'),.8,.59);gl.uniform2f(u('uDash'),.05,.32);gl.uniform2f(u('uIntro'),.17,.21);
 gl.uniform3f(u('uBg'),2/255,21/255,33/255);gl.uniform3f(u('uBase'),0,0,0);gl.uniform3f(u('uAccent'),0,0,0);
 gl.uniform3f(u('uGuideCol'),9/255,9/255,9/255);gl.uniform3f(u('uHazeCol'),0,29/255,47/255);
 let visible=false,raf=0,last=0,clock=2.5,mx=.5,my=.5,tx=.5,ty=.5,hover=0,targetHover=0,lost=false,parallax=0;
 function draw(dt=0){clock=(clock+dt)%3600;const k=1-Math.exp(-dt*6);mx+=(tx-mx)*k;my+=(ty-my)*k;hover+=(targetHover-hover)*k;
  const rect=section.getBoundingClientRect();
  const target=reduced.matches?0:Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/((innerHeight+rect.height)/2)));
  parallax=reduced.matches?0:parallax+(target-parallax)*k;
  gl.uniform2f(u('uApex'),.8+(reduced.matches?0:(mx-.5)*.008),.59+parallax*.025+(reduced.matches?0:(my-.5)*.01));
  gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(u('uRes'),canvas.width,canvas.height);gl.uniform1f(u('uTime'),clock);gl.uniform2f(u('uMouse'),mx,my);gl.uniform1f(u('uHover'),reduced.matches?0:hover);gl.drawArrays(gl.TRIANGLES,0,3);canvas.classList.add('is-ready');}
 function tick(now){raf=0;if(!visible||document.hidden||reduced.matches||lost)return;if(!last||now-last>=1000/30){draw(last?Math.min((now-last)/1000,.1):0);last=now;}raf=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(!lost&&visible&&!document.hidden){if(reduced.matches)draw();else raf=requestAnimationFrame(tick);}}
 function resize(){const w=section.clientWidth,h=section.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1400000/Math.max(1,w*h)));canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));if(!lost)draw();}
 const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(section);
 const viewObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});viewObserver.observe(section);
 section.addEventListener('pointermove',e=>{const r=section.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height;targetHover=1;},{passive:true});
 section.addEventListener('pointerleave',()=>{targetHover=0;},{passive:true});
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 canvas.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(raf);canvas.classList.remove('is-ready');});
 window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));window.addEventListener('pageshow',sync);
}
