import { requestHandler } from "./configserver";

function setPinValue(pin: number, val: number): void {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, val);
  console.log("Selftest: GPIO " + pin + " set to " + val);
}

export function run(): void {
  requestHandler.push((req, res) => {
    try {
      let match;
      // eslint-disable-next-line no-cond-assign
      if ((match = req.path.match(/^\/selftest\/pins\/(\d+)\/([0|1])/))) {
        setPinValue(parseInt(match[1]), parseInt(match[2]));
      }
      res.end();
    } catch (error) {
      if (!res.headersWritten) {
        res.setStatus(500);
      }
      if (!res.isEnded) {
        res.end(`Error: ${error}`);
      }
    }
  });
  console.log("Self test initialized.");
}
