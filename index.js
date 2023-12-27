//dotenv, .env dosyasını okumamızı sağlar.
require('dotenv').config();

// npm i express
const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const path = require('path');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { logWrite: log } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const verifyJWT = require('./middleware/verifyJWT');
const dbConnect = require('./config/database/dbConnect')

const PORT = process.env.PORT || 3500;

dbConnect();
app.use(log);

// credentials, cors(corsOptions)'dan önde gelmelidir.
app.use(credentials);
app.use(cors(corsOptions));

// errorhandler cors'un arkasında expressin önünde olmalıdır.
app.use(errorHandler);

// When extended is set to false, the querystring library is used, and the values are not parsed in a nested way. For example, { extended: false } parses "key=value&key=value" into { key: 'value', key: 'value' }.
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Tokenleri önbelleğe kaydetmek için gereklidir.
app.use(cookieParser());


// route tanımlarken her birisi için ayrı static dosyaları tanımlatmalıyız. 
app.use("/subdir/", express.static(path.join(__dirname, "static")))
app.use("/subdir/", require("./routes/subdir"))

app.use("/", express.static(path.join(__dirname, "static")))
app.use("/", require("./routes/root"))

app.use("/auth", require("./routes/auth"));
app.use("/register", require("./routes/register"));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.get("/trying",(req, res) => {
    
    res.send("Hello world!");
    // res.sendFile("/views/index.html",{root:__dirname});
    // res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// There is a special routing method, app.all(), used to load middleware functions at a path for all HTTP request methods. For example, the following handler is executed for requests to the route “/secret” whether using GET, POST, PUT, DELETE, or any other HTTP request method supported
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts('html'))
        res.sendFile(path.join(__dirname, "views", "404.html"));
    else if (req.accepts('json'))
        res.json({error:'404 not found'});
    else
        res.type('txt').send();
})



// html dosyalarında cssi dahil etmek için "../" yerine
// "css/style.css" kullanabiliriz.
// app.use(express.static(path.join(__dirname, "static")))


// next() ifadesi bir sonrakine geçişi tanımlar yani
// (req, res) kullanabilmemizi sağlar.
// app.get("/subdir(/index(.html)?)?", (req, res, next) => {
//     next()

// }, (req, res) => {
//     res.sendFile(path.join(__dirname, "views/subdir", "index.html"))
// })

// const one = (req, res, next) => {
//     console.log("one")
//     next();
// }

// const two = (req, res, next) => {
//     console.log("two")
//     next();
// }

// const three = (req, res) => {
//     console.log("three")
//     res.send("finish")
// }

// app.get("/chain(.html)?", [one, two, three])



mongoose.connection.once('open', () => {
    console.log("connected to mongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

