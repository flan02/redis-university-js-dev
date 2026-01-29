# Mapeo de Estructuras de Datos Redis a Resultados en JavaScript

|Estructura Redis | Comando Común|Resultado en JS                                                             |
|-----------------|--------------|----------------------------------------------------------------------------|
|Hash             |  HGETALL     |  Object (llave-valor)                                                      |
|Set              |  SMEMBERS    |  Array of strings                                                          |
|List             |  LRANGE      |  Array of strings                                                          |
|Sorted Set       |  ZRANGE      |  Array of strings (o de objetos si usas WITHSCORES en versiones más nuevas)|
|String           |  GET         |  String o Number (dependiendo del contenido)                               |
|Bitmap           |GETBIT/SETBIT |  Number (0 o 1)                                                            |
