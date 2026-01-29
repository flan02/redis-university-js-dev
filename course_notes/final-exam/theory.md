# Redis foundations

## SET vs ZSET

1. El Orden (La diferencia principal)SET: Es una colección desordenada. Los elementos están ahí "flotando". Si pides los miembros con SMEMBERS, Redis te los da en cualquier orden.ZSET (Sorted Set): Es una colección ordenada. Cada elemento tiene un Score (un número flotante) asociado. Redis siempre mantiene los elementos ordenados de menor a mayor score.
2. Los Comandos y la ComplejidadSET: Casi todas las operaciones son $O(1)$ (instantáneas). Usas SADD para agregar y SISMEMBER para ver si alguien está.ZSET: Como Redis tiene que mantener el orden cada vez que agregas algo, la complejidad es $O(\log(N))$. Usas ZADD para agregar. Para ver el orden usas ZRANGE.
3. Casos de Uso (Muy importante para el examen)SET: Úsalo cuando solo necesites saber si algo existe o no y que no se repita.Ejemplo: IDs de usuarios que dieron "Like" a una foto, o etiquetas de un blog.ZSET: Úsalo cuando necesites un Ranking o Leaderboard.Ejemplo: Una tabla de posiciones de un videojuego (Score = puntos) o una lista de tareas priorizadas (Score = nivel de prioridad).

## El Duelo del Orden: SET vs ZSET

SET: Colección de strings únicas, sin orden. Ideal para "pertenencia" (¿Está este usuario en el grupo?).
ZSET (Sorted Set): Cada miembro tiene un Score. Redis los mantiene ordenados automáticamente.

Dato clave: Si haces un ZADD de alguien que ya existe con un score nuevo, Redis lo mueve a su nueva posición. No hay duplicados, solo actualizaciones de ranking.
Pero recordá siempre esta regla de oro para el examen: En un ZSET, el score manda. Si el score de un elemento cambia, su "ranking" (posición) se recalcula inmediatamente

## El Duelo de la Atomicidad: MULTI vs BATCH (Pipeline)

¿Por qué la a (MULTI) NO permite comandos en el medio?
Cuando ejecutas un MULTI, Redis entra en un estado especial. Todos los comandos que mandas se ponen en una cola interna del servidor. Cuando tiras el EXEC, Redis dice: "Permiso, ahora me toca a mí", y ejecuta toda la secuencia sin dejar que nadie más se meta.

Es una transacción atómica. Si un comando de otro usuario llega justo en ese microsegundo, Redis lo hace esperar a que termine el EXEC. Por eso, en la función a, nunca verás otro comando corriendo entre el LPUSH y el INCR.

¿Por qué la b (BATCH) SÍ permite comandos en el medio?
Como vimos antes, el batch (pipelining) es solo una mejora de transporte. Es como mandar 10 cartas en un mismo sobre para ahorrar estampillas.

Cuando el sobre llega al servidor, Redis saca las 10 cartas y las procesa una por una como si hubieran llegado por separado.

El riesgo: Mientras Redis termina de procesar tu primera carta (LPUSH) y se dispone a leer la segunda (INCR), el bucle de eventos de Redis puede decir: "Ah, mirá, acá llegó un comando de otro usuario, lo meto ahora".

Entonces, el orden de ejecución en el servidor podría terminar siendo:

Tu LPUSH

Un SET de otro usuario (que se metió en el medio)

Tu INCR

Resumen para el examen:
¿Garantiza que NO se metan otros comandos? → MULTI (Función A).

¿PERMITE que otros comandos se metan en el medio? → BATCH (Función B).

Ojo: La pregunta te está pidiendo identificar cuál es la que permite esa interferencia. Por eso la respuesta es la b. Si eligieras las dos, estarías diciendo que el MULTI no es atómico, y eso es un error grave en la teoría de Redis.

### Remarks

Un consejo para tus notas:Anotá siempre la Complejidad Temporal ($O(1)$, $O(N)$, etc.). En el mundo de Redis, el rendimiento es el rey, y saber que LLEN es $O(1)$ mientras que LRANGE es $O(N)$ es lo que te permite ganar discusiones técnicas con fundamentos
