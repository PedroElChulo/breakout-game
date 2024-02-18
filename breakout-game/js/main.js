const btnReglas = document.getElementById("btn-reglas");
const btnCierra = document.getElementById("btn-cerrar");
const reglas = document.getElementById("reglas");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");//Es el contexto del canvas obtenido mediante getContext("2d"). Se utiliza para realizar operaciones de dibujo en el canvas.

let puntuacion = 0;
let nivel =0;
const nColumnasBloques = 9;
const nFilasBloques = 5;
const delay = 1000; //delay para resetear el juego cuando pierdes
const velocidadInicialBola = 4;
const velocidadInicialPaleta = 8;

function generarColorAleatorio() {
  const coloresDisponibles = [
    "#0095dd", // Azul
    "#ff8c00", // Naranja más claro
    "#4caf50", // Verde
    "#e53935", // Rojo más claro
    "#00bcd4", // Azul cian
    "#FFFF00", // Amarillo
  ];

  return coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)];
}
// Objeto bola
const bola = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 20,
  size: 10,
  velocidad: velocidadInicialBola,
  dx: 4,
  dy: -3,//dx y dy (cambios en las coordenadas x e y)
  visible: true,
};

// Objeto paleta
const paleta = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    velocidad: velocidadInicialPaleta,
    dx: 0,  
    visible: true,
};

// Objeto Bloque (individual)
const iBloque = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
    resistencia: 2, // Resistencia inicial del bloque
    hits: 0, // Inicializamos el contador de golpes en 0
    color: generarColorAleatorio(),
};

// Crear conjunto de bloques
const bloques = [];
for (let i = 0; i < nColumnasBloques; i++) {
    bloques[i] = [];
    for (let j = 0; j < nFilasBloques; j++) {
        const x = i * (iBloque.w + iBloque.padding) + iBloque.offsetX;
        const y = j * (iBloque.h + iBloque.padding) + iBloque.offsetY;
        bloques[i][j] = { x, y, ...iBloque, color: generarColorAleatorio() };
    }
}
// Dibuja la bola
function dibujaBola() {
    ctx.beginPath();//Inicia un nuevo camino de dibujo.
    ctx.arc(bola.x, bola.y, bola.size, 0, Math.PI * 2);//Dibuja un arco (círculo) en el canvas.Los parámetros especifican la posición de la bola (bola.x, bola.y), el radio (bola.size), el ángulo de inicio (0), y el ángulo de final (Math.PI * 2), que representa un círculo completo.
    ctx.fillStyle = bola.visible ? "#0095dd" : "transparent"; //Establece el color de relleno del círculo.
    ctx.fill();//Rellena el área del círculo con el color especificado.
    ctx.closePath();//Finaliza el camino de dibujo.
}

// Dibuja la paleta
function dibujaPaleta() {
    ctx.beginPath();
    ctx.rect(paleta.x, paleta.y, paleta.w, paleta.h);
    ctx.fillStyle = paleta.visible ? "#0095dd" : "transparent";
    ctx.fill();
    ctx.closePath();
}

// Dibuja la puntuación
function dibujaPuntuacion() {
    ctx.font = "20px Arial";
    ctx.fillText(`Puntos: ${puntuacion}`, canvas.width - 100, 30);
}
function dibujaNivel() {
  ctx.font = "20px Arial";
  ctx.fillText(`Nivel: ${nivel}`, 50, 30);
}
// Dibuja los bloques
function dibujaMuro() {
    bloques.forEach((grupo) => {
        grupo.forEach((bloque) => {
            ctx.beginPath();
            ctx.rect(bloque.x, bloque.y, bloque.w, bloque.h);
            ctx.fillStyle = bloque.visible ? bloque.color : "transparent";
            ctx.fill();
            ctx.font = "15px Arial";
            ctx.fillStyle = bloque.visible ? "black" : "transparent";
            ctx.fillText(bloque.resistencia-bloque.hits,bloque.x+bloque.w/2,bloque.y+bloque.h);//es para pintar la resistencia delbloque 
            ctx.closePath();
        });
    });
}

// Mover la paleta izquierda y derecha
function muevePaleta() {
    paleta.x += paleta.dx;

    // Wall detection
    if (paleta.x + paleta.w > canvas.width) {
        paleta.x = canvas.width - paleta.w;
    }

    if (paleta.x < 0) {
        paleta.x = 0;
    }
}

