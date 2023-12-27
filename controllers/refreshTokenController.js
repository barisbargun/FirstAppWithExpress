const data = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
const accessTokenSettings = require('../config/tokens/accessTokenSettings');
const User = require('../models/User');

const handleRefreshToken = async (req, res) => {
    // req.cookies, önbellekteki anahtarları verir.
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken:refreshToken});

    // const foundUser = data.users.find(person => person.refreshToken === refreshToken);
    
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // refresh tokeni refresh token secret anahtarıyla karşılaştırır.
    // onaylanırsa yeni accesstoken oluşturur.
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = accessTokenSettings(decoded.username, roles);
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }