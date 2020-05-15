import { KokosClient } from "./kokosClient";

async function Initialize() {
    var rfx = new KokosClient('127.0.0.1:5000');
}

Initialize();