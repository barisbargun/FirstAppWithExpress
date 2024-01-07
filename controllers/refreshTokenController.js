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
    // clearJWTCookie(res);

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    // Eğer ki refresh token girilen kullanıcıda yok ama içindeki username 
    // bir kullanıcıyla eşleşiyorsa hacklenmiş kabul edip tüm tokenlerini sıfırlarız.
    try {
        if (!foundUser) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) return res.sendStatus(403);
                    const user = await User.findOne({ username: decoded.username }).exec();
                    user.refreshToken = [];
                    await user.save();
                }
            )
            return res.sendStatus(403); //Forbidden 
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                // Refresh token expired
                const filteredArray = foundUser.refreshToken.filter(v => v != refreshToken);
                if (err) {
                    foundUser.refreshToken = [...filteredArray];
                    await foundUser.save();
                    return res.sendStatus(401);
                }
                if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
                const roles = Object.values(foundUser.roles);

                const accessToken = accessTokenSettings(decoded.username, roles);

                // Eğer kullanıcı 4 saat içinde hep giriş yapıyorsa sürekli yenileyerek ömür boyu giriş yapmasını sağlarız 4 saat boyunca girmesse de token yenileyemez.

                const newRefreshToken = refreshTokenSettings(decoded.username);
                makeJWTCookie(res, newRefreshToken);

                foundUser.refreshToken = [...filteredArray, newRefreshToken];
                await foundUser.save();

                return res.status(200).json({ roles, accessToken });

            }
        );
    } catch (error) {
        res.sendStatus(500)
    }

}

module.exports = { handleRefreshToken }