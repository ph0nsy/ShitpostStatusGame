# Proyectos_2-UFV
Desarrollo de un juego online por turnos para la asignatura de Proyectos 2 en la Universidad Francisco de Vitoria.

## Tecnologías

+ [HTML5](https://www.w3schools.com/html/)
+ [JavaScript](https://www.javascript.com/)
+ [Phaser.io](https://phaser.io/ "Librería de Game Development")
+ [Node.JS](https://nodejs.org/en/ "Servidor")
+ [Socket.io](https://socket.io/ "Conexión con la Base de Datos")
+ [MySQL](https://www.mysql.com/ "Base de Datos")
+ [GitHub](github.com "Repositorio del proyecto")
+ [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/ "Planeadore de Scrum")

## Diseño

### Introducción
Descripción

### Historias de Usuario

**Registro e Inicio de Sesión**
El jugador deberá poder registrar su usuario y contraseña
El nombre del jugador deberá ser único
La sesión deberá iniciarse automáticamente después del que el jugador se haya registrado

**Pantalla de inicio**
El jugador deberá poder cambiar su avatar entre una lista de avatares predeterminados
El jugador podrá cambiar su nombre de jugador (pero no el nombre de su cuenta)
El jugador deberá poder ver una lista con los amigos que ha añadido
El jugador deberá poder ver una lista de las cartas que existen en el juego
El jugador deberá poder ver una lista de los mazos que tiene disponibles a elegir
El jugador deberá poder cambiar el mazo elegido
El jugador deberá poder ver una lista de las cartas que hay en un mazo
El jugador deberá poder buscar partida online desde la pantalla de inicio
El jugador deberá poder iniciar una partida offline contra una IA desde la pantalla de inicio
El jugador deberá poder crear partidas personalizadas mediante un código generado por el ordenador
El jugador podrá añadir amigos a la lista según su ID de jugador
El jugador podrá ver (pero no cambiar) su ID de jugador

**Partida Online**
Cada jugador tendrá un número de acciones que podrán realizar en un turno
El jugador deberá poder ver el número de cartas que tiene el enemigo
El jugador deberá poder ver el número de cartas que le quedan al mazo del enemigo
El jugador deberá poder ver el número de cartas que le quedan a su mazo
El jugador deberá poder ver las cartas de su mano
El jugador deberá poder jugar sus cartas y (si es necesario) seleccionar un objetivo
El jugador ganará un número de costes de acción fijos por turno
Los costes de acción son acumulables

**IA Offline**
La IA elegirá jugar cartas al azar de un mazo personalizado y (si es necesario) seleccionar un objetivo al azar en función al coste de acción

**Sistemas**
Las información de las cartas vendrá dada por un archivo json que describirá todas sus características
Las cartas podrán ser de tipo ataque
Las cartas podrán ser de tipo ataque futuro
Las cartas podrán ser de tipo trampa estatus
Las cartas podrán ser de tipo trampa ataque
Las cartas podrán ser de tipo curación
Las cartas podrán ser de tipo defensa
Las cartas podrán ser de tipo devolver daño
Las cartas podrán ser de tipo estatus negativo
Las cartas podrán ser de tipo estatus daño
Las cartas podrán ser de tipo estatus defensa
Las cartas podrán ser de tipo estatus curación
Las cartas tendrán valores que determinarán la potencia de la misma
Las cartas tendrán un coste de acción

### Diseño de la Base de Datos
Descripción

#### Tablas

**Tabla x**


**Tabla x**


**Tabla x**


**Tabla x**


### Diseño de las Pantallas
Descripción

#### Registro / Inicio de Sesión
Descripción

#### Cliente principal
Descripción

#### Juego Online
Descripción

#### Juego Offline
Descripción

