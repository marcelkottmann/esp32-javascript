(function () {
  var config = require("./config").config;

  var success = 0;
  var err = 0;

  function stress() {
    info();
    fetch("http://localhost/setup", {
      headers: {
        authorization:
          "Basic " +
          btoa(config.access.username + ":" + config.access.password),
      },
    })
      .then(function () {
        console.log(++success);
        setTimeout(stress, 0);
      })
      .catch(function (error) {
        console.error(++err);
        console.error(error);
        setTimeout(stress, 0);
      });
  }

  stress();
})();
