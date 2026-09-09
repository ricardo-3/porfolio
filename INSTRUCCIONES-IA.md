# INSTRUCCIONES PARA LA IA

**Si sos una IA y te pasaron este archivo: leelo entero antes de hacer nada. Acá está todo lo que necesitás saber para publicar un post en este sitio.**

---

## Contexto

Este repo es el sitio personal de Rick (**rrr—**): diseño, dirección de arte y estrategia visual.
Está hecho con React + Vite y se publica solo en GitHub Pages: cada push a la rama `main` dispara el workflow `.github/workflows/deploy.yml` y en 1–2 minutos el sitio queda actualizado.

**Rick no es programador.** No usa consola ni git. Sube todo desde la web de GitHub, a mano. Tenelo presente en todo lo que le expliques.

---

## LA REGLA DE ORO

**Para publicar un post NO se toca `src/App.jsx`. Nunca.**

Los posts viven en `src/posts/`, uno por archivo `.md`. El sitio los levanta solos: si el archivo está en esa carpeta, aparece en el blog, ordenado por fecha (el más nuevo primero). No hay ninguna lista que actualizar, ningún índice, ningún import.

Publicar un post = crear **dos archivos nuevos**:

| Archivo | Dónde va |
|---|---|
| `mi-post.md` | `src/posts/` |
| `mi-portada.jpg` | `public/images/` |

Si creés que hace falta modificar `App.jsx` para publicar un post, está mal: volvé a leer este archivo.

---

## Qué tenés que entregarle a Rick

1. **El archivo `.md` completo**, listo para copiar y pegar (formato de abajo).
2. **La imagen de portada procesada**: 1600×900 px (16:9), JPG, idealmente bajo 400 KB.
3. **Los pasos de subida**, cortos y concretos, siempre en este orden:
   1. Subir la imagen: repo → `public` → `images` → **Add file → Upload files** → arrastrar el JPG → **Commit changes**.
   2. Subir el post: repo → `src` → `posts` → **Add file → Create new file** → escribir el nombre del archivo con `.md` al final → pegar el contenido → **Commit changes**.
   3. Ver el resultado en la pestaña **Actions**: punto verde = publicado.

Siempre **imagen primero**. Si va al revés, hay un deploy intermedio con la portada rota.

Si Rick pide corregir un post que ya existe, no crees uno nuevo: decile que edite el `.md` correspondiente con el ícono del lápiz en GitHub, y pasale el texto corregido.

---

## Formato del archivo .md

Arriba van los datos entre `---`, y abajo el texto.

```markdown
---
title: El título del post, tal cual va a aparecer
date: 09 — 2026
tags: Diseño, Tipografía, Proceso
cover: nombre-de-la-imagen.jpg
excerpt: Una o dos líneas que se ven en la tarjeta del blog. Enganchan, no resumen todo.
---

Primer párrafo. Los párrafos se separan con una línea en blanco.

## Un subtítulo de sección

Más texto. Podés usar **negrita**, *itálica* y [links](https://ejemplo.com).

> Una cita destacada. Se usa para la frase más fuerte de cada sección.

1. Atención: si el ítem arranca con una palabra y dos puntos, esa palabra se resalta sola.
2. Identificación: sirve para listas de pasos o etapas.

- También hay listas con viñetas.
- Una por línea.

### Fuentes

- [Nombre de la fuente](https://url-real.com)
- [Otra fuente](https://otra-url.com)
```

### Reglas de los campos de arriba

- **`title`** — si el título tiene dos puntos (`:`), envolvelo en comillas dobles. Si no, no hacen falta.
- **`date`** — siempre en formato `MM — AAAA` (mes con dos dígitos, raya larga, año). De acá sale el orden del blog.
- **`tags`** — separados por coma. Dos o tres, con mayúscula inicial. Reutilizá los que ya existen en otros posts cuando encajen.
- **`cover`** — solo el nombre del archivo, sin ruta. La imagen va en `public/images/`.
- **`excerpt`** — 1 o 2 líneas. Si no lo ponés, el sitio agarra el principio del primer párrafo, pero queda peor.

### El nombre del archivo

El nombre del `.md` es la dirección del post. Reglas: minúsculas, sin acentos, sin ñ, sin espacios, palabras separadas por guiones, y que se entienda de qué habla.

`de-la-letra-elitista-a-tiktok-shop.md` ✅
`Post nuevo (final) 2.md` ❌

### Qué NO va en el archivo

- **El tiempo de lectura.** Se calcula solo, contando las palabras a 200 por minuto. No lo escribas.
- **El título repetido arriba del texto.** El sitio ya lo muestra.
- **La imagen dentro del texto.** La portada se pone en `cover` y nada más.
- **Tablas, HTML, imágenes sueltas, `#` de un solo numeral.** El lector de markdown del sitio soporta lo que está en el ejemplo de arriba y nada más. Si necesitás algo distinto, resolvelo con lo que hay.

---

## Voz y estilo del blog

Leé uno o dos `.md` de `src/posts/` antes de escribir: ahí está el tono real. En resumen:

- Ensayo, no artículo de marketing. Se conecta historia del diseño, percepción y tecnología para llegar a una idea.
- Español rioplatense (vos, tenés, podés), pero sin exceso de modismos.
- Párrafos cortos. Frases directas. Nada de relleno.
- Una cita `>` por sección, con la frase más filosa. No más.
- Fuentes reales al final, con URL que exista. **No inventes fuentes ni citas.** Si no verificaste un dato, no lo pongas.
- Se puede afirmar sin hedging permanente, pero sin exagerar hallazgos.

---

## Estructura del repo (para ubicarte)

```
src/
  App.jsx        → todo el sitio (manifiesto, portfolio, blog, contacto, estilos)
  posts/         → los posts en .md ← lo único que se toca para publicar
public/
  images/        → portadas y fotos del portfolio
.github/workflows/deploy.yml  → publica solo al pushear a main
```

Dentro de `App.jsx`, la parte del blog (`parseFrontmatter`, `parseMarkdown`, `BLOG_POSTS`) lee la carpeta de posts. Tocalo **solo** si Rick pide un cambio de diseño o de funcionamiento del sitio — nunca para publicar contenido. Si lo tocás, avisale que ese archivo es delicado: un error ahí tira abajo el sitio entero, mientras que un error en un `.md` solo afecta a ese post.
