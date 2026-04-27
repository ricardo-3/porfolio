import { useState, useEffect, useCallback } from "react";

const PAGES = ["Inicio", "Trabajo", "Sobre Mí", "Blog", "Contacto"];
const BLUE = "#2b44c0";
const DARK = "#0f0f0f";

/*
 * ── DESIGN SYSTEM ──────────────────────────────────
 * 
 * Colors (light):  bg = blue, t1 = white, t2 = white 50%
 * Colors (dark):   bg = near-black, t1 = white 92%, t2 = white 45%
 * Special:         MANIFESTO title = full #fff always
 * 
 * Typography:      Inter only. Weights: 400 (body), 500 (UI/labels/titles)
 * Sizes:           22px titles, 16px body, 13px labels, 11px micro
 * 
 * Spacing:         48px horizontal desktop, 20px mobile
 * Content:         max-width 680px centered (reading), 900px (grids)
 * 
 * Borders:         rgba white 0.08 only — nearly invisible
 * No backdrop-filter, no glass effects, no color variations
 */

const themes = {
  light: {
    "--bg": BLUE,
    "--t1": "#ffffff",
    "--t2": "rgba(255,255,255,0.50)",
    "--border": "rgba(255,255,255,0.08)",
    "--card": "rgba(255,255,255,0.06)",
    "--card-h": "rgba(255,255,255,0.12)",
    "--btn-bg": "#ffffff",
    "--btn-fg": BLUE,
  },
  dark: {
    "--bg": DARK,
    "--t1": "rgba(255,255,255,0.92)",
    "--t2": "rgba(255,255,255,0.45)",
    "--border": "rgba(255,255,255,0.08)",
    "--card": "rgba(255,255,255,0.04)",
    "--card-h": "rgba(255,255,255,0.08)",
    "--btn-bg": "#ffffff",
    "--btn-fg": DARK,
  },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0 !important;padding:0 !important;overflow-x:hidden !important;min-height:100%}
::selection{background:rgba(255,255,255,0.18)}

.site{
  font-family:'Inter',system-ui,sans-serif;
  font-size:16px;line-height:1.6;
  background:var(--bg);color:var(--t1);
  min-height:100vh;width:100%;
  transition:background .35s,color .35s;
  -webkit-font-smoothing:antialiased;
}

/* ═══ NAV ═══════════════════════════════════════════ */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  height:56px;
  background:var(--bg);
  transition:background .35s;
}
.nav-inner{
  max-width:960px;margin:0 auto;height:100%;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;
}
.nav-logo{
  font-size:19px;font-weight:500;letter-spacing:-.02em;
  color:var(--t1);cursor:pointer;user-select:none;
  min-width:80px;
}
.nav-center{display:flex;gap:28px;align-items:center}
.nav-link{
  font-size:11px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;
  color:var(--t2);cursor:pointer;
  background:none;border:none;font-family:inherit;
  padding:4px 0;position:relative;transition:color .2s;
}
.nav-link:hover{color:var(--t1)}
.nav-link.active{color:var(--t1)}
.nav-link.active::after{
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:1px;background:var(--t1);
}
.nav-right{
  display:flex;align-items:center;gap:16px;
  min-width:80px;justify-content:flex-end;
}
.theme-dot{
  width:26px;height:26px;border-radius:50%;
  border:1.5px solid var(--border);
  background:transparent;color:var(--t1);
  cursor:pointer;display:flex;align-items:center;
  justify-content:center;font-size:11px;
  transition:border-color .2s;line-height:1;
}
.theme-dot:hover{border-color:var(--t2)}

/* ── Mobile nav ── */
.mob-btn{
  display:none;background:none;border:none;cursor:pointer;
  width:24px;height:18px;position:relative;
}
.mob-btn span{
  display:block;position:absolute;left:0;right:0;height:1.5px;
  background:var(--t1);transition:all .3s;
}
.mob-btn span:nth-child(1){top:0}
.mob-btn span:nth-child(2){top:8px}
.mob-btn span:nth-child(3){top:16px}
.mob-btn.open span:nth-child(1){top:8px;transform:rotate(45deg)}
.mob-btn.open span:nth-child(2){opacity:0}
.mob-btn.open span:nth-child(3){top:8px;transform:rotate(-45deg)}

.mob-menu{
  display:none;position:fixed;inset:0;z-index:99;
  background:var(--bg);
  flex-direction:column;align-items:center;justify-content:center;gap:28px;
}
.mob-menu.open{display:flex}
.mob-menu .nav-link{font-size:16px;letter-spacing:.12em}

@media(max-width:768px){
  .nav-inner{padding:0 20px}
  .nav-center{display:none}
  .mob-btn{display:block}
}

/* ═══ LAYOUT ════════════════════════════════════════ */
.wrap{
  max-width:680px;margin:0 auto;
  padding:0 48px;text-align:left;
}
.wrap-wide{
  max-width:960px;margin:0 auto;
  padding:0 48px;text-align:left;
}
@media(max-width:768px){
  .wrap,.wrap-wide{padding:0 20px}
}

