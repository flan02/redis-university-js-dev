# Blocking Commands en Redis con Node.js

## 1. El inicio: queue was empty

Al principio, el **Consumer** (Consumidor) arrancó antes de que hubiera datos. Como es un **Blocking Command** (probablemente `BRPOP`), se quedó esperando. Al no encontrar nada en los primeros intentos (dependiendo de cómo esté configurado el timeout en el script), te avisa que la cola estaba vacía.

## 2. El intercambio: "Pushing" y "Popped"

Aquí es donde ocurre la magia de Redis:

* **Producer: pushing X**: El Productor metió un número en la lista (usando `LPUSH`).
* **Consumer: popped X**: El Consumidor, que estaba bloqueado esperando, detectó el dato al instante, lo sacó de la lista (usando `BRPOP`) y lo procesó.

## 3. El cierre ordenado: "Shutting down"

Fíjate en esta parte:

1. El productor termina de mandar los 20 mensajes y dice: `producer: shutting down`.
2. El consumidor procesa el último: `consumer: popped 20`.
3. El consumidor vuelve a intentar leer, ve que no hay más nada (`queue was empty`), espera un momento y finalmente decide cerrarse también.

---

### ¿Por qué es esto mejor que un simple loop?

Si no usaras un **comando bloqueante**, tendrías que hacer un `while(true)` que le pregunte a Redis cada milisegundo: *"¿Hay datos? ¿Hay datos? ¿Hay datos?"*.

* Eso saturaría tu CPU y tu red.
* Con **Blocking Commands**, el proceso "duerme" y Redis lo "despierta" solo cuando hay trabajo que hacer. Es extremadamente eficiente.

### Una pregunta clave para tu aprendizaje

Si vas a **Redis Insight** ahora mismo y buscas la llave de esa lista (probablemente se llame `queue` o algo similar), **¿qué crees que vas a encontrar?**

> **Respuesta:** La vas a encontrar **vacía** (o ni siquiera va a existir). Esto es porque el consumidor fue "poppeando" (sacando) cada elemento apenas entraba. En Redis, cuando una lista se queda sin elementos, la llave se borra automáticamente.

¿Te gustaría que probemos un ejemplo donde el consumidor tarde más tiempo en procesar para ver cómo la cola empieza a crecer en Redis? Sería un gran ejercicio para entender el **Backpressure** (presión de retroceso)
