const data = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const clearCookie = (res) => {
    // önbellekteki jwt anahtarını temizler. Ek ayarlar gereklidir.
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
}

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = data.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        clearCookie(res);
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    const otherUsers = data.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    data.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(data.users)
    );

    clearCookie(res);
    res.sendStatus(204);
}

module.exports = { handleLogout }