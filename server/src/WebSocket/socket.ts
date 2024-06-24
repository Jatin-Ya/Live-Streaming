import { Http2Server } from 'http2';
import { Server, Socket } from 'socket.io';

const WEBSOCKET_CORS = {
   origin: "*",
//    methods: ["GET", "POST"]
}

class Websocket extends Server {

   private static io: Websocket;

   constructor(httpServer : Http2Server) {
       super(httpServer, {
           cors: WEBSOCKET_CORS
       });
   }

   public static getInstance(httpServer: any): Websocket {

       if (!Websocket.io) {
           Websocket.io = new Websocket(httpServer);
       }

       return Websocket.io;

   }

   public initializeHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach(element => {
        let namespace = Websocket.io.of(element.path, (socket: Socket) => {
            element.handler.handleConnection(socket);
            // socket.on("create-stream",(room: string)=> {
            //     socket.join()
            // })
            
            
        });

        namespace.adapter.on("create-room", (room: string)=> {
            console.log(`room ${room} created`);
        })

        namespace.adapter.on("join-room", (room: string, id: any)=> {
            console.log(`room ${room}, ${id} joined`);
        })

        if (element.handler.middlewareImplementation) {
            namespace.use(element.handler.middlewareImplementation);
        }
    });
}
}

export default Websocket;