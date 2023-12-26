const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const {v4:uuid} = require("uuid")

const {format} = require("date-fns");
const dirName = path.join(__dirname, "..", "logs");
const logEvents = async(message, fileName) => {
    const date = format(new Date(), "HH:mm:ss  dd.MM.yyyy")
    const log = `${message} - ${date}\n`

    try {
        if(!fs.existsSync(dirName)) {
            await fsPromises.mkdir(dirName);
        }
        await fsPromises.appendFile(path.join(dirName, fileName), log, {encoding:"utf-8"})
    } catch (error) {
        console.log(error)
    }
}

// header.origin undefined yazacaktır.
// eğer ki bir internet sitesinden konsol alanına fetch("http://localhost:3500") yazıldığı takdirde ise yazıldığı yerdeki urli verecektir.
const logWrite = (req, res, next) => {
    logEvents(`${req.method} ${req.headers.origin} ${req.path}`, "reqLog.txt")
    // next() programın çalışması için gereklidir.
    // res.sendStatus, res.status().json gibi durumlar yazsaydık next() gerek kalmazdı
    next();
}

module.exports = {logWrite, logEvents};
