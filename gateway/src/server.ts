import express, { Application, json } from "express";
import { createServer, Server as HTTPServer } from "http";
import path from "path";
import Redis from 'ioredis';
import JSONCache from 'redis-json';
import { Room } from "./room";
import { User } from "./user";
import { v4 as uuidv4 } from 'uuid';
import { SignalServerInfo } from "./signalServerInfo";

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private db: Redis.Redis;

    private readonly DEFAULT_PORT = 4050;

    private signalServers: JSONCache<Array<SignalServerInfo>>;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.db = new Redis();
        this.signalServers = new JSONCache(this.db, { prefix: 'cache:' });

        this.configureApp();
        this.configureRoutes();
    }

    private configureApp(): void {
        this.app.use(express.static(path.join(__dirname, "../public")));
    }
    private async GetLowestSignalServerInfo() {
        var servers = await this.signalServers.get("signalServers");
        var lowest = servers[0];
        for (var server of servers) {
            if (server.clients < lowest.clients) lowest = server;
        }
        return lowest;
    }
    private configureRoutes(): void {
        this.app.get("/", (req, res) => {
            res.sendFile("index.html");
        });
        this.app.post('/gateway/room', async (req, res) => {
            //Create a new room

        })
        this.app.get("/gateway/room/:roomId", (req, res) => {
            res.sendFile("index.html");
        });
    }

    public listen(callback: (port: number) => void, desiredPort?: number): void {
        let _port = desiredPort;
        if (!desiredPort) _port = this.DEFAULT_PORT;
        this.httpServer.listen(_port, () => {
            callback(_port);
        });
    }
}
