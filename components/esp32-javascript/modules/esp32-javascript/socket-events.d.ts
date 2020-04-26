declare module "socket-events" {
  interface Esp32JsSocket {
    sockfd: number;
    onData: (data: string) => void;
    onError: (sockfd: number) => void;
    flush(cb?: () => void): void;
    write(data: string): void;
  }
  function sockListen(
    port: number,
    onAccept: (socket: Esp32JsSocket) => void,
    onError: (sockfd: number) => void,
    onClose: (sockfd: number) => void,
    isSSL: boolean
  ): void;

  function sockConnect(
    ssl: boolean,
    host: string,
    port: string,
    onConnect: (socket: Esp32JsSocket) => void,
    onData: (data: string, sockfd: number, length: number) => void,
    onError: (sockfd: number) => void,
    onClose: () => void
  ): Esp32JsSocket;

  function closeSocket(sockfd: number): void;
}
