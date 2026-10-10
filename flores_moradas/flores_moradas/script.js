// ====== PERSONALIZA AQUI ======
const NOMBRE = "LUZ";
const RAZONES = [
  "Tu mensajes me alegra el día",
  "Contigo el tiempo se vuelve divertido",
  "Eres de las personas más cheveres que conozco",
  "Tu forma de ser es gozu",
  "ESTUPIDA xd",
  "Eres especial",
  "te odio"
];
const CARTA = `Hola,
Es curioso cómo hay personas con las que no necesitas años de amistad ni mil historias compartidas para empezar a tenerles cierto cariño. Y bueno, tú eres una de esas personas.
Hoy, por lo que representa este día, se supone que las flores moradas son para alguien a quien admiras, aprecias o simplemente quieres hacerle saber que tiene un lugarcito especial, y pues… me acordé de ti
Pero ya, hablando en serio, me caes muy bien. Quizá todavía nos falte mucho por conocer el uno del otro, pero espero que con el tiempo podamos compartir más conversaciones, risas y esas tonterías
 YA NO SERAS ESPECTADORA - ESTUPIDA 💜`;
// ===============================

const $ = id => document.getElementById(id);
$("nombre").textContent = NOMBRE;

// ---------- Petalos lilas y luciernagas ----------
const canvas = $("petalos"), ctx = canvas.getContext("2d");
const MORADOS = ["#b388ff", "#9c6ade", "#ce93d8", "#7e57c2", "#e1bee7"];
let piezas = [];
function ajustar() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", ajustar); ajustar();

function pieza(x, y, tipo, explosion) {
  const p = {
    x, y, tipo, temp: explosion, k: Math.floor(Math.random() * MORADOS.length),
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.1, fase: Math.random() * 6,
    r: tipo === "p" ? Math.random() * 4 + 4 : tipo === "g" ? Math.random() * 2 + 1 : 16 + Math.random() * 8,
    vx: explosion ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 0.4,
    vy: explosion ? -2 - Math.random() * 5 : Math.random() * 0.8 + 0.5
  };
  if (tipo === "g") { p.vy = -(Math.random() * 0.3 + 0.1); p.vx = (Math.random() - 0.5) * 0.3; }
  return p;
}
for (let i = 0; i < 40; i++) piezas.push(pieza(Math.random() * innerWidth, Math.random() * innerHeight, "p", false));
for (let i = 0; i < 40; i++) piezas.push(pieza(Math.random() * innerWidth, Math.random() * innerHeight, "g", false));

function soltar(x, y) {
  for (let i = 0; i < 18; i++) piezas.push(pieza(x, y, "p", true));
  ["💜", "✨", "🌸", "💜"].forEach(e => piezas.push(pieza(x, y, e, true)));
}
function lluvia(n) {
  for (let i = 0; i < n; i++) setTimeout(() => {
    const p = pieza(Math.random() * innerWidth, -10, Math.random() < 0.12 ? "💜" : "p", true);
    p.vx = (Math.random() - 0.5) * 1.5; p.vy = 1 + Math.random() * 1.5;
    piezas.push(p);
  }, i * 120);
}

function dibujar(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  piezas.forEach(c => {
    c.x += c.vx; c.y += c.vy; c.rot += c.vr;
    if (c.tipo === "p") c.x += Math.sin(c.y / 50 + c.fase) * 0.5;
    if (c.temp) c.vy += 0.07;
    if (c.tipo === "p") {
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
      ctx.fillStyle = MORADOS[c.k]; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(0, 0, c.r * 1.4, c.r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    } else if (c.tipo === "g") {
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 700 + c.fase));
      ctx.fillStyle = ctx.shadowColor = "#d9b8ff"; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    } else { ctx.font = c.r + "px serif"; ctx.fillText(c.tipo, c.x, c.y); }
    if (!c.temp) {
      if (c.tipo === "p" && c.y > canvas.height) { c.y = -10; c.x = Math.random() * canvas.width; }
      if (c.tipo === "g" && c.y < -5) { c.y = canvas.height + 5; c.x = Math.random() * canvas.width; }
    }
  });
  piezas = piezas.filter(c => !(c.temp && c.y > canvas.height + 30));
  requestAnimationFrame(dibujar);
}
requestAnimationFrame(dibujar);

// ---------- Partes y progreso ----------
const partes = ["parte1", "parte2", "parte3"];
partes.forEach(() => $("puntos").appendChild(document.createElement("span")));
function mostrar(id) {
  document.querySelectorAll(".parte").forEach(e => e.classList.remove("activa"));
  $(id).classList.add("activa");
  [...$("puntos").children].forEach((p, i) => p.classList.toggle("on", partes[i] === id));
}
mostrar("parte1");

// ---------- Musica ----------
const musica = $("musica"), btnMusica = $("btnMusica");
btnMusica.onclick = () => {
  if (musica.paused) { musica.play(); btnMusica.classList.add("suena"); }
  else { musica.pause(); btnMusica.classList.remove("suena"); }
};
$("btnEntrar").onclick = () => {
  mostrar("parte2");
  btnMusica.hidden = false;
  musica.play().then(() => btnMusica.classList.add("suena")).catch(() => {});
};

// ---------- Jardin: plantar flores ----------
const svgNS = "http://www.w3.org/2000/svg", jardin = $("jardin");
function ajustarJardin() { jardin.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`); }
addEventListener("resize", ajustarJardin); ajustarJardin();

function el(tag, attrs, padre) {
  const e = document.createElementNS(svgNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (padre) padre.appendChild(e);
  return e;
}
function plantar(x, y) {
  const color = MORADOS[Math.floor(Math.random() * 4)];
  const sx = x + (Math.random() - 0.5) * 120, H = innerHeight;
  el("path", { class: "tallo", pathLength: 1, d: `M${sx} ${H} Q${sx + (x - sx) / 2 + (Math.random() - 0.5) * 60} ${(H + y) / 2} ${x} ${y}` }, jardin);
  const g = el("g", { transform: `translate(${x},${y})` }, jardin);
  const cab = el("g", { class: "cabeza" }, g);
  const escala = 0.9 + Math.random() * 0.6;
  if (Math.random() < 0.65) {            // flor de petalos
    for (let i = 0; i < 6; i++)
      el("ellipse", { cx: 0, cy: -12 * escala, rx: 7 * escala, ry: 13 * escala, fill: color, opacity: 0.92, transform: `rotate(${i * 60})` }, cab);
    el("circle", { r: 5 * escala, fill: "#ffe082" }, cab);
  } else {                                // lavanda
    for (let j = 0; j < 7; j++) {
      const yy = -j * 8 * escala;
      el("ellipse", { cx: -4 * escala, cy: yy, rx: 4 * escala, ry: 6 * escala, fill: color }, cab);
      el("ellipse", { cx: 4 * escala, cy: yy - 3, rx: 4 * escala, ry: 6 * escala, fill: color }, cab);
    }
    el("ellipse", { cx: 0, cy: -58 * escala, rx: 4 * escala, ry: 7 * escala, fill: color }, cab);
  }
}

let flores = 0;
$("parte2").addEventListener("pointerdown", e => {
  if (e.target.closest("button")) return;
  const x = e.clientX, y = Math.max(e.clientY, 150);
  plantar(x, y);
  soltar(x, y);
  const m = document.createElement("div");
  m.className = "msg"; m.textContent = RAZONES[flores % RAZONES.length];
  m.style.left = Math.min(Math.max(x, 140), innerWidth - 140) + "px";
  m.style.top = (y - 70) + "px";
  document.body.appendChild(m);
  setTimeout(() => m.remove(), 4000);
  if (++flores === RAZONES.length) {
    $("tituloJardin").textContent = "Tu jardín está floreciendo 💜";
    $("btnCarta").hidden = false;
  }
});

// ---------- Carta ----------
let escribiendo;
$("btnCarta").onclick = () => {
  mostrar("parte3");
  clearTimeout(escribiendo);
  const p = $("textoCarta"); p.textContent = "";
  let i = 0;
  (function escribir() {
    if (i < CARTA.length) { p.textContent += CARTA[i++]; escribiendo = setTimeout(escribir, 50); }
    else lluvia(50);
  })();
};
$("btnVolver").onclick = () => { clearTimeout(escribiendo); mostrar("parte2"); };
$("btnInicio").onclick = () => location.reload();
