import { useState, useEffect, useCallback } from "react";

const PAGES = ["Inicio", "Portfolio", "Sobre Mí", "Blog", "Contacto"];
const BLUE = "#2b44c0";
const DARK = "#0f0f0f";
const BASE_URL = import.meta.env.BASE_URL;
const imagePath = (name) => `${BASE_URL}images/${name}`;

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
    "--t2": "rgba(255,255,255,0.72)",
    "--border": "rgba(255,255,255,0.08)",
    "--card": "rgba(255,255,255,0.06)",
    "--card-h": "rgba(255,255,255,0.12)",
    "--btn-bg": "#ffffff",
    "--btn-fg": BLUE,
  },
  dark: {
    "--bg": DARK,
    "--t1": "rgba(255,255,255,0.96)",
    "--t2": "rgba(255,255,255,0.60)",
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
#root{max-width:none !important;padding:0 !important;margin:0 !important;text-align:left !important;width:100% !important}
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
  justify-content:center;position:relative;
  transition:border-color .2s;line-height:1;
}
.theme-dot svg{width:14px;height:14px;display:block;position:relative;z-index:1}
.theme-dot:hover{border-color:var(--t2)}

.theme-dot-pulse{
  position:absolute;inset:0;border-radius:50%;
  border:1px solid var(--t1);
  opacity:0;pointer-events:none;
  animation:themePulse 2.6s ease-out infinite;
}
.theme-dot:hover .theme-dot-pulse{animation-play-state:paused}
@keyframes themePulse{
  0%{transform:scale(0.55);opacity:.45}
  70%{transform:scale(1.55);opacity:0}
  100%{transform:scale(1.55);opacity:0}
}
@media (prefers-reduced-motion: reduce){
  .theme-dot-pulse{animation:none;display:none}
}

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
  display:grid;grid-template-columns:1fr 1fr;gap:24px;
}
.blog-item{
  background:rgba(255,255,255,0.04);
  padding:20px;
  cursor:pointer;transition:background .2s;
  overflow:hidden;
  outline:1px solid rgba(255,255,255,0.12);
  outline-offset:-1px;
  border-radius:3px;
}
.blog-item:hover{background:rgba(255,255,255,0.06)}
.blog-cover{
  width:100%;aspect-ratio:16/10;
  background:rgba(255,255,255,0.08);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
  margin-bottom:18px;
}
.blog-cover img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) brightness(0.95)}
.blog-cover-placeholder{
  font-size:11px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;opacity:.7;
}
.blog-item-body{padding:0}
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
.post-body h3{
  font-size:13px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t1);
  margin:56px 0 22px;line-height:1.5;
}
.post-body ul,.post-body ol{
  margin:0 0 24px;padding-left:20px;
}
.post-body li{
  font-size:16px;font-weight:400;line-height:1.85;
  color:var(--t2);margin-bottom:10px;padding-left:6px;
}
.post-body li::marker{color:var(--t2);opacity:.6}
.post-body li strong{color:var(--t1);font-weight:500}
.post-sources{
  margin-top:48px;padding-top:20px;
  border-top:1px solid var(--border);
}
.post-sources-label{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:14px;
}
.post-sources a{
  display:block;width:fit-content;
  font-size:13px;font-weight:400;line-height:1.6;
  color:var(--t2);text-decoration:none;margin-bottom:10px;
  border-bottom:1px solid transparent;
  transition:color .2s,border-color .2s;
}
.post-sources a:hover{color:var(--t1);border-bottom-color:var(--t1)}
.post-body a{
  color:var(--t1);text-decoration:none;
  border-bottom:1px solid var(--border);
  transition:border-color .2s;
}
.post-body a:hover{border-bottom-color:var(--t1)}
.post-body em{font-style:italic}
.post-body strong{color:var(--t1);font-weight:500}
.post-meta-read{
  font-size:11px;font-weight:400;letter-spacing:.08em;
  text-transform:uppercase;color:var(--t2);
  opacity:.65;margin-top:12px;
}
.blog-readtime{opacity:.6}
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
.portfolio-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:24px;
}
.portfolio-item{
  background:rgba(255,255,255,0.04);
  padding:20px;
  cursor:pointer;transition:background .2s;
  overflow:hidden;
  outline:1px solid rgba(255,255,255,0.12);
  outline-offset:-1px;
  border-radius:3px;
}
.portfolio-item:hover{background:rgba(255,255,255,0.06)}
.portfolio-cover{
  width:100%;aspect-ratio:16/10;
  background:rgba(255,255,255,0.08);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
  border-radius:0;
  margin-bottom:18px;
}
.portfolio-cover img{
  width:100%;height:100%;object-fit:cover;
  filter:grayscale(100%) brightness(0.95);
}
.portfolio-cover-placeholder{
  font-size:11px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;opacity:.7;
}
.portfolio-item-body{padding:0}
.portfolio-date{
  font-size:11px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t2);margin-bottom:12px;
}
.portfolio-title{
  font-size:16px;font-weight:500;letter-spacing:-.01em;
  color:var(--t1);margin-bottom:8px;line-height:1.4;
}
.portfolio-excerpt{
  font-size:13px;font-weight:400;color:var(--t2);line-height:1.6;
}
@media(max-width:768px){.portfolio-grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.portfolio-grid{grid-template-columns:1fr}}

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
  padding-top:8px;
  animation:modalUp .3s ease forwards;
}
@keyframes modalUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
.modal-close{
  position:absolute;top:12px;right:18px;z-index:999;
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
  max-height:50vh;
}
.modal-img-placeholder{
  font-size:13px;font-weight:400;color:var(--t2);
  text-align:center;line-height:1.6;
}
.modal-body{padding:32px}
.modal-cover-img{
  width:100%;height:100%;max-height:calc(50vh - 16px);object-fit:contain;display:block;
}
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
  "Pilotas un esqueleto hecho de polvo de estrellas, envuelto en músculo y carne, sentado sobre una roca que genera su propia atmósfera y suficiente oxígeno para respirar, mientras atraviesas el espacio a unos 110.000 km por hora.",
  "Cada noche abandonas tu cuerpo, alucinas vívidamente durante horas, te ves morir una y otra vez, y luego despiertas y a eso lo llamas \"dormir\", como si no fuera nada inusual.",
  "Eres un conjunto de átomos que, de algún modo, aprendió a pensar sobre sí mismo; a sentir emociones por tener emociones, y a ser consciente de que es consciente.",
  "Eres un universo consciente atrapado en un cuerpo temporal durante unos 80 o 90 años —unas 4.000 semanas— y pasas parte de ese tiempo preocupándote por si un correo fue demasiado largo.",
  "Mi amor, eres un milagro que la física no puede explicar.",
  "Tus átomos se forjaron en el corazón de una estrella moribunda; la sangre de tus venas es ancestral; el calcio de tus huesos se creó en una supernova.",
  "Estás literalmente lleno de estrellas reencarnadas, y te preocupa volverte loco.",
  "Haz esa cosa rara. Di ese pensamiento raro. Sé ese ser humano desconcertante y contradictorio que de verdad eres.",
  "Ya eres imposible… bien podrías ser interesante.",
];

