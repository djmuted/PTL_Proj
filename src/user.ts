export class User {
    public id: string;
    public name: string;

    constructor(_id: string) {
        this.id = _id;
        this.name = "Guest";
    }
}