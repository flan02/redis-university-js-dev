// - Cheat sheet: Using Redis v-3.1.2 Streams with Node.js

/**
 * REDIS STREAMS - Machete para node-redis v3.1.2
 * Basado en los estándares de Redis University
 */

const redis = require("redis");
const bluebird = require("bluebird");
// En Redis 3.x, se suele usar la librería bluebird para que los comandos devuelvan promesas (Async)

// Promisificamos para usar async/await con la versión 3.x
bluebird.promisifyAll(redis);

const client = redis.createClient({
  // Tus credenciales aquí
});

async function ejemplosStreams() {
  const streamKey = "chat:general";

  // ? 1. XADD: Agregar un mensaje al stream
  // El '*' genera un ID automático (Tiempo-Secuencial)
  // Complejidad: O(1)
  const msgId = await client.xaddAsync(
    streamKey,
    "*",
    "usuario",
    "Cristian",
    "mensaje",
    "Azul como el mar azul",
    "timestamp",
    Date.now(),
  );
  console.log(`Mensaje guardado con ID: ${msgId}`);

  // ? 2. XLEN: Saber cuántos mensajes hay en el stream
  // Complejidad: O(1)
  const cantidad = await client.xlenAsync(streamKey);
  console.log(`El stream tiene ${cantidad} mensajes.`);

  // ? 3. XRANGE: Leer un rango de mensajes (como LRANGE en listas)
  // '-' significa el inicio, '+' el final.
  // Complejidad: O(n) - Cuidado con streams gigantes
  const mensajes = await client.xrangeAsync(streamKey, "-", "+");
  console.log("Todos los mensajes:", mensajes);

  // ? 4. XREAD: Leer mensajes nuevos (Modo Escucha)
  // 'STREAMS chat:general 0' lee desde el principio
  // 'STREAMS chat:general $' lee solo lo que entre a partir de AHORA
  const nuevos = await client.xreadAsync("STREAMS", streamKey, "0");
  console.log("Leído con XREAD:", nuevos);

  // ? 5. CONSUMER GROUPS (La Joya de la Corona)
  // Creamos un grupo llamado 'soporte' para procesar mensajes
  // El '$' indica que el grupo empezará a leer mensajes nuevos
  try {
    await client.xgroupAsync(
      "CREATE",
      streamKey,
      "grupo-soporte",
      "$",
      "MKSTREAM",
    );
  } catch (err) {
    console.log("El grupo ya existe o hubo un error");
  }

  // ? XREADGROUP: Leer como un miembro del grupo
  // Esto asegura que si tienes 3 workers, Redis reparta un mensaje a cada uno
  const mensajesGrupo = await client.xreadgroupAsync(
    "GROUP",
    "grupo-soporte",
    "worker-1",
    "COUNT",
    "1",
    "STREAMS",
    streamKey,
    ">",
  );

  // ? 6. XACK: Confirmar que procesaste el mensaje
  // Si no tiras XACK, Redis cree que el mensaje falló y lo reintenta
  if (mensajesGrupo) {
    const idParaConfirmar = mensajesGrupo[0][1][0][0];
    await client.xackAsync(streamKey, "grupo-soporte", idParaConfirmar);
    console.log(`Mensaje ${idParaConfirmar} confirmado (ACK)`);
  }
}

ejemplosStreams().catch(console.error);
