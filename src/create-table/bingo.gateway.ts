import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Configura CORS si es necesario
export class BingoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server; // Aseguramos que `server` está tipado como `Server`

  private balls: Set<number> = new Set(); // Almacena los números generados
  private intervalId: NodeJS.Timeout;

  private players: string[] = [];  // Lista de jugadores en el lobby
  private readonly MAX_PLAYERS = 2; // Número máximo de jugadores en el juego

  afterInit() {
    console.log('Gateway initialized');
    this.startBallDrawing(); // Inicia el sorteo de bolas al iniciar el servidor
  }

  // Función para iniciar el sorteo de bolas
  startBallDrawing() {
    this.intervalId = setInterval(() => {
      const ball = this.generateRandomBall();
      if (ball !== null) {
        this.server.emit('ballDrawn', ball); // Envía el número generado a todos los clientes
      } else {
        clearInterval(this.intervalId); // Detiene el intervalo si se agotaron las bolas
      }
    }, 5000); // 5000 ms = 5 segundos
  }

  // Genera un número aleatorio entre 1 y 75, sin repeticiones
  generateRandomBall(): number | null {
    if (this.balls.size >= 75) {
      return null; // Si ya se generaron los 75 números, detén la generación
    }

    let ball: number;
    do {
      ball = Math.floor(Math.random() * 75) + 1; // Genera un número entre 1 y 75
    } while (this.balls.has(ball)); // Asegúrate de no repetir números

    this.balls.add(ball); // Añade el número al conjunto de bolas ya sacadas
    // console.log(this.balls);
    return ball;
  }

  // Este método se llama cuando un cliente se conecta
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Este método se llama cuando un cliente se desconecta
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    // Si un jugador se desconecta, lo eliminamos del lobby
    const index = this.players.findIndex(player => player === client.id);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

  // Este método es para emitir cuando alguien gana el juego
  notifyAllPlayers(winner: string) {
    this.server.emit('gameOver', winner);
  }

  // Método para que los jugadores se unan al lobby
  @SubscribeMessage('joinLobby')
  handleJoinLobby(client: Socket, username: string): void {
    console.log(`${username} se ha unido al lobby.`);
    this.players.push(username); // Agrega al jugador al lobby

    this.server.emit('lobbyUpdate', { players: this.players });

    // Si el número máximo de jugadores está en el lobby, comenzamos el juego
    if (this.players.length === this.MAX_PLAYERS) {
      this.server.emit('gameStart', { message: 'El juego ha comenzado!' });
    } else {
      // Iniciar temporizador de 30 segundos si no se alcanzaron los jugadores
      setTimeout(() => {
        if (this.players.length < this.MAX_PLAYERS) {
          this.server.emit('gameStart', { message: 'El tiempo se agotó, comenzando el juego con 1 jugador...' });
        }
      }, 30000); // 30 segundos de espera
    }
  }

  // Este método puede ser llamado para comenzar el juego
  @SubscribeMessage('startGame')
  handleStartGame(client: Socket): void {
    this.server.emit('gameStart', { message: 'El juego ha comenzado con los jugadores disponibles.' });
  }
}
