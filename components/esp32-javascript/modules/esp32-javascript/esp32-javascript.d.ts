declare var KEY_BUILTIN: number;
declare var LED_BUILTIN: number;

declare var INPUT: number;
declare var OUTPUT: number;

declare var errorhandler: (error: Error) => void;

declare function pinMode(pin: number, direction: number): void;
declare function digitalWrite(pin: number, value: number): void;
declare function digitalRead(pin: number): number;
declare function stopWifi(): void;

declare function el_load(key: string): string;
declare function el_store(key: string, value: string): void;

declare function setDateTimeInMillis(time: number): void;
declare function setDateTimeZoneOffsetInHours(hours: number): void;

interface Esp32JsDefaultConfig {
  basicAuthUsername?: string;
  basicAuthPassword?: string;
}

declare function getDefaultConfig(): Esp32JsDefaultConfig;
declare function restart(): void;

interface Esp32JsEventloopEvent {
  type: number;
  status: number;
}

declare function el_createTimer(timeout: number): number;
declare function el_removeTimer(handle: number): void;
declare function el_suspend(): Esp32JsEventloopEvent[];

declare function main(): void;

interface Esp32JsWifiConfig {
  bssid: number[];
}
declare function getWifiConfig(): Esp32JsWifiConfig;
declare var EL_WIFI_EVENT_TYPE: number;
declare function el_connectWifi(ssid: string, password: string): void;
declare function el_createSoftAp(ssid: string, password: string): void;
