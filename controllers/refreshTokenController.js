const data = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
const accessTokenSettings = require('../config/tokens/accessTokenSettings');
const User = require('../models/User');
const { clearJWTCookie, makeJWTCookie } = require('../config/cookieOptions');
const refreshTokenSettings = require('../config/tokens/refreshTokenSettings');

const handleRefreshToken = async (req, res) => {
    // req.cookies, önbellekteki anahtarları verir.
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken:refreshToken}).exec();

    // const foundUser = data.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if(err) return res.sendStatus(403);
                const user = await User.findOne({username:decoded.username}).exec();
                user.refreshToken = [];
                await user.save();
            }
        )
        return res.sendStatus(403); //Forbidden 
    } 
    // refresh tokeni refresh token secret anahtarıyla karşılaştırır.
    // onaylanırsa yeni accesstoken oluşturur.

    

    const filteredArray = foundUser.refreshToken.filter(v => v != refreshToken);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            // Refresh token expired
            if (err) {
                foundUser.refreshToken = [...filteredArray];
                await foundUser.save();
                return res.sendStatus(401);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            
            const roles = Object.values(foundUser.roles);
            const accessToken = accessTokenSettings(decoded.username, roles);

            return res.status(200).json({ roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }