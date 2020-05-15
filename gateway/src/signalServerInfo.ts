export class SignalServerInfo {
    public id: string;
    public clients: number;

    constructor(_id: string, _clients: number) {
        this.id = _id;
        this.clients = _clients;
    }
}