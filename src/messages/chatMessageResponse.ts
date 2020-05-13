export class ChatMessageResponse {
    public user: string;
    public message: string;

    constructor(_user: string, _message: string) {
        this.user = _user;
        this.message = _message;
    }
}