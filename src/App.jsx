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
 * ║  BLOG POSTS — TEMPLATE REUTILIZABLE                        ║
 * ║                                                             ║
 * ║  Para agregar un nuevo post:                                ║
 * ║  1. Copiá un objeto del array BLOG_POSTS                   ║
 * ║  2. Cambiá: id, date, title, excerpt, tags, body           ║
 * ║  3. En "cover" poné la URL de tu imagen o dejá null        ║
 * ║  4. Listo — aparece automáticamente en el blog             ║
 * ║                                                             ║
 * ║  Para la imagen de portada:                                 ║
 * ║  - Recomendado: 1600x900px (ratio 16:9)                    ║
 * ║  - Guardala en public/images/ y usá imagePath("archivo")   ║
 * ║  - Si cover es null muestra el placeholder                  ║
 * ║                                                             ║
 * ║  TIPOS DE BLOQUE disponibles dentro de "body":              ║
 * ║  { type: "p",     text: "un párrafo normal" }               ║
 * ║  { type: "h",     text: "un subtítulo de sección" }         ║
 * ║  { type: "quote", text: "una cita destacada" }              ║
 * ║  { type: "list",  ordered: true, items: ["uno","dos"] }     ║
 * ║        → ordered: true = 1,2,3 · ordered: false = viñetas   ║
 * ║        → si un ítem empieza con "Palabra:" esa palabra      ║
 * ║          se resalta automáticamente                         ║
 * ║  { type: "sources", items: [{ label:"Nombre", url:"..." }]} ║
 * ║        → se muestra al final como lista de fuentes          ║
 * ║                                                             ║
 * ║  El TIEMPO DE LECTURA se calcula solo (ver readingTime).    ║
 * ║  No hay que escribirlo a mano en ningún post.               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

/* Tiempo estimado de lectura, estilo Medium: cuenta las palabras
   del post y las divide por la velocidad de lectura promedio.
   Si editás el texto, el número se actualiza solo. */
const WORDS_PER_MINUTE = 200;