/* ═══ HOME ══════════════════════════════════════════ */
.home{
  min-height:100vh;
  display:flex;flex-direction:column;
  justify-content:center;align-items:center;
  padding:128px 48px 80px;
  text-align:center;
}
.home-label{
  font-size:12px;font-weight:500;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--t2);margin-bottom:48px;
}
.home-poem{
  max-width:560px;text-align:left;
}
.home-poem p{
  font-size:15px;font-weight:400;
  line-height:1.8;color:var(--t2);
  margin-bottom:18px;
}
.home-poem p:last-child{margin-bottom:0}
.home-credit{
  margin-top:36px;
  font-size:13px;font-weight:400;
  font-style:italic;color:var(--t2);
}
@media(max-width:768px){
  .home{padding:100px 20px 60px}
}

/* ═══ PAGE SECTIONS ═════════════════════════════════ */
.pg{padding:128px 0 80px;min-height:100vh}
.pg-head{
  display:flex;align-items:baseline;gap:12px;
  margin-bottom:56px;padding-bottom:16px;
  border-bottom:1px solid rgba(255,255,255,0.12);
}
.pg-head h2{
  font-size:22px;font-weight:500;letter-spacing:-.02em;
  color:var(--t1);
}
.pg-head .tag{
  font-size:11px;font-weight:400;letter-spacing:.08em;
  text-transform:uppercase;color:var(--t2);
}

/* ═══ BLOG ══════════════════════════════════════════ */
.blog-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:0;
}
.blog-item{
  background:transparent;padding:0;
  cursor:pointer;transition:background .2s;
  overflow:hidden;
  outline:1px solid rgba(255,255,255,0.12);
  outline-offset:-1px;
}
.blog-item:hover{background:rgba(255,255,255,0.06)}
.blog-cover{
  width:100%;aspect-ratio:16/10;
  background:rgba(255,255,255,0.04);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.blog-cover img{width:100%;height:100%;object-fit:cover}
.blog-cover-placeholder{
  font-size:11px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;opacity:.6;
}
.blog-item-body{padding:24px 28px 28px}
.blog-date{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:12px;
}
.blog-title{
  font-size:18px;font-weight:500;letter-spacing:-.01em;
  color:var(--t1);margin-bottom:8px;line-height:1.35;
}
.blog-excerpt{
  font-size:14px;font-weight:400;color:var(--t2);line-height:1.65;
}
.blog-read{
  display:inline-block;margin-top:14px;
  font-size:11px;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--t2);
  border-bottom:1px solid var(--border);padding-bottom:2px;
  transition:color .2s,border-color .2s;
}
.blog-item:hover .blog-read{color:var(--t1);border-color:var(--t1)}
@media(max-width:600px){.blog-grid{grid-template-columns:1fr}}

/* ── Blog post ── */
.post{
  max-width:680px;margin:0 auto;
  padding:128px 48px 80px;
}
.post-back{
  display:inline-flex;align-items:center;gap:6px;
  font-size:13px;font-weight:500;letter-spacing:.06em;
  text-transform:uppercase;color:var(--t2);
  cursor:pointer;background:none;border:none;
  font-family:inherit;margin-bottom:48px;transition:color .2s;
}
.post-back:hover{color:var(--t1)}
.post-meta{margin-bottom:32px}
.post-meta-date{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:10px;
}
.post-meta-title{
  font-size:22px;font-weight:500;letter-spacing:-.02em;
  color:var(--t1);line-height:1.35;
}
.post-cover{
  width:100%;aspect-ratio:16/9;
  background:var(--card);
  border:1px dashed var(--border);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:48px;overflow:hidden;
}
.post-cover-placeholder{
  font-size:13px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;
}
.post-body p{
  font-size:16px;font-weight:400;line-height:1.85;
  color:var(--t2);margin-bottom:24px;
}
.post-body p:last-child{margin-bottom:0}
.post-body blockquote{
  font-size:18px;font-weight:400;font-style:italic;
  color:var(--t1);padding:24px 0 24px 24px;
  border-left:1px solid var(--t2);
  margin:32px 0;line-height:1.65;opacity:.8;
}
.post-tags{
  display:flex;flex-wrap:wrap;gap:8px;
  margin-top:48px;padding-top:20px;
  border-top:1px solid var(--border);
}
.post-tag{
  font-size:11px;font-weight:400;letter-spacing:.04em;
  padding:6px 14px;border:1px solid var(--border);color:var(--t2);
}
@media(max-width:768px){.post{padding:100px 20px 60px}}

/* ═══ ABOUT ═════════════════════════════════════════ */
.about-layout{text-align:left}
.about-layout>p{
  font-size:16px;font-weight:400;line-height:1.85;
  color:var(--t2);margin-bottom:24px;
}
.about-quote{
  font-size:18px;font-weight:400;font-style:italic;
  color:var(--t1);padding:24px 0 24px 24px;
  border-left:1px solid var(--t2);
  margin:32px 0;line-height:1.65;opacity:.8;
}
.skills-label{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:12px;
}
.skills-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px}
.skill-tag{
  font-size:13px;font-weight:400;
  padding:7px 16px;border:1px solid var(--border);
  color:var(--t2);transition:color .2s,border-color .2s;
}
.skill-tag:hover{color:var(--t1);border-color:var(--t2)}

