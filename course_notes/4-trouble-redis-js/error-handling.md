# Manejo de Errores en Redis con Node.js

## 1. El evento `'error'` es obligatorio

En la versión 3.x, si el cliente de Redis emite un error (como una desconexión o un fallo de red) y tú **no** tienes un listener de `on('error')`, Node.js lanzará una excepción no capturada y **tu aplicación se cerrará (crash)**.

Es lo primero que debes configurar al crear el cliente:

```js
const redis = require('redis');
const client = redis.createClient(config);

client.on('error', (err) => {
    console.error('Error de Redis Client:', err);
    // Aquí podrías enviar el error a un servicio como Sentry o Datadog
});

```

## 2. Reconexión Automática y Estrategia de Reintento

Redis 3.1.2 intenta reconectarse automáticamente por defecto. Pero, ¿qué pasa si el servidor está caído mucho tiempo? Para eso se usa `retry_strategy`.

Esta función te permite decidir qué hacer según el tipo de error:

* **Si devuelves un número:** Es el tiempo de espera en milisegundos antes del próximo intento.
* **Si devuelves un objeto `Error`:** El cliente dejará de intentar reconectarse y cerrará la conexión definitivamente.

```js
const client = redis.createClient({
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // El servidor rechazó la conexión, quizás el host está mal
            return new Error('El servidor rechazó la conexión');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // Dejar de intentar después de 1 hora
            return new Error('Tiempo de reintento agotado');
        }
        // Reintentar en 2 segundos
        return 2000; 
    }
});
```

### 3. Errores de Comandos vs. Errores de Conexión

Es vital distinguir estos dos:

* **Errores de Conexión:** Se capturan en el `client.on('error')`. Afectan a todos los comandos pendientes.
* **Errores de Comando:** (Ej: intentar un `HSET` en una llave que es un `Set`). Como estás usando **Bluebird** para promisificar (`promisifyAll`), estos errores llegan a través del `.catch()` de la promesa o el `try/catch` del `async/await`.

```js
try {
    await client.setAsync('mi_llave', 'valor');
} catch (err) {
    // Este es un error específico de este comando (ej: Read Only en el cluster)
    console.error('Fallo el comando SET:', err);
}
```

### 4. El "Offline Queue" (Cola fuera de línea)

Este es un concepto que confunde a muchos. Por defecto, si el cliente se desconecta, **no tira error inmediatamente** cuando intentas mandar un comando. En su lugar, los guarda en una cola interna (`offline queue`) para ejecutarlos cuando la conexión vuelva.

* **Peligro:** Si la conexión tarda mucho en volver, tu memoria RAM puede empezar a subir porque los comandos se acumulan.
* **Control:** Puedes desactivar esto con `enable_offline_queue: false` en la configuración si prefieres que los comandos fallen rápido si no hay conexión.

---

### Resumen de "Checklist" para tu código

1. **Listener `on('error')**`: Siempre presente para evitar crashes.
2. **`retry_strategy`**: Personalizada para no reintentar eternamente si el error es fatal.
3. **Try/Catch**: Envolviendo tus llamadas `Async` para manejar errores de lógica de Redis.
4. **Verificar Prefijos**: Muchos errores en este curso vienen de usar llaves que no existen o tienen el tipo de dato incorrecto (ej: pedir un `TS.RANGE` a un `Hash`).
