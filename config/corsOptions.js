const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    // origin websitesinin urlsidir allowed origins'te yer alıyorsa izin verir.
    origin: (origin, callback) => {
        // localhost:3500 undefined olarak görülmekte 
        // bu yüzden !origin yaparak o web sitesinde görülmesini
        // sağlıyoruz. Geliştirme aşaması bitince !origini ve 
        // whiteList'teki istemediğimiz siteleri silmemiz gerek.
        if (allowedOrigins.indexOf(origin) !== -1 | !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;