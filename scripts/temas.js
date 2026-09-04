/**
 * temas.js — la identidad visual de cada distrito.
 *
 * Un tema decide TODO lo que hace que un distrito se sienta distinto:
 * cielo, arquitectura de fondo, vegetación, clima, colores del suelo,
 * qué bichos aparecen y cómo se llaman.
 *
 * Para crear un distrito nuevo: agrega una entrada acá y apunta a ella
 * desde el JSON del nivel con "tema": "nombreDelTema".
 */
import { CFG } from "./config.js";

const T = CFG.TILE;

/* Utilidad: repite un elemento de fondo a lo largo del nivel con parallax. */
function repetir(ctx, cam, paso, factor, dibujo) {
  const desfase = (cam * factor) % paso;
  for (let i = -1; i < Math.ceil(CFG.ANCHO_VISTA / paso) + 2; i++) {
    dibujo(i * paso - desfase, i);
  }
}

export const TEMAS = {
  /* =========================================================
     CALLAO — puerto al amanecer, garúa fina, grúas y contenedores
     ========================================================= */
  puerto: {
    nombre: "Puerto",
    cielo: [[0, "#1b2b52"], [0.45, "#3f5f8f"], [0.75, "#c98a5e"], [1, "#f2c078"]],
    suelo: { cara: "#5d6b78", borde: "#8fa3b0", tierra: "#3b4650", plataforma: "#c96a3c", plataformaBorde: "#e89a63" },
    acento: "#38bdf8",
    bichos: ["gaviota", "ancla", "contenedor"],
    nombresBichos: ["Gaviota Contrabandista", "Ancla Terca", "Contenedor Colado"],
    jefe: "pulpo",
    nombreJefe: "El Pulpo del Censo",

    fondo(ctx, cam, t) {
      // mar al fondo
      ctx.fillStyle = "#20406b";
      ctx.fillRect(0, 300, CFG.ANCHO_VISTA, 84);
      for (let i = 0; i < 26; i++) {
        const x = (i * 63 - (cam * 0.12) % 63 + 800) % 860 - 30;
        const y = 312 + ((i * 17) % 60);
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.fillRect(x, y, 16, 2);
      }
      // barcos lejanos
      repetir(ctx, cam, 420, 0.18, (x) => {
        ctx.fillStyle = "#16233d";
        ctx.fillRect(x + 40, 292, 78, 14);
        ctx.fillRect(x + 62, 274, 10, 18);
        ctx.fillRect(x + 82, 280, 6, 12);
      });
      // grúas del puerto
      repetir(ctx, cam, 260, 0.42, (x) => {
        ctx.fillStyle = "#243b56";
        ctx.fillRect(x + 30, 232, 9, 152);
        ctx.fillRect(x + 30, 226, 104, 8);
        ctx.fillRect(x + 124, 234, 6, 30);
        ctx.fillStyle = "#ff9f45";
        ctx.fillRect(x + 26, 220, 17, 8);
      });
      // faro (queda al fondo, sobre la línea del horizonte)
      repetir(ctx, cam, 900, 0.3, (x) => {
        ctx.fillStyle = "#f2f6ff"; ctx.fillRect(x + 700, 244, 16, 92);
        ctx.fillStyle = "#ff5470";
        ctx.fillRect(x + 700, 262, 16, 9); ctx.fillRect(x + 700, 286, 16, 9);
        ctx.fillStyle = "#ffd166"; ctx.fillRect(x + 702, 234, 12, 10);
      });
      // pila de contenedores
      repetir(ctx, cam, 190, 0.62, (x, i) => {
        const cols = ["#2f6b8f", "#c14a22", "#3f7d5c", "#8f5da8"];
        for (let k = 0; k < 4; k++) {
          const cx = x + 20 + (k % 2) * 52, cy = 336 - Math.floor(k / 2) * 26;
          ctx.fillStyle = cols[(i + k) % cols.length];
          ctx.fillRect(cx, cy, 48, 24);
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.fillRect(cx, cy + 20, 48, 4);
        }
      });
    },

    clima(ctx, t) {
      // garúa chalaca: líneas finas y diagonales
      ctx.strokeStyle = "rgba(200,225,255,.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 70; i++) {
        const x = (i * 137 + t * 2.2) % 860 - 30;
        const y = (i * 71 + t * 6.5) % 500;
        ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9);
      }
      ctx.stroke();
      // banda de neblina
      ctx.fillStyle = "rgba(226,236,255,.10)";
      ctx.fillRect(0, 250 + Math.sin(t / 90) * 6, CFG.ANCHO_VISTA, 60);
    },
  },

  /* =========================================================
     SAN MIGUEL — parque frente al mar, sol, cometas y áreas verdes
     ========================================================= */
  parque: {
    nombre: "Parque",
    cielo: [[0, "#2f8fd6"], [0.5, "#6cc4ec"], [0.82, "#bfe8f7"], [1, "#e8f6c9"]],
    suelo: { cara: "#8a6a48", borde: "#5ec46a", tierra: "#5f452e", plataforma: "#9aa7c7", plataformaBorde: "#d8e2ff" },
    acento: "#4ade80",
    bichos: ["paloma", "cometa", "cono"],
    nombresBichos: ["Paloma Repetida", "Cometa Enredada", "Cono Mandón"],
    jefe: "combi",
    nombreJefe: "La Combi Doble Cuenta",

    fondo(ctx, cam, t) {
      // sol
      ctx.fillStyle = "rgba(255,231,150,.95)";
      ctx.beginPath(); ctx.arc(690, 92, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,231,150,.18)";
      ctx.beginPath(); ctx.arc(690, 92, 54, 0, Math.PI * 2); ctx.fill();
      // mar al fondo
      ctx.fillStyle = "#2f8fd6";
      ctx.fillRect(0, 296, CFG.ANCHO_VISTA, 30);
      // cometas en el cielo
      repetir(ctx, cam, 340, 0.15, (x, i) => {
        const cy = 70 + ((i * 53) % 90) + Math.sin(t / 40 + i) * 8;
        const cx = x + 120;
        ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80"][i % 3];
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx + 10, cy); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 10, cy);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, cy + 12); ctx.quadraticCurveTo(cx - 14, cy + 34, cx + 4, cy + 52); ctx.stroke();
      });
      // edificios del malecón
      repetir(ctx, cam, 200, 0.45, (x, i) => {
        const alto = 90 + ((i * 37) % 60);
        ctx.fillStyle = ["#e8e2d2", "#f4d9c0", "#dce6ef"][i % 3];
        ctx.fillRect(x + 24, 326 - alto, 96, alto);
        ctx.fillStyle = "rgba(90,110,130,.55)";
        for (let fy = 326 - alto + 12; fy < 316; fy += 20)
          for (let fx = x + 34; fx < x + 112; fx += 20) ctx.fillRect(fx, fy, 10, 12);
        ctx.fillStyle = "#c9553f";
        ctx.fillRect(x + 20, 326 - alto - 8, 104, 8);
      });
      // arboleda del parque
      repetir(ctx, cam, 150, 0.68, (x, i) => {
        const bx = x + 40, by = 350 - (i % 2) * 8;
        ctx.fillStyle = "#6b4a2c"; ctx.fillRect(bx + 12, by, 8, 34);
        ctx.fillStyle = i % 2 ? "#3f9d55" : "#4fbb63";
        ctx.beginPath(); ctx.arc(bx + 16, by - 6, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.15)";
        ctx.beginPath(); ctx.arc(bx + 9, by - 13, 9, 0, Math.PI * 2); ctx.fill();
      });
    },

    clima(ctx, t) {
      // hojitas y destellos que cruzan la pantalla
      for (let i = 0; i < 22; i++) {
        const x = (i * 191 - t * 1.4) % 860 - 30;
        const y = 60 + ((i * 83) % 300) + Math.sin(t / 30 + i) * 14;
        ctx.fillStyle = i % 3 ? "rgba(120,220,140,.55)" : "rgba(255,240,170,.65)";
        ctx.fillRect(x, y, 5, 4);
      }
    },
  },

  /* =========================================================
     PUEBLO LIBRE — plaza colonial al mediodía, casonas y palmeras
     ========================================================= */
  plaza: {
    nombre: "Plaza",
    cielo: [[0, "#5fb2e8"], [0.55, "#9ad6f2"], [0.85, "#ffe9c2"], [1, "#f7d9a0"]],
    suelo: { cara: "#c9a877", borde: "#e8cfa0", tierra: "#8f7448", plataforma: "#b8543f", plataformaBorde: "#e08f74" },
    acento: "#ff9f45",
    bichos: ["cuy", "farol", "paloma"],
    nombresBichos: ["Cuy Nacional", "Farol Apagado", "Paloma de la Plaza"],
    jefe: "torito",
    nombreJefe: "El Torito de las Cuentas",

    fondo(ctx, cam, t) {
      // sol de mediodía bien alto
      ctx.fillStyle = "rgba(255,244,200,.95)";
      ctx.beginPath(); ctx.arc(120, 62, 30, 0, Math.PI * 2); ctx.fill();
      // cerros secos al fondo
      for (let i = 0; i < 10; i++) {
        const hx = i * 300 - (cam * 0.2) % 3000;
        ctx.fillStyle = "#c2a882";
        ctx.beginPath();
        ctx.moveTo(hx, 330); ctx.lineTo(hx + 130, 214); ctx.lineTo(hx + 260, 330);
        ctx.closePath(); ctx.fill();
      }
      // casonas coloniales con balcones y teja
      repetir(ctx, cam, 210, 0.45, (x, i) => {
        const alto = 110 + ((i * 41) % 46);
        const cuerpo = ["#f4e7d2", "#f2d6b8", "#e8dcc0"][i % 3];
        ctx.fillStyle = cuerpo;
        ctx.fillRect(x + 20, 330 - alto, 118, alto);
        ctx.fillStyle = "#a8452c";                       // techo de teja
        ctx.fillRect(x + 12, 330 - alto - 12, 134, 12);
        ctx.fillStyle = "#7a5c3a";                       // balcón de madera
        ctx.fillRect(x + 36, 330 - alto + 30, 86, 26);
        ctx.fillStyle = "#3d2c1a";
        for (let bx = x + 40; bx < x + 118; bx += 10) ctx.fillRect(bx, 330 - alto + 34, 4, 18);
        ctx.fillStyle = "#5b7d99";                       // portón
        ctx.fillRect(x + 62, 330 - 42, 34, 42);
      });
      // palmeras de la plaza
      repetir(ctx, cam, 160, 0.66, (x, i) => {
        const px = x + 50, py = 352 - (i % 2) * 6;
        ctx.fillStyle = "#8a6a3f";
        ctx.fillRect(px + 8, py - 46, 7, 46);
        ctx.fillStyle = i % 2 ? "#3f9d55" : "#4fbb63";
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.ellipse(px + 11 + k * 13, py - 50, 15, 6, k * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      // banderitas de fiesta cruzando la plaza
      repetir(ctx, cam, 240, 0.55, (x) => {
        ctx.strokeStyle = "rgba(60,40,20,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 150); ctx.quadraticCurveTo(x + 120, 178, x + 240, 150); ctx.stroke();
        for (let k = 1; k < 8; k++) {
          const bx = x + k * 30, by = 150 + Math.sin((k / 8) * Math.PI) * 26;
          ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80", "#38bdf8"][k % 4];
          ctx.beginPath();
          ctx.moveTo(bx, by); ctx.lineTo(bx + 9, by); ctx.lineTo(bx + 4, by + 12);
          ctx.closePath(); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // polvillo dorado flotando en el aire caliente
      for (let i = 0; i < 26; i++) {
        const x = (i * 173 + t * 0.6) % 860 - 30;
        const y = 90 + ((i * 97) % 280) + Math.sin(t / 40 + i) * 10;
        ctx.fillStyle = "rgba(255,226,160,.55)";
        ctx.fillRect(x, y, 3, 3);
      }
    },
  },

  /* =========================================================
     JESÚS MARÍA — Campo de Marte por la tarde: jacarandás en flor,
     las torres de la Residencial San Felipe y jardines geométricos
     ========================================================= */
  campo: {
    nombre: "Campo",
    cielo: [[0, "#3d5a9e"], [0.42, "#7f8fd0"], [0.78, "#e2a6c8"], [1, "#ffd9b0"]],
    suelo: { cara: "#6f8f4a", borde: "#9ed46b", tierra: "#4a5b30", plataforma: "#8f7bbd", plataformaBorde: "#c9b6ef" },
    acento: "#c084fc",
    bichos: ["flor", "banca", "ardilla"],
    nombresBichos: ["La Flor Informal", "La Banca de Reventa", "La Ardilla Acaparadora"],
    jefe: "monumento",
    nombreJefe: "El Monumento al Doble Conteo",

    fondo(ctx, cam, t) {
      // sol bajo de la tarde
      ctx.fillStyle = "rgba(255,214,170,.95)";
      ctx.beginPath(); ctx.arc(610, 150, 38, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,196,150,.16)";
      ctx.beginPath(); ctx.arc(610, 150, 66, 0, Math.PI * 2); ctx.fill();

      // torres de la Residencial San Felipe: bloques altos y parejos
      repetir(ctx, cam, 260, 0.32, (x, i) => {
        const alto = 150 + ((i * 53) % 70);
        ctx.fillStyle = ["#b9b0a4", "#a8a396", "#c6bcae"][i % 3];
        ctx.fillRect(x + 30, 330 - alto, 78, alto);
        // ventanas en rejilla, algunas ya encendidas
        for (let fy = 330 - alto + 14; fy < 318; fy += 18) {
          for (let fx = x + 38; fx < x + 102; fx += 16) {
            const encendida = ((fx + fy + i * 7) % 5) === 0;
            ctx.fillStyle = encendida ? "rgba(255,214,140,.9)" : "rgba(70,80,96,.6)";
            ctx.fillRect(fx, fy, 9, 11);
          }
        }
      });

      // jacarandás en flor: copa morada y tronco delgado
      repetir(ctx, cam, 145, 0.66, (x, i) => {
        const bx = x + 36, by = 352 - (i % 2) * 10;
        ctx.fillStyle = "#5b4630"; ctx.fillRect(bx + 13, by - 34, 6, 34);
        ctx.fillStyle = i % 2 ? "#8b5cf6" : "#a678f0";
        ctx.beginPath(); ctx.arc(bx + 16, by - 42, 20, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 3, by - 34, 13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 29, by - 34, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.16)";
        ctx.beginPath(); ctx.arc(bx + 9, by - 50, 8, 0, Math.PI * 2); ctx.fill();
      });

      // jardines geométricos del parque, en franjas horizontales
      repetir(ctx, cam, 96, 0.82, (x, i) => {
        ctx.fillStyle = ["#e05f8f", "#ffd166", "#f2f6ff"][i % 3];
        for (let k = 0; k < 4; k++) ctx.fillRect(x + 10 + k * 18, 362 - (i % 2) * 4, 9, 5);
        ctx.fillStyle = "#4c6b33";
        ctx.fillRect(x + 6, 368 - (i % 2) * 4, 82, 4);
      });
    },

    clima(ctx, t) {
      // pétalos de jacarandá cayendo en diagonal
      for (let i = 0; i < 24; i++) {
        const x = (i * 167 - t * 0.9) % 860 - 30;
        const y = (50 + i * 89 + t * 0.7) % 380;
        ctx.fillStyle = i % 4 ? "rgba(168,120,240,.6)" : "rgba(255,214,180,.65)";
        ctx.fillRect(x, y, 4, 6);
      }
    },
  },

  /* =========================================================
     LINCE — feria de noche: carpa de circo, rueda de la fortuna,
     guirnaldas de focos y confeti en el aire
     ========================================================= */
  feria: {
    nombre: "Feria",
    cielo: [[0, "#140d2e"], [0.45, "#2b1b58"], [0.8, "#5b2a72"], [1, "#a3486b"]],
    suelo: { cara: "#7a4a8f", borde: "#c98adf", tierra: "#3f2455", plataforma: "#e0b23c", plataformaBorde: "#ffe28a" },
    acento: "#ffd166",
    bichos: ["globo", "diana", "algodon"],
    nombresBichos: ["El Globo Retenido", "La Diana de la Reventa", "El Algodón sin Boleta"],
    jefe: "payaso",
    nombreJefe: "El Payaso de Ida y Vuelta",

    fondo(ctx, cam, t) {
      // luna y estrellas
      ctx.fillStyle = "rgba(255,247,214,.95)";
      ctx.beginPath(); ctx.arc(690, 74, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1b1240";
      ctx.beginPath(); ctx.arc(700, 66, 22, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 40; i++) {
        const x = (i * 197 - (cam * 0.05)) % 900 - 20;
        const y = 20 + ((i * 71) % 200);
        const brillo = 0.35 + 0.45 * Math.abs(Math.sin(t / 30 + i));
        ctx.fillStyle = `rgba(255,255,255,${brillo.toFixed(2)})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // rueda de la fortuna al fondo
      repetir(ctx, cam, 520, 0.22, (x) => {
        const cx = x + 150, cy = 208, r = 72;
        ctx.strokeStyle = "rgba(255,209,102,.75)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + t / 120;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
          ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80", "#38bdf8"][k % 4];
          ctx.fillRect(cx + Math.cos(a) * r - 5, cy + Math.sin(a) * r - 5, 10, 10);
        }
        ctx.strokeStyle = "rgba(200,160,90,.6)";
        ctx.beginPath(); ctx.moveTo(cx - 26, 330); ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 26, 330); ctx.stroke();
      });

      // carpas de circo a rayas
      repetir(ctx, cam, 230, 0.48, (x, i) => {
        const bx = x + 30, base = 330, alto = 96 + ((i * 29) % 26);
        ctx.fillStyle = i % 2 ? "#d94f6b" : "#e0396b";
        ctx.beginPath();
        ctx.moveTo(bx + 62, base - alto - 26);
        ctx.lineTo(bx + 124, base); ctx.lineTo(bx, base);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,245,225,.85)";
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.moveTo(bx + 62, base - alto - 26);
          ctx.lineTo(bx + 20 + k * 34, base); ctx.lineTo(bx + 32 + k * 34, base);
          ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = "#ffd166";
        ctx.beginPath(); ctx.arc(bx + 62, base - alto - 30, 5, 0, Math.PI * 2); ctx.fill();
      });

      // guirnaldas de focos cruzando la feria
      repetir(ctx, cam, 250, 0.7, (x) => {
        ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 172); ctx.quadraticCurveTo(x + 125, 214, x + 250, 172); ctx.stroke();
        for (let k = 1; k < 9; k++) {
          const p = k / 9;
          const fx = x + 250 * p;
          const fy = 172 + Math.sin(p * Math.PI) * 40;
          const on = ((k + Math.floor(t / 18)) % 3) !== 0;
          ctx.fillStyle = on ? ["#ffd166", "#ff8fab", "#8ef2c0"][k % 3] : "rgba(120,110,150,.5)";
          ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // confeti cayendo y girando
      for (let i = 0; i < 30; i++) {
        const x = (i * 149 + Math.sin(t / 40 + i) * 22) % 860 - 20;
        const y = (i * 73 + t * 1.1) % 400;
        ctx.fillStyle = ["rgba(255,209,102,.75)", "rgba(255,143,171,.75)", "rgba(142,242,192,.7)", "rgba(139,180,255,.7)"][i % 4];
        const ancho = 3 + (i % 2) * 2;
        ctx.fillRect(x, y, ancho, 5);
      }
    },
  },

  /* =========================================================
     SAN ISIDRO — el distrito financiero al mediodía: torres de
     vidrio, los olivos del Olivar y garúa fina de Lima
     ========================================================= */
  torres: {
    nombre: "Torres",
    cielo: [[0, "#8fa8c4"], [0.45, "#b6c8db"], [0.8, "#d8e3ec"], [1, "#eef3f7"]],
    suelo: { cara: "#8d99a6", borde: "#5f8f52", tierra: "#5b6470", plataforma: "#3f6f9e", plataformaBorde: "#8fc4ea" },
    acento: "#2f7fc4",
    bichos: ["maletin", "corbata", "cafe"],
    nombresBichos: ["El Maletín del Año Base", "La Corbata Desinflada", "El Café Subyacente"],
    jefe: "ejecutivo",
    nombreJefe: "El Ejecutivo de Laspeyres",

    fondo(ctx, cam, t) {
      // sol tapado por la garúa limeña
      ctx.fillStyle = "rgba(255,255,240,.45)";
      ctx.beginPath(); ctx.arc(560, 88, 40, 0, Math.PI * 2); ctx.fill();

      // torres de vidrio, altas y de distinto tono
      repetir(ctx, cam, 190, 0.3, (x, i) => {
        const alto = 170 + ((i * 61) % 90);
        const tono = ["#6f8ba8", "#7e99b4", "#607d9b"][i % 3];
        ctx.fillStyle = tono;
        ctx.fillRect(x + 24, 330 - alto, 92, alto);
        for (let fy = 330 - alto + 10; fy < 322; fy += 14) {
          ctx.fillStyle = "rgba(200,226,245,.55)";
          ctx.fillRect(x + 30, fy, 80, 7);
        }
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.fillRect(x + 30, 330 - alto, 18, alto);
        ctx.fillStyle = "#4a5b6b";
        ctx.fillRect(x + 68, 330 - alto - 18, 3, 18);
      });

      // torres bajas de segunda fila
      repetir(ctx, cam, 120, 0.5, (x, i) => {
        const alto = 70 + ((i * 37) % 40);
        ctx.fillStyle = ["#93a7ba", "#a4b5c5"][i % 2];
        ctx.fillRect(x + 14, 330 - alto, 62, alto);
        ctx.fillStyle = "rgba(70,90,110,.45)";
        for (let fy = 330 - alto + 8; fy < 324; fy += 12)
          for (let fx = x + 20; fx < x + 70; fx += 12) ctx.fillRect(fx, fy, 7, 7);
      });

      // los olivos del Olivar
      repetir(ctx, cam, 132, 0.7, (x, i) => {
        const bx = x + 40, by = 354 - (i % 2) * 8;
        ctx.fillStyle = "#6b5a3f"; ctx.fillRect(bx + 12, by - 30, 7, 30);
        ctx.fillStyle = i % 2 ? "#6f9a5c" : "#7fae6a";
        ctx.beginPath(); ctx.ellipse(bx + 15, by - 38, 22, 15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.beginPath(); ctx.ellipse(bx + 8, by - 43, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
      });
    },

    clima(ctx, t) {
      // garúa fina: hilitos verticales muy tenues
      for (let i = 0; i < 34; i++) {
        const x = (i * 131 - t * 0.5) % 860 - 20;
        const y = (i * 97 + t * 2.6) % 400;
        ctx.fillStyle = "rgba(226,238,248,.35)";
        ctx.fillRect(x, y, 1, 9);
      }
    },
  },

  /* =========================================================
     MIRAFLORES — el malecón al atardecer: acantilado sobre el
     Pacífico, parapentes en el cielo y el sol metiéndose al mar
     ========================================================= */
  acantilado: {
    nombre: "Acantilado",
    cielo: [[0, "#1f3a6e"], [0.4, "#5a6fae"], [0.72, "#e8896b"], [1, "#ffd39b"]],
    suelo: { cara: "#9a7f5e", borde: "#7fae5c", tierra: "#6b563c", plataforma: "#2f7fc4", plataformaBorde: "#93cdf2" },
    acento: "#ff9f45",
    bichos: ["parapente", "tabla", "cangrejo"],
    nombresBichos: ["El Parapente Exportado", "La Tabla Sustituta", "El Cangrejo del Interés Simple"],
    jefe: "gato",
    nombreJefe: "El Gato de las Canastas",

    fondo(ctx, cam, t) {
      // sol metiéndose al mar
      ctx.fillStyle = "rgba(255,214,140,.95)";
      ctx.beginPath(); ctx.arc(600, 240, 44, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,180,120,.20)";
      ctx.beginPath(); ctx.arc(600, 240, 74, 0, Math.PI * 2); ctx.fill();

      // el Pacífico, con el reflejo del sol
      ctx.fillStyle = "#274a80";
      ctx.fillRect(0, 258, CFG.ANCHO_VISTA, 76);
      for (let i = 0; i < 30; i++) {
        const x = (i * 61 - (cam * 0.08)) % 880 - 30;
        const y = 268 + ((i * 23) % 56);
        const cerca = Math.abs(x - 600) < 110;
        ctx.fillStyle = cerca ? "rgba(255,214,150,.45)" : "rgba(255,255,255,.16)";
        ctx.fillRect(x, y, 18, 2);
      }

      // parapentes cruzando el cielo
      repetir(ctx, cam, 300, 0.12, (x, i) => {
        const px = x + 90;
        const py = 80 + ((i * 47) % 70) + Math.sin(t / 50 + i) * 10;
        ctx.fillStyle = ["#e0562f", "#ffd166", "#4ade80"][i % 3];
        ctx.beginPath();
        ctx.moveTo(px - 22, py); ctx.quadraticCurveTo(px, py - 14, px + 22, py);
        ctx.quadraticCurveTo(px, py + 5, px - 22, py);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 14, py + 2); ctx.lineTo(px, py + 18);
        ctx.moveTo(px + 14, py + 2); ctx.lineTo(px, py + 18); ctx.stroke();
        ctx.fillStyle = "#2f3a56";
        ctx.fillRect(px - 3, py + 18, 6, 8);
      });

      // edificios del malecón, en el borde del acantilado
      repetir(ctx, cam, 165, 0.42, (x, i) => {
        const alto = 96 + ((i * 43) % 54);
        ctx.fillStyle = ["#e6ddd0", "#d8cfc2", "#efe6da"][i % 3];
        ctx.fillRect(x + 18, 334 - alto, 74, alto);
        ctx.fillStyle = "rgba(90,110,140,.5)";
        for (let fy = 334 - alto + 10; fy < 328; fy += 15)
          for (let fx = x + 24; fx < x + 86; fx += 14) ctx.fillRect(fx, fy, 8, 9);
        ctx.fillStyle = "rgba(255,200,150,.5)";
        ctx.fillRect(x + 18, 334 - alto, 74, 4);
      });

      // la baranda del malecón y el pasto del borde
      repetir(ctx, cam, 64, 0.72, (x) => {
        ctx.fillStyle = "#5f7a4a";
        ctx.fillRect(x, 356, 64, 8);
        ctx.strokeStyle = "rgba(240,240,235,.55)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, 348); ctx.lineTo(x + 64, 348); ctx.stroke();
        ctx.fillStyle = "rgba(240,240,235,.55)";
        ctx.fillRect(x + 8, 348, 3, 10);
        ctx.fillRect(x + 44, 348, 3, 10);
      });
    },

    clima(ctx, t) {
      // brisa del mar: motitas claras cruzando en horizontal
      for (let i = 0; i < 22; i++) {
        const x = (i * 179 - t * 2.2) % 900 - 30;
        const y = 70 + ((i * 89) % 260) + Math.sin(t / 26 + i) * 6;
        ctx.fillStyle = "rgba(255,236,210,.4)";
        ctx.fillRect(x, y, 9, 1);
      }
    },
  },
  barranco: {
    nombre: "Barranco",
    cielo: [[0, "#160f33"], [0.4, "#33205c"], [0.75, "#7a3f76"], [1, "#c9705f"]],
    suelo: { cara: "#7b6b8f", borde: "#c9a4d6", tierra: "#3d3350", plataforma: "#e07a3f", plataformaBorde: "#ffbc82" },
    acento: "#ff8fab",
    bichos: ["guitarra", "aerosol", "cajon"],
    nombresBichos: ["La Guitarra Nominal", "El Aerosol Deflactado", "El Cajón de la Desinflación"],
    jefe: "bohemio",
    nombreJefe: "El Bohemio de los Índices",

    fondo(ctx, cam, t) {
      // luna llena sobre el mar
      ctx.fillStyle = "rgba(255,246,222,.92)";
      ctx.beginPath(); ctx.arc(650, 84, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,230,190,.14)";
      ctx.beginPath(); ctx.arc(650, 84, 52, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 34; i++) {
        const x = (i * 173 - (cam * 0.04)) % 900 - 20;
        const y = 18 + ((i * 67) % 170);
        ctx.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.abs(Math.sin(t / 34 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // el mar al fondo, con el reflejo de la luna
      ctx.fillStyle = "#1d2b52";
      ctx.fillRect(0, 250, CFG.ANCHO_VISTA, 52);
      for (let i = 0; i < 24; i++) {
        const x = (i * 71 - (cam * 0.07)) % 880 - 30;
        const y = 258 + ((i * 19) % 38);
        ctx.fillStyle = Math.abs(x - 650) < 90 ? "rgba(255,240,200,.4)" : "rgba(255,255,255,.12)";
        ctx.fillRect(x, y, 14, 2);
      }

      // el Puente de los Suspiros, en silueta
      repetir(ctx, cam, 430, 0.26, (x) => {
        const bx = x + 60, base = 302;
        ctx.fillStyle = "#2c2140";
        ctx.fillRect(bx, base - 8, 150, 10);
        // arco
        ctx.beginPath();
        ctx.moveTo(bx + 30, base + 2);
        ctx.quadraticCurveTo(bx + 75, base - 34, bx + 120, base + 2);
        ctx.lineTo(bx + 120, base + 26); ctx.lineTo(bx + 30, base + 26);
        ctx.closePath(); ctx.fill();
        // barandas
        ctx.fillStyle = "#3d2f56";
        for (let k = 0; k < 10; k++) ctx.fillRect(bx + 6 + k * 15, base - 22, 3, 14);
        ctx.fillRect(bx, base - 24, 150, 3);
        // farolitos
        ctx.fillStyle = "rgba(255,209,120,.9)";
        ctx.beginPath(); ctx.arc(bx + 8, base - 30, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 142, base - 30, 3.5, 0, Math.PI * 2); ctx.fill();
      });

      // casonas de colores con murales
      repetir(ctx, cam, 158, 0.48, (x, i) => {
        const alto = 104 + ((i * 47) % 44);
        const cuerpo = ["#e0568f", "#f0a03c", "#4fb0a8", "#8f6fd0"][i % 4];
        ctx.fillStyle = cuerpo;
        ctx.fillRect(x + 16, 334 - alto, 78, alto);
        // teja
        ctx.fillStyle = "#8f3b2c";
        ctx.fillRect(x + 10, 334 - alto - 9, 90, 9);
        // ventanas encendidas
        ctx.fillStyle = "rgba(255,220,150,.85)";
        for (let fy = 334 - alto + 16; fy < 322; fy += 22)
          for (let fx = x + 24; fx < x + 86; fx += 22) ctx.fillRect(fx, fy, 11, 13);
        // mural en la pared
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.beginPath(); ctx.arc(x + 55, 334 - 30, 13, 0, Math.PI * 2); ctx.fill();
      });

      // guirnaldas de foquitos sobre la bajada
      repetir(ctx, cam, 220, 0.72, (x) => {
        ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 190); ctx.quadraticCurveTo(x + 110, 228, x + 220, 190); ctx.stroke();
        for (let k = 1; k < 8; k++) {
          const p = k / 8;
          const fx = x + 220 * p, fy = 190 + Math.sin(p * Math.PI) * 36;
          ctx.fillStyle = ["#ffd166", "#ff8fab", "#8ef2c0", "#9fc4ff"][k % 4];
          ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // luciérnagas tibias flotando entre las casonas
      for (let i = 0; i < 20; i++) {
        const x = (i * 157 + Math.sin(t / 50 + i) * 30) % 880 - 20;
        const y = 120 + ((i * 83) % 230) + Math.cos(t / 38 + i) * 12;
        const brillo = 0.25 + 0.5 * Math.abs(Math.sin(t / 22 + i * 1.7));
        ctx.fillStyle = `rgba(255,214,140,${brillo.toFixed(2)})`;
        ctx.fillRect(x, y, 3, 3);
      }
    },
  },
  muelle: {
    nombre: "Chorrillos",
    cielo: [[0, "#1d3a5c"], [0.34, "#4a6c96"], [0.7, "#e8a06a"], [1, "#ffd9a0"]],
    suelo: { cara: "#8a6a48", borde: "#c49a68", tierra: "#4a3826", plataforma: "#5b4630", plataformaBorde: "#e0a03c" },
    acento: "#ffb04a",
    bichos: ["bote", "red", "pelicano"],
    nombresBichos: ["El Bote de Agua Dulce", "La Red de la Caleta", "El Pelícano Importado"],
    jefe: "pescador",
    nombreJefe: "El Pescador del Morro",

    fondo(ctx, cam, t) {
      // el sol saliendo, todavía bajo y anaranjado
      ctx.fillStyle = "rgba(255,214,140,.16)";
      ctx.beginPath(); ctx.arc(178, 206, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,196,110,.95)";
      ctx.beginPath(); ctx.arc(178, 206, 38, 0, Math.PI * 2); ctx.fill();

      // el Morro Solar en silueta, con la cruz en la cumbre
      repetir(ctx, cam, 620, 0.16, (x) => {
        const bx = x + 380;
        ctx.fillStyle = "#3b4d6b";
        ctx.beginPath();
        ctx.moveTo(bx - 160, 262);
        ctx.lineTo(bx - 44, 148);
        ctx.lineTo(bx + 12, 170);
        ctx.lineTo(bx + 126, 262);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#2c3a52";
        ctx.fillRect(bx - 46, 126, 5, 24);
        ctx.fillRect(bx - 54, 134, 21, 4);
      });

      // el mar, con el camino del sol encima
      ctx.fillStyle = "#2f5b78";
      ctx.fillRect(0, 258, CFG.ANCHO_VISTA, 48);
      for (let i = 0; i < 28; i++) {
        const x = (i * 63 - (cam * 0.08)) % 880 - 30;
        const y = 264 + ((i * 23) % 38);
        ctx.fillStyle = Math.abs(x - 178) < 100 ? "rgba(255,206,140,.5)" : "rgba(255,255,255,.13)";
        ctx.fillRect(x, y, 13, 2);
      }

      // botes amarrados, meciéndose con el oleaje
      repetir(ctx, cam, 196, 0.4, (x, i) => {
        const bx = x + 28, mece = Math.sin(t / 26 + i) * 2.5;
        ctx.fillStyle = "#5b4630";
        ctx.fillRect(bx + 20, 246 + mece, 3, 26);
        ctx.fillStyle = "rgba(255,250,240,.9)";
        ctx.beginPath();
        ctx.moveTo(bx + 23, 246 + mece);
        ctx.lineTo(bx + 44, 262 + mece);
        ctx.lineTo(bx + 23, 268 + mece);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = ["#c9553f", "#e0a03c", "#4f8fa8", "#d8d2c4"][i % 4];
        ctx.beginPath();
        ctx.moveTo(bx, 270 + mece);
        ctx.lineTo(bx + 54, 270 + mece);
        ctx.lineTo(bx + 44, 282 + mece);
        ctx.lineTo(bx + 10, 282 + mece);
        ctx.closePath(); ctx.fill();
      });

      // el muelle de madera, adelante, con las cajas de pescado apiladas encima
      repetir(ctx, cam, 132, 0.66, (x) => {
        ctx.fillStyle = "#6b5236";
        ctx.fillRect(x + 12, 336, 108, 7);
        ctx.fillStyle = "#5a4229";
        for (let k = 0; k < 4; k++) ctx.fillRect(x + 20 + k * 30, 343, 6, 41);
        ctx.fillStyle = "#a8b8c4"; ctx.fillRect(x + 70, 320, 24, 16);
        ctx.fillStyle = "#8a9aa8"; ctx.fillRect(x + 75, 306, 20, 14);
      });

      // pelícanos cruzando en fila, esperando su turno
      repetir(ctx, cam, 340, 0.9, (x, i) => {
        const y = 94 + ((i * 37) % 46) + Math.sin(t / 30 + i) * 5;
        ctx.strokeStyle = "rgba(40,52,70,.55)"; ctx.lineWidth = 2;
        for (let k = 0; k < 3; k++) {
          const px = x + k * 28, py = y + k * 9;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(px + 7, py - 6, px + 14, py);
          ctx.stroke();
        }
      });
    },

    clima(ctx, t) {
      // salpicadura salada: la reventazón levanta gotitas contra el muelle
      for (let i = 0; i < 22; i++) {
        const ciclo = (t / 2 + i * 17) % 120;
        const x = (i * 137) % 880 - 20;
        const y = 300 - ciclo * 0.9;
        const alfa = Math.max(0, 0.42 - ciclo / 290);
        ctx.fillStyle = `rgba(226,240,250,${alfa.toFixed(2)})`;
        ctx.fillRect(x, y, 2, 3);
      }
    },
  },

  /* =========================================================
     CERCADO DE LIMA — mediodía bajo la panza de burro. El Centro
     Histórico: los balcones de madera de Torre Tagle y Osambela,
     las torres de la Catedral, el cerro San Cristóbal al fondo y
     los toldos del Jirón de la Unión. Acá está Jirón Lampa, la
     calle donde estuvo la banca de Lima, y a la vuelta Ocoña con
     sus cambistas y Azángaro con sus tramitadores.
     ========================================================= */
  centro: {
    nombre: "Cercado de Lima",
    cielo: [[0, "#94a1b5"], [0.4, "#b6c0ca"], [0.76, "#d6d8d5"], [1, "#ece3d1"]],
    suelo: { cara: "#9a9285", borde: "#c4bcab", tierra: "#5e584e", plataforma: "#46301f", plataformaBorde: "#e8b13c" },
    acento: "#e8b13c",
    bichos: ["fajo", "sello", "bono"],
    nombresBichos: ["El Fajo de Ocoña", "El Sello de Azángaro", "El Bono de Jirón Lampa"],
    jefe: "banquero",
    nombreJefe: "El Banquero de Jirón Lampa",

    fondo(ctx, cam, t) {
      // el sol que no termina de romper la panza de burro: se adivina, no se ve
      ctx.fillStyle = "rgba(255,240,196,.16)";
      ctx.beginPath(); ctx.arc(520, 92, 92, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,244,206,.22)";
      ctx.beginPath(); ctx.arc(520, 92, 56, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,248,214,.30)";
      ctx.beginPath(); ctx.arc(520, 92, 28, 0, Math.PI * 2); ctx.fill();

      // el cerro San Cristóbal con sus casitas y la cruz en la cumbre
      repetir(ctx, cam, 620, 0.13, (x) => {
        const bx = x + 300;
        ctx.fillStyle = "#8d93a0";
        ctx.beginPath();
        ctx.moveTo(bx - 210, 296);
        ctx.lineTo(bx - 40, 150);
        ctx.lineTo(bx + 30, 168);
        ctx.lineTo(bx + 190, 296);
        ctx.closePath(); ctx.fill();
        // las casitas trepando el cerro
        ctx.fillStyle = "rgba(210,190,168,.75)";
        for (let k = 0; k < 16; k++) {
          const cx = bx - 170 + k * 22, alto = 168 + Math.abs(k - 7) * 17;
          ctx.fillRect(cx, alto, 15, 11);
        }
        ctx.fillStyle = "#6f7583";                      // la cruz de la cumbre
        ctx.fillRect(bx - 42, 128, 4, 24);
        ctx.fillRect(bx - 50, 136, 20, 4);
      });

      // las torres de la Catedral, con sus campanarios y su reloj
      repetir(ctx, cam, 700, 0.28, (x) => {
        const bx = x + 120, base = 302;
        const torre = (tx) => {
          ctx.fillStyle = "#e0d2b4";
          ctx.fillRect(tx, base - 150, 40, 150);
          ctx.fillStyle = "#7a6a52";                    // el campanario abierto
          ctx.fillRect(tx + 9, base - 132, 22, 26);
          ctx.fillStyle = "#3f4654";                    // el chapitel oscuro
          ctx.beginPath();
          ctx.moveTo(tx - 4, base - 150);
          ctx.lineTo(tx + 20, base - 186);
          ctx.lineTo(tx + 44, base - 150);
          ctx.closePath(); ctx.fill();
          ctx.fillRect(tx + 18, base - 198, 4, 14);
        };
        torre(bx);
        torre(bx + 130);
        // el cuerpo de la iglesia entre las dos torres
        ctx.fillStyle = "#e8dcc0";
        ctx.fillRect(bx + 40, base - 112, 130, 112);
        ctx.fillStyle = "#7a6a52";
        ctx.fillRect(bx + 92, base - 62, 26, 62);       // el portón
        ctx.fillStyle = "rgba(120,105,80,.6)";
        ctx.beginPath(); ctx.arc(bx + 105, base - 86, 15, 0, Math.PI * 2); ctx.fill();
      });

      // la cuadra de casonas con sus balcones de madera: la firma del Centro
      repetir(ctx, cam, 158, 0.5, (x, i) => {
        const bx = x + 10, base = 340, alto = 96 + ((i * 31) % 34);
        const fachadas = ["#e2b56a", "#d9a95c", "#e8c88a", "#cf9f6b", "#ddbe86"];
        ctx.fillStyle = fachadas[i % 5];
        ctx.fillRect(bx, base - alto, 138, alto);
        ctx.fillStyle = "rgba(255,255,255,.22)";        // la cornisa
        ctx.fillRect(bx, base - alto, 138, 5);
        // el balcón de cajón, cerrado, de madera oscura
        ctx.fillStyle = "#5c3d24";
        ctx.fillRect(bx + 16, base - alto + 30, 106, 38);
        ctx.fillStyle = "#7a4a2e";
        ctx.fillRect(bx + 16, base - alto + 30, 106, 5);
        ctx.fillRect(bx + 16, base - alto + 63, 106, 5);
        ctx.fillStyle = "rgba(232,177,60,.55)";         // la celosía
        for (let k = 0; k < 9; k++) ctx.fillRect(bx + 22 + k * 12, base - alto + 38, 6, 22);
        // el zaguán y las tiendas de la vereda
        ctx.fillStyle = "#4d3a28";
        ctx.fillRect(bx + 54, base - 40, 30, 40);
        ctx.fillStyle = "rgba(90,110,130,.45)";
        ctx.fillRect(bx + 16, base - 36, 26, 22);
        ctx.fillRect(bx + 96, base - 36, 26, 22);
      });

      // los toldos y letreros del Jirón de la Unión, ya en la vereda
      repetir(ctx, cam, 118, 0.7, (x, i) => {
        const bx = x + 14, base = 352;
        ctx.fillStyle = ["#c2264a", "#2f6b8f", "#2b6b45", "#c96a1c"][i % 4];
        ctx.beginPath();
        ctx.moveTo(bx, base - 26);
        ctx.lineTo(bx + 66, base - 26);
        ctx.lineTo(bx + 58, base - 8);
        ctx.lineTo(bx + 8, base - 8);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.35)";
        for (let k = 0; k < 3; k++) ctx.fillRect(bx + 6 + k * 20, base - 26, 8, 18);
        ctx.fillStyle = "#e8b13c";                      // el letrero colgado
        ctx.fillRect(bx + 74, base - 30, 24, 10);
      });
    },

    clima(ctx, t) {
      // los papelitos de los tramitadores, dando vueltas en el aire
      for (let i = 0; i < 20; i++) {
        const x = (i * 163 - t * 2.2) % 880 - 20;
        const y = 130 + ((i * 71) % 210) + Math.sin(t / 21 + i) * 14;
        const gira = Math.abs(Math.sin(t / 13 + i * 1.4));
        ctx.fillStyle = `rgba(246,242,228,${(0.30 + 0.35 * gira).toFixed(2)})`;
        ctx.fillRect(x, y, 6, 2 + gira * 5);
      }
    },
  },

  /* =========================================================
     SANTA ANITA — las cuatro de la mañana en el Gran Mercado
     Mayorista. Los galpones larguísimos con su techo de calamina
     y sus focos colgando, los camiones de provincia metidos de
     espaldas en la bahía de carga, las torres de jabas y los
     cerros de Ate todavía en silueta. Acá el que llega con el
     camión más grande deja al resto sin sitio.
     ========================================================= */
  mayorista: {
    nombre: "Santa Anita",
    cielo: [[0, "#16294a"], [0.4, "#365a7d"], [0.78, "#8fa0a6"], [1, "#cfc4a8"]],
    suelo: { cara: "#7d7a72", borde: "#a8a49a", tierra: "#4a4740", plataforma: "#6b3f1c", plataformaBorde: "#ffd166" },
    acento: "#ffd166",

    bichos: ["jaba", "balanza", "saco"],
    nombresBichos: ["La Jaba del Movimiento", "La Balanza de la Tasa", "El Saco sin Destino"],
    jefe: "camion",
    nombreJefe: "El Camión del Déficit",

    fondo(ctx, cam, t) {
      // todavía no amanece: el cielo apenas se aclara por el este
      const alba = ctx.createLinearGradient(0, 190, 0, 300);
      alba.addColorStop(0, "rgba(255,206,130,0)");
      alba.addColorStop(1, "rgba(255,206,130,.16)");
      ctx.fillStyle = alba;
      ctx.fillRect(0, 190, CFG.ANCHO_VISTA, 110);

      // los cerros de Ate, en silueta
      repetir(ctx, cam, 560, 0.12, (x) => {
        ctx.fillStyle = "#26364f";
        ctx.beginPath();
        ctx.moveTo(x - 80, 292);
        ctx.quadraticCurveTo(x + 140, 168, x + 340, 292);
        ctx.closePath(); ctx.fill();
      });

      // los galpones del mercado, larguísimos, con techo de calamina
      repetir(ctx, cam, 300, 0.34, (x, i) => {
        const bx = x + 20, base = 316, alto = 74 + ((i * 23) % 18);
        ctx.fillStyle = ["#4a5566", "#54606f", "#455063"][i % 3];
        ctx.fillRect(bx, base - alto, 250, alto);
        // el techo a dos aguas, bien bajito
        ctx.fillStyle = "#39424f";
        ctx.beginPath();
        ctx.moveTo(bx - 10, base - alto);
        ctx.lineTo(bx + 125, base - alto - 26);
        ctx.lineTo(bx + 260, base - alto);
        ctx.closePath(); ctx.fill();
        // los portones abiertos del galpón, iluminados por dentro
        ctx.fillStyle = "rgba(255,206,120,.5)";
        for (let k = 0; k < 4; k++) ctx.fillRect(bx + 22 + k * 60, base - 46, 38, 46);
      });

      // la guirnalda de focos pelados que cruza los pasillos
      repetir(ctx, cam, 190, 0.5, (x) => {
        ctx.strokeStyle = "rgba(60,66,78,.7)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 214); ctx.quadraticCurveTo(x + 95, 240, x + 190, 214); ctx.stroke();
        for (let k = 1; k < 6; k++) {
          const p = k / 6, px = x + 190 * p, py = 214 + Math.sin(p * Math.PI) * 26;
          const brillo = 0.55 + 0.3 * Math.abs(Math.sin(t / 34 + k));
          ctx.fillStyle = `rgba(255,226,150,${brillo.toFixed(2)})`;
          ctx.beginPath(); ctx.arc(px, py + 4, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,226,150,.14)";
          ctx.beginPath(); ctx.arc(px, py + 4, 11, 0, Math.PI * 2); ctx.fill();
        }
      });

      // los camiones de provincia, metidos de espaldas en la bahía de carga
      repetir(ctx, cam, 226, 0.62, (x, i) => {
        const bx = x + 16, base = 340;
        ctx.fillStyle = ["#8a6a48", "#6b7a8a", "#8a5c48"][i % 3];
        ctx.fillRect(bx, base - 52, 104, 52);             // la tolva
        ctx.fillStyle = "#e0562f";
        ctx.fillRect(bx, base - 34, 104, 7);              // la franja
        ctx.fillStyle = ["#2f6b8f", "#c2264a", "#3f7d5c"][i % 3];
        ctx.fillRect(bx + 104, base - 40, 34, 40);        // la cabina
        ctx.fillStyle = "rgba(189,232,255,.55)";
        ctx.fillRect(bx + 112, base - 34, 18, 14);        // la ventana
        ctx.fillStyle = "#1c1c26";                        // las llantas
        for (const lx of [bx + 16, bx + 62, bx + 116]) {
          ctx.beginPath(); ctx.arc(lx, base, 8, 0, Math.PI * 2); ctx.fill();
        }
      });

      // las torres de jabas apiladas en la vereda
      repetir(ctx, cam, 104, 0.8, (x, i) => {
        const bx = x + 10, base = 352, pisos = 3 + (i % 3);
        for (let k = 0; k < pisos; k++) {
          ctx.fillStyle = ["#3f8fc4", "#e0562f", "#4fb0a8", "#e8c15a"][(i + k) % 4];
          ctx.fillRect(bx, base - (k + 1) * 13, 40, 12);
          ctx.fillStyle = "rgba(0,0,0,.22)";
          ctx.fillRect(bx, base - (k + 1) * 13 + 9, 40, 3);
        }
      });
    },

    clima(ctx, t) {
      // el vaho frío de la madrugada, bajito, entre los pasillos
      for (let i = 0; i < 14; i++) {
        const x = (i * 197 - t * 0.9) % 900 - 40;
        const y = 236 + ((i * 43) % 90) + Math.sin(t / 44 + i) * 5;
        ctx.fillStyle = `rgba(206,222,236,${(0.05 + 0.05 * Math.abs(Math.sin(t / 50 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 120, 12);
      }
    },
  },

  /* =========================================================
     SAN BORJA — la tarde en la alameda. Acá está el MEF y acá se
     levanta la Torre del Banco de la Nación, la más alta del
     Estado peruano; enfrente, la reja verde del Pentagonito y las
     ciclovías rojas que le dieron fama al distrito. Es el barrio
     donde se firman las medidas que después caen en la práctica.
     ========================================================= */
  alameda: {
    nombre: "San Borja",
    cielo: [[0, "#3f7fbf"], [0.45, "#79aed6"], [0.8, "#cfe0e8"], [1, "#e8e2d2"]],
    suelo: { cara: "#b8b4a8", borde: "#d8d4c8", tierra: "#6b675e", plataforma: "#46566e", plataformaBorde: "#ffd166" },
    acento: "#c2264a",

    bichos: ["expediente", "bicicleta", "candado"],
    nombresBichos: ["El Expediente sin Ahorro Público", "La Bicicleta de Ida y Vuelta", "El Candado del Tipo de Cambio"],
    jefe: "ministro",
    nombreJefe: "El Ministro de la Torre",

    fondo(ctx, cam, t) {
      // sol de la tarde, alto y limpio
      ctx.fillStyle = "rgba(255,246,214,.22)";
      ctx.beginPath(); ctx.arc(672, 78, 58, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,250,230,.95)";
      ctx.beginPath(); ctx.arc(672, 78, 28, 0, Math.PI * 2); ctx.fill();

      // la Torre del Banco de la Nación, el hito que se ve desde toda la avenida
      repetir(ctx, cam, 820, 0.2, (x) => {
        const bx = x + 300, base = 306, alto = 216;
        ctx.fillStyle = "#5f708a";
        ctx.fillRect(bx, base - alto, 68, alto);
        ctx.fillStyle = "#7c8ea8";                       // el canto iluminado
        ctx.fillRect(bx + 54, base - alto, 14, alto);
        // las bandas de ventanas, piso por piso
        ctx.fillStyle = "rgba(196,226,244,.55)";
        for (let y = base - alto + 14; y < base - 24; y += 12) ctx.fillRect(bx + 7, y, 42, 7);
        // el remate y la antena
        ctx.fillStyle = "#46566e";
        ctx.fillRect(bx - 6, base - alto - 10, 80, 12);
        ctx.fillStyle = "#9aa0a6";
        ctx.fillRect(bx + 32, base - alto - 42, 3, 32);
      });

      // los bloques bajos y anchos del barrio, con sus azoteas
      repetir(ctx, cam, 214, 0.38, (x, i) => {
        const bx = x + 16, base = 312, alto = 78 + ((i * 27) % 40);
        ctx.fillStyle = ["#dcd6c8", "#cfd6dc", "#e2d8c4", "#d2ccc0"][i % 4];
        ctx.fillRect(bx, base - alto, 148, alto);
        ctx.fillStyle = "rgba(0,0,0,.14)";
        ctx.fillRect(bx, base - alto, 148, 5);
        ctx.fillStyle = "rgba(96,132,158,.45)";
        for (let fy = base - alto + 16; fy < base - 16; fy += 20)
          for (let fx = bx + 12; fx < bx + 136; fx += 22) ctx.fillRect(fx, fy, 13, 12);
      });

      // la reja verde del Pentagonito con los árboles asomando por encima
      repetir(ctx, cam, 168, 0.56, (x, i) => {
        const bx = x + 10, base = 340;
        ctx.fillStyle = i % 2 ? "#3f8f55" : "#4fa363";
        ctx.beginPath(); ctx.arc(bx + 36, base - 54, 26, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 112, base - 48, 21, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#6b5535";
        ctx.fillRect(bx + 33, base - 40, 6, 40);
        ctx.fillRect(bx + 109, base - 34, 6, 34);
        ctx.strokeStyle = "rgba(58,110,72,.8)"; ctx.lineWidth = 2;   // la reja
        ctx.beginPath();
        for (let rx = bx; rx < bx + 160; rx += 9) { ctx.moveTo(rx, base - 26); ctx.lineTo(rx, base); }
        ctx.moveTo(bx, base - 24); ctx.lineTo(bx + 160, base - 24);
        ctx.stroke();
      });

      // la ciclovía roja de la alameda, con sus bancas y sus postes
      repetir(ctx, cam, 132, 0.78, (x, i) => {
        const bx = x + 8, base = 356;
        ctx.fillStyle = "#a3243f";
        ctx.fillRect(bx, base - 6, 124, 6);
        ctx.fillStyle = "rgba(255,255,255,.6)";                      // la línea discontinua
        for (let lx = bx + 6; lx < bx + 118; lx += 22) ctx.fillRect(lx, base - 4, 11, 2);
        if (i % 2 === 0) {                                           // la banca
          ctx.fillStyle = "#8a6a48";
          ctx.fillRect(bx + 20, base - 24, 40, 5);
          ctx.fillRect(bx + 20, base - 34, 40, 5);
          ctx.fillStyle = "#5c5c66";
          ctx.fillRect(bx + 23, base - 20, 4, 14); ctx.fillRect(bx + 53, base - 20, 4, 14);
        } else {                                                     // el poste de luz
          ctx.fillStyle = "#9aa0a6";
          ctx.fillRect(bx + 74, base - 58, 3, 58);
          ctx.fillStyle = "#e8e2d2";
          ctx.fillRect(bx + 68, base - 62, 15, 6);
        }
      });
    },

    clima(ctx, t) {
      // el destello del sol de la tarde rebotando en los vidrios
      for (let i = 0; i < 18; i++) {
        const x = (i * 173 - t * 1.1) % 880 - 20;
        const y = 90 + ((i * 79) % 220) + Math.sin(t / 40 + i) * 8;
        ctx.fillStyle = `rgba(255,250,224,${(0.10 + 0.18 * Math.abs(Math.sin(t / 30 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 4, 4);
      }
    },
  },

  /* =========================================================
     LA PUNTA — mediodía en el malecón. El distrito más chico del
     país es una lengua de tierra con mar de los dos lados: acá se
     acaba el Perú y empieza el resto del mundo. Al frente, la isla
     San Lorenzo; al costado, las casonas republicanas de colores
     con sus miradores, los veleros del Club de Regatas y, más allá,
     los barcos entrando y saliendo del puerto.
     ========================================================= */
  punta: {
    nombre: "La Punta",
    cielo: [[0, "#2f7fc4"], [0.42, "#79b6dc"], [0.78, "#c4dce4"], [1, "#e4e0cc"]],
    suelo: { cara: "#c4bca8", borde: "#e4dcc4", tierra: "#7a7263", plataforma: "#2b4a6b", plataformaBorde: "#ffd166" },
    acento: "#2f6b8f",

    bichos: ["brujula", "vela", "caracola"],
    nombresBichos: ["La Brújula Volteada", "La Vela en Contra", "La Caracola de un Solo Lado"],
    jefe: "capitan",
    nombreJefe: "El Capitán de la Punta",

    fondo(ctx, cam, t) {
      // sol de mediodía rebotando en el agua
      ctx.fillStyle = "rgba(255,250,220,.24)";
      ctx.beginPath(); ctx.arc(596, 70, 60, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,252,236,.95)";
      ctx.beginPath(); ctx.arc(596, 70, 27, 0, Math.PI * 2); ctx.fill();

      // la isla San Lorenzo, larguísima, cerrando el horizonte
      repetir(ctx, cam, 900, 0.1, (x) => {
        const bx = x + 60;
        ctx.fillStyle = "#6f88a0";
        ctx.beginPath();
        ctx.moveTo(bx - 40, 238);
        ctx.lineTo(bx + 90, 190);
        ctx.lineTo(bx + 240, 202);
        ctx.lineTo(bx + 430, 172);
        ctx.lineTo(bx + 610, 212);
        ctx.lineTo(bx + 760, 238);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.10)";
        ctx.beginPath();
        ctx.moveTo(bx + 430, 172); ctx.lineTo(bx + 610, 212); ctx.lineTo(bx + 470, 238);
        ctx.closePath(); ctx.fill();
      });

      // el mar, con el brillo del sol encima
      ctx.fillStyle = "#2f6b96";
      ctx.fillRect(0, 238, CFG.ANCHO_VISTA, 46);
      for (let i = 0; i < 30; i++) {
        const x = (i * 59 - (cam * 0.07)) % 880 - 30;
        const y = 244 + ((i * 19) % 36);
        ctx.fillStyle = Math.abs(x - 596) < 110 ? "rgba(255,248,206,.42)" : "rgba(255,255,255,.14)";
        ctx.fillRect(x, y, 14, 2);
      }

      // los barcos del puerto, entrando y saliendo por el horizonte
      repetir(ctx, cam, 430, 0.18, (x, i) => {
        const bx = x + 70, by = 226 + (i % 2) * 8;
        ctx.fillStyle = "#3a4a5e";
        ctx.fillRect(bx, by, 88, 13);
        ctx.fillRect(bx + 58, by - 14, 22, 14);
        ctx.fillStyle = ["#c2264a", "#3f8f55", "#e8b13c"][i % 3];   // los contenedores en cubierta
        for (let k = 0; k < 5; k++) ctx.fillRect(bx + 6 + k * 10, by - 8, 8, 8);
      });

      // los veleros del Club de Regatas, meciéndose cerca de la orilla
      repetir(ctx, cam, 214, 0.4, (x, i) => {
        const bx = x + 40, mece = Math.sin(t / 28 + i) * 2.5;
        ctx.fillStyle = "#5c4632";
        ctx.fillRect(bx + 18, 240 + mece, 3, 28);
        ctx.fillStyle = "rgba(255,252,245,.95)";
        ctx.beginPath();
        ctx.moveTo(bx + 21, 240 + mece);
        ctx.lineTo(bx + 42, 264 + mece);
        ctx.lineTo(bx + 21, 268 + mece);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#e8e2d2";
        ctx.fillRect(bx + 6, 268 + mece, 34, 6);
      });

      // las casonas republicanas del malecón, con sus miradores de madera
      repetir(ctx, cam, 206, 0.54, (x, i) => {
        const bx = x + 12, base = 336, alto = 56 + ((i * 29) % 22);
        const fachadas = ["#e8dcc0", "#cfe0e4", "#f0d8c4", "#d8e4d0", "#e4d0dc"];
        ctx.fillStyle = fachadas[i % 5];
        ctx.fillRect(bx, base - alto, 132, alto);
        ctx.fillStyle = "rgba(0,0,0,.14)";                 // la cornisa
        ctx.fillRect(bx, base - alto, 132, 5);
        // el mirador de madera, en volado sobre la vereda
        ctx.fillStyle = "#7a4a2e";
        ctx.fillRect(bx + 22, base - alto + 26, 88, 34);
        ctx.fillStyle = "rgba(189,232,255,.6)";
        for (let k = 0; k < 4; k++) ctx.fillRect(bx + 28 + k * 21, base - alto + 32, 14, 22);
        // el zaguán y las ventanitas
        ctx.fillStyle = "#5c4632";
        ctx.fillRect(bx + 54, base - 34, 26, 34);
        ctx.fillStyle = "rgba(120,150,170,.4)";
        ctx.fillRect(bx + 16, base - 30, 24, 20);
        ctx.fillRect(bx + 92, base - 30, 24, 20);
      });

      // la baranda blanca del malecón, ya en primer plano
      repetir(ctx, cam, 96, 0.8, (x) => {
        const base = 356;
        ctx.fillStyle = "#f2f6ff";
        ctx.fillRect(x, base - 26, 96, 4);
        ctx.fillRect(x, base - 14, 96, 3);
        for (let k = 0; k < 4; k++) ctx.fillRect(x + 6 + k * 24, base - 26, 5, 26);
      });
    },

    clima(ctx, t) {
      // la brisa salada: gotitas finas que cruzan de costado
      for (let i = 0; i < 22; i++) {
        const x = (i * 151 - t * 2.4) % 880 - 20;
        const y = 120 + ((i * 67) % 210) + Math.sin(t / 24 + i) * 8;
        ctx.fillStyle = `rgba(226,244,255,${(0.12 + 0.18 * Math.abs(Math.sin(t / 30 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 7, 2);
      }
    },
  },
};

/** Pinta el cielo del tema (degradado vertical). */
export function pintarCielo(ctx, tema) {
  const g = ctx.createLinearGradient(0, 0, 0, CFG.ALTO_VISTA);
  (TEMAS[tema] || TEMAS.puerto).cielo.forEach(([p, c]) => g.addColorStop(p, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CFG.ANCHO_VISTA, CFG.ALTO_VISTA);
}

/** Dibuja un bloque de suelo o plataforma con los colores del tema. */
export function pintarTile(ctx, tema, tipo, px, py) {
  const p = (TEMAS[tema] || TEMAS.puerto).suelo;
  if (tipo === "suelo") {
    ctx.fillStyle = p.cara; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = p.borde; ctx.fillRect(px, py, T, 6);
    ctx.fillStyle = "rgba(0,0,0,.16)";
    ctx.fillRect(px + 4, py + 12, 8, 5); ctx.fillRect(px + 20, py + 21, 7, 5);
  } else if (tipo === "tierra") {
    ctx.fillStyle = p.tierra; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = "rgba(0,0,0,.14)";
    ctx.fillRect(px + 6, py + 7, 6, 5); ctx.fillRect(px + 19, py + 18, 6, 5);
  } else { // plataforma
    ctx.fillStyle = p.plataforma; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = p.plataformaBorde; ctx.fillRect(px, py, T, 5);
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(px, py + T - 4, T, 4);
  }
}
