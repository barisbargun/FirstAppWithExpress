const data = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const {clearJWTCookie} = require('../config/cookieOptions');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
     
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content

    clearJWTCookie(res);
    res.sendStatus(200);   

    // const refreshToken = cookies.jwt;

    // // Is refreshToken in db?
    // const foundUser = data.users.find(person => person.refreshToken === refreshToken);
    // if (!foundUser) {
    //     clearJWTCookie(res)
    //     return res.sendStatus(204);
    // }

    // // Delete refreshToken in db
    // const otherUsers = data.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: '' };
    // data.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'models', 'users.json'),
    //     JSON.stringify(data.users)
    // );

    // clearJWTCookie(res)
    // res.sendStatus(204);
}

module.exports = handleLogout;