/* ── Timeline ── */
.timeline{margin-top:56px}
.timeline-chapter{margin-bottom:48px}
.timeline-chapter:last-child{margin-bottom:0}
.timeline-place{
  font-size:13px;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--t1);
  margin-bottom:6px;
}
.timeline-subtitle{
  font-size:13px;font-weight:400;color:var(--t2);
  margin-bottom:20px;
}
.timeline-items{display:flex;flex-direction:column;gap:14px}
.timeline-item{
  display:flex;gap:12px;
  font-size:14px;font-weight:400;color:var(--t2);
  line-height:1.65;
}
.timeline-dot{
  width:5px;height:5px;min-width:5px;
  border-radius:50%;background:var(--t2);
  margin-top:8px;
}

/* ═══ WORK ══════════════════════════════════════════ */
.work-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:0;
}
.work-card{
  aspect-ratio:1;background:transparent;
  display:flex;flex-direction:column;justify-content:space-between;
  padding:24px;cursor:pointer;position:relative;
  transition:background .2s;
  outline:1px solid rgba(255,255,255,0.12);
  outline-offset:-1px;
}
.work-card:hover{background:rgba(255,255,255,0.06)}
.work-card-num{
  font-size:11px;font-weight:400;color:var(--t2);
}
.work-card-cat{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:4px;
}
.work-card-title{
  font-size:17px;font-weight:500;letter-spacing:-.01em;
  color:var(--t1);line-height:1.3;
}
.work-card-arrow{
  position:absolute;top:20px;right:24px;
  font-size:16px;color:var(--t1);opacity:0;
  transition:opacity .2s;
}
.work-card:hover .work-card-arrow{opacity:.4}
@media(max-width:768px){.work-grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.work-grid{grid-template-columns:1fr}}

/* ── Work modal ── */
.modal-overlay{
  position:fixed;inset:0;z-index:200;
  background:rgba(0,0,0,0.6);
  display:flex;align-items:center;justify-content:center;
  padding:20px;
  opacity:0;animation:fadeIn .25s ease forwards;
}
@keyframes fadeIn{to{opacity:1}}
.modal{
  background:var(--bg);
  max-width:640px;width:100%;
  max-height:90vh;overflow-y:auto;
  position:relative;
  animation:modalUp .3s ease forwards;
}
@keyframes modalUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
.modal-close{
  position:absolute;top:16px;right:20px;z-index:1;
  font-size:18px;color:var(--t2);
  background:none;border:none;cursor:pointer;
  font-family:inherit;transition:color .2s;
}
.modal-close:hover{color:var(--t1)}
.modal-img{
  width:100%;aspect-ratio:16/9;
  background:var(--card);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.modal-img-placeholder{
  font-size:13px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;
}
.modal-body{padding:32px}
.modal-cat{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:8px;
}
.modal-title{
  font-size:22px;font-weight:500;letter-spacing:-.02em;
  color:var(--t1);margin-bottom:16px;line-height:1.35;
}
.modal-desc{
  font-size:16px;font-weight:400;line-height:1.85;
  color:var(--t2);
}
.modal-tags{
  display:flex;flex-wrap:wrap;gap:8px;
  margin-top:24px;padding-top:20px;
  border-top:1px solid var(--border);
}
.modal-tag{
  font-size:11px;font-weight:400;letter-spacing:.04em;
  padding:6px 14px;border:1px solid var(--border);color:var(--t2);
}

/* ═══ CONTACT ═══════════════════════════════════════ */
.contact-block{}
.contact-block>p{
  font-size:16px;font-weight:400;line-height:1.85;
  color:var(--t2);margin-bottom:40px;
}
.contact-info{
  display:flex;flex-direction:column;gap:14px;
  margin-bottom:48px;
  padding-bottom:40px;
  border-bottom:1px solid var(--border);
}
.contact-info-item{
  font-size:16px;color:var(--t2);
  display:flex;align-items:center;gap:10px;
}
.contact-info-label{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;min-width:52px;color:var(--t1);
}
.contact-cta{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'Inter',sans-serif;
  font-size:15px;font-weight:500;
  padding:16px 32px;border:none;
  background:var(--btn-bg);color:var(--btn-fg);
  cursor:pointer;transition:opacity .2s;
  text-decoration:none;
}
.contact-cta:hover{opacity:.85}
.contact-cta svg{width:18px;height:18px}
.contact-note{
  margin-top:16px;
  font-size:13px;font-weight:400;color:var(--t2);
}

/* ═══ FOOTER ════════════════════════════════════════ */
.footer{
  border-top:1px solid rgba(255,255,255,0.18);
  padding:48px 0 28px;
}
.ft-top{
  display:flex;justify-content:space-between;align-items:baseline;
  margin-bottom:40px;
}
.ft-brand{
  font-size:19px;font-weight:500;letter-spacing:-.02em;
  color:var(--t1);
}
.ft-desc{font-size:13px;font-weight:400;color:var(--t2)}
.ft-grid{
  display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:32px;
}
.ft-col-title{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t1);margin-bottom:14px;
}
.ft-links{display:flex;flex-direction:column;gap:8px}
.ft-link{
  font-size:13px;font-weight:400;color:var(--t2);
  cursor:pointer;background:none;border:none;
  text-align:left;font-family:inherit;padding:0;
  transition:color .2s;
}
.ft-link:hover{color:var(--t1)}
.ft-bottom{
  margin-top:36px;padding-top:16px;
  border-top:1px solid rgba(255,255,255,0.18);
  display:flex;justify-content:space-between;
  align-items:center;flex-wrap:wrap;gap:12px;
}
.ft-copy{font-size:11px;font-weight:400;color:var(--t2)}
.ft-socials{display:flex;gap:16px}
.ft-social{
  font-size:13px;font-weight:500;
  color:var(--t2);cursor:pointer;transition:color .2s;
  text-decoration:none;
}
.ft-social:hover{color:var(--t1)}
@media(max-width:768px){
  .ft-grid{grid-template-columns:1fr 1fr;gap:32px 40px}
}
@media(max-width:480px){
  .ft-grid{grid-template-columns:1fr 1fr;gap:28px 32px}
  .ft-top{flex-direction:column;gap:6px}
}