function readingTime(post) {
  const words = (post.body || []).reduce((total, block) => {
    if (block.type === "sources") return total;
    const text = block.type === "list" ? (block.items || []).join(" ") : block.text || "";
    return total + String(text).trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const BLOG_POSTS = [
  {
    id: "letra-elitista-tiktok-shop",
    date: "09 — 2026",
    title: "De la letra elitista a TikTok Shop: la evolución del mensaje que no necesita ser pensado",
    excerpt: "De la escritura cuneiforme al botón de compra: cómo las interfaces dejaron de pedirnos que interpretemos la información y empezaron a interpretarla por nosotros.",
    cover: imagePath("blog-cover-6.jpg"), // ← guardá la imagen en public/images/blog-cover-6.jpg
    tags: ["Interfaces", "Historia del Diseño", "Comunicación"],
    body: [
      { type: "p", text: "Durante gran parte de la historia, acceder a la información significó pertenecer a un círculo capaz de interpretarla." },
      { type: "p", text: "La escritura fue una de las primeras tecnologías eficientes para conservar información fuera de la memoria humana. Permitió registrar cantidades, acontecimientos, leyes, sonidos e ideas mediante símbolos. Pero su existencia no garantizaba que la información fuera accesible: para comprenderla había que conocer su código." },
      { type: "p", text: "Leer y escribir exigía aprendizaje, tiempo y acceso a instituciones que durante siglos estuvieron reservadas para determinados grupos sociales. Escribas, sacerdotes, administradores, comerciantes y miembros de las clases dominantes podían producir y descifrar información que el resto de la población no estaba en condiciones de interpretar directamente." },
      { type: "quote", text: "La escritura no solo permitió conservar conocimiento. También permitió administrarlo." },
      { type: "p", text: "Los primeros sistemas conocidos aparecieron en Mesopotamia hacia el 3200 a. C. y estuvieron ligados al registro económico y administrativo. Antes de servir para la literatura, la escritura sirvió para contabilizar bienes, organizar intercambios y controlar recursos. Denise Schmandt-Besserat estudió esta evolución desde antiguos sistemas de fichas contables hasta la escritura cuneiforme." },
      { type: "p", text: "Más adelante, los alfabetos fenicio, griego y romano facilitaron la representación de sonidos y ampliaron las posibilidades del lenguaje escrito. Sin embargo, la información continuaba detrás de una interfaz que no todos sabían utilizar." },
      { type: "quote", text: "La dificultad no estaba necesariamente en el contenido. Estaba en el acceso al código." },

      { type: "h", text: "La necesidad de una interfaz más accesible" },
      { type: "p", text: "Toda interfaz establece una relación entre una información y alguien que necesita interpretarla." },
      { type: "p", text: "La escritura funcionaba con eficiencia para quienes habían aprendido su sistema. Para los demás, los signos permanecían cerrados. Por eso la comunicación nunca dependió únicamente del texto: imágenes religiosas, símbolos políticos, vestimentas, escudos, monumentos, colores y representaciones teatrales permitían transmitir significados a personas que no sabían leer." },
      { type: "p", text: "La imagen ofrecía algo que el texto no podía garantizar: la posibilidad de producir una primera interpretación antes de conocer el código completo." },
      { type: "p", text: "Una persona podía no comprender una inscripción, pero reconocer una figura sagrada. Podía no leer el nombre de una autoridad, pero identificar sus colores y sus emblemas. Podía desconocer una narración escrita y, sin embargo, comprender un conflicto representado mediante cuerpos, gestos, música y escenografía." },
      { type: "p", text: "Esta necesidad de hacer perceptible una idea compleja llevó a integrar diferentes lenguajes dentro de una misma experiencia. Uno de los antecedentes modernos más importantes de esa integración apareció en la ópera." },

      { type: "h", text: "La ópera como sistema de composición total" },
      { type: "p", text: "En el siglo XIX, Richard Wagner formuló la idea de Gesamtkunstwerk: la “obra de arte total”." },
      { type: "p", text: "Su propuesta consistía en dejar de pensar la música, la poesía, el teatro, la actuación, la escenografía y el movimiento como elementos independientes. Todos debían participar de una misma composición y conducir hacia una misma experiencia." },
      { type: "p", text: "Wagner desarrolló esta idea en La obra de arte del futuro, publicada en 1849. En ella propuso una unión entre música, canto, danza, poesía, teatro y artes visuales. El objetivo no era simplemente colocar varias disciplinas dentro de una obra, sino hacer que cada una cumpliera una función dentro de un sistema común." },
      { type: "p", text: "La música aportaba emoción y ritmo. La poesía organizaba el relato. Los actores encarnaban el conflicto. La escenografía construía el mundo visual. La iluminación dirigía la atención. El espacio teatral separaba al espectador de la realidad cotidiana y lo introducía en otra." },
      { type: "p", text: "La ópera podía comunicar de forma simultánea a través del oído, la vista, el cuerpo y la emoción. El espectador no necesitaba reconstruir toda la experiencia mediante la lectura: la obra se presentaba ante él ya compuesta. Cada elemento indicaba cómo debía ser interpretado el siguiente." },
      { type: "p", text: "Así apareció un modelo fundamental para las interfaces posteriores: una información compleja podía dividirse en diferentes estímulos, organizarse jerárquicamente y recomponerse como una experiencia aparentemente unitaria. La persona no recibía elementos aislados. Recibía un recorrido." },

      { type: "h", text: "Del escenario a la ciudad" },
      { type: "p", text: "El principio de la obra total no quedó limitado a la ópera. A finales del siglo XIX, el Art Nouveau retomó la búsqueda de una unidad entre las artes. Arquitectura, mobiliario, ilustración, tipografía, indumentaria, objetos decorativos y espacios públicos comenzaron a compartir un mismo lenguaje." },
      { type: "p", text: "El Metropolitan Museum of Art explica que sus diseñadores buscaron sintetizar las bellas artes y las artes aplicadas mediante la creación de ambientes completos. El concepto de Gesamtkunstwerk se trasladó así desde la representación escénica hacia la vida cotidiana." },
      { type: "p", text: "La composición ya no terminaba cuando bajaba el telón. Podía continuar en una casa, un comercio, una estación de metro, un mueble, una lámpara o una pieza gráfica. Las entradas del metro diseñadas por Hector Guimard, por ejemplo, no funcionaban solamente como señales: convertían el ingreso al sistema de transporte en parte de un lenguaje visual reconocible." },
      { type: "quote", text: "Una estética comenzaba a comportarse como una interfaz." },
      { type: "p", text: "Sus formas, líneas y repeticiones permitían reconocer que elementos diferentes pertenecían a un mismo universo. El usuario aprendía ese lenguaje mediante la exposición y la experiencia, aunque nadie le explicara formalmente sus reglas." },
      { type: "p", text: "Este principio sería fundamental para el desarrollo posterior de la identidad visual y del branding: ya no bastaba con colocar un nombre sobre un producto. Había que construir un sistema coherente alrededor de él." },

      { type: "h", text: "Jules Chéret y la síntesis del mensaje" },
      { type: "p", text: "Dentro de este proceso, el cartel publicitario produjo un cambio decisivo." },
      { type: "p", text: "Hasta entonces, gran parte de la información pública seguía dependiendo de la palabra escrita. Los anuncios podían contener extensos bloques de texto que exigían detenerse, leer y comprender. Funcionaban para quienes conocían la interfaz de la lectura, pero resultaban menos eficaces dentro de una ciudad cada vez más rápida, saturada y poblada." },
      { type: "p", text: "Jules Chéret comprendió que el cartel necesitaba otro recorrido. En 1866 popularizó una técnica de litografía en color que marcó el nacimiento del cartel publicitario moderno. Su innovación no se redujo al uso del color: consistió en organizar la información para que pudiera ser percibida antes de ser leída." },
      { type: "p", text: "La composición proponía tres momentos:" },
      { type: "list", ordered: true, items: [
        "Atención: una figura expresiva, el movimiento y el contraste producen una reacción inmediata.",
        "Identificación: el nombre, el espectáculo o el producto se integran dentro de esa escena.",
        "Información: los datos secundarios quedan disponibles para quien decide detenerse.",
      ] },
      { type: "p", text: "El orden es lo verdaderamente importante. En un anuncio basado en texto, la persona debía comenzar por el código: reconocer las letras, formar palabras y reconstruir el significado. En el cartel de Chéret, la persona comenzaba por la emoción y la imagen. Primero comprendía que algo era alegre, deseable, elegante o divertido. Después descubría qué se anunciaba." },
      { type: "p", text: "La síntesis visual reemplazaba una parte de la decodificación. Una persona que no estaba habituada a leer información comercial recibió de pronto una interfaz diferente. No necesitaba conocer previamente todas sus reglas porque la propia composición le enseñaba dónde mirar: primero la figura, luego el nombre y finalmente los datos." },
      { type: "p", text: "La jerarquía visual funcionaba como una guía. El cartel no eliminó el texto: lo subordinó a una estructura perceptiva capaz de comunicar incluso cuando el espectador no completaba la lectura." },
      { type: "p", text: "De este modo, la publicidad alcanzó a un público más amplio. La información dejó de estar encerrada únicamente en la alfabetización escrita y comenzó a circular mediante asociaciones visuales compartidas. No era necesario leer todo para recibir el mensaje." },

      { type: "h", text: "Aprender una interfaz sin que nadie la enseñe" },
      { type: "p", text: "El cartel también hizo algo más profundo: enseñó a las personas una nueva forma de mirar." },
      { type: "p", text: "Al principio, aquella combinación de cuerpos de gran escala, colores intensos, tipografía y movimiento debió constituir una interfaz novedosa. Sin embargo, su repetición en las calles permitió que el público aprendiera rápidamente su funcionamiento." },
      { type: "p", text: "No hacía falta un manual. La ubicación y el tamaño indicaban qué era importante. La figura generaba una emoción. El nombre permitía reconocer el evento o producto. Los elementos menores ofrecían detalles adicionales." },
      { type: "p", text: "La composición distribuía la información de acuerdo con la velocidad de la mirada. Con el tiempo, este recorrido se naturalizó: las personas dejaron de percibirlo como un sistema construido y comenzaron a experimentarlo como una forma evidente de comunicación." },
      { type: "quote", text: "Este es uno de los mayores logros de una interfaz: desaparecer como sistema y hacer que su interpretación parezca natural." },

      { type: "h", text: "Del cartel al retail moderno" },
      { type: "p", text: "Las tiendas contemporáneas de Nike, Adidas o Apple continúan aplicando esta estructura." },
      { type: "p", text: "Una pantalla de gran tamaño o una imagen de campaña produce el primer impacto. El producto aparece aislado, iluminado y presentado como objeto de deseo. La información técnica ocupa un lugar secundario. La arquitectura, los materiales, la música y la circulación completan el mensaje." },
      { type: "p", text: "El patrón de Chéret se expande desde la superficie del cartel hacia el espacio físico:" },
      { type: "list", ordered: false, items: [
        "La campaña captura la atención.",
        "El producto establece la identificación.",
        "Las etiquetas y pantallas aportan la información.",
        "La distribución del espacio conduce hacia la acción.",
      ] },
      { type: "p", text: "Al mismo tiempo, la tienda recupera el principio del Gesamtkunstwerk. Todos sus elementos participan de una identidad común. El consumidor no observa la marca desde afuera: entra en su universo." },
      { type: "p", text: "La tienda se convierte en una obra total orientada al consumo. No necesita explicar mediante un texto que la marca es innovadora, deportiva, exclusiva o tecnológica: construye un espacio donde esa interpretación ya está contenida en los materiales, las imágenes y los objetos." },
      { type: "quote", text: "La estética realiza el argumento." },

      { type: "h", text: "Garmin: cuando la interfaz interpreta antes que el usuario" },
      { type: "p", text: "Esta lógica también aparece en productos que no pertenecen directamente a la publicidad." },
      { type: "p", text: "Un reloj Garmin funciona aunque la persona no sepa correr, no comprenda la fisiología del entrenamiento o se encuentre en mal estado físico. El sistema no exige esos conocimientos porque los reemplaza por una interfaz." },
      { type: "p", text: "El dispositivo recoge información sobre frecuencia cardíaca, sueño, estrés, actividad y recuperación. Después sintetiza esos datos mediante colores, gráficos, números y recomendaciones. La función Body Battery, por ejemplo, combina diferentes señales para producir una estimación de la energía corporal." },
      { type: "p", text: "La persona no necesita interpretar todos los datos originales. La interfaz ya lo hizo." },
      { type: "p", text: "El usuario recibe el resultado de un proceso que no conoce por completo: energía alta, estrés elevado, mala recuperación o preparación para entrenar. A partir de esa síntesis toma una decisión. Garmin no le enseña necesariamente a comprender su cuerpo: le ofrece una interpretación lista para utilizar." },
      { type: "p", text: "El mecanismo es similar al del cartel. Una gran cantidad de información queda reducida a una jerarquía comprensible: primero aparece el estado general y después, si el usuario lo desea, puede acceder a los datos secundarios. La interfaz ocupa el lugar que antes correspondía al conocimiento especializado." },

      { type: "h", text: "TikTok Shop: la obra total dentro de una pantalla" },
      { type: "p", text: "TikTok Shop reúne todos estos sistemas dentro de una sola interfaz." },
      { type: "p", text: "Del cartel recupera la captura inmediata de la atención. Del Gesamtkunstwerk, la integración de diferentes lenguajes. Del retail, la construcción de una atmósfera de marca. De dispositivos como Garmin, la capacidad de procesar información y ofrecer una acción ya interpretada." },
      { type: "p", text: "El video integra cuerpo, música, voz, texto, montaje, movimiento, sonido y producto. La plataforma suma comentarios, reacciones, recomendaciones algorítmicas y una herramienta de compra. La composición vuelve a repetirse:" },
      { type: "list", ordered: true, items: [
        "Atención: el movimiento, el sonido o una imagen detienen el desplazamiento.",
        "Identificación: el producto aparece integrado en la acción.",
        "Información: el creador explica o demuestra sus beneficios.",
        "Validación: otros usuarios comentan, reaccionan y comparten.",
        "Acción: el botón de compra aparece dentro de la misma experiencia.",
      ] },
      { type: "p", text: "El contenido UGC resulta especialmente eficaz porque la publicidad adopta la forma de una experiencia personal. El producto no parece presentado por una empresa, sino utilizado y recomendado por una persona común." },
      { type: "p", text: "El usuario no debe imaginar cómo funciona: lo ve funcionando. No debe imaginar cómo se sentiría: el creador representa esa sensación. No debe buscar validación externa: los comentarios aparecen en la misma pantalla. No debe recordar el producto para comprarlo después: la transacción está integrada al estímulo." },
      { type: "p", text: "Una investigación sobre social commerce y contenido en video señala que las emociones, la presencia social y la información disponible influyen en la intención de compra. La eficacia no se encuentra únicamente en cada elemento, sino en la manera en que todos se combinan dentro de un mismo recorrido." },
      { type: "p", text: "TikTok Shop es una forma contemporánea de obra total, pero construida para la conversión. La música, la actuación, la demostración, la identidad visual, la validación colectiva y el comercio ocurren dentro del mismo escenario: la pantalla del teléfono." },

      { type: "h", text: "De interpretar el mensaje a recibirlo interpretado" },
      { type: "p", text: "La evolución de estas interfaces no eliminó la información. Eliminó progresivamente la necesidad de que el usuario la organizara por sí mismo." },
      { type: "p", text: "La escritura exigía conocer un código reservado históricamente a determinados círculos sociales. La ópera integró distintos lenguajes para producir una experiencia comprensible mediante varios sentidos. El Gesamtkunstwerk trasladó esa unidad hacia los objetos y los espacios. El Art Nouveau convirtió esa integración en un lenguaje visual. Chéret sintetizó la información comercial mediante un recorrido de atención, identificación e información. El retail transformó ese recorrido en un ambiente. Garmin convirtió datos complejos en una recomendación. TikTok Shop integró el estímulo y la compra dentro del mismo movimiento." },
      { type: "p", text: "Cada interfaz redujo la distancia entre la información y la acción. Pero también redujo la cantidad de operaciones que el usuario debía realizar para construir su propia interpretación." },
      { type: "p", text: "La interfaz selecciona lo importante, establece un orden, produce una emoción y sugiere una respuesta. No le enseña necesariamente a la persona a elegir a partir de una comprensión completa: le presenta una realidad ya sintetizada para que pueda actuar dentro de ella." },
      { type: "p", text: "Primero fue necesario pertenecer a un círculo capaz de leer. Después, la imagen permitió comprender sin dominar aquel código. Finalmente, las interfaces comenzaron a interpretar la información antes que nosotros." },
      { type: "quote", text: "Ya no solo vemos y creemos. Vemos aquello que el sistema decidió mostrarnos, lo comprendemos mediante el recorrido que diseñó y actuamos antes de preguntarnos cómo se construyó esa decisión." },
      { type: "sources", items: [
        { label: "Universidad de Texas — Del registro contable a la escritura (Denise Schmandt-Besserat)", url: "https://sites.utexas.edu/dsb/tokens/from-accounting-to-writing/" },
        { label: "The Metropolitan Museum of Art — Art Nouveau", url: "https://www.metmuseum.org/essays/art-nouveau" },
        { label: "The Metropolitan Museum of Art — Cronología: el cartel a color y Jules Chéret", url: "https://www.metmuseum.org/toah/ht/10/euwf.html" },
        { label: "Garmin — Documentación de Body Battery", url: "https://www8.garmin.com/manuals/webhelp/forerunner245/EN-US/GUID-87E1392B-2C55-40B7-A1FF-3AB9252DA2A0.html" },
        { label: "PMC — Social commerce, contenido en video e intención de compra", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11428252/" },
      ] },
    ],
  },
  {
    id: "casco-percepcion-conciencia-sistemica",
    date: "08 — 2026",
    title: "Casco de la Percepción: De la Ilusión Evolutiva a la Conciencia Sistémica en UX y la Vida",
    excerpt: "Por qué la percepción humana no es una ventana a la verdad sino una interfaz optimizada para sobrevivir — y qué tiene esto que ver con el diseño de experiencias.",
    cover: imagePath("blog-cover-5.jpg"), // ← guardá la imagen en public/images/blog-cover-5.jpg
    tags: ["Percepción", "UX/UI"],
    body: [
      { type: "p", text: "Imaginá por un segundo que mirás la pantalla de tu computadora. Ves el ícono de un archivo en forma de carpeta amarilla y sabés intuitivamente qué hacer con él: arrastrarlo, abrirlo o borrarlo. Sin embargo, en el mundo físico real ese ícono no existe — lo que realmente hay dentro de tu dispositivo son transistores, señales eléctricas, transiciones de código binario y voltajes dentro de un disco de estado sólido." },
      { type: "p", text: "Si la computadora te obligara a interactuar directamente con esos millones de datos brutos para enviar un correo, colapsarías en segundos. La pantalla es una interfaz de usuario: una ilusión simplificada construida específicamente para ocultar la complejidad de la realidad objetiva y permitirte actuar." },
      { type: "p", text: "Esta misma metáfora es la que el científico cognitivo Donald Hoffman utiliza para explicar cómo funciona la percepción humana. A través de su Teoría de la Interfaz de la Percepción, Hoffman sostiene que nuestros sentidos no evolucionaron para mostrarnos la 'verdad' del universo, sino para proyectarnos una pantalla con 'íconos' — espacio, tiempo, formas, colores — optimizados para nuestra supervivencia." },
      { type: "p", text: "El truco del escarabajo joya ilustra bien este principio, y también lo que pasa cuando el algoritmo biológico falla. Los machos del escarabajo joya australiano (Julodimorpha bakewelli) buscan hembras guiándose por un algoritmo perceptual muy simple: buscar objetos marrones, brillantes y con textura de hoyuelos." },
      { type: "p", text: "Durante años ese atajo funcionó a la perfección. Pero cuando los humanos empezaron a tirar botellas de cerveza vacías con ese mismo tono marrón y esa textura en el desierto, los machos intentaron aparearse masivamente con las botellas, ignorando a las hembras reales, hasta poner a la especie al borde de la extinción." },
      { type: "quote", text: "El escarabajo no ve una hembra; ve un patrón visual simplificado. Su interfaz biológica carece de la conciencia necesaria para cuestionar el estímulo — está atrapado en un bucle de reacción automática." },
      { type: "p", text: "Si analizamos esto únicamente desde un enfoque neodarwinista tradicional caemos en un reduccionismo: la percepción sería solo una herramienta de supervivencia biológica orientada a pasar genes a la siguiente generación. Pero la historia humana demuestra que esto es insuficiente — si dependiéramos únicamente de la lenta mutación genética nos habríamos estancado. ¿Por qué la humanidad pasó milenios sin grandes cambios y de pronto dio un salto cultural, tecnológico y ético exponencial en el último siglo?" },
      { type: "p", text: "Ahí se vuelve fundamental integrar la Teoría General de Sistemas formulada por el biólogo Ludwig von Bertalanffy. Desde esta mirada, la mente y la percepción no son entes aislados sino sistemas abiertos en constante intercambio de información, energía y sentido con un suprasistema — el entorno socio-cultural y ecológico." },
      { type: "p", text: "Procesar la realidad pura generaría un colapso entrópico en nuestra mente: la interfaz filtra la información para mantener el equilibrio del sistema, una especie de homeostasis cognitiva. Y al subir el nivel de conciencia, la humanidad aprendió a autorregularse — el progreso masivo de los últimos tiempos no respondió a un cambio biológico en nuestro ADN, sino a un cambio sistémico de conciencia: la capacidad de eliminar sesgos primarios (tribalismo, racismo, violencia) para trabajar en red de forma colaborativa." },
      { type: "p", text: "Hoffman describe nuestra mente como si lleváramos puesto un casco de realidad virtual o aumentada biológico que jamás podemos quitarnos. En el diseño web, de videojuegos y de producto digital este principio se aplica de forma directa." },
      { type: "p", text: "Al igual que el foveated rendering en los visores de RA/RV — que solo renderiza en alta definición la zona donde el ojo enfoca — las interfaces digitales deben guiar la atención hacia focos clave para evitar la sobrecarga cognitiva. El jugador o usuario no necesita procesar los algoritmos del servidor ni las llamadas a las APIs: una barra de vida o un botón de pago convierten procesos abstractos en ilusiones útiles. Una buena interfaz no obliga al usuario a pensar en la infraestructura subyacente — se adapta a sus patrones mentales para hacer fluida la interacción." },
      { type: "p", text: "El escarabajo joya muere al lado de la botella porque no puede reflexionar sobre su propia interfaz. Los seres humanos, en cambio, tenemos una facultad única: la capacidad de tomar conciencia de nuestra propia capa de renderizado." },
      { type: "quote", text: "Cuando actuamos impulsados por sesgos inconscientes, prejuicios o reacciones automáticas de miedo y agresión, nos comportamos exactamente como el escarabajo intentando aparearse con la botella de cerveza." },
      { type: "p", text: "Evolucionar como especie — y como diseñadores de experiencias, tecnologías y sociedades — exige reconocer que lo que percibimos no es la totalidad de la verdad. Al elevar nuestro grado de conciencia dejamos de reaccionar como biomasas automáticas y empezamos a rediseñar activamente los íconos de nuestra interfaz, construyendo un sistema humano más empático, colaborativo y equilibrado." },
      { type: "p", text: "Fuentes: Donald Hoffman, charla TED 'Do we see reality as it is?' (ted.com) y 'The Evolutionary Argument Against Reality' en Quanta Magazine · Gwynne & Rentz (1983), 'Beetles on the Bottle: Male Buprestids Mistake Stubbies for Females', el estudio original sobre el escarabajo joya · Ludwig von Bertalanffy y la Teoría General de Sistemas, vía Britannica y Stanford Encyclopedia of Philosophy." },
    ],
  },
  {
    id: "curiosidad-motor-creativo",
    date: "04 — 2026",
    title: "La curiosidad como motor creativo",
    excerpt: "Reflexiones sobre por qué la curiosidad genuina produce mejor trabajo que la disciplina forzada.",
    cover: imagePath("blog-cover-1.jpg"), // ← guarda la imagen en public/images/blog-cover-1.jpg
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
    cover: imagePath("portada2.png"),
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
    cover: imagePath("portada3.png"),
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
    cover: imagePath("portada4.png"),
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

/* Ítem de lista: si empieza con "Palabra:" resalta esa palabra */
function PostListItem({ text }) {
  const i = text.indexOf(":");
  if (i > 0 && i < 24) {
    return <li><strong>{text.slice(0, i)}</strong>{text.slice(i)}</li>;
  }
  return <li>{text}</li>;
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
          if (block.type === "quote") return <blockquote key={i}>{block.text}</blockquote>;
          if (block.type === "h") return <h3 key={i}>{block.text}</h3>;
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
