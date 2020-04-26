import socketEvents = require("socket-events");
import { StringBuffer } from "./stringbuffer";

export interface Esp32JsRequest {
  path: string;
  headers: Headers;
  method: string;
  body: string | null;
}

export interface Esp32JsResponse {
  on: (event: "end", cb: () => void) => void;
  flush: () => void;
  setStatus: (status: number, statusText?: string) => void;
  write: (data?: string | Uint8Array) => void;
  end: (data?: string) => void;
  status: { status: number; statusText: string };
  isEnded: boolean;
  statusWritten: boolean;
  headersWritten: boolean;
  headers: Headers;
}

const sockListen = socketEvents.sockListen;
const sockConnect = socketEvents.sockConnect;
const closeSocket = socketEvents.closeSocket;

function parseHeaders(complete: StringBuffer, endOfHeaders: number) {
  const headersRaw = complete.substring(0, endOfHeaders).toString();
  const headerTokens = headersRaw.split("\r\n");
  const statusLine = headerTokens.shift();
  const headers: Headers = new Headers();
  headerTokens.forEach(function (headerLine) {
    const delim = headerLine.indexOf(":");
    if (delim >= 0) {
      headers.append(
        headerLine.substring(0, delim).trim(),
        headerLine.substring(delim + 1).trim()
      );
    }
  });
  return {
    statusLine,
    headers,
  };
}

class EventEmitter {
  private listener: { [event: string]: (() => void)[] } = {};
  public on(event: string, cb: () => void) {
    (this.listener[event] = this.listener[event] || []).push(cb);
  }
  public emit(event: string) {
    console.debug(`Event ${event} emitted: `);
    const eventListener = this.listener[event];
    if (Array.isArray(eventListener)) {
      console.debug(`${eventListener.length} listeners active.`);
      eventListener.forEach((cb) => setTimeout(cb, 0));
    }
  }
}

