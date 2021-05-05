Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var configserver_1 = require("./configserver");
function setPinValue(pin, val) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, val);
    console.log("Selftest: GPIO " + pin + " set to " + val);
}
function run() {
    configserver_1.requestHandler.push(function (req, res) {
        try {
            var match = void 0;
            // eslint-disable-next-line no-cond-assign
            if ((match = req.path.match(/^\/selftest\/pins\/(\d+)\/([0|1])/))) {
                setPinValue(parseInt(match[1]), parseInt(match[2]));
            }
            res.end();
        }
        catch (error) {
            if (!res.headersWritten) {
                res.setStatus(500);
            }
            if (!res.isEnded) {
                res.end("Error: " + error);
            }
        }
    });
    console.log("Self test initialized.");
}
exports.run = run;
