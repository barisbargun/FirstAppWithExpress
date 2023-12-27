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
const { makeJWTCookie } = require("../config/cookieOptions");

const handleUserAuth = async (req, res) => {
    // giriş yapmak için username ve password bilgilerini gireriz.
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ "message": "Username and password are required." })
    
    // databaseden kullanıcı bilgisini çekeriz.
    // const foundUser = data.users.find(u => u.username == username);
    const foundUser = await User.findOne({username:username}).exec();

    if (!foundUser) return res.sendStatus(401) // Unauthorized;

    // girilen şifreyle kişinin encrypt edilmiş şifresini çözmeye çalışırız 
    // match true gelirse eşleşmiştir.
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // access_token ve refresh_token oluşturmak için her ikisinde de secret_tokenler kullanılır.
        // secret_tokenlerin iyi saklanması gerekir. 

        // Kullanıcı giriş yaptığında ekranda access token görünür 30 saniyesi vardır
        // 30 saniye sonra iptal olur.
        const roles = Object.values(foundUser.roles);
        
        const accessToken = accessTokenSettings(foundUser.username, roles);
        // kullanıcı giriş yaptığında 1 gün süren refresh token alır kullanıcının yanına ve cookies olarak eklenir.
        const refreshToken = refreshTokenSettings(foundUser.username);
        // Refresh tokeni kullanıcıya eklemek için yaptığımız durum.
        // const otherUsers = data.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // data.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'models', 'users.json'),
        //     JSON.stringify(data.users)
        // );

        // const filter = {username:username};

        // // Güncellenecek alan ve değeri
        // const update = { $set: { refreshToken: refreshToken } };
        
        // // Güncellemeyi gerçekleştirin
        // const updatedDocument = await User.findOneAndUpdate(filter, update, {
        //   new: true, // Güncellenmiş belgeyi döndürmesini sağlar
        //   upsert: true, // Belge bulunamazsa yeni bir belge ekler
        // });

        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        
        makeJWTCookie(res, refreshToken);
        res.json({ accessToken });
        
    }
    else
        res.sendStatus(401);
}

module.exports = handleUserAuth;