export function httpServer(
  port: string | number,
  isSSL: boolean,
  cb: (req: Esp32JsRequest, res: Esp32JsResponse) => void
): void {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  sockListen(
    port,
    function (socket) {
      let requestCounter = 0;
      let complete: StringBuffer | null = null;
      let contentLength = 0;
      let headers: Headers | undefined;
      let statusLine: string | undefined;
      let gotten = 0;
      const active: { req: Esp32JsRequest; res: Esp32JsResponse }[] = [];

      socket.onData = function (data: string, _: number, length: number) {
        complete = complete ? complete.append(data) : new StringBuffer(data);
        gotten += length;

        const endOfHeaders = complete.indexOf("\r\n\r\n");
        if (gotten >= 4 && endOfHeaders >= 0) {
          if (!headers) {
            const parsed = parseHeaders(complete, endOfHeaders);
            statusLine = parsed.statusLine;
            headers = parsed.headers;
            requestCounter++;
            console.debug(
              `Request on socket ${socket.sockfd}: ${statusLine}, requestCounter:${requestCounter}`
            );
          }

          let postedData = null;

          const contentLengthHeader = headers.get("content-length");
          if (typeof contentLengthHeader === "string") {
            contentLength = parseInt(contentLengthHeader);
          }

          if (contentLength > 0) {
            console.debug("A request body is expected.");

            if (gotten >= endOfHeaders + 4 + contentLength) {
              const potentialRequestBody = textEncoder.encode(
                complete.substring(endOfHeaders + 4).toString()
              );
              postedData = textDecoder.decode(
                potentialRequestBody.subarray(0, contentLength)
              );
              console.debug("Request body is complete:");
              console.debug(postedData);
            } else {
              //wait for more data to come (body of  a POST request)
              console.debug("Waiting for more data to come:");
              console.debug(contentLength);
              console.debug(complete.length);
              console.debug(gotten);
              console.debug(endOfHeaders);
              return;
            }
          }

          if (statusLine) {
            const startOfPath = statusLine.indexOf(" ");
            const path = statusLine.substring(
              startOfPath + 1,
              statusLine.indexOf(" ", startOfPath + 1)
            );
            const method = complete.substring(0, startOfPath).toString();

            const req: Esp32JsRequest = {
              method: method,
              path: path,
              body: postedData,
              headers,
            };

            const eventEmitter = new EventEmitter();
            const responseHeaders = new Headers();
            let chunkedEncoding = false;

            const isConnectionClose = function () {
              let close = false;
              if (!close && headers && headers.get("connection") === "close") {
                close = true;
              }

              if (
                !close &&
                responseHeaders &&
                responseHeaders.get("transfer-encoding") !== "chunked" &&
                !responseHeaders.has("content-length")
              ) {
                close = true;
              }

              if (
                !close &&
                responseHeaders &&
                responseHeaders.get("connection") === "close"
              ) {
                close = true;
              }

              return close;
            };

            const chunked = function () {
              let chunked = true;
              if (chunked && headers && headers.get("connection") === "close") {
                chunked = false;
              }

              if (
                chunked &&
                responseHeaders &&
                ((responseHeaders.has("transfer-encoding") &&
                  responseHeaders.get("transfer-encoding") !== "chunked") ||
                  responseHeaders.has("content-length"))
              ) {
                chunked = false;
              }

              if (
                chunked &&
                responseHeaders &&
                responseHeaders.get("connection") === "close"
              ) {
                chunked = false;
              }

              return chunked;
            };

            // initialize response
            const res: Esp32JsResponse = {
              headers: responseHeaders,
              isEnded: false,
              statusWritten: false,
              headersWritten: false,
              status: { status: 200, statusText: "OK" },
              on: function (event, cb) {
                eventEmitter.on(event, cb);
              },
              flush: function () {
                socket.flush();
              },
              setStatus: function (status, statusText) {
                res.status.status = status;
                if (statusText) {
                  res.status.statusText = statusText;
                }
              },
              write: function (data) {
                if (res.isEnded) {
                  throw Error("request has already ended");
                }
                if (!res.statusWritten) {
                  res.statusWritten = true;
                  socket.write(
                    `HTTP/1.1 ${res.status.status} ${res.status.statusText}\r\n`
                  );
                }
                if (!res.headersWritten) {
                  if (chunked()) {
                    responseHeaders.set("transfer-encoding", "chunked");
                    chunkedEncoding = true;
                  }
                  if (isConnectionClose()) {
                    responseHeaders.set("connection", "close");
                  }
                  if (!responseHeaders.has("connection")) {
                    responseHeaders.set("connection", "keep-alive");
                    socket.setReadTimeout(20000);
                  }
                  const contentType = responseHeaders.get("content-type");
                  if (typeof contentType !== "string") {
                    responseHeaders.set(
                      "content-type",
                      "text/plain; charset=utf-8"
                    );
                  } else if (contentType.indexOf("charset") < 0) {
                    responseHeaders.set(
                      "content-type",
                      `${contentType}; charset=utf-8`
                    );
                  }

                  res.headersWritten = true;
                  responseHeaders.forEach((value, key) => {
                    socket.write(`${key}: ${value}\r\n`);
                  });
                  socket.write(`\r\n`);
                }
                if (typeof data !== "undefined" && data.length > 0) {
                  if (chunkedEncoding) {
                    const encoded =
                      typeof data === "string"
                        ? textEncoder.encode(data)
                        : data;
                    socket.write(`${encoded.length.toString(16)}\r\n`);
                  }
                  if (data) {
                    socket.write(data);
                  }
                  if (chunkedEncoding) {
                    socket.write(`\r\n`);
                    //socket.flush();
                  }
                }
              },
              end: function (data) {
                res.write(data);
                if (chunkedEncoding) {
                  socket.write(`0\r\n`);
                  socket.write(`\r\n`);
                }
                socket.flush(function () {
                  if (isConnectionClose()) {
                    console.debug(`Socket ${socket.sockfd} closed.`);
                    closeSocket(socket.sockfd);
                  }
                  res.isEnded = true;
                  eventEmitter.emit("end");
                });
              },
            };

            // reset state for keep alive connections getting more requests
            // on the same socket
            complete = complete.substring(endOfHeaders + 4 + contentLength);
            gotten = gotten - endOfHeaders - 4 - contentLength;
            contentLength = 0;
            headers = undefined;
            statusLine = undefined;

            console.debug(`gotten: ${gotten}`);
            console.debug(`complete.length: ${complete.length}`);

            const item = { req, res };
            const num = active.push(item);
            console.debug(`Currently active requests: ${num}`);
            res.on("end", () => {
              console.debug("splicing req/res form active list");
              active.splice(active.indexOf(item), 1);
            });

            const previous = num - 2;
            if (previous < 0 || active[previous].res.isEnded) {
              // active request/response is empty, perform immediately
              console.debug(
                "// active request/response is empty or entries are ended, perform immediately"
              );
              setTimeout(() => {
                console.debug("perform immediate");
                cb(req, res);
              }, 0);
            } else {
              // queue request/response callback after previous request/response
              console.debug(
                "// queue request/response callback after previous request/response"
              );
              active[previous].res.on("end", () => {
                console.debug(
                  "end of previous req/res: triggering new req/res callback"
                );
                cb(req, res);
              });
            }

            if (gotten > 0 && socket.onData) {
              socket.onData("", _, 0);
            }
          }
        }
      };
      socket.onError = function (sockfd) {
        console.error("NEW SOCK: ON ERROR: " + sockfd);
      };
    },
    function (sockfd) {
      console.error("ON ERROR: Socket " + sockfd);
    },
    function () {
      console.info("SOCKET WAS CLOSED!");
    },
    isSSL
  );
}

export function decodeQueryParam(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, "%20"));
}

export function parseQueryStr(query: string | null): { [key: string]: string } {
  const parsed: { [key: string]: string } = {};
  if (query) {
    const keyValues = query.split("&");
    keyValues.forEach(function (val) {
      const splitted = val.split("=");
      parsed[splitted[0]] =
        splitted.length > 1 ? decodeQueryParam(splitted[1]) : "";
    });
  }
  return parsed;
}

export function httpClient(
  ssl: boolean,
  host: string,
  port: string,
  path: string,
  method: string,
  requestHeaders?: string,
  body?: { toString: () => string },
  successCB?: (content: string, headers: string) => void,
  errorCB?: (message: string) => void,
  finishCB?: () => void
): void {
  const complete: StringBuffer = new StringBuffer();
  let completeLength = 0;
  let chunked = false;
  let headerRead = false;
  let headerEnd = -1;
  let contentLength = -1;
  requestHeaders = requestHeaders || "";
  if (!errorCB) {
    errorCB = print;
  }

  sockConnect(
    ssl,
    host,
    port,
    function (socket) {
      const bodyStr = body ? body.toString() : null;

      const requestLines = `${method} ${path} HTTP/1.1\r\nHost: ${host}\r\n${
        bodyStr ? `Content-length: ${bodyStr.length}\r\n` : ""
      }${requestHeaders}\r\n${bodyStr ? bodyStr + "\r\n" : ""}`;

      socket.write(requestLines);
      socket.flush();
    },
    function (data, sockfd, length) {
      complete.append(data);
      completeLength = completeLength + length;

      if (!headerRead && (headerEnd = complete.indexOf("\r\n\r\n")) >= 0) {
        headerRead = true;
        chunked =
          complete.toLowerCase().indexOf("transfer-encoding: chunked") >= 0;
        const clIndex = complete.toLowerCase().indexOf("content-length: ");
        if (clIndex >= 0) {
          const endOfContentLength = complete.indexOf("\r\n", clIndex);
          contentLength = parseInt(
            complete.substring(clIndex + 15, endOfContentLength).toString()
          );
        }
        headerEnd += 4;
      }

      if (chunked) {
        if (complete.substring(complete.length - 5).toString() == "0\r\n\r\n") {
          closeSocket(sockfd);
        }
      }
      if (contentLength >= 0) {
        if (completeLength - headerEnd == contentLength) {
          closeSocket(sockfd);
        }
      }
    },
    function () {
      if (errorCB) {
        errorCB(
          `Could not load ${ssl ? "https" : "http"}://${host}:${port}${path}`
        );
      }
    },
    function () {
      let startFrom = headerEnd;
      let content = null;

      if (chunked) {
        content = new StringBuffer();

        let chunkLength;
        do {
          const chunkLengthEnd = complete.indexOf("\r\n", startFrom);
          const lengthStr = complete
            .substring(startFrom, chunkLengthEnd)
            .toString();
          chunkLength = parseInt(lengthStr, 16);
          const chunkEnd = chunkLengthEnd + chunkLength + 2;

          content.append(complete.substring(chunkLengthEnd + 2, chunkEnd));
          startFrom = chunkEnd + 2;
        } while (chunkLength > 0);
      } else {
        content = complete.substring(startFrom);
      }

      const headers = complete.substring(0, headerEnd);

      if (successCB) {
        successCB(content.toString(), headers.toString());
      }
      //free complete for GC
      content = null;
      if (finishCB) {
        finishCB();
      }
    }
  );
}

export class XMLHttpRequest {
  private url?: AnchorElement;
  private method = "GET";
  private reponseHeaders?: string;
  private requestHeaders?: StringBuffer;
  private status?: number;
  private statusText?: string;
  private responseURL?: string;
  private responseText?: string;

  public onerror?: (error: string) => void;
  public onload?: () => void;

  public send(body: string): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    if (this.url) {
      httpClient(
        this.url.protocol === "https:",
        this.url.hostname,
        this.url.port,
        this.url.pathname + this.url.search,
        this.method,
        this.requestHeaders ? this.requestHeaders.toString() : undefined,
        body,
        function (data: string, responseHeaders: string) {
          const r = responseHeaders.match(/^HTTP\/[0-9.]+ ([0-9]+) (.*)/);
          if (r) {
            self.status = parseInt(r[1], 10);
            self.statusText = r[2];
            self.responseURL = "";
            self.responseText = data;
            self.reponseHeaders = responseHeaders.substring(r[0].length + 2);
            if (self.onload) {
              self.onload();
            }
          } else {
            if (self.onerror) {
              self.onerror("Bad http status line.");
            }
          }
        },
        function (error: string) {
          console.error(error);
          if (self.onerror) {
            self.onerror(error);
          }
        }
      );
    } else {
      if (self.onerror) {
        self.onerror("Url unset.");
      }
    }
  }

  public getAllResponseHeaders(): string | undefined {
    return this.reponseHeaders;
  }

  public open(method: string, url: string): void {
    this.method = method;
    this.url = urlparse(url);

    // check protocol
    if (this.url.protocol !== "http:" && this.url.protocol !== "https:") {
      throw Error(
        `Unsupported protocol for esp32 fetch implementation: ${this.url.protocol}`
      );
    }

    // get default port
    let port = parseInt(this.url.port, 10);
    if (isNaN(port)) {
      if (this.url.protocol === "https:") {
        port = 443;
      } else if (this.url.protocol === "http:") {
        port = 80;
      } else {
        throw Error(
          `Cannot determine default port for protocol ${this.url.protocol}`
        );
      }
    }
    this.url.port = "" + port;
  }

  public setRequestHeader(name: string, value: string): void {
    this.requestHeaders = this.requestHeaders || new StringBuffer();
    this.requestHeaders.append(name).append(": ").append(value).append("\r\n");
  }
}