// Mueve la bola por el canvas
function mueveBola() {
  if (juegoIniciado ){
  bola.x += bola.dx;
  bola.y += bola.dy;


  // Colisión con paredes izquierda o derecha
  if (bola.x + bola.size > canvas.width || bola.x - bola.size < 0) {
    bola.dx *= -1; // rebote de 45º
  }

  // Colisión con paredes superior o inferior
  if (bola.y + bola.size > canvas.height || bola.y - bola.size < 0) {
    bola.dy *= -1;
  }

  // Colisión con la paleta
  if (
    bola.x - bola.size > paleta.x &&
    bola.x + bola.size < paleta.x + paleta.w &&
    bola.y + bola.size > paleta.y
  ) {
    
    bola.dy = -bola.velocidad;
  }

  // colisión con un bloque
  bloques.forEach((grupo) => {
    grupo.forEach((bloque) => {
        if (bloque.visible && bola.x + bola.size > bloque.x && 
            bola.x - bola.size < bloque.x + bloque.w &&
            bola.y + bola.size > bloque.y && 
            bola.y - bola.size < bloque.y + bloque.h) {
            if (bloque.hits < bloque.resistencia) { // Comprobamos si el bloque ha sido golpeado menos de 2 veces
                bloque.hits++; // Incrementamos el contador de golpes al bloque
                if (bloque.hits === bloque.resistencia) { // Si ha sido golpeado 2 veces, el bloque desaparece
                    bloque.visible = false; // el bloque desaparece
                    actualizaPuntuacion();
                    bola.dy *= -1; 
                } else {
                    bola.dy *= -1; // rebota con 45º
                }
            }
        }
    });
});
console.log(bola.hits);

  // La paleta no golpea - Pierdes
  if (bola.y + bola.size > canvas.height) {
    reiniciaMuro();
    juegoIniciado = false;
    puntuacion = 0;
    nivel = 0;
    bola.x= canvas.width / 2 - 30;
    bola.y= canvas.height - 30;
    paleta.x = canvas.width / 2 - 40;
    paleta.y = canvas.height - 20;
    paleta.velocidad = velocidadInicialPaleta;
    bola.velocidad = velocidadInicialBola;
    bola.dx=4;
    bola.dy=-3;
    paleta.x= canvas.width / 2 - 40;
    paleta.y= canvas.height - 20;
    paleta.w= 80;
    paleta.h=10;
  }
  }
}
function showAllbloques() {
  bloques.forEach(grupo => {
    grupo.forEach(bloque => {
      bloque.visible = true;
    });
  });
}
// Actualiza puntuacion
function actualizaPuntuacion() {
  puntuacion++;

  // Verifica si se ha completado el nivel
  if (puntuacion % (nFilasBloques * nColumnasBloques) === 0) {
      // Reinicia los bloques y aumenta el nivel
      setTimeout(() => {
          reiniciaMuro();
          nivel++;
          iniciarNuevoNivel(); // Llama a esta función para aumentar la resistencia de los bloques
          bola.x = canvas.width / 2 - 30;
          bola.y = canvas.height - 30;
          juegoIniciado = true; // Vuelve a iniciar el juego automáticamente
      }, delay);
  }
}

// Inicia un nuevo nivel
function reiniciaMuro() {
  bloques.forEach((grupo) => {
      grupo.forEach((bloque) => {
          bloque.visible = true;
          bloque.hits = 0; // Reinicia el contador de golpes
          bloque.resistencia = 2; // Restablece la resistencia a 1
      });
  });
}

// Inicia un nuevo nivel
function iniciarNuevoNivel() {
  reiniciaMuro(); // Reinicia los bloques
}
let juegoIniciado = false; // Variable para controlar si el juego ha comenzado o no

// Iniciar el juego al pulsar una tecla
document.addEventListener("keydown", iniciarJuego);

function iniciarJuego() {
    if (!juegoIniciado) {
        juegoIniciado = true;
        //El problrma rtaba aqui ya que cada vez que se ejecutaba esta funcion hacia un update que lo que hacia era recargar el juego
    }
}


// Pausar el juego al pulsar una tecla
document.addEventListener("keydown", pausarJuego);

function pausarJuego(e) {
    if (e.key === "Escape") {
        juegoIniciado = false;
        // Limpia el canvas y detiene la animación
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       // cancelAnimationFrame(update);
    }
}
// Dibujar el canvas
function dibujaTodo() {
    // limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujaBola();
    dibujaPaleta();
    dibujaPuntuacion();
    dibujaNivel();
    dibujaMuro();
}

// Actualiza el canvas y las posiciones de los objetos
function update() {
    muevePaleta();
    mueveBola();
    dibujaTodo();
    requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        paleta.dx = paleta.velocidad;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paleta.dx = -paleta.velocidad;
    }
}


// Keyup event
function keyUp(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        paleta.dx = 0;
    }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Muestra reglas
btnReglas.addEventListener('click', () => reglas.classList.add('mostrar'));
btnCierra.addEventListener('click', () => reglas.classList.remove('mostrar'));