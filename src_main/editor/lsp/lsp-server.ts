import * as http from "http";
import * as ws from "ws";
import * as rpc from "vscode-ws-jsonrpc";
import * as rpcServer from "vscode-ws-jsonrpc/lib/server";
// import { getPortPromise } from "portfinder";

interface languageServer {
  command: string[];
}
let languageServers: { [key: string]: languageServer } = {
  cpp: { command: ["/opt/homebrew/opt/llvm/bin/clangd", "--pretty"] },
};

export async function LSPsetup() {
  // const serverPort: number = await getPortPromise({
  //   port: 49154,
  //   stopPort: 65535,
  // });
  const serverPort = 49154;
  const wss = new ws.Server(
    {
      port: serverPort,
      perMessageDeflate: false,
    },
    () => {
      console.log(`LSP Server is ready with port:${serverPort}`);
    }
  );

  function toSocket(webSocket: any): rpc.IWebSocket {
    return {
      send: (content) => webSocket.send(content),
      onMessage: (cb) => (webSocket.onmessage = (event: any) => cb(event.data)),
      onError: (cb) =>
        (webSocket.onerror = (event: any) => {
          if ("message" in event) {
            cb((event as any).message);
          }
        }),
      onClose: (cb) =>
        (webSocket.onclose = (event: any) => cb(event.code, event.reason)),
      dispose: () => webSocket.close(),
    };
  }

  wss.on("connection", (client: any, request: http.IncomingMessage) => {
    const urlList = Object.keys(languageServers).map((arg) => "/" + arg);
    const selectLang = request.url?.slice(1);
    if (selectLang && selectLang in urlList) {
      console.error("Invalid language server", request.url);
      client.close();
      return;
    }
    if (selectLang) {
      let localConnection = rpcServer.createServerProcess(
        "LSP",
        languageServers[selectLang].command[0],
        languageServers[selectLang].command.slice(1)
      );
      let socket: rpc.IWebSocket = toSocket(client);
      let connection = rpcServer.createWebSocketConnection(socket);
      rpcServer.forward(connection, localConnection);
      console.log(`Forwarding new client`);
      socket.onClose((code, reason) => {
        console.log("Client closed", reason);
        localConnection.dispose();
      });
    }
  });
  function close() {
    wss.close();
  }
  return close;
}
