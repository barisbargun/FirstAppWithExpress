const data = {
    users: require("../models/users.json"),
    setUsers: function (users) { this.users = users }
};

const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleUserAuth = async (req, res) => {
    // giriş yapmak için username ve password bilgilerini gireriz.
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ "message": "Username and password are required." })
    
    // databaseden kullanıcı bilgisini çekeriz.
    const foundUser = data.users.find(u => u.username == username);
    if (!foundUser) return res.sendStatus(401) // Unauthorized;

    // girilen şifreyle kişinin encrypt edilmiş şifresini çözmeye çalışırız 
    // match true gelirse eşleşmiştir.
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // access_token ve refresh_token oluşturmak için her ikisinde de secret_tokenler kullanılır.
        // secret_tokenlerin iyi saklanması gerekir. 

        // Kullanıcı giriş yaptığında ekranda access token görünür 30 saniyesi vardır
        // 30 saniye sonra iptal olur.
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' } // 30 seconds
        );
        // kullanıcı giriş yaptığında 1 gün süren refresh token alır kullanıcının yanına ve cookies olarak eklenir.
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // 1 day
        );
        // Refresh tokeni kullanıcıya eklemek için yaptığımız durum.
        const otherUsers = data.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        data.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(data.users)
        );
        // http kullanılacaksa secure false yapılır aksi takdirde çalışmaz.
        // maxAge 1 gündür.
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
        
    }
    else
        res.sendStatus(401);
}

module.exports = handleUserAuth;