/*
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  BLOG — LOS POSTS VIVEN EN src/posts/                       ║
 * ║                                                             ║
 * ║  Cada post es un archivo .md dentro de src/posts/.          ║
 * ║  No hay ninguna lista para actualizar: si el archivo está   ║
 * ║  en esa carpeta, aparece solo en el blog, ordenado por      ║
 * ║  fecha (más nuevo primero).                                 ║
 * ║                                                             ║
 * ║  Para publicar: subí el .md a src/posts/ y la portada a     ║
 * ║  public/images/. Nada de este archivo hay que tocar.        ║
 * ║                                                             ║
 * ║  El formato del .md está explicado en INSTRUCCIONES-IA.md   ║
 * ║  (en la raíz del repo).                                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

/* Vite lee todos los .md de la carpeta al compilar */
const POST_FILES = import.meta.glob("./posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

/* Separa los datos de arriba (entre ---) del texto del post */
function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, "").trim();
  const meta = {};
  if (!text.startsWith("---")) return { meta, body: text };
  const close = text.indexOf("\n---", 3);
  if (close === -1) return { meta, body: text };
  text.slice(3, close).split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  });
  return { meta, body: text.slice(close + 4).trim() };
}

/* Convierte el markdown en bloques que el sitio sabe dibujar */
function parseMarkdown(md) {
  const blocks = [];
  let paragraph = [];
  let list = null;
  let ordered = false;
  let sourcesMode = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    if (sourcesMode) {
      const items = list
        .map((item) => {
          const m = item.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          return m ? { label: m[1], url: m[2] } : null;
        })
        .filter(Boolean);
      if (items.length) blocks.push({ type: "sources", items });
    } else {
      blocks.push({ type: "list", ordered, items: list });
    }
    list = null;
  };

  md.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }
    if (/^#{1,6}\s+/.test(line)) {
      flushParagraph();
      flushList();
      const title = line.replace(/^#{1,6}\s+/, "");
      if (/^fuentes$/i.test(title)) {
        sourcesMode = true;
      } else {
        sourcesMode = false;
        blocks.push({ type: "h", text: title });
      }
      return;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "") });
      return;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph();
      if (list && !ordered) flushList();
      ordered = true;
      list = list || [];
      list.push(line.replace(/^\d+[.)]\s+/, ""));
      return;
    }
    if (/^[-*+]\s+/.test(line)) {
      flushParagraph();
      if (list && ordered) flushList();
      ordered = false;
      list = list || [];
      list.push(line.replace(/^[-*+]\s+/, ""));
      return;
    }
    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();
  return blocks;
}

/* Tiempo estimado de lectura, estilo Medium: cuenta las palabras
   del post y las divide por la velocidad de lectura promedio.
   Si editás el texto, el número se actualiza solo. */
const WORDS_PER_MINUTE = 200;

function readingTime(post) {
  const words = (post.body || []).reduce((total, block) => {
    if (block.type === "sources") return total;
    const text = block.type === "list" ? (block.items || []).join(" ") : block.text || "";
    return total + String(text).replace(/[*_[\]()]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/* Para ordenar: "09 — 2026" se convierte en 202609 */
function dateWeight(date) {
  const m = String(date || "").match(/(\d{1,2})\D+(\d{4})/);
  return m ? Number(m[2]) * 100 + Number(m[1]) : 0;
}

const BLOG_POSTS = Object.entries(POST_FILES)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const blocks = parseMarkdown(body);
    const firstParagraph = blocks.find((b) => b.type === "p");
    const cover = meta.cover
      ? (/^https?:\/\//.test(meta.cover) ? meta.cover : imagePath(meta.cover))
      : null;
    return {
      id: path.split("/").pop().replace(/\.md$/, ""),
      title: meta.title || "Sin título",
      date: meta.date || "",
      excerpt: meta.excerpt || (firstParagraph ? firstParagraph.text.slice(0, 160) : ""),
      tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      cover,
      body: blocks,
    };
  })
  .sort((a, b) => dateWeight(b.date) - dateWeight(a.date));


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
        <div className="home-credit">— No tienes que sufrir un caos continuo para poder crecer.</div>
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
                <div className="blog-date">
                  {post.date} <span className="blog-readtime">· {readingTime(post)} min de lectura</span>
                </div>
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

/* Dibuja **negritas**, *itálicas* y [links](url) dentro de un texto */
function Inline({ text }) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let key = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(<a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>);
    } else if (m[3]) {
      parts.push(<strong key={key++}>{m[3]}</strong>);
    } else {
      parts.push(<em key={key++}>{m[4]}</em>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/* Ítem de lista: si empieza con "Palabra:" resalta esa palabra */
function PostListItem({ text }) {
  const i = text.indexOf(":");
  if (i > 0 && i < 24) {
    return <li><strong>{text.slice(0, i)}</strong><Inline text={text.slice(i)} /></li>;
  }
  return <li><Inline text={text} /></li>;
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
        <div className="post-meta-read">{readingTime(post)} min de lectura</div>
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
          if (block.type === "quote") return <blockquote key={i}><Inline text={block.text} /></blockquote>;
          if (block.type === "h") return <h3 key={i}><Inline text={block.text} /></h3>;
          if (block.type === "list") {
            const items = block.items.map((t, j) => <PostListItem key={j} text={t} />);
            return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          if (block.type === "sources") {
            return (
              <div key={i} className="post-sources">
                <div className="post-sources-label">Fuentes</div>
                {block.items.map((s, j) => (
                  <a key={j} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                ))}
              </div>
            );
          }
          return <p key={i}><Inline text={block.text} /></p>;
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
    { cat: "UI / UX", title: "VAM — Virtual Assistant for Merchandising", cover: imagePath("vam.png"), desc: "App que estandariza y centraliza el Visual Merchandising en retail de moda. Elimina reportes manuales, asegura trazabilidad y alinea a los equipos. Rol: Diseño UX/UI end-to-end. Proceso: 10 entrevistas en profundidad con visual merchandisers y encargados de tienda → insight: falta de visibilidad y desalineación entre lineamientos visuales y objetivos de venta. Entregables: user personas, user flow (Login → Home → Zonas/Tiendas → Reporte → Fotos/Checklist/Notas → Enviar), wireframes. Solución: reporte estructurado (fotos + checklist + notas), trazabilidad por zona y tienda, lineamientos y capacitación en tiempo real. UI: Inter, paleta #E5FF73 (acento), #F4F5EF (off-white), #000301. Estado: en uso real en Barcelona (producto privado). Se puede hablar del proceso y aprendizajes, NO de datos internos ni capturas no públicas.", tags: ["UX","Research","Enterprise"] },
    { cat: "UI / UX", title: "HairScope — Análisis Capilar con IA", cover: imagePath("hairscope.png"), desc: "App (MVP/hackatón) que mide la salud del cabello en 60s con IA desde el celular. Flujo en 3 pasos: 1) selfie con luz natural; 2) IA evalúa densidad, grosor, cuero cabelludo y patrones de caída; 3) diagnóstico con score (ej. 72/100) y recomendaciones personalizadas. Doble audiencia: usuarios finales y profesionales. Incluye landing y experiencia de producto. Prueba social: testimonios de usuaria (Buenos Aires), dermatólogo (CDMX) y directora de clínica (Bogotá). UI: estética cálida y editorial (verdes naturales + crema, tipografía serif). Estado: hackatón — pieza de portfolio que demuestra pasar de problema a producto en tiempo reducido.", tags: ["MVP","IA","Mobile"] },
    { cat: "UI / UX", title: "Residencia Amanecer — Gestión Geriátrica", cover: imagePath("residencia-amanecer.png"), desc: "Software de gestión para residencias geriátricas que centraliza pacientes, familiares, medicamentos e historia clínica. Funcionalidades clave: dashboard con métricas (pacientes activos, medicamentos que requieren atención), módulo de Medicamentos (dosis, frecuencia, stock restante, fecha estimada de agotamiento) y sistema de alertas en tres niveles (urgente ≤2d, alerta, próximos ≤10d) con envío de aviso por WhatsApp al familiar responsable y registro histórico. Impacto: reducir errores de medicación y evitar quiebres de stock. UI: sidebar oscuro (navy/violeta), área de contenido clara y pills de estado por color. Estado: en uso real/producción.", tags: ["Healthcare","Dashboard","Alerts"] },
    { cat: "Branding / Web", title: "NAN — Agencia de Marketing Digital", cover: imagePath("nan.png"), desc: "Proyecto propio: creador y diseñador de la marca y el sitio. NAN es una agencia enfocada en ecosistemas de crecimiento: growth marketing, paid media (Meta, Google, TikTok), UX/UI engineering y analítica avanzada. Diseñé identidad, dirección de arte y el sitio completo, con módulos de IA (AI Summarizer, Growth Roadmap) y un sistema visual de alto contraste. Sitio: nanestudio.art.", tags: ["Branding","Web","AI"] },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="pg">
      <div className="wrap-wide">
        <div className="pg-head reveal">
          <h2>Portfolio</h2>
          <span className="tag">Proyectos seleccionados</span>
        </div>
        <div className="portfolio-grid reveal r1">
          {projects.map((p, i) => (
            <div key={i} className="portfolio-item" onClick={() => setSelected(p)}>
              <div className="portfolio-cover">
                {p.cover ? (
                  <img src={p.cover} alt={p.title} />
                ) : (
                  <div className="portfolio-cover-placeholder">Portada</div>
                )}
              </div>
              <div className="portfolio-item-body">
                <div className="portfolio-date">{String(i + 1).padStart(2, "0")}</div>
                <div className="portfolio-title">{p.title}</div>
                <div className="portfolio-excerpt">{p.cat}</div>
              </div>
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
                <img src={selected.cover} alt={selected.title} className="modal-cover-img" />
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
              {selected.pdf && (
                <div className="modal-pdf" style={{marginTop:12}}>
                  <a href={selected.pdf} target="_blank" rel="noreferrer" className="modal-pdf-link">Ver PDF del proyecto ↗</a>
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
  const [theme, setTheme] = useState("dark");
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
    document.body.style.setProperty("display", "block", "important");
    const root = document.getElementById("root");
    if (root) {
      root.style.setProperty("max-width", "none", "important");
      root.style.setProperty("padding", "0", "important");
      root.style.setProperty("margin", "0", "important");
      root.style.setProperty("text-align", "left", "important");
      root.style.setProperty("width", "100%", "important");
    }
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
              <button
                className="theme-dot"
                onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
                aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
                title={theme === "light" ? "Modo oscuro" : "Modo claro"}
              >
                <span className="theme-dot-pulse" />
                {theme === "light" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4.2" />
                    <line x1="12" y1="1.5" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22.5" />
                    <line x1="1.5" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="22.5" y2="12" />
                    <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
                    <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
                    <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
                    <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
                  </svg>
                )}
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
          {page === "Portfolio" && <Work />}
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
