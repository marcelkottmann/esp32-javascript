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

  _protocol: string;
  _hostname: string;
  _host: string;
  _port: string;
  _pathname: string;
  _search: string;
  _hash: string;
}

var urlparse: (absoluteUrl: string) => AnchorElement = function (absoluteUrl) {
  var anchorElement: AnchorElement = {
    href: "",
    origin: "",
    protocol: "",
    hostname: "",
    host: "",
    port: "",
    pathname: "",
    search: "",
    hash: "",
    _protocol: "",
    _hostname: "",
    _host: "",
    _port: "",
    _pathname: "",
    _search: "",
    _hash: "",
    resolve: function (rel: string) {
      var result = urlparse(anchorElement.href);
      if (rel.substr(0, 1) === "/") {
        result.pathname = rel;
        result.search = "";
        result.hash = "";
      } else {
        var directoryPath = result.pathname;
        if (
          !(
            !directoryPath ||
            directoryPath.substr(directoryPath.length - 1, 1) === "/"
          )
        ) {
          directoryPath = directoryPath.replace(/[^\/]+$/, "");
        }
        result.pathname = directoryPath + rel;
      }
      return result;
    },
  };

  var prependIf = function (str: string, prep?: string) {
    if (prep && str.substring(0, prep.length) !== prep) {
      return prep + str;
    }
    return str;
  };

  var protoFunc = function (
    prop: string,
    prep?: string,
    wrap?: (value: string) => string
  ) {
    return {
      get: function () {
        return (anchorElement as any)[prop];
      },
      set: function (value: string) {
        value = "" + (wrap ? wrap(value) : value);
        (anchorElement as any)[prop] = prependIf(value, prep);
      },
    };
  };

  var calcRelative = function (path: string) {
    var result: string[] = [];
    var pathes = path.split("/");
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
        var href =
          anchorElement.origin +
          anchorElement.pathname +
          anchorElement.search +
          anchorElement.hash;
        return href;
      },
      set: function (value) {
        var result = (value + "").match(
          /^(([a-zA-Z]+\:)\/\/)?([^\:\/\?]+)?(:([0-9]+))?(\/[^#\?]+)?(\?[^#]+)?(#.+)?/
        );
        if (result) {
          anchorElement.protocol = result[2] || "";
          anchorElement.hostname = result[3] || "";
          anchorElement.port = result[5] || "";
          anchorElement.pathname = result[6] || "/";
          anchorElement.search = result[7] || "";
          anchorElement.hash = result[8] || "";
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
        var result = (value + "").match(/^([^\:\/]+)(:[0-9]+)?/);
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
