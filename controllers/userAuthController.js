const data = {
    users: require("../models/users.json"),
    setUsers: function (users) { this.users = users }
};

const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");
const accessTokenSettings = require("../config/tokens/accessTokenSettings");
const refreshTokenSettings = require("../config/tokens/refreshTokenSettings");
const User = require("../models/User");
const { makeJWTCookie, clearJWTCookie } = require("../config/cookieOptions");

const handleUserAuth = async (req, res) => {
    // giriş yapmak için username ve password bilgilerini gireriz.
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json
        ({ "message": "Username and password are required." })
    const cookies = req.cookies;

    // databaseden kullanıcı bilgisini çekeriz.
    // const foundUser = data.users.find(u => u.username == username);
    const foundUser = await User.findOne({ username: username }).exec();

    if (!foundUser) return res.sendStatus(401) // Unauthorized;

    // girilen şifreyle kişinin encrypt edilmiş şifresini çözmeye çalışırız 
    // match true gelirse eşleşmiştir.

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        //{ User: 2001, Admin: 1907 } [ 2001, undefined, 1907 ] şekline çeviririz 
        const roles = Object.values(foundUser.roles);

        const accessToken = accessTokenSettings(foundUser.username, roles);
        const refreshToken = refreshTokenSettings(foundUser.username);

        // const otherUsers = data.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // data.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'models', 'users.json'),
        //     JSON.stringify(data.users)
        // );

        // Eğer ki cookide jwt anahtarı varsa ve bir kullanıcıya 
        // ait ise kullanıcıdan silip jwt anahtarını da sileriz.
        if (cookies?.jwt) {
            const user = await User.findOne({ refreshToken }).exec();

            if (user) {
                user.refreshToken = user.refreshToken.filter(v => v !== cookies.jwt);
                await user.save();
            }

            clearJWTCookie(res);
        }

        foundUser.refreshToken = [...foundUser.refreshToken, refreshToken];
        await foundUser.save();

        makeJWTCookie(res, refreshToken);
        res.json({ refreshToken, accessToken });

    }
    else
        res.status(401).json({ message: "No match password" });
}

module.exports = handleUserAuth;