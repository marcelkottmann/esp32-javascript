Object.defineProperty(exports, "__esModule", { value: true });
exports.createChunkedEncodingConsumer = void 0;
var READ_CR = 0;
var READ_LF = 1;
var READ_LEN = 2;
var READ_PAYL = 3;
var FINISHED = 4;
function assertTransferChunked(test, message) {
    if (!test) {
        throw Error("Invalid chunked transfer encoding. Failed test " + message);
    }
}
function createChunkedEncodingConsumer(onData) {
    var state = READ_LEN;
    var tempLen = 0;
    var chunkLen = -1;
    var finishing = false;
    return function (data) {
        var p = 0;
        while (p < data.length && state !== FINISHED) {
            /*console.log("s=" + state);
            console.log("p=" + p);
            console.log("cl=" + chunkLen);
            console.log("dl=" + data.length);
      */
            var d = data[p];
            switch (state) {
                case READ_CR:
                    assertTransferChunked(d === 13, "d === 13");
                    state = READ_LF;
                    p++;
                    break;
                case READ_LF:
                    assertTransferChunked(d === 10, "d === 10");
                    if (finishing) {
                        state = FINISHED;
                    }
                    else if (chunkLen == 0) {
                        finishing = true;
                        state = READ_CR;
                    }
                    else if (chunkLen > 0) {
                        state = READ_PAYL;
                    }
                    else {
                        state = READ_LEN;
                    }
                    p++;
                    break;
                case READ_LEN:
                    if (d == 13) {
                        state = READ_CR;
                        chunkLen = tempLen;
                        tempLen = 0;
                        break;
                    }
                    else if (d >= 97 && d <= 102) {
                        // a-f
                        tempLen = tempLen * 16 + (d - 97) + 10;
                    }
                    else if (d >= 65 && d <= 70) {
                        // A-F
                        tempLen = tempLen * 16 + (d - 65) + 10;
                    }
                    else if (d >= 48 && d <= 57) {
                        // 0-9
                        tempLen = tempLen * 16 + (d - 48);
                    }
                    else {
                        assertTransferChunked(false, "Invalid length char: " + d);
                    }
                    //console.log("templen=" + tempLen + "d=" + d);
                    p++;
                    break;
                case READ_PAYL:
                    assertTransferChunked(chunkLen > 0, "chunkLen > 0");
                    if (chunkLen >= data.length - p) {
                        if (onData) {
                            onData(data.subarray(p, data.length));
                        }
                        chunkLen -= data.length - p;
                        p = data.length;
                    }
                    else {
                        if (onData) {
                            onData(data.subarray(p, p + chunkLen));
                        }
                        p += chunkLen;
                        chunkLen = -1;
                        state = READ_CR;
                    }
                    break;
                case FINISHED:
                    return true;
            }
        }
        return state === FINISHED;
    };
}
exports.createChunkedEncodingConsumer = createChunkedEncodingConsumer;
/*

function selftest() {
  let consumer = createChunkedEncodingConsumer();
  console.log(
    consumer(new Uint8Array(["0".charCodeAt(0), 10, 13, 10, 13]), () => {
      throw Error("Should not be called.");
    }) === FINISHED
  );

  consumer = createChunkedEncodingConsumer();
  console.log(
    consumer(
      new Uint8Array([
        "1".charCodeAt(0),
        10,
        13,
        "x".charCodeAt(0),
        10,
        13,
        "0".charCodeAt(0),
        10,
        13,
        10,
        13,
      ]),
      (data: Uint8Array) =>
        console.log(data.length === 1 && data[0] === "x".charCodeAt(0))
    ) === FINISHED
  );

  consumer = createChunkedEncodingConsumer();
  console.log(
    consumer(
      new Uint8Array([
        "0".charCodeAt(0),
        "1".charCodeAt(0),
        10,
        13,
        "x".charCodeAt(0),
        10,
        13,
        "0".charCodeAt(0),
        10,
        13,
        10,
        13,
      ]),
      (data: Uint8Array) =>
        console.log(data.length === 1 && data[0] === "x".charCodeAt(0))
    ) === FINISHED
  );

  consumer = createChunkedEncodingConsumer();
  console.log(
    consumer(
      new Uint8Array([
        "1".charCodeAt(0),
        "a".charCodeAt(0),
        10,
        13,
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        10,
        13,
        "0".charCodeAt(0),
        10,
        13,
        10,
        13,
      ]),
      (data: Uint8Array) =>
        console.log(
          data.length === 26 &&
            data[0] === "x".charCodeAt(0) &&
            data[1] === "y".charCodeAt(0)
        )
    ) === FINISHED
  );

  consumer = createChunkedEncodingConsumer();
  console.log(
    consumer(
      new Uint8Array([
        "1".charCodeAt(0),
        "a".charCodeAt(0),
        10,
        13,
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
        "y".charCodeAt(0),
        "x".charCodeAt(0),
      ]),
      (data: Uint8Array) =>
        console.log(data.length === 25 && data[0] === "x".charCodeAt(0))
    ) === READ_PAYL
  );
  console.log("test");
  console.log(
    consumer(
      new Uint8Array([
        "y".charCodeAt(0),
        10,
        13,
        "0".charCodeAt(0),
        10,
        13,
        10,
        13,
      ]),
      (data: Uint8Array) =>
        console.log(data.length === 1 && data[0] === "y".charCodeAt(0))
    ) === FINISHED
  );
}
selftest();
*/
