const jwt = require('jsonwebtoken');

//dotenv, .env dosyasını okumamızı sağlar.
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("*" + authHeader); // Bearer token
    if (!authHeader) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT