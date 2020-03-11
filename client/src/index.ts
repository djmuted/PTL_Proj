import { RedfoxClient } from "./rfxClient/RedfoxClient";

async function Initialize() {
    var rfx = new RedfoxClient('ws://127.0.0.1:81/ws');
    await rfx.Connect();
    await rfx.JoinZone('ptlproj');
    await rfx.JoinRoom('lobby');
}

Initialize();