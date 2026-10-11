/**
 * escena.js — las partes cinematográficas del juego.
 *
 *  - introJefe(): viñetas estilo manga antes de pelear con el jefe del distrito.
 *  - animarPortada(): la escena que corre sola en la pantalla de inicio.
 *  - galeriaPersonajes(): las tarjetas con los bichos que el alumno va a encontrar.
 *
 * Nada de esto afecta a la lógica del juego: si se quita, el juego sigue andando.
 */
import { pintar, miniatura, medida } from "./sprites.js";
import { Audio } from "./audio.js";

/* ==============================================================
   1. VIÑETAS DEL JEFE
   ============================================================== */
const capa = document.getElementById("manga");

export function introJefe({ nombre, sprite, distrito, retos }, alTerminar) {
  let cerrado = false;
  const cerrar = () => {
    if (cerrado) return;
    cerrado = true;
    capa.classList.remove("visible");
    capa.hidden = true;
    capa.innerHTML = "";
    clearTimeout(temporizador);
    alTerminar();
  };

  capa.innerHTML = `
    <div class="manga-tiras">
      <div class="vineta v1">
        <div class="lineas"></div>
        <span class="texto">Algo grande se mueve al final de ${distrito}…</span>
      </div>
      <div class="vineta v2">
        <div class="lineas rapidas"></div>
        <span class="retrato" id="manga-jefe"></span>
        <span class="nombre">${nombre}</span>
      </div>
      <div class="vineta v3">
        <span class="retrato chico" id="manga-jose"></span>
        <span class="texto">«${retos} preguntas y cae.»</span>
      </div>
      <div class="estampa">¡A PELEAR!</div>
    </div>
    <button class="saltar">Saltar ▸</button>`;

  capa.querySelector("#manga-jefe").appendChild(miniatura(sprite, 5));
  capa.querySelector("#manga-jose").appendChild(miniatura("jose_quieto", 5));
  capa.hidden = false;
  setTimeout(() => capa.classList.add("visible"), 16);   // deja que aplique la transición

  // golpes de sonido acompañando cada viñeta
  [0, 550, 1100].forEach((ms, i) => setTimeout(() => Audio.tono(160 + i * 90, 0.18, "square", 0.05), ms));
  setTimeout(() => Audio.golpe(), 1750);

  capa.addEventListener("click", cerrar, { once: true });
  const temporizador = setTimeout(cerrar, 2900);
}

/* ==============================================================
   2. ESCENA ANIMADA DE LA PORTADA
   ============================================================== */
export function animarPortada(lienzo) {
  const ctx = lienzo.getContext("2d");
  const A = lienzo.width, H = lienzo.height;
  const SUELO = H - 26;
  let t = 0, corriendo = true;

  // objetos que cruzan la escena
  const monedas = [0, 1, 2].map((i) => ({ x: 180 + i * 260, y: SUELO - 74 }));
  const bichos = [
    { x: 320, sprite: "gaviota" },
    { x: 700, sprite: "cono" },
  ];

  function cuadro() {
    if (!corriendo) return;
    t++;
    const desp = t * 1.7;   // la escena se desplaza sola

    // cielo del amanecer
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b2b52"); g.addColorStop(0.6, "#4a6ea8"); g.addColorStop(1, "#f0b26b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, A, H);

    // cerros y grúas al fondo
    for (let i = 0; i < 8; i++) {
      const x = (i * 190 - (desp * 0.25) % 190 + A + 190) % (A + 380) - 190;
      ctx.fillStyle = "#243b56";
      ctx.fillRect(x + 30, SUELO - 96, 7, 96);
      ctx.fillRect(x + 30, SUELO - 100, 74, 6);
      ctx.fillStyle = "#2f6b8f";
      ctx.fillRect(x + 110, SUELO - 34, 40, 20);
      ctx.fillStyle = "#c14a22";
      ctx.fillRect(x + 110, SUELO - 54, 40, 20);
    }

    // piso
    ctx.fillStyle = "#5d6b78"; ctx.fillRect(0, SUELO, A, H - SUELO);
    ctx.fillStyle = "#8fa3b0"; ctx.fillRect(0, SUELO, A, 5);
    for (let i = 0; i < 30; i++) {
      const x = (i * 61 - desp % 61 + A) % (A + 61) - 30;
      ctx.fillStyle = "rgba(0,0,0,.16)";
      ctx.fillRect(x, SUELO + 12, 9, 5);
    }

    // monedas girando
    monedas.forEach((m, i) => {
      const x = (m.x - desp % (A + 300) + A + 300) % (A + 300) - 60;
      const gira = Math.floor((t + i * 9) / 9) % 4;
      pintar(ctx, gira === 2 ? "moneda_b" : "moneda_a", x, m.y + Math.sin((t + i * 20) / 20) * 3);
    });

    // bichos con su globito
    bichos.forEach((b, i) => {
      const x = (b.x - desp % (A + 400) + A + 400) % (A + 400) - 60;
      const flota = Math.sin((t + i * 30) / 16) * 2;
      pintar(ctx, b.sprite, x, SUELO - 26 + flota, true);
      ctx.fillStyle = "rgba(18,16,42,.85)";
      ctx.fillRect(x + 8, SUELO - 44 + flota, 14, 12);
      ctx.fillStyle = "#ffd166";
      ctx.font = "bold 11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("?", x + 15, SUELO - 34 + flota);
      ctx.textAlign = "left";
    });

    // José corriendo en el sitio, con saltitos cada cierto rato
    const cicloSalto = t % 200;
    const salto = cicloSalto < 40 ? -Math.sin((cicloSalto / 40) * Math.PI) * 54 : 0;
    const enAire = salto < -1;
    const sprite = enAire ? "jose_salta" : (Math.floor(t / 6) % 2 ? "jose_paso_a" : "jose_paso_b");
    const m = medida(sprite);
    pintar(ctx, sprite, 96, SUELO - m.alto + salto);

    // garúa
    ctx.strokeStyle = "rgba(200,225,255,.30)"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const x = (i * 137 + t * 2.4) % (A + 40) - 20;
      const y = (i * 71 + t * 7) % H;
      ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9);
    }
    ctx.stroke();

    requestAnimationFrame(cuadro);
  }
  cuadro();

  return () => { corriendo = false; };
}

/* ==============================================================
   3. TARJETAS DE PERSONAJES
   ============================================================== */
