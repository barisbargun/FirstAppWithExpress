const { logEvents } = require("./logEvents")

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, "errLog.txt");

    // vscode konsoluna hata mesajını yazdırır.
    console.error(err.stack);

    // siteye hata mesajını yazdırır
    res.status(500).send(err.message);
}

module.exports = errorHandler;