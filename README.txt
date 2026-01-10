🚀 Space Drift

Space Drift es un videojuego de navegación minimalista basado en una simulación simplificada de fuerzas gravitatorias. El jugador no controla directamente la posición de la nave, sino que interviene aplicando impulsos puntuales para corregir su trayectoria y alcanzar sucesivos objetivos.

El proyecto explora la tensión entre control y deriva, combinando física básica, diseño procedural y una estética sobria inspirada en el espacio profundo.

🎮 Concepto de juego

En Space Drift:

La nave se mueve de forma continua bajo la influencia de campos gravitatorios.

El jugador puede aplicar impulsos breves (“thrust”) en distintas direcciones.

Cada nivel presenta una nueva configuración de planetas (fuentes de gravedad).

El objetivo es alcanzar el punto de destino con el menor número de correcciones posible.

No existen “vidas” ni checkpoints:

Un fallo (colisión o salida de pantalla) termina la partida.

La partida puede prolongarse indefinidamente si se encadenan trayectorias estables con éxito.

Este planteamiento refuerza la idea de trayectoria única y de error como evento definitivo, en contraste con modelos arcade tradicionales basados en repetición inmediata.

🧠 Fundamentos y referencias

El sistema físico se basa en una versión simplificada de la ley de gravitación, inspirada en los principios explicados en:

The Nature of Code — Daniel Shiffman

A partir de esta base, el proyecto amplía un sketch inicial de atracción entre partículas hasta convertirlo en una experiencia lúdica completa, incorporando:

Diseño de niveles procedural

Gestión de estados de juego

Sistema de puntuación acumulativa

Audio reactivo y transiciones sonoras

Interfaces claras y no intrusivas

🖥️ Tecnologías utilizadas

p5.js — motor gráfico y de interacción

p5.sound.js — gestión de audio en entorno web

JavaScript (ES6 modules) — arquitectura modular

HTML5 / Canvas — ejecución en navegador

El juego está diseñado para funcionar tanto en desktop como en dispositivos móviles, con un sistema de entrada adaptado a teclado, ratón y pantalla táctil.

📱 Compatibilidad y control
Desktop

Flechas del teclado: aplicar impulsos

Espacio: pausa

Teclado completo para interacción en menús

Móvil

Toque en pantalla para iniciar y desbloquear audio

Controles táctiles integrados

Interfaz adaptativa y responsive

🔊 Audio

El audio forma parte activa de la experiencia:

Música de inicio y ambiente con transición suave

Sonidos de empuje, colisión y victoria

Gestión de “fade in / fade out” entre estados

Cumple las restricciones de reproducción de audio en navegadores móviles

Toda la lógica sonora está encapsulada en un módulo específico (AudioManager) para mantener el código desacoplado y legible.