/* ═══ UTILITIES ═════════════════════════════════════ */
.reveal{opacity:0;transform:translateY(14px);animation:up .5s ease forwards}
@keyframes up{to{opacity:1;transform:translateY(0)}}
.r1{animation-delay:.06s}.r2{animation-delay:.14s}
.r3{animation-delay:.22s}.r4{animation-delay:.3s}
`;

/* ═══ DATA ══════════════════════════════════════════ */

const POEM = [
  "Pilotas un esqueleto cubierto de nervios, músculos y carne, montado sobre una roca que contiene su propia atmósfera y genera suficiente oxígeno para que puedas respirar, y atraviesas el espacio infinito a 110.000 km por hora.",
  "Cada noche abandonas tu cuerpo, alucinas vívidamente durante horas, se miran el uno al otro una y otra vez y se despiertan como si nada hubiera pasado. Están toda la noche y me llaman a dormir, como si no fuera del todo inusual.",
  "Eres un conjunto de átomos que, de alguna manera, aprendieron a pensar sobre sí mismos; a sentir emociones al tener emociones y a ser conscientes de que son conscientes.",
  "Fuiste un universo consciente atrapado en un cuerpo temporal durante aproximadamente 80 o 90 años —unas 4.000 semanas—, y pasaste parte de ese tiempo preocupándote de que el correo fuera demasiado largo.",
  "Mi amor, eres un milagro que la física no puede explicar. Tus átomos se forjaron en el seno de una estrella moribunda; la sangre que corre por tus venas es ancestral, el calcio de tus huesos se creó en una supernova.",
  "Literalmente estás lleno de estrellas reencarnadas y te preocupa volverte loco.",
  "Crea esa cosa extraña, di ese pensamiento extraño. Eres ese ser humano desconcertante y contradictorio, como el pulpo de estrellas que realmente eres.",
  "Ya eres imposible… también podría ser interesante.",
];

/*
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  BLOG POSTS — TEMPLATE REUTILIZABLE                        ║
 * ║                                                             ║
 * ║  Para agregar un nuevo post:                                ║
 * ║  1. Copiá un objeto del array BLOG_POSTS                   ║
 * ║  2. Cambiá: id, date, title, excerpt, tags, body           ║
 * ║  3. En "cover" poné la URL de tu imagen o dejá null        ║
 * ║  4. Listo — aparece automáticamente en el blog             ║
 * ║                                                             ║
 * ║  Para la imagen de portada:                                 ║
 * ║  - Recomendado: 1200x675px (ratio 16:9)                    ║
 * ║  - Poné la URL en el campo "cover"                          ║
 * ║  - Si cover es null muestra el placeholder                  ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const BLOG_POSTS = [
  {
    id: "curiosidad-motor-creativo",
    date: "04 — 2026",
    title: "La curiosidad como motor creativo",
    excerpt: "Reflexiones sobre por qué la curiosidad genuina produce mejor trabajo que la disciplina forzada.",
    cover: null, // ← CAMBIAR ACÁ POR URL DE IMAGEN (ej: "https://tu-imagen.jpg")
    tags: ["Creatividad", "Proceso"],
    body: [
      { type: "p", text: "La curiosidad es el combustible más honesto del proceso creativo. No necesita justificación, no pide permiso, simplemente aparece y te empuja hacia algo que todavía no entendés del todo." },
      { type: "p", text: "Cuando trabajamos desde la curiosidad genuina, el resultado siempre tiene algo que la disciplina sola no puede producir: tiene vida. Tiene esa cualidad invisible que hace que alguien se detenga un segundo más frente a lo que creaste." },
      { type: "quote", text: "La disciplina te lleva al escritorio. La curiosidad te lleva a las preguntas correctas." },
      { type: "p", text: "Esto no significa que la disciplina no importe — claro que importa. Pero la disciplina sin curiosidad produce trabajo correcto. La curiosidad sin disciplina produce caos interesante. La combinación de ambas produce trabajo que importa." },
      { type: "p", text: "Mi práctica creativa cambió cuando dejé de preguntarme '¿qué debería hacer?' y empecé a preguntarme '¿qué me da curiosidad?'. Las respuestas fueron muy distintas, y el trabajo también." },
    ],
  },
  {
    id: "menos-decisiones-mas-intencion",
    date: "03 — 2026",
    title: "Menos decisiones, más intención",
    excerpt: "Cómo simplificar el proceso de diseño eliminando lo innecesario y manteniendo solo lo que tiene propósito.",
    cover: null,
    tags: ["Diseño", "Minimalismo"],
    body: [
      { type: "p", text: "Cada decisión de diseño consume energía. Cada opción que dejás abierta es una pregunta sin resolver que te distrae de lo esencial. Simplificar no es quitar — es elegir con más intención." },
      { type: "p", text: "Empecé a aplicar una regla simple: si no puedo explicar por qué algo está ahí en una frase, probablemente no debería estar. No es minimalismo por estética — es claridad por respeto al mensaje." },
      { type: "quote", text: "Lo que quitás define tu trabajo tanto como lo que dejás." },
      { type: "p", text: "El resultado es un proceso más lento al principio pero mucho más rápido después. Cuando cada elemento tiene una razón, las decisiones siguientes se toman solas." },
    ],
  },
  {
    id: "silencio-visual-composicion",
    date: "02 — 2026",
    title: "El silencio visual en la composición",
    excerpt: "El espacio vacío no es ausencia — es una declaración. Notas sobre el uso consciente del espacio negativo.",
    cover: null,
    tags: ["Composición", "Espacio"],
    body: [
      { type: "p", text: "En música, el silencio entre las notas es tan importante como las notas mismas. En diseño, pasa exactamente lo mismo. El espacio que dejás vacío no es desperdicio — es oxígeno para la composición." },
      { type: "p", text: "Tendemos a llenar porque el vacío nos incomoda. Pero el espacio negativo es lo que le da peso a lo que sí está. Sin pausa no hay ritmo, sin silencio no hay énfasis." },
      { type: "quote", text: "El espacio vacío es la decisión más valiente que podés tomar en una composición." },
      { type: "p", text: "Practicar el uso consciente del espacio es practicar la confianza en tu mensaje. Si lo que decís es fuerte, no necesita gritar. Necesita espacio para resonar." },
    ],
  },
  {
    id: "tipografia-emocion",
    date: "01 — 2026",
    title: "Apuntes sobre tipografía y emoción",
    excerpt: "La tipografía comunica antes de ser leída. El impacto emocional de las decisiones tipográficas.",
    cover: null,
    tags: ["Tipografía", "Emoción"],
    body: [
      { type: "p", text: "Antes de leer una sola palabra, la tipografía ya comunicó algo. El peso, el espaciado, la forma de las letras — todo transmite una emoción que precede al contenido." },
      { type: "p", text: "Elegir una tipografía es como elegir el tono de voz con el que vas a hablar. Podés decir exactamente lo mismo con una voz que tranquiliza o con una que confronta. La tipografía es esa voz." },
      { type: "quote", text: "La tipografía es el vestido de las palabras. Y como todo vestido, dice algo antes de que abras la boca." },
      { type: "p", text: "Mi proceso tipográfico es simple: primero siento, después elijo. Leo el texto en voz alta, entiendo su ritmo, y busco una familia que hable en la misma frecuencia." },
    ],
  },
  // ── PARA AGREGAR MÁS POSTS ──
  // Copiá cualquier post de arriba, pegalo acá, y cambiá los datos.
  // Asegurate de que el "id" sea único (sin espacios, con guiones).
];

const LEGAL_PAGES = {
  terminos: {
    title: "Términos y Condiciones",
    body: [
      "Al acceder y utilizar este sitio web, aceptás los siguientes términos y condiciones de uso.",
      "Todo el contenido publicado en este sitio — incluyendo textos, imágenes, diseños, logotipos y material gráfico — es propiedad de rrr— salvo que se indique lo contrario. Queda prohibida su reproducción, distribución o modificación sin autorización previa por escrito.",
      "Los proyectos y trabajos mostrados en la sección de portfolio son presentados con fines de muestra profesional. Algunos pueden estar sujetos a acuerdos de confidencialidad con los clientes respectivos.",
      "Este sitio puede contener enlaces a sitios de terceros. No me hago responsable por el contenido, políticas de privacidad o prácticas de dichos sitios.",
      "Me reservo el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigencia desde su publicación en esta página.",
      "Para cualquier consulta sobre estos términos, podés contactarme a romero.me@outlook.com.",
    ],
  },
  privacidad: {
    title: "Política de Privacidad",
    body: [
      "Tu privacidad es importante. Esta política describe cómo se recopila, usa y protege la información personal que proporcionás a través de este sitio.",
      "Datos recopilados: cuando usás el formulario de contacto, se recopilan los datos que proporcionás voluntariamente (nombre, correo electrónico y mensaje). No se recopilan datos automáticamente ni se utilizan cookies de rastreo.",
      "Uso de la información: los datos proporcionados se utilizan exclusivamente para responder a tu consulta o solicitud. No se comparten, venden ni transfieren a terceros.",
      "Almacenamiento: la información de contacto se conserva únicamente durante el tiempo necesario para gestionar la comunicación. Podés solicitar la eliminación de tus datos en cualquier momento.",
      "Derechos del usuario: tenés derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, escribí a romero.me@outlook.com.",
      "Esta política puede actualizarse periódicamente. Cualquier cambio será publicado en esta página.",
    ],
  },
};

/* ═══ COMPONENTS ════════════════════════════════════ */

function Home() {
  return (
    <div className="home">
      <div className="home-label reveal">"Manifesto"</div>
      <div className="home-poem reveal r1">
        {POEM.map((p, i) => <p key={i}>{p}</p>)}
        <div className="home-credit">— Texto encontrado en creativeliving</div>
      </div>
    </div>
  );
}

function BlogList({ onOpenPost }) {
  return (
    <div className="pg">
      <div className="wrap-wide">
        <div className="pg-head reveal">
          <h2>Blog</h2>
          <span className="tag">Pensamiento creativo</span>
        </div>
        <div className="blog-grid reveal r1">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="blog-item" onClick={() => onOpenPost(post.id)}>
              <div className="blog-cover">
                {post.cover ? (
                  <img src={post.cover} alt={post.title} />
                ) : (
                  <div className="blog-cover-placeholder">CAMBIAR POR IMG</div>
                )}
              </div>
              <div className="blog-item-body">
                <div className="blog-date">{post.date}</div>
                <div className="blog-title">{post.title}</div>
                <div className="blog-excerpt">{post.excerpt}</div>
                <span className="blog-read">Leer más</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogPost({ postId, onBack }) {
  const post = BLOG_POSTS.find(p => p.id === postId);
  if (!post) return null;
  return (
    <div className="post reveal">
      <button className="post-back" onClick={onBack}>← Volver al blog</button>
      <div className="post-meta">
        <div className="post-meta-date">{post.date}</div>
        <div className="post-meta-title">{post.title}</div>
      </div>
      <div className="post-cover">
        {post.cover ? (
          <img src={post.cover} alt={post.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
        ) : (
          <div className="post-cover-placeholder">
            CAMBIAR ACÁ POR IMG<br />
            <span style={{fontSize:"11px",opacity:.5}}>En BLOG_POSTS → cover: "tu-url.jpg"</span>
          </div>
        )}
      </div>
      <div className="post-body">
        {post.body.map((block, i) => {
          if (block.type === "quote") return <blockquote key={i}>{block.text}</blockquote>;
          return <p key={i}>{block.text}</p>;
        })}
      </div>
      {post.tags && (
        <div className="post-tags">
          {post.tags.map(t => <span key={t} className="post-tag">{t}</span>)}
        </div>
      )}
    </div>
  );
}

function Blog({ postId, onOpenPost, onBack }) {
  if (postId) return <BlogPost postId={postId} onBack={onBack} />;
  return <BlogList onOpenPost={onOpenPost} />;
}

function About() {
  return (
    <div className="pg">
      <div className="wrap">
        <div className="pg-head reveal">
          <h2>Sobre Mí</h2>
          <span className="tag">De la moda al producto digital</span>
        </div>
        <div className="about-layout">
          <p className="reveal r1">
            De Bogotá a São Paulo, pasando por Buenos Aires: cada ciudad me enseñó una capa nueva de cómo diseñar productos que funcionan.
          </p>
          <p className="reveal r1">
            Todo empezó en Colombia, entre negocios y moda. Trabajando con marcas como Diesel, Tommy Hilfiger y Ralph Lauren descubrí el visual merchandising — la idea de que un espacio tiene un recorrido, que podés guiar al usuario a través de un layout pensado para que cada paso tenga sentido. Estaba aprendiendo UX antes de saber que se llamaba así.
          </p>
          <p className="reveal r2">
            En Buenos Aires esa intuición se convirtió en oficio. Cinco años en Nike, donde la experiencia de marca tomó otra escala. Pero lo que cambió todo fue descubrir qué había detrás de las pantallas — el diseño web, la lógica de un producto de software. Me formé como desarrollador Full Stack, me especialicé en UX/UI, y a partir de ahí no paré.
          </p>
          <div className="about-quote reveal r2">
            Una idea que no se comunica es una idea que no existe.
          </div>
          <p className="reveal r3">
            Como freelance diseñé desde apps de geolocalización satelital para el agro hasta plataformas de +70 millones de datos para retailers globales como Walmart, Amazon y Tesco. Lideré la taxonomía mundial de ads para Coca-Cola, PepsiCo y Loewe. Construí ecommerce, marketplaces, escuelas online y un asistente parental dentro de WhatsApp en la primera hackathon de la app en LATAM.
          </p>
          <p className="reveal r3">
            Hoy estoy en Brasil. La mudanza fue intencional — este país tiene la industria de ecommerce y consumo masivo más grande de la región, y quiero estar donde la escala obliga a pensar diferente.
          </p>
          <p className="reveal r4">
            Si hay algo que me define es la curiosidad. No me interesa dominar una sola herramienta; me interesa entender cómo se conectan los sistemas, por qué la gente usa los productos como los usa, y cómo la tecnología puede hacer que esa experiencia sea mejor.
          </p>

          <div className="reveal r4">
            <p className="skills-label">Áreas de enfoque</p>
            <div className="skills-row">
              {["UX / UI Design", "UX Research", "Product Design", "Visual Merchandising", "Diseño Web", "Ecommerce", "Data Interfaces", "Branding"].map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>

          {/* ── LÍNEA DE TIEMPO ── */}
          <div className="timeline reveal r4">
            <div className="timeline-chapter">
              <div className="timeline-place">Colombia</div>
              <div className="timeline-subtitle">Negocio, diseño y narrativa visual</div>
              <div className="timeline-items">
                <div className="timeline-item"><div className="timeline-dot" /><span>Negocios Comerciales — Mercadeo internacional, publicidad. La base de entender que todo diseño responde a un objetivo de negocio.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Diseño Gráfico — La herramienta para materializar estrategia en comunicación visual.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Diesel, Tommy Hilfiger, Ralph Lauren — Visual merchandising: layout, recorrido del usuario, experiencia de marca. La primera semilla de UX.</span></div>
              </div>
            </div>

            <div className="timeline-chapter">
              <div className="timeline-place">Buenos Aires</div>
              <div className="timeline-subtitle">Del espacio físico al producto digital</div>
              <div className="timeline-items">
                <div className="timeline-item"><div className="timeline-dot" /><span>Nike — Imagen Corporativa (5 años). Visual merchandising a escala multinacional. Descubrimiento del diseño web y productos digitales.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Full Stack + UX/UI — Transición formal al mundo del software y diseño de producto.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Kelpie — App de geolocalización satelital para medición de pasturas. QA, API REST, Agile-Scrum.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Agencia Nan — Ecommerce, marketplaces, escuelas online, academias de coaching.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>NoCountry — Plataforma de crowdfunding para startups con pasarela de pagos.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Hack the Chat — Hackathon WhatsApp LATAM. Asistente parental dentro de la app.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>Shalion (Barcelona) — Interfaces para +70M de datos en retailers globales. Taxonomía de ads para Coca-Cola, PepsiCo, Loewe.</span></div>
              </div>
            </div>

            <div className="timeline-chapter">
              <div className="timeline-place">Brasil</div>
              <div className="timeline-subtitle">Nuevo territorio, misma curiosidad</div>
              <div className="timeline-items">
                <div className="timeline-item"><div className="timeline-dot" /><span>Consultor UX/UI remoto — Adaptación de ecommerce para compra a través de recetas. Lógica de negocio, interfaz y tecnología.</span></div>
                <div className="timeline-item"><div className="timeline-dot" /><span>En proceso de arraigo — Explorando el ecosistema tech brasileño y el mercado de ecommerce más grande de la región.</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Work() {
  /*
   * ── PROYECTOS ──
   * Para editar: cambiá title, cat, desc, tags y cover.
   * cover: null muestra placeholder, o poné "https://tu-imagen.jpg"
   */
  const projects = [
    { cat: "Branding", title: "Studio Nórdico — Identidad", cover: null, desc: "Desarrollo de identidad visual completa para un estudio de diseño escandinavo. El proyecto incluyó logotipo, paleta cromática, tipografía, papelería y guía de marca.", tags: ["Identidad", "Logotipo", "Guidelines"] },
    { cat: "Editorial", title: "Revista Materia N°04", cover: null, desc: "Diseño editorial de la cuarta edición de Revista Materia, una publicación independiente sobre arte y cultura contemporánea. 120 páginas, formato A4.", tags: ["Editorial", "Print", "Layout"] },
    { cat: "Dirección de Arte", title: "Estación Sur — Campaña", cover: null, desc: "Dirección de arte para la campaña visual de temporada. Fotografía, composición y adaptación a formatos digitales e impresos.", tags: ["Campaña", "Fotografía", "Digital"] },
    { cat: "Tipografía", title: "Sistema Tipográfico Clave", cover: null, desc: "Diseño de un sistema tipográfico modular para uso en interfaces y piezas editoriales. Incluye 4 pesos y variantes itálicas.", tags: ["Type Design", "Sistema", "Variable"] },
    { cat: "UI / UX", title: "Plataforma Onda", cover: null, desc: "Diseño de interfaz y experiencia de usuario para una plataforma de streaming de música independiente. Investigación, wireframes y diseño final.", tags: ["UI", "UX", "Product"] },
    { cat: "Moda", title: "Colección Cápsula SS26", cover: null, desc: "Dirección creativa para la colección cápsula de primavera-verano 2026. Concepto visual, lookbook y comunicación de marca.", tags: ["Moda", "Lookbook", "Concepto"] },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="pg">
      <div className="wrap-wide">
        <div className="pg-head reveal">
          <h2>Trabajo</h2>
          <span className="tag">Proyectos seleccionados</span>
        </div>
        <div className="work-grid reveal r1">
          {projects.map((p, i) => (
            <div key={i} className="work-card" onClick={() => setSelected(p)}>
              <div className="work-card-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="work-card-bottom">
                <div className="work-card-cat">{p.cat}</div>
                <div className="work-card-title">{p.title}</div>
              </div>
              <div className="work-card-arrow">↗</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL DE PROYECTO ── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>

            {/* Imagen de portada */}
            <div className="modal-img">
              {selected.cover ? (
                <img src={selected.cover} alt={selected.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              ) : (
                <div className="modal-img-placeholder">
                  CAMBIAR ACÁ POR IMG<br />
                  <span style={{fontSize:"11px",opacity:.5}}>En projects → cover: "tu-url.jpg"</span>
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="modal-body">
              <div className="modal-cat">{selected.cat}</div>
              <div className="modal-title">{selected.title}</div>
              <div className="modal-desc">{selected.desc}</div>
              {selected.tags && (
                <div className="modal-tags">
                  {selected.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Contact() {
  return (
    <div className="pg">
      <div className="wrap">
        <div className="pg-head reveal">
          <h2>Contacto</h2>
          <span className="tag">Hablemos</span>
        </div>
        <div className="contact-block">
          <p className="reveal r1">
            Si tenés una idea, un proyecto o simplemente querés conversar sobre diseño y creatividad, escribime. Estoy abierto a colaboraciones, consultas y nuevos desafíos.
          </p>
          <div className="contact-info reveal r2">
            <div className="contact-info-item">
              <span className="contact-info-label">Email</span>
              <span>romero.me@outlook.com</span>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-label">Tel</span>
              <span>+54 11 6814-1667</span>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-label">Base</span>
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
          <div className="reveal r3">
            <a
              className="contact-cta"
              href="https://wa.me/541168141667?text=Hola%2C%20vi%20tu%20portfolio%20y%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto."
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Hablemos
            </a>
            <div className="contact-note">Respondo en menos de 24hs.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalPage({ pageKey, onBack }) {
  const legal = LEGAL_PAGES[pageKey];
  if (!legal) return null;
  return (
    <div className="post reveal">
      <button className="post-back" onClick={onBack}>← Volver</button>
      <div className="post-meta">
        <div className="post-meta-title">{legal.title}</div>
        <div className="post-meta-date" style={{marginTop:"10px"}}>Última actualización: Abril 2026</div>
      </div>
      <div className="post-body" style={{marginTop:"48px"}}>
        {legal.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}

/* ═══ APP ════════════════════════════════════════════ */

export default function App() {
  const [page, setPage] = useState("Inicio");
  const [theme, setTheme] = useState("light");
  const [mob, setMob] = useState(false);
  const [blogPost, setBlogPost] = useState(null);
  const [legalPage, setLegalPage] = useState(null);

  const go = useCallback((p) => {
    setPage(p); setBlogPost(null); setLegalPage(null); setMob(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const openPost = useCallback((id) => {
    setBlogPost(id); window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const backToBlog = useCallback(() => {
    setBlogPost(null); window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const openLegal = useCallback((key) => {
    setPage("__legal"); setLegalPage(key); setMob(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const backFromLegal = useCallback(() => {
    setPage("Inicio"); setLegalPage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const bg = theme === "light" ? BLUE : DARK;
    document.documentElement.style.setProperty("background", bg, "important");
    document.body.style.setProperty("background", bg, "important");
    document.body.style.setProperty("margin", "0", "important");
    document.body.style.setProperty("padding", "0", "important");
    // Update page title
    document.title = "rrr—";
  }, [theme]);

  return (
    <>
      <style>{css}</style>
      <div className="site" style={themes[theme]}>

        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="nav-logo" onClick={() => go("Inicio")}>rrr—</div>
            <div className="nav-center">
              {PAGES.map(p => (
                <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => go(p)}>{p}</button>
              ))}
            </div>
            <div className="nav-right">
              <button className="theme-dot" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
                {theme === "light" ? "●" : "○"}
              </button>
              <button className={`mob-btn${mob ? " open" : ""}`} onClick={() => setMob(v => !v)}>
                <span /><span /><span />
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`mob-menu${mob ? " open" : ""}`}>
          {PAGES.map(p => (
            <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => go(p)}>{p}</button>
          ))}
        </div>

        {/* PAGES */}
        <div key={page + (blogPost || "")}>
          {page === "Inicio" && <Home />}
          {page === "Blog" && <Blog postId={blogPost} onOpenPost={openPost} onBack={backToBlog} />}
          {page === "Sobre Mí" && <About />}
          {page === "Trabajo" && <Work />}
          {page === "Contacto" && <Contact />}
          {page === "__legal" && <LegalPage pageKey={legalPage} onBack={backFromLegal} />}
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="wrap-wide">
            <div className="ft-top">
              <div className="ft-brand">rrr—</div>
              <div className="ft-desc">Buenos Aires, Argentina</div>
            </div>
            <div className="ft-grid">
              <div>
                <div className="ft-col-title">Sitio</div>
                <div className="ft-links">
                  {PAGES.map(p => <button key={p} className="ft-link" onClick={() => go(p)}>{p}</button>)}
                </div>
              </div>
              <div>
                <div className="ft-col-title">Legal</div>
                <div className="ft-links">
                  <button className="ft-link" onClick={() => openLegal("terminos")}>Términos</button>
                  <button className="ft-link" onClick={() => openLegal("privacidad")}>Privacidad</button>
                </div>
              </div>
              <div>
                <div className="ft-col-title">Contacto</div>
                <div className="ft-links">
                  <span className="ft-link">romero.me@outlook.com</span>
                  <span className="ft-link">+54 11 6814-1667</span>
                </div>
              </div>
              <div>
                <div className="ft-col-title">Redes</div>
                <div className="ft-links" style={{flexDirection:"row",gap:"16px"}}>
                  <a className="ft-social" href="https://www.linkedin.com/in/rafael-rom/" target="_blank" rel="noopener noreferrer">Li</a>
                  <a className="ft-social" href="https://www.behance.net/Ricardo-Romero" target="_blank" rel="noopener noreferrer">Be</a>
                  <a className="ft-social" href="https://github.com/ricardo-3" target="_blank" rel="noopener noreferrer">Gh</a>
                </div>
              </div>
            </div>
            <div className="ft-bottom">
              <div className="ft-copy">© 2026 rrr—</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}