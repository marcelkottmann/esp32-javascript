interface AnchorElement {
  href: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  protocol: string;
  hostname: string;
  host: string;
  port: string;
  resolve(rel: string): AnchorElement;

  _protocol: string | undefined;
  _hostname: string | undefined;
  _host: string | undefined;
  _port: string | undefined;
  _pathname: string | undefined;
  _search: string | undefined;
  _hash: string | undefined;
}

const urlparse: (absoluteUrl: string) => AnchorElement = function (
  absoluteUrl
) {
  const anchorElement: AnchorElement = {
    href: "",
    origin: "",
    protocol: "",
    hostname: "",
    host: "",
    port: "",
    pathname: "",
    search: "",
    hash: "",
    _protocol: undefined,
    _hostname: undefined,
    _host: undefined,
    _port: undefined,
    _pathname: undefined,
    _search: undefined,
    _hash: undefined,
    resolve: function (rel: string) {
      const result = urlparse(anchorElement.href);
      if (rel.substr(0, 1) === "/") {
        result.pathname = rel;
        result.search = "";
        result.hash = "";
      } else {
        let directoryPath = result.pathname;
        if (
          !(
            !directoryPath ||
            directoryPath.substr(directoryPath.length - 1, 1) === "/"
          )
        ) {
          directoryPath = directoryPath.replace(/[^/]+$/, "");
        }
        result.pathname = directoryPath + rel;
      }
      return result;
    },
  };

  const prependIf = function (str: string, prep?: string) {
    if (
      prep &&
      typeof str !== "undefined" &&
      str.substring(0, prep.length) !== prep
    ) {
      return prep + str;
    }
    return str;
  };

  const protoFunc = function (
    prop: string,
    prep?: string,
    wrap?: (value: string) => string
  ) {
    return {
      get: function () {
        return (anchorElement as any)[prop] || "";
      },
      set: function (value: string) {
        value = wrap ? wrap(value) : value;
        (anchorElement as any)[prop] = prependIf(value, prep);
      },
    };
  };

  const calcRelative = function (path: string) {
    const result: string[] = [];
    const pathes = path.split("/");
    pathes.forEach(function (p, i) {
      if (p === "..") {
        result.pop();
        if (i === pathes.length - 1) {
          result.push("");
        }
      } else if (p === ".") {
        if (i === pathes.length - 1) {
          result.push("");
        }
      } else {
        result.push(p);
      }
    });
    return result.join("/");
  };

  Object.defineProperties(anchorElement, {
    href: {
      get: function () {
        const href =
          anchorElement.origin +
          anchorElement.pathname +
          anchorElement.search +
          anchorElement.hash;
        return href;
      },
      set: function (value) {
        const result = (value + "").match(
          /^(([a-zA-Z]+:)\/\/)?([^:/?]+)?(:([0-9]+))?(\/[^#?]+)?(\?[^#]+)?(#.+)?/
        );
        if (result) {
          anchorElement._protocol = result[2];
          anchorElement._hostname = result[3];
          anchorElement._port = result[5];
          anchorElement._pathname = result[6] || "/";
          anchorElement._search = result[7];
          anchorElement._hash = result[8];
        } else {
          throw Error("URL could not be parsed.");
        }
      },
    },
    protocol: protoFunc("_protocol"),
    hostname: protoFunc("_hostname"),
    port: protoFunc("_port"),
    pathname: protoFunc("_pathname", "/", calcRelative),
    search: protoFunc("_search", "?"),
    hash: protoFunc("_hash", "#"),
    host: {
      get: function () {
        return (
          anchorElement.hostname +
          (anchorElement.port ? ":" + anchorElement.port : "")
        );
      },
      set: function (value) {
        const result = (value + "").match(/^([^:/]+)(:[0-9]+)?/);
        if (result) {
          anchorElement._host = result[1];
          anchorElement._port = result[1];
        } else {
          throw Error("host could not be parsed.");
        }
      },
    },
    origin: {
      get: function () {
        return anchorElement.protocol + "//" + anchorElement.host;
      },
      set: function (value) {
        throw Error("cannot set origin");
      },
    },
  });

  anchorElement.href = absoluteUrl;
  return anchorElement;
};
