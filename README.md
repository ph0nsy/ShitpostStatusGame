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
A continuación veremos todas las cuestiones de diseño que permitirán que la aplicación funciones correctamente. El juego en cuestión será un juego de cartas online que tendrá cartas de diferentes valores y costes que favorecerán una jugabilidad rápida y original

### Historias de Usuario

**Registro e Inicio de Sesión**
+ El jugador deberá poder registrar su usuario y contraseña
+ El nombre del jugador deberá ser único
+ La sesión deberá iniciarse automáticamente después del que el jugador se haya registrado

**Pantalla de inicio**
+ El jugador deberá poder cambiar su avatar entre una lista de avatares predeterminados
+ El jugador podrá cambiar su nombre de jugador (pero no el nombre de su cuenta)
+ El jugador deberá poder ver una lista con los amigos que ha añadido
+ El jugador deberá poder ver una lista de las cartas que existen en el juego
+ El jugador deberá poder ver una lista de los mazos que tiene disponibles a elegir
+ El jugador deberá poder cambiar el mazo elegido
+ El jugador deberá poder ver una lista de las cartas que hay en un mazo
+ El jugador deberá poder buscar partida online desde la pantalla de inicio
+ El jugador deberá poder iniciar una partida offline contra una IA desde la pantalla de inicio
+ El jugador deberá poder crear partidas personalizadas mediante un código generado por el ordenador
+ El jugador deberá poder entrar en partidas personalizadas mediante introducir un código dado por otro jugador
+ El jugador podrá añadir amigos a la lista según su ID de jugador
+ El jugador podrá ver (pero no cambiar) su ID de jugador

**Partida Online**
+ Cada jugador tendrá un número de acciones que podrán realizar en un turno
+ El jugador deberá poder ver el número de cartas que tiene el enemigo
+ El jugador deberá poder ver el número de cartas que le quedan al mazo del enemigo
+ El jugador deberá poder ver el número de cartas que le quedan a su mazo
+ El jugador deberá poder ver las cartas de su mano
+ El jugador deberá poder jugar sus cartas y (si es necesario) seleccionar un objetivo
+ El jugador ganará un número de costes de acción fijos por turno
+ Los costes de acción son acumulables

**IA Offline**
+ La IA elegirá jugar cartas al azar de un mazo personalizado y (si es necesario) seleccionar un objetivo al azar en función al coste de acción

**Sistemas**
+ Las información de las cartas vendrá dada por un archivo json que describirá todas sus características
+ Las cartas podrán ser de tipo ataque
+ Las cartas podrán ser de tipo ataque futuro
+ Las cartas podrán ser de tipo trampa estatus
+ Las cartas podrán ser de tipo trampa ataque
+ Las cartas podrán ser de tipo curación
+ Las cartas podrán ser de tipo defensa
+ Las cartas podrán ser de tipo devolver daño
+ Las cartas podrán ser de tipo estatus negativo
+ Las cartas podrán ser de tipo estatus daño
+ Las cartas podrán ser de tipo estatus defensa
+ Las cartas podrán ser de tipo estatus curación
+ Las cartas tendrán valores que determinarán la potencia de la misma
+ Las cartas tendrán un coste de acción

**Matchmaking**
+ El sistema deberá poder buscar un jugador que no esté en partida según un booleano
+ El sistema agregará un código de la partida a los 2 jugadores que participan en la misma 
+ El sistemá llevará a ambos jugadores a una partida

**Matchmaking personalizado**
+ El sistema dará un código al jugador, lo llevará a una partida y cambiará el código de partida del jugador
+ El sistema dejará introducir un código al jugador que lo llevará a una partida y cambiará el código del jugador
+ El sistema dará un booleano de en partida cuando ambos jugadores tengan el mismo código de partida e iniciará la partida

### Diseño de la Base de Datos
Descripción

#### Tablas

**Usuario**

- idUser
- char userName
- char password
- image icono
- array idAmigos

**Jugador**

- idJugador
- array idDeck
- array idMano
- id codPartida
- bool partida
- int costeAccion

### Diseño de las Pantallas
A continuación veremos las Pantallas de la aplicación

#### Registro / Inicio de Sesión
Una pantalla inicial para poder tanto iniciar sesión como registrarse.

#### Cliente principal
Entorno base del jugador donde poder comprobar cartas, personalizar su usuario y buscar partidas

#### Juego Online
Entorno en el que vamos a desarrollar las partidas