const FICHAS = [
  { sprite: "jose_quieto", nombre: "José", texto: "Tú. Corre, salta y responde." },
  { sprite: "gaviota", nombre: "Gaviota Contrabandista", texto: "Quiere meter su mercadería informal al PBI." },
  { sprite: "contenedor", nombre: "Contenedor Colado", texto: "Producción del año pasado que insiste en contarse hoy." },
  { sprite: "pulpo", nombre: "El Pulpo del Censo", texto: "Jefe del puerto: quiere contar hasta lo que no se registra." },
  { sprite: "paloma", nombre: "Paloma Repetida", texto: "Suma dos veces la misma cuenta del cuadro." },
  { sprite: "combi", nombre: "La Combi Doble Cuenta", texto: "Jefa del malecón: cobra dos veces el mismo pasaje." },
  { sprite: "cuy", nombre: "Cuy Nacional", texto: "Se fue del país y cree que ya no cuenta en ningún lado." },
  { sprite: "torito", nombre: "El Torito de las Cuentas", texto: "Jefe de la plaza: confunde el PBI con el PNB." },
  { sprite: "flor", nombre: "La Flor Informal", texto: "Vende sin boleta y jura que igual entra al PBI." },
  { sprite: "ardilla", nombre: "La Ardilla Acaparadora", texto: "Guarda la producción del año pasado para contarla este año." },
  { sprite: "monumento", nombre: "El Monumento al Doble Conteo", texto: "Jefe de Jesús María: suma el insumo y el producto final." },
  { sprite: "globo", nombre: "El Globo Retenido", texto: "Mete las utilidades retenidas en el Ingreso Nacional." },
  { sprite: "diana", nombre: "La Diana de la Reventa", texto: "Revende entradas y jura que eso es producción." },
  { sprite: "payaso", nombre: "El Payaso de Ida y Vuelta", texto: "Jefe de Lince: se pierde entre el método del gasto y el del ingreso." },
  { sprite: "maletin", nombre: "El Maletín del Año Base", texto: "Calcula el IPC y se le olvida cuál era el año base." },
  { sprite: "corbata", nombre: "La Corbata Desinflada", texto: "Cree que si la inflación baja, los precios bajan." },
  { sprite: "ejecutivo", nombre: "El Ejecutivo de Laspeyres", texto: "Jefe de San Isidro: mezcla las cantidades del año base con las del actual." },
  { sprite: "parapente", nombre: "El Parapente Exportado", texto: "Mete en la canasta de consumo lo que se va al extranjero." },
  { sprite: "tabla", nombre: "La Tabla Sustituta", texto: "No se entera de que el consumidor ya se cambió de producto." },
  { sprite: "gato", nombre: "El Gato de las Canastas", texto: "Jefe de Miraflores: multiplica la inflación promedio por los años." },
  { sprite: "guitarra", nombre: "La Guitarra Nominal", texto: "Celebra que el PBI subió sin fijarse en que solo subieron los precios." },
  { sprite: "aerosol", nombre: "El Aerosol Deflactado", texto: "Pinta el deflactor donde va el IPC, como si midieran la misma canasta." },
  { sprite: "bohemio", nombre: "El Bohemio de los Índices", texto: "Jefe de Barranco: no distingue a Laspeyres de Paasche ni del deflactor." },
  { sprite: "bote", nombre: "El Bote de Agua Dulce", texto: "Como la playa: el nombre promete dulce y el agua es salada. Le pasa igual con el PBI nominal." },
  { sprite: "red", nombre: "La Red de la Caleta", texto: "Echa todos los años a la misma red y suma las inflaciones en vez de componerlas." },
  { sprite: "pelicano", nombre: "El Pelícano Importado", texto: "Se traga lo que sea, venga de donde venga, y mete lo importado al deflactor." },
  { sprite: "pescador", nombre: "El Pescador del Morro", texto: "Jefe de Chorrillos: desde el Morro ve toda Lima y aun así pesa la canasta equivocada." },
  { sprite: "fajo", nombre: "El Fajo de Ocoña", texto: "Canta la tasa nominal a gritos y nunca le descuenta la inflación." },
  { sprite: "sello", nombre: "El Sello de Azángaro", texto: "Sella el impuesto y después consume sobre el ingreso entero, como si nunca lo hubiera cobrado." },
  { sprite: "bono", nombre: "El Bono de Jirón Lampa", texto: "Cambia de mano toda la cuadra y ya no sabe quién presta y quién pide prestado." },
  { sprite: "banquero", nombre: "El Banquero de Jirón Lampa", texto: "Jefe del Cercado: cuadra la caja con el ahorro de las familias y deja al gobierno fuera del libro." },
  { sprite: "jaba", nombre: "La Jaba del Movimiento", texto: "Se corre dos puestos por el pasillo y jura que se movió el mercado entero." },
  { sprite: "balanza", nombre: "La Balanza de la Tasa", texto: "Cree que la tasa de interés se mueve sola y arrastra a las curvas con ella." },
  { sprite: "saco", nombre: "El Saco sin Destino", texto: "Nadie sabe si lo que lleva adentro se va a consumir o a invertir, y de eso depende todo." },
  { sprite: "camion", nombre: "El Camión del Déficit", texto: "Jefe de Santa Anita: se para en media bahía de carga y deja a los chicos sin sitio para descargar." },
  { sprite: "expediente", nombre: "El Expediente sin Ahorro Público", texto: "Cuadra el ahorro nacional con lo de las familias y se le traspapela el (T − G)." },
  { sprite: "bicicleta", nombre: "La Bicicleta de Ida y Vuelta", texto: "Los capitales entran y salen, y ella nunca se queda con el NETO." },
  { sprite: "candado", nombre: "El Candado del Tipo de Cambio", texto: "Ve al BCRP comprando dólares y ya cree que le pusieron candado a un tipo de cambio que flota." },
  { sprite: "ministro", nombre: "El Ministro de la Torre", texto: "Jefe de San Borja: firma la medida, arma el gráfico y te lo deja de práctica calificada." },
  { sprite: "brujula", nombre: "La Brújula Volteada", texto: "Sube el tipo de cambio y ella canta «se apreció el sol»: apunta justo al revés." },
  { sprite: "vela", nombre: "La Vela en Contra", texto: "Jura que si el tipo de cambio real sube, las exportaciones netas caen." },
  { sprite: "caracola", nombre: "La Caracola de un Solo Lado", texto: "Solo escucha los capitales que entran y nunca los que salen, así que no le sale el neto." },
  { sprite: "capitan", nombre: "El Capitán de la Punta", texto: "Jefe de La Punta: ve al gobierno endeudarse y grita crowding out sin fijarse si está entrando ahorro externo." },
  { sprite: "pizarra", nombre: "La Pizarra de la Semana Pasada", texto: "Explica lo que pasó hace siete días con una regla que solo vale en el largo plazo." },
  { sprite: "canasta", nombre: "La Canasta de Dos Monedas", texto: "Echa soles y dólares a la misma canasta y los compara sin convertir nada." },
  { sprite: "palta", nombre: "La Palta al Revés", texto: "Suben los precios en USA y ella jura que el que se deprecia es el sol." },
  { sprite: "caserita", nombre: "La Casera de los Dos Precios", texto: "Jefa de Surquillo: vende lo mismo a dos precios según de qué lado de la vía estés, y jura que eso dura para siempre." },
  { sprite: "maleta", nombre: "La Maleta del Andén Equivocado", texto: "Le preguntan por el mercado de préstamos y ella se sube al bus del mercado cambiario." },
  { sprite: "letrero", nombre: "El Letrero de Largo Plazo", texto: "Saca el gráfico del ROR*, que es de corto plazo, para responder una pregunta de años." },
  { sprite: "timon", nombre: "El Timón que Desplaza", texto: "Cambió la tasa local y él gira la curva entera, cuando solo tocaba moverse a lo largo de ella." },
  { sprite: "chofer", nombre: "El Chofer del Crowding Out", texto: "Jefe de El Agustino: grita crowding out en cada esquina sin mirar si puede entrar ahorro externo." },
  { sprite: "tanque", nombre: "El Tanque que No Varía", texto: "Cree que las RIN deberían quedarse quietas para dar confianza, y por eso nunca entiende la balanza de pagos." },
  { sprite: "valvula", nombre: "La Válvula de un Solo Flujo", texto: "Solo deja pasar las exportaciones netas y se olvida de la renta de factores y las transferencias." },
  { sprite: "barril", nombre: "El Barril del Corto Plazo", texto: "Capital golondrino: entra, se pasea y se va, pero él lo cuenta como si fuera una fábrica nueva." },
  { sprite: "ingeniero", nombre: "El Ingeniero del Signo Cambiado", texto: "Jefe de Ventanilla: confunde el ahorro externo con la cuenta corriente y se le pierde el menos." },
  { sprite: "chakana", nombre: "La Chakana Descuadrada", texto: "Le sale un PBI distinto según el método que use, cuando los tres tienen que dar lo mismo." },
  { sprite: "piedra", nombre: "La Piedra que no Encaja", texto: "Mete al PBI cosas que no van: reventas, insumos y producción de años anteriores." },
  { sprite: "qero", nombre: "El Qero que se Llena Dos Veces", texto: "Cuenta el insumo y después el producto final, y termina con el doble conteo de siempre." },
  { sprite: "guia", nombre: "El Guía de la Plaza", texto: "Jefe del Cusco: te resume los dos exámenes en diez minutos y termina mezclando el IPC con el deflactor." },
  { sprite: "lingote", nombre: "El Lingote del Banco Central", texto: "Cree que el dinero de la economía es solo lo que el BCR llegó a imprimir." },
  { sprite: "ventanilla", nombre: "La Ventanilla sin Encaje", texto: "Presta todo lo que recibe y se olvida de apartar el encaje antes de soltar el préstamo." },
  { sprite: "sombrero", nombre: "El Sombrero al Revés", texto: "Jura que si sube la tasa de encaje sube la oferta monetaria, cuando es justo al revés." },
  { sprite: "tesorero", nombre: "El Tesorero del Rescate", texto: "Jefe de Cajamarca: llena el cuarto una sola vez y no entiende cómo puede haber más dinero del que entró." },
  { sprite: "glaciar", nombre: "El Glaciar del Tipo de Cambio", texto: "Huaraz: jura que la finalidad del BCR es preservar la estabilidad del tipo de cambio, cuando es la de los precios." },
  { sprite: "compuerta", nombre: "La Compuerta al Revés", texto: "Para expandir la oferta anuncia que SUBIRÁ la tasa de referencia, que es justo lo que la contrae." },
  { sprite: "canal", nombre: "El Canal de Doble Sentido", texto: "Confunde qué operación suelta soles y cuál los recoge: mezcla la OMA venta con la OMA compra." },
  { sprite: "puya", nombre: "La Puya que Mueve la Base", texto: "Cree que el encaje afecta la base monetaria, cuando lo que mueve es el multiplicador bancario." },
  { sprite: "condor", nombre: "El Cóndor que Todo lo Controla", texto: "Desde arriba cree que el BCR también decide cuánto depositan las familias y cuánto prestan los bancos." },
  { sprite: "guardian", nombre: "El Guardián de la Laguna", texto: "Jefe de Huaraz: abre y cierra la compuerta a destiempo, y por eso el valle o se inunda o se seca." },
  { sprite: "cambista", nombre: "El Cambista sin Fisher", texto: "Chiclayo: te canta la tasa nominal como si fuera lo que de verdad ganas, sin descontarle nunca la inflación." },
  { sprite: "billete", nombre: "El Billete Guardado", texto: "Se queda quieto debajo del colchón y jura que la velocidad de circulación no tiene nada que ver con la tasa de interés." },
  { sprite: "kingkong", nombre: "El King Kong de Precio Doble", texto: "Le suben el precio y jura que ahora la demanda REAL de dinero cambió, cuando el precio solo mueve la nominal." },
  { sprite: "tumi", nombre: "El Tumi que Corta al Revés", texto: "Pasa la ecuación cuantitativa a variaciones con los signos cambiados y termina restando lo que había que sumar." },
  { sprite: "gallinazo", nombre: "El Gallinazo que Confunde el Vuelo", texto: "Confunde moverse a lo largo de la curva de demanda con desplazarla entera." },
  { sprite: "curandero", nombre: "El Curandero de la Sección Brujos", texto: "Jefe de Chiclayo: te adivina la tasa de interés a punta de hierbas, en vez de igualar la oferta con la demanda." },
  { sprite: "vale", nombre: "El Vale de la Mina", texto: "Huancavelica: cree que el billete de hoy vale por el metal que lo respalda, cuando lo que le da valor es la ley." },
  { sprite: "azogue", nombre: "El Azogue Mal Ordenado", texto: "Es el metal más líquido que hay y aun así ordena al revés la escala de liquidez del dinero." },
  { sprite: "socavon", nombre: "El Socavón al Revés", texto: "Jura que las funciones del dinero se pierden de la primera a la última, cuando se caen de la última a la primera." },
  { sprite: "suela", nombre: "La Suela sin Gastar", texto: "Confunde el costo de suela de zapato con el costo de menú: uno es del que va al banco, el otro del que cambia los precios." },
  { sprite: "murcielago", nombre: "El Murciélago del Depósito", texto: "Cuelga su plata en el socavón y jura que con inflación alta el dinero igual guarda su valor." },
  { sprite: "azoguero", nombre: "El Azoguero de Santa Bárbara", texto: "Jefe de Huancavelica: sigue creyendo que el billete vale por el metal que queda en el cerro." },
  { sprite: "riel", nombre: "El Riel sin Producto", texto: "La Oroya: se lanza a la demanda de dinero sin haber calculado antes el Y con la función de producción." },
  { sprite: "chimenea", nombre: "La Chimenea Nominal", texto: "Iguala la oferta NOMINAL con la demanda REAL: se olvida de dividir entre el nivel de precios." },
  { sprite: "aguja", nombre: "La Aguja sin Fisher", texto: "La demanda le viene con la tasa REAL y él la iguala igual, sin pasarla a nominal." },
  { sprite: "vagon", nombre: "El Vagón de los Dos Multiplicadores", texto: "Mezcla el multiplicador de M1 con el de M2, y de paso el encaje sobre depósitos con el implícito." },
  { sprite: "humo", nombre: "El Humo de la Elasticidad", texto: "Canta la pendiente como si fuera la elasticidad, sin multiplicarla por Y sobre la cantidad demandada." },
  { sprite: "mochila", nombre: "La Mochila del Salario de Reserva", texto: "Nueva Zelanda: cree que el salario de reserva lo pone el gobierno, cuando lo decide la familia según lo que le cuesta ir a trabajar." },
  { sprite: "esquiladora", nombre: "La Tijera sin Pendiente", texto: "Le dan cuánto sube el sueldo y cuánta gente más se ofrece, y no sabe que la pendiente es la variación del salario entre la del empleo." },
  { sprite: "oveja", nombre: "La Oveja que No Mira el Equilibrio", texto: "Opina del salario mínimo sin fijarse primero dónde está el de equilibrio, que es lo único que decide si el mínimo muerde o no." },
  { sprite: "tope", nombre: "El Tope al Revés", texto: "Cree que un salario máximo funciona igual que un mínimo. Es al revés: el máximo solo hace efecto si queda POR DEBAJO del equilibrio." },
  { sprite: "kiwi", nombre: "El Kiwi que Cuenta Mal", texto: "Para el desempleo resta al revés: son los ofertantes menos los demandantes, reemplazando el mismo salario en las dos ecuaciones." },
  { sprite: "arbitro", nombre: "El Árbitro de 1894", texto: "Jefe de Nueva Zelanda: firma laudos de salario sin revisar si quedan por encima o por debajo del equilibrio, así que no sabe cuáles cambian algo." },
  { sprite: "telar", nombre: "El Telar sin Precio", texto: "Lyon: cuenta cuántas piezas teje el obrero y se olvida de multiplicar por el precio, que es lo que da el VPMgL." },
  { sprite: "lanzadera", nombre: "La Lanzadera del Más Capacitado", texto: "Cree que el aporte cae porque los primeros obreros son mejores, cuando la causa es que los telares son los que son." },
  { sprite: "capataz", nombre: "El Capataz que Contrata de Más", texto: "Sigue metiendo gente al taller aunque lo que aporta el último ya no alcance para pagarle el salario." },
  { sprite: "franco", nombre: "El Franco Confundido", texto: "Mira el monto del sueldo y cree que eso es el salario real, sin dividirlo entre el nivel de precios." },
  { sprite: "pancarta", nombre: "La Pancarta del Tarif", texto: "Jura que subir el salario mínimo crea más empleo, y además que mueve la curva de la demanda laboral." },
  { sprite: "sedero", nombre: "El Sedero de la Croix-Rousse", texto: "Jefe de Lyon: tiene los pedidos y los telares, pero no sabe hasta qué trabajador le conviene contratar." },
  { sprite: "maquinista", nombre: "El Maquinista del Nudo", texto: "Jefe de La Oroya: llega al cruce y arranca sin fijarse si las dos vías se juntan justo ahí." },
];

export function galeriaPersonajes(contenedor) {
  contenedor.innerHTML = "";
  FICHAS.forEach((f, i) => {
    const t = document.createElement("figure");
    t.className = "ficha";
    t.style.animationDelay = `${i * 90}ms`;
    t.appendChild(miniatura(f.sprite, 3));
    t.insertAdjacentHTML("beforeend",
      `<figcaption><b>${f.nombre}</b><span>${f.texto}</span></figcaption>`);
    contenedor.appendChild(t);
  });
}
