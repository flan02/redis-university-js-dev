# Redis commands that can break your redis performance

Vamos a desarmar el porqué, comparando las complejidades de cada uno. Es un tema de **$O(1)$** vs **$O(N)$**.¿Por qué HGETALL es el peligroso?El comando HGETALL tiene una complejidad de $O(N)$, donde $N$ es el número de campos en el Hash.El Riesgo: Si tenés un Hash con miles o millones de campos (algo común si no se diseña bien), Redis tiene que bloquear el hilo principal para recolectar todos los campos y valores, empaquetarlos y mandarlos por la red.

El impacto: Como ya sabés, Redis es single-threaded. Mientras hace ese HGETALL gigante, nadie más puede usar la base de datos.¿Por qué los otros son más seguros?xaddAsync() ($O(1)$ o $O(\log(N))$): Agregar un mensaje a un Stream es extremadamente rápido. Redis solo lo concatena al final del log.zaddAsync() ($O(\log(N))$):

Aunque tiene que ordenar, el costo es logarítmico. Es muy eficiente incluso con millones de elementos.scardAsync() ($O(1)$): Redis guarda el contador de elementos de un Set en memoria.

Responder cuántos hay es instantáneo, no importa si el Set tiene 10 o 10 millones de miembros.Resumen de "Comandos Peligrosos" para tus notas:En el examen, siempre que te pregunten por problemas de performance, buscá los comandos que intentan traer "Todo" de una estructura:

Hashes: HGETALL, HKEYS, HVALS.Sets: SMEMBERS.
Lists: LRANGE (cuando el rango es grande, como 0 -1).Keys: KEYS * (el más peligroso de todos).

Tip para el examen:
Si la pregunta es sobre cuál causa problemas, buscá el $O(N)$. Si la pregunta es sobre cuál es el más rápido, buscá el $O(1)$ (como SCARD o GET).¡Ojo con esa, Dan! No te confundas por el hecho de que XADD o ZADD "escriban" datos. En Redis, leer "todo" suele ser mucho más peligroso que escribir un solo dato.

¿Te queda claro por qué el HGETALL es el que se lleva el premio al "rompe-performance